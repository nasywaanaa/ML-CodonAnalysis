import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useLocation } from 'react-router-dom';
import { Download } from 'lucide-react';
import '../result-page.css';

import logoKDS from '../assets/images/logoKDS.png';
import pcaScatter from '../assets/images/pcaScatter.png';
import distortionGraph from '../assets/images/distortionGraph.png';

const ResultPage: React.FC = () => {
  const [kingdomDistribution, setKingdomDistribution] = useState<Record<string, number> | null>(null);
  const [showClusterDetails, setShowClusterDetails] = useState(false);
  const navigate = useNavigate();
  
  const toggleDetails = () => {
    setShowClusterDetails((prev) => !prev);
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

  const handleDownload = () => {
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

  // Get total number of unique kingdoms
  const clusterCount = kingdomDistribution ? Object.keys(kingdomDistribution).length : null;

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
            <h3 className="viz-title">PCA Scatter Plot <span className="viz-highlight">Visualization</span></h3>
            <p className="viz-description">
              The PCA scatter plot displays the species' codon usage profiles...
            </p>
            <div className="chart-container">
              <img src={pcaScatter} alt="PCA Scatter Plot" className="chart-image" />
            </div>
          </div>

          <div className="visualization-card">
            <h3 className="viz-title">Clusters Using the Elbow <span className="viz-highlight">Method</span></h3>
            <p className="viz-description">
              This plot visualizes the distortion scores...
            </p>
            <div className="chart-container">
              <img src={distortionGraph} alt="Elbow Method Chart" className="chart-image" />
            </div>
          </div>
        </div>

        {/* Table Placeholder */}
        <div className="result-table-section">
          <div className="table-search">
            <input type="text" placeholder="Masukkan Kingdom" className="search-input" />
            <button className="search-button">🔍</button>
          </div>
          <table className="result-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Kingdom</th>
                <th>Cluster</th>
                <th>Feature</th>
                <th>Feature Description</th>
                <th>Feature Detail</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4].map((_, idx) => (
                <tr key={idx}>
                  <td>1</td>
                  <td>XXXXX</td>
                  <td>120</td>
                  <td>pieces</td>
                  <td>20</td>
                  <td>300</td>
                  <td><button className="table-action-button">Pilih</button></td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button className="page-button disabled">‹ Prev</button>
            <span className="page-info">Page 1 of 2</span>
            <button className="page-button">Next ›</button>
          </div>
        </div>

        {/* Download Section */}
        <div className="download-section">
          <h3 className="download-title">Download <span className="download-highlight">File .csv</span></h3>
          <p className="download-description">
            You can download the clustering results...
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
