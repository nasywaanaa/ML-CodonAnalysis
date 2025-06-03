from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
import pandas as pd
import joblib
import numpy as np
import tempfile
import os
from typing import Dict, Any, List
import logging
from fastapi.middleware.cors import CORSMiddleware



# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Codon Usage Analysis API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://ml-codon-analysis.vercel.app"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add middleware to handle trailing slashes
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import RedirectResponse

class TrailingSlashMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.url.path.endswith('/') and len(request.url.path) > 1:
            # Redirect trailing slash to non-trailing slash
            new_path = request.url.path.rstrip('/')
            new_url = request.url.replace(path=new_path)
            return RedirectResponse(url=str(new_url), status_code=307)
        return await call_next(request)

app.add_middleware(TrailingSlashMiddleware)

# Global variables for models
scaler = None
pca = None
kmeans = None
classifier = None
feature_names = None
feature_description_full = None
aa_full = None
full_description_mapping = None

def load_models():
    """Load all required model components with error handling"""
    global scaler, pca, kmeans, classifier, feature_names
    global feature_description_full, aa_full, full_description_mapping

    # Path ke direktori models relatif terhadap main.py
    model_dir = os.path.join(os.path.dirname(__file__), "models")

    try:
        required_files = [
            'scaler.pkl',
            'pca.pkl', 
            'kmeans_model.pkl',
            'best_classification_model.pkl',
            'feature_columns.pkl',
            'feature_description_full.pkl',
            'aa_full.pkl'
        ]

        missing_files = [f for f in required_files if not os.path.exists(os.path.join(model_dir, f))]
        if missing_files:
            logger.error(f"Missing required files: {missing_files}")
            return False

        scaler = joblib.load(os.path.join(model_dir, 'scaler.pkl'))
        pca = joblib.load(os.path.join(model_dir, 'pca.pkl'))
        kmeans = joblib.load(os.path.join(model_dir, 'kmeans_model.pkl'))
        classifier = joblib.load(os.path.join(model_dir, 'best_classification_model.pkl'))
        feature_names = joblib.load(os.path.join(model_dir, 'feature_columns.pkl'))
        feature_description_full = joblib.load(os.path.join(model_dir, 'feature_description_full.pkl'))
        aa_full = joblib.load(os.path.join(model_dir, 'aa_full.pkl'))

        full_description_mapping = {**feature_description_full, **aa_full}

        logger.info("All models loaded successfully")
        return True

    except Exception as e:
        logger.error(f"Error loading models: {str(e)}")
        return False


@app.on_event("startup")
async def startup_event():
    """Load models on startup"""
    success = load_models()
    if not success:
        logger.warning("Some models failed to load - running in demo mode")

from scipy.stats import entropy
from sklearn.metrics.pairwise import cosine_similarity

def preprocess_feature(raw_features: pd.DataFrame) -> pd.DataFrame:
    """Preprocess codon usage features"""
    df = raw_features.copy()
    
    # Convert to numeric and fill NA with median
    df = df.apply(pd.to_numeric, errors='coerce')
    df = df.fillna(df.median())
    
    # Remove rows with total 0 (corrupt data)
    codon_sum = df.sum(axis=1)
    df = df[codon_sum > 0]
    
    # Codon to amino acid mapping
    codon_to_aa = {
        'GCU': 'A', 'GCC': 'A', 'GCA': 'A', 'GCG': 'A',
        'CGU': 'R', 'CGC': 'R', 'CGA': 'R', 'CGG': 'R', 'AGA': 'R', 'AGG': 'R',
        'GGU': 'G', 'GGC': 'G', 'GGA': 'G', 'GGG': 'G',
        'AAA': 'K', 'AAG': 'K',
        'UUU': 'F', 'UUC': 'F',
        'CCU': 'P', 'CCC': 'P', 'CCA': 'P', 'CCG': 'P',
        'UCU': 'S', 'UCC': 'S', 'UCA': 'S', 'UCG': 'S', 'AGU': 'S', 'AGC': 'S',
        'AUU': 'I', 'AUC': 'I', 'AUA': 'I',
        'AUG': 'M',
        'GUU': 'V', 'GUC': 'V', 'GUA': 'V', 'GUG': 'V',
        'UUA': 'L', 'UUG': 'L', 'CUU': 'L', 'CUC': 'L', 'CUA': 'L', 'CUG': 'L',
        'ACU': 'T', 'ACC': 'T', 'ACA': 'T', 'ACG': 'T',
        'UAU': 'Y', 'UAC': 'Y',
        'CAA': 'Q', 'CAG': 'Q',
        'AAU': 'N', 'AAC': 'N',
        'GAU': 'D', 'GAC': 'D',
        'UGU': 'C', 'UGC': 'C',
        'GAA': 'E', 'GAG': 'E',
        'CAU': 'H', 'CAC': 'H',
        'UGG': 'W'
    }

    # Aggregate codons to amino acids
    aa_features = {}
    for codon, aa in codon_to_aa.items():
        if codon in df.columns:
            aa_features.setdefault(aa, []).append(df[codon])

    df_aa = pd.DataFrame()
    for aa, cols in aa_features.items():
        df_aa[aa] = np.sum(cols, axis=0)

    # Normalize per row with pseudocount
    pseudocount = 1e-8
    row_sums = df_aa.sum(axis=1)
    valid_rows = row_sums > row_sums.quantile(0.05)  # Filter bottom 5%
    df_aa = df_aa[valid_rows]
    df_aa_norm = (df_aa + pseudocount).div(row_sums[valid_rows] + pseudocount*len(df_aa.columns), axis=0)

    # Statistical features
    stats = pd.DataFrame(index=df_aa_norm.index)
    stats['mean'] = df_aa_norm.mean(axis=1)
    stats['median'] = df_aa_norm.median(axis=1)
    stats['std'] = df_aa_norm.std(axis=1).fillna(0)
    stats['skewness'] = df_aa_norm.skew(axis=1).fillna(0)
    stats['kurtosis'] = df_aa_norm.kurtosis(axis=1).fillna(0)
    stats['entropy'] = df_aa_norm.apply(lambda x: entropy(x + 1e-10, base=2), axis=1).fillna(0)

    # Gini coefficient function
    def gini_coefficient(x):
        x = np.array(x)
        x = x[~np.isnan(x)]
        if len(x) == 0 or np.sum(x) == 0:
            return 0
        x = np.sort(x)
        n = len(x)
        index = np.arange(1, n+1)
        return (2*np.sum(index*x))/(n*np.sum(x)) - (n+1)/n

    stats['gini'] = df_aa_norm.apply(gini_coefficient, axis=1)

    # Combine final features
    features_final = pd.concat([df_aa_norm, stats], axis=1).fillna(0)

    # Add cosine similarity to mean & median profile
    mean_profile = df_aa_norm.mean(axis=0).values.reshape(1, -1)
    median_profile = df_aa_norm.median(axis=0).values.reshape(1, -1)

    cos_sim_mean = cosine_similarity(df_aa_norm.values, mean_profile).flatten()
    cos_sim_median = cosine_similarity(df_aa_norm.values, median_profile).flatten()

    features_final['cosine_similarity_to_mean'] = cos_sim_mean
    features_final['cosine_similarity_to_median'] = cos_sim_median

    return features_final

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Codon Usage Analysis API",
        "version": "1.0.0",
        "endpoints": {
            "analyze": "POST /analyze - Analyze codon usage file",
            "preprocess": "POST /preprocess - Preprocess codon usage file (alias for /analyze)",
            "health": "GET /health - Health check"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    models_loaded = all([
        scaler is not None,
        pca is not None, 
        kmeans is not None,
        classifier is not None,
        feature_names is not None
    ])
    
    return {
        "status": "healthy" if models_loaded else "partial",
        "models_loaded": models_loaded,
        "message": "All models loaded" if models_loaded else "Running in demo mode"
    }

@app.post("/preprocess")
async def preprocess_codon_usage(file: UploadFile = File(...)):
    """Preprocess endpoint (alias for analyze)"""
    return await analyze_codon_usage(file)

@app.post("/debug")
async def debug_analysis(file: UploadFile = File(...)):
    """Debug endpoint untuk melihat step-by-step analysis"""
    
    debug_info = {"steps": []}
    
    try:
        # Step 1: File reading
        with tempfile.NamedTemporaryFile(delete=False, suffix='.csv') as temp:
            content = await file.read()
            temp.write(content)
            temp_path = temp.name
        
        raw_df = pd.read_csv(temp_path)
        debug_info["steps"].append({
            "step": "file_reading",
            "status": "success",
            "data_shape": raw_df.shape,
            "columns": list(raw_df.columns)
        })
        
        # Step 2: Feature extraction
        feature_cols = raw_df.columns[5:]
        raw_features = raw_df[feature_cols]
        debug_info["steps"].append({
            "step": "feature_extraction", 
            "status": "success",
            "feature_columns": len(feature_cols),
            "sample_features": list(feature_cols[:5])
        })
        
        # Step 3: Preprocessing
        processed_features = preprocess_feature(raw_features)
        debug_info["steps"].append({
            "step": "preprocessing",
            "status": "success", 
            "processed_shape": processed_features.shape,
            "processed_columns": list(processed_features.columns)
        })
        
        # Step 4: Feature alignment
        if feature_names is not None:
            missing_features = set(feature_names) - set(processed_features.columns)
            extra_features = set(processed_features.columns) - set(feature_names)
            processed_features_aligned = processed_features[feature_names]
            
            debug_info["steps"].append({
                "step": "feature_alignment",
                "status": "success",
                "missing_features": list(missing_features),
                "extra_features": list(extra_features),
                "final_shape": processed_features_aligned.shape
            })
        else:
            processed_features_aligned = processed_features
            debug_info["steps"].append({
                "step": "feature_alignment",
                "status": "skipped - no feature_names available"
            })
        
        # Step 5: Scaling and PCA
        if scaler is not None and pca is not None:
            X_scaled = scaler.transform(processed_features_aligned)
            X_pca = pca.transform(X_scaled)
            debug_info["steps"].append({
                "step": "scaling_pca",
                "status": "success",
                "scaled_shape": X_scaled.shape,
                "pca_shape": X_pca.shape
            })
        else:
            debug_info["steps"].append({
                "step": "scaling_pca", 
                "status": "failed - models not loaded"
            })
            return debug_info
        
        # Step 6: Clustering
        if kmeans is not None:
            cluster_labels = kmeans.predict(X_pca)
            debug_info["steps"].append({
                "step": "clustering",
                "status": "success",
                "n_clusters": len(np.unique(cluster_labels)),
                "cluster_distribution": dict(zip(*np.unique(cluster_labels, return_counts=True)))
            })
        else:
            debug_info["steps"].append({
                "step": "clustering",
                "status": "failed - kmeans model not loaded"
            })
            return debug_info
        
        # Step 7: Classification
        if classifier is not None:
            try:
                # Try different input configurations
                configs_to_try = [
                    ("scaled_features_only", X_scaled),
                    ("scaled_features_plus_cluster", np.concatenate([X_scaled, cluster_labels.reshape(-1, 1)], axis=1))
                ]
                
                classification_results = []
                for config_name, X_input in configs_to_try:
                    try:
                        kingdom_pred = classifier.predict(X_input)
                        classification_results.append({
                            "config": config_name,
                            "input_shape": X_input.shape,
                            "status": "success",
                            "kingdom_distribution": dict(zip(*np.unique(kingdom_pred, return_counts=True)))
                        })
                    except Exception as e:
                        classification_results.append({
                            "config": config_name,
                            "input_shape": X_input.shape,
                            "status": f"failed: {str(e)}"
                        })
                
                debug_info["steps"].append({
                    "step": "classification",
                    "configurations_tested": classification_results
                })
                
            except Exception as e:
                debug_info["steps"].append({
                    "step": "classification",
                    "status": f"failed: {str(e)}"
                })
        else:
            debug_info["steps"].append({
                "step": "classification",
                "status": "failed - classifier not loaded"
            })
        
        # Model info
        debug_info["model_info"] = {
            "scaler_loaded": scaler is not None,
            "pca_loaded": pca is not None,
            "kmeans_loaded": kmeans is not None,
            "classifier_loaded": classifier is not None,
            "feature_names_loaded": feature_names is not None,
            "classifier_expected_features": classifier.n_features_in_ if classifier and hasattr(classifier, 'n_features_in_') else "unknown"
        }
        
        return debug_info
        
    except Exception as e:
        debug_info["steps"].append({
            "step": "error",
            "status": f"failed: {str(e)}"
        })
        return debug_info
    
    finally:
        try:
            if 'temp_path' in locals():
                os.unlink(temp_path)
        except:
            pass

@app.post("/analyze")
async def analyze_codon_usage(file: UploadFile = File(...)):
    """Main analysis endpoint"""
    
    # Check if models are loaded
    if not all([scaler, pca, kmeans, classifier, feature_names]):
        raise HTTPException(
            status_code=503, 
            detail="Models not loaded. Please ensure all .pkl files are present."
        )
    
    try:
        # Save temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.csv') as temp:
            content = await file.read()
            temp.write(content)
            temp_path = temp.name

        # Read CSV
        try:
            raw_df = pd.read_csv(temp_path)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error reading CSV file: {str(e)}")
        
        # Check if file has enough columns
        if len(raw_df.columns) < 6:
            raise HTTPException(
                status_code=400, 
                detail=f"CSV file must have at least 6 columns (5 metadata + features). Found {len(raw_df.columns)} columns."
            )
        
        # Extract feature columns (assuming first 5 are metadata)
        feature_cols = raw_df.columns[5:]
        raw_features = raw_df[feature_cols]
        
        # Preprocess features
        processed_features = preprocess_feature(raw_features)
        
        # Ensure feature order matches training
        missing_features = set(feature_names) - set(processed_features.columns)
        extra_features = set(processed_features.columns) - set(feature_names)
        
        if missing_features:
            logger.warning(f"Adding missing features with zeros: {missing_features}")
            for feat in missing_features:
                processed_features[feat] = 0
        
        if extra_features:
            logger.warning(f"Removing extra features: {extra_features}")
            processed_features = processed_features.drop(columns=list(extra_features))
        
        # Reorder to match training exactly
        processed_features = processed_features[feature_names]
        
        logger.info(f"Final processed features shape: {processed_features.shape}")
        logger.info(f"Expected feature names length: {len(feature_names)}")
        logger.info(f"Processed feature columns length: {len(processed_features.columns)}")
        
        # Verify column alignment
        if not all(processed_features.columns == feature_names):
            raise ValueError("Feature column order mismatch after reordering!")
        
        # Transform and predict clustering
        X_scaled = scaler.transform(processed_features)
        X_pca = pca.transform(X_scaled)
        cluster_labels = kmeans.predict(X_pca)
        
        logger.info(f"Clustering completed. Found {len(np.unique(cluster_labels))} clusters")
        
        # Add cluster labels to original data
        result_df = raw_df.iloc[:len(cluster_labels)].copy()
        result_df['Cluster'] = cluster_labels
        
        # CLASSIFICATION STEP
        try:
            # Load training configuration if available
            training_config = None
            if os.path.exists('training_config.pkl'):
                training_config = joblib.load('training_config.pkl')
                logger.info(f"Loaded training config: {training_config}")
            
            # Prepare input for classification
            if training_config and training_config.get('includes_cluster', False):
                # Model was trained WITH cluster feature
                X_with_cluster = np.concatenate([X_scaled, cluster_labels.reshape(-1, 1)], axis=1)
                logger.info("Using scaled features + cluster for classification")
            else:
                # Model was trained WITHOUT cluster feature - try both options
                logger.info("Training config suggests no cluster feature, trying without cluster first")
                X_with_cluster = X_scaled
            
            # Check feature dimensions
            expected_features = training_config['n_features'] if training_config else (
                classifier.n_features_in_ if hasattr(classifier, 'n_features_in_') else X_with_cluster.shape[1]
            )
            actual_features = X_with_cluster.shape[1]
            
            logger.info(f"Classification input - Expected: {expected_features}, Actual: {actual_features}")
            
            # If mismatch and we didn't include cluster, try adding it
            if actual_features != expected_features and not (training_config and training_config.get('includes_cluster', False)):
                logger.info("Feature count mismatch, trying with cluster feature added")
                X_with_cluster = np.concatenate([X_scaled, cluster_labels.reshape(-1, 1)], axis=1)
                actual_features = X_with_cluster.shape[1]
                logger.info(f"After adding cluster - Actual features: {actual_features}")
            
            # Final check
            if actual_features != expected_features:
                logger.error(f"Feature mismatch persists: expected {expected_features}, got {actual_features}")
                # Try with just the expected number of features
                if actual_features > expected_features:
                    X_with_cluster = X_with_cluster[:, :expected_features]
                    logger.warning(f"Truncated to {expected_features} features")
                else:
                    # Pad with zeros
                    padding = np.zeros((X_with_cluster.shape[0], expected_features - actual_features))
                    X_with_cluster = np.concatenate([X_with_cluster, padding], axis=1)
                    logger.warning(f"Padded to {expected_features} features")
            
            # Perform classification
            kingdom_pred = classifier.predict(X_with_cluster)
            kingdom_proba = classifier.predict_proba(X_with_cluster) if hasattr(classifier, 'predict_proba') else None
            
            result_df['Kingdom'] = kingdom_pred
            
            if kingdom_proba is not None:
                # Add prediction probabilities
                class_labels = classifier.classes_ if hasattr(classifier, 'classes_') else None
                if class_labels is not None:
                    for i, class_label in enumerate(class_labels):
                        result_df[f'Kingdom_{class_label}_prob'] = kingdom_proba[:, i]
            
            logger.info(f"Classification completed successfully")
            logger.info(f"Kingdom distribution: {result_df['Kingdom'].value_counts().to_dict()}")
            
            classification_success = True
            
        except Exception as e:
            logger.error(f"Classification failed: {str(e)}")
            result_df['Kingdom'] = 'Classification_Failed'
            result_df['Classification_Error'] = str(e)
            classification_success = False
        
        # Generate response based on available results
        response_data = {
            "status": "success",
            "clustering_completed": True,
            "classification_completed": classification_success,
            "total_samples": len(result_df),
            "cluster_distribution": result_df['Cluster'].value_counts().to_dict()
        }
        
        # Add classification results if successful
        if classification_success and 'Kingdom' in result_df.columns:
            response_data["kingdom_distribution"] = result_df['Kingdom'].value_counts().to_dict()
            response_data["classification_summary"] = result_df.groupby(['Kingdom', 'Cluster']).size().reset_index(name='count').to_dict('records')
        
        # Try to load feature importance file for detailed analysis
        importance_file = 'classification_results_BestModel_feature_importance.csv'
        if os.path.exists(importance_file) and classification_success:
            try:
                importance_df = pd.read_csv(importance_file)
                
                # Create detailed summary with feature importance
                top_features = importance_df.sort_values('Importance', ascending=False)['Feature'].unique()[:5]
                
                kingdom_clusters = result_df.groupby(['Kingdom', 'Cluster']).size().reset_index(name='n_species')
                
                # Add feature descriptions
                summary_results = []
                for _, row in kingdom_clusters.iterrows():
                    for feat in top_features:
                        importance_val = importance_df[importance_df['Feature'] == feat]['Importance'].mean()
                        
                        summary_results.append({
                            'Kingdom': row['Kingdom'],
                            'Cluster': row['Cluster'],
                            'n_species': row['n_species'],
                            'Feature': feat,
                            'Importance': float(importance_val),
                            'Feature_Description': full_description_mapping.get(feat, {}).get('description', feat) if full_description_mapping else feat,
                            'Feature_Detail': full_description_mapping.get(feat, {}).get('detail', '') if full_description_mapping else ''
                        })
                
                response_data["detailed_analysis"] = summary_results
                response_data["top_features"] = top_features.tolist()
                
            except Exception as e:
                logger.warning(f"Could not process feature importance file: {str(e)}")
        
        # Always include the detailed results
        response_data["detailed_results"] = result_df.to_dict(orient='records')
        
        # Add metadata about the analysis
        response_data["analysis_metadata"] = {
            "n_clusters_found": len(result_df['Cluster'].unique()),
            "features_used": len(feature_names),
            "preprocessing_steps": [
                "codon_to_amino_acid_aggregation",
                "statistical_features_calculation", 
                "pca_transformation",
                "clustering",
                "classification" if classification_success else "classification_failed"
            ]
        }
        
        if not classification_success:
            response_data["warning"] = "Classification failed, only clustering results are available"
            response_data["clustering_only"] = True
        
        return response_data
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    
    finally:
        # Cleanup temporary file
        try:
            if 'temp_path' in locals():
                os.unlink(temp_path)
        except:
            pass

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
