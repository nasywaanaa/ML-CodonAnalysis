import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useLocation } from 'react-router-dom';
import { Download } from 'lucide-react';
import '../result-page.css';

import logoKDS from '../assets/images/logoKDS.png';
import pcaScatter from '../assets/images/graph1.jpg';
import distortionGraph from '../assets/images/graph2.jpg';

const ResultPage: React.FC = () => {
  const [kingdomDistribution, setKingdomDistribution] = useState<Record<string, number> | null>(null);
  const [showClusterDetails, setShowClusterDetails] = useState(false);
  const navigate = useNavigate();

  const toggleDetails = () => {
    setShowClusterDetails((prev) => !prev);
  };
  
  const handleDownloadClusteringResult = () => {
    fetch("/hasil_clustering_clean.csv")
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "hasil_clustering_clean.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      });
  };
  
  const handleDownloadFeatureDetail = () => {
    fetch("/kingdom_cluster_feature_insight.csv")
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "kingdom_cluster_feature_insight.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      });
  };
  
  useEffect(() => {
    try {
      const data = sessionStorage.getItem('analysisResult');
      if (data) {
        const parsed = JSON.parse(data);
        setKingdomDistribution(parsed.kingdom_distribution || null);
      }
    } catch (e) {
      console.error("Failed to parse sessionStorage data", e);
    }
  }, []);

  // const handleDownload = () => {
  //   const csvContent = "Species,Cluster,Codon_Frequency\nSpecies1,1,0.25\nSpecies2,2,0.33\nSpecies3,1,0.28";
  //   const blob = new Blob([csvContent], { type: 'text/csv' });
  //   const url = window.URL.createObjectURL(blob);
  //   const a = document.createElement('a');
  //   a.href = url;
  //   a.download = 'codon_analysis_results.csv';
  //   document.body.appendChild(a);
  //   a.click();
  //   document.body.removeChild(a);
  //   window.URL.revokeObjectURL(url);
  // };

  // Get total number of unique kingdoms
  // const clusterCount = kingdomDistribution ? Object.keys(kingdomDistribution).length : null;

  return (
    <div className="result-container">
      <div className="result-content">

        {/* Header */}
        <div className="result-header-flex">
          <div className="result-left-header">
            <img src={logoKDS} alt="Codon Chronicle Logo" className="logo-title" />
            <p className="result-subtitle">Analysis for Codon</p>
            <div className="result-divider"></div>
            <p className="result-description">
              Codon Chronicle is a bioinformatics analysis platform that clusters species based on codon usage patterns using a clustering algorithm...
            </p>
            <button
              className="feature-button"
              onClick={() => navigate('/feature-details')}
            >
              Feature Details
            </button>
          </div>

          {/* Cluster Box */}
          <div className="cluster-result-box">
            <p className="cluster-title">How Many Clusters?</p>
            <p className="cluster-number-large" onClick={toggleDetails} style={{ cursor: 'pointer' }}>
              {kingdomDistribution ? `${Object.keys(kingdomDistribution).length} Clusters` : 'Loading...'}
            </p>
            {showClusterDetails && kingdomDistribution && (
              <div className="cluster-detail-list">
                {Object.entries(kingdomDistribution).map(([key, value]) => (
                  <p key={key}>Cluster {key}: {value} species</p>
                ))}
              </div>
            )}

            <p className="cluster-desc">
              This cluster groups species with similar codon usage patterns based on the selected clustering algorithm.
            </p>
          </div>
        </div>

        {/* Visualizations */}
        <div className="visualizations">
          <div className="visualization-card">
            <h3 className="viz-title">t-SNE <span className="viz-highlight">Visualization</span></h3>
            <p className="viz-description">
            A non-linear dimensionality reduction method that reveals local data structure for cluster visualization...
            </p>
            <div className="chart-container">
              <img src={pcaScatter} alt="PCA Scatter Plot" className="chart-image" />
            </div>
          </div>

          <div className="visualization-card">
            <h3 className="viz-title">UMAP <span className="viz-highlight">Visualizaton</span></h3>
            <p className="viz-description">
            A fast dimensionality reduction technique that preserves local and global structure for cluster visualization...
            </p>
            <div className="chart-container">
              <img src={distortionGraph} alt="Elbow Method Chart" className="chart-image" />
            </div>
          </div>
        </div>

        {/* Download Section */}
        <div className="download-section">
          <h3 className="download-title">Download <span className="download-highlight">File .csv</span></h3>
          <p className="download-description">
            You can download the clustering results and feature analysis...
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "1.5rem" }}>
            <button onClick={handleDownloadClusteringResult} className="download-button">
              <Download size={20} />
              Download Clustering Result
            </button>
            <button onClick={handleDownloadFeatureDetail} className="download-button">
              <Download size={20} />
              Download Feature Detail
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
