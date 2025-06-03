import React from 'react';
import { Download } from 'lucide-react';
import '../result-page.css';

import logoKDS from '../assets/images/logoKDS.png';
import pcaScatter from '../assets/images/pcaScatter.png';
import distortionGraph from '../assets/images/distortionGraph.png';

const ResultPage: React.FC = () => {
  const handleDownload = () => {
    // Simulate CSV download
    const csvContent = "Species,Cluster,Codon_Frequency\nSpecies1,1,0.25\nSpecies2,2,0.33\nSpecies3,1,0.28";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'codon_analysis_results.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="result-container">
      <div className="result-content">
        {/* Header with Logo */}
        <div className="result-header-flex">
  {/* Left: Logo + Title */}
        <div className="result-left-header">
            <img src={logoKDS} alt="Codon Chronicle Logo" className="logo-title" />
            <p className="result-subtitle">Analysis for Codon</p>
            <div className="result-divider"></div>
            <p className="result-description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam imperdiet tincidunt
            pellentesque. Curabitur elementum interdum mollis. Maecenas convallis dui id rutrum
            laoreet. Donec tempor mattis nulla, in faucibus massa congue at. Curabitur quis lorem
            euismod, bibendum leo nec, tempus nunc. Pellentesque habitant morbi tristique senectus
            et netus et malesuada fames ac turpis egestas. Morbi cursus lacus tristique tempor
            posuere.
            </p>
        </div>

        {/* Right: Cluster Result Box */}
        <div className="cluster-result-box">
            <p className="cluster-title">How Many Clusters?</p>
            <p className="cluster-number-large">3 Cluster</p>
            <p className="cluster-desc">
            ini adalah total cluster yang dihasilkan dari dataset tersebut. (CHECKCHECK) This cluster groups species with similar codon usage patterns based on the selected clustering algorithm.
            </p>
        </div>
        </div>

        {/* Visualizations */}
        <div className="visualizations">
          {/* PCA Scatter Plot */}
          <div className="visualization-card">
            <h3 className="viz-title">
              PCA Scatter Plot <span className="viz-highlight">Visualization</span>
            </h3>
            <p className="viz-description">
              The PCA scatter plot displays the species' codon usage profiles reduced to 
              two dimensions, highlighting the clustering structure and the position of the 
              input species among other data points.
            </p>
            <div className="chart-container">
            <img src={pcaScatter} alt="PCA Scatter Plot" className="chart-image" />
            </div>
          </div>

          {/* Elbow Method */}
          <div className="visualization-card">
            <h3 className="viz-title">
              Clusters Using the Elbow <span className="viz-highlight">Method</span>
            </h3>
            <p className="viz-description">
              This plot visualizes the distortion scores for different numbers of clusters, 
              where the "elbow" point at k = 4 suggests the optimal cluster count for 
              minimizing within-cluster variance while avoiding overfitting.
            </p>
            <div className="chart-container">
            <img src={distortionGraph} alt="Elbow Method Chart" className="chart-image" />
            </div>
          </div>
        </div>

        {/* Download Section */}
        <div className="download-section">
          <h3 className="download-title">
            Download <span className="download-highlight">File .csv</span>
          </h3>
          <p className="download-description">
            You can download the clustering results, including species name, assigned cluster, 
            and codon frequencies, by <strong>clicking the button below</strong>.
          </p>
          
          <button onClick={handleDownload} className="download-button">
            <Download size={20} />
            Download Result in CSV Format
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;