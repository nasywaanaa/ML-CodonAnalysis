import React from 'react';
import { Download } from 'lucide-react';
import '../result-page.css';

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
        <div className="result-header">
          <div className="result-logo-section">
            <div className="result-logo-container">
              <img 
                src="/assets/images/logoKDS.png" 
                alt="Logo KDS" 
                className="result-logo"
              />
            </div>
            <div className="result-divider"></div>
            <p className="result-subtitle">Piano Tracker for ABRSM</p>
            
            <div className="result-description">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam 
                imperdiet tincidunt pellentesque. Curabitur elementum interdum 
                mollis. Maecenas convallis dui id rutrum laoreet. Donec tempor 
                mattis nulla, in faucibus massa congue at. Curabitur quis lorem 
                euismod, bibendum leo nec, tempus nunc. Pellentesque habitant 
                morbi tristique senectus et netus et malesuada fames ac turpis 
                egestas. Morbi cursus lacus tristique tempor posuere.
              </p>
            </div>
          </div>

          {/* Cluster Info */}
          <div className="cluster-info">
            <div className="cluster-header">
              <h2>Cluster ID Assigned</h2>
            </div>
            <div className="cluster-number">3 Cluster</div>
            <p className="cluster-description">
              This cluster groups species with similar codon usage patterns 
              based on the selected clustering algorithm.
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
              <img 
                src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iNDAwIiBmaWxsPSJ3aGl0ZSIgcng9IjEwIi8+CjwhLS0gR3JpZCBMaW5lcyAtLT4KPHN0eWxlPi5ncmlkIHsgc3Ryb2tlOiAjZjBmMGYwOyBzdHJva2Utd2lkdGg6IDF9PC9zdHlsZT4KPGcgY2xhc3M9ImdyaWQiPgo8bGluZSB4MT0iNjAiIHkxPSI0MCIgeDI9IjYwIiB5Mj0iMzYwIi8+CjxsaW5lIHgxPSI2MCIgeTE9IjM2MCIgeDI9IjU2MCIgeTI9IjM2MCIvPgo8IS0tIFZlcnRpY2FsIGdyaWQgLS0+CjxsaW5lIHgxPSIxMjAiIHkxPSI0MCIgeDI9IjEyMCIgeTI9IjM2MCIvPgo8bGluZSB4MT0iMTgwIiB5MT0iNDAiIHgyPSIxODAiIHkyPSIzNjAiLz4KPGxpbmUgeDE9IjI0MCIgeTE9IjQwIiB4Mj0iMjQwIiB5Mj0iMzYwIi8+CjxsaW5lIHgxPSIzMDAiIHkxPSI0MCIgeDI9IjMwMCIgeTI9IjM2MCIvPgo8bGluZSB4MT0iMzYwIiB5MT0iNDAiIHgyPSIzNjAiIHkyPSIzNjAiLz4KPGxpbmUgeDE9IjQyMCIgeTE9IjQwIiB4Mj0iNDIwIiB5Mj0iMzYwIi8+CjxsaW5lIHgxPSI0ODAiIHkxPSI0MCIgeDI9IjQ4MCIgeTI9IjM2MCIvPgo8bGluZSB4MT0iNTQwIiB5MT0iNDAiIHgyPSI1NDAiIHkyPSIzNjAiLz4KPCEtLSBIb3Jpem9udGFsIGdyaWQgLS0+CjxsaW5lIHgxPSI2MCIgeTE9IjgwIiB4Mj0iNTYwIiB5Mj0iODAiLz4KPGxpbmUgeDE9IjYwIiB5MT0iMTIwIiB4Mj0iNTYwIiB5Mj0iMTIwIi8+CjxsaW5lIHgxPSI2MCIgeTE9IjE2MCIgeDI9IjU2MCIgeTI9IjE2MCIvPgo8bGluZSB4MT0iNjAiIHkxPSIyMDAiIHgyPSI1NjAiIHkyPSIyMDAiLz4KPGxpbmUgeDE9IjYwIiB5MT0iMjQwIiB4Mj0iNTYwIiB5Mj0iMjQwIi8+CjxsaW5lIHgxPSI2MCIgeTE9IjI4MCIgeDI9IjU2MCIgeTI9IjI4MCIvPgo8bGluZSB4MT0iNjAiIHkxPSIzMjAiIHgyPSI1NjAiIHkyPSIzMjAiLz4KPC9nPgo8IS0tIERhdGEgUG9pbnRzIC0tPgo8IS0tIENsdXN0ZXIgMSAoR3JlZW4pIC0tPgo8Y2lyY2xlIGN4PSIxNTAiIGN5PSIxODAiIHI9IjYiIGZpbGw9IiMyM0Q2OTMiLz4KPGNY2NjbGUgY3g9IjE3MCIgY3k9IjE2MCIgcj0iNiIgZmlsbD0iIzIzRDY5MyIvPgo8Y2lyY2xlIGN4PSIxMzAiIGN5PSIyMDAiIHI9IjYiIGZpbGw9IiMyM0Q2OTMiLz4KPGNY2NjbGUgY3g9IjE2MCIgY3k9IjE5MCIgcj0iNiIgZmlsbD0iIzIzRDY5MyIvPgo8IS0tIENsdXN0ZXIgMiAoQmx1ZSkgLS0+CjxjaXJjbGUgY3g9IjEyMCIgY3k9IjMwMCIgcj0iNiIgZmlsbD0iIzNiODJmNiIvPgo8Y2lyY2xlIGN4PSIxNDAiIGN5PSIzMjAiIHI9IjYiIGZpbGw9IiMzYjgyZjYiLz4KPGNY2NjbGUgY3g9IjEwMCIgY3k9IjI5MCIgcj0iNiIgZmlsbD0iIzNiODJmNiIvPgo8IS0tIENsdXN0ZXIgMyAoUHVycGxlKSAtLT4KPGNY2NjbGUgY3g9IjQ4MCIgY3k9IjMwMCIgcj0iNiIgZmlsbD0iIzk5MzNlYSIvPgo8Y2lyY2xlIGN4PSI1MDAiIGN5PSIzMjAiIHI9IjYiIGZpbGw9IiM5OTMzZWEiLz4KPGNY2NjbGUgY3g9IjQ2MCIgY3k9IjI4MCIgcj0iNiIgZmlsbD0iIzk5MzNlYSIvPgo8IS0tIElucHV0IFNwZWNpZXMgKFllbGxvdykgLS0+CjxwYXRoIGQ9Im0zODAsMTAwIDEwLDAgMCwxMCAtMTAsMCB6IiBmaWxsPSIjZmJiZjI0IiBzdHJva2U9IiNmNTk5NDQiIHN0cm9rZS13aWR0aD0iMiIvPgo8IS0tIEF4ZXMgLS0+CjxsaW5lIHgxPSI2MCIgeTE9IjM2MCIgeDI9IjU2MCIgeTI9IjM2MCIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjIiLz4KPGxpbmUgeDE9IjYwIiB5MT0iMzYwIiB4Mj0iNjAiIHkyPSI0MCIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjIiLz4KPHN0eWxlPi50ZXh0IHsgZm9udC1mYW1pbHk6IEFyaWFsLCBzYW5zLXNlcmlmOyBmb250LXNpemU6IDEycHggfTwvc3R5bGU+Cjx0ZXh0IHg9IjMwMCIgeT0iMzkwIiBjbGFzcz0idGV4dCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UENBIENvbXBvbmVudCAxPC90ZXh0Pgo8dGV4dCB4PSIyMCIgeT0iMjAwIiBjbGFzcz0idGV4dCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgdHJhbnNmb3JtPSJyb3RhdGUoLTkwIDIwIDIwMCkiPlBDQSBDb21wb25lbnQgMjwvdGV4dD4KPHN0eWxlPi5sZWdlbmQgeyBmb250LWZhbWlseTogQXJpYWwsIHNhbnMtc2VyaWY7IGZvbnQtc2l6ZTogMTBweCB9PC9zdHlsZT4KPGN4aXJjbGUgY3g9IjQ2MCIgY3k9IjcwIiByPSI0IiBmaWxsPSIjMjNENjkzIi8+Cjx0ZXh0IHg9IjQ3MCIgeT0iNzMiIGNsYXNzPSJsZWdlbmQiPk90aGVyIFNwZWNpZXM8L3RleHQ+Cjx0ZXh0IHg9IjQ0MCIgeT0iNTUiIGNsYXNzPSJsZWdlbmQiPkxlZ2VuZDo8L3RleHQ+CjxyZWN0IHg9IjQ2MCIgeT0iODAiIHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiNmYmJmMjQiIHN0cm9rZT0iI2Y1OTk0NCIgc3Ryb2tlLXdpZHRoPSIxIi8+Cjx0ZXh0IHg9IjQ3NSIgeT0iODciIGNsYXNzPSJsZWdlbmQiPklucHV0IFNwZWNpZXM8L3RleHQ+CjwvZz4KPC9zdmc+" 
                alt="PCA Scatter Plot" 
                className="chart-image"
              />
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
              <img 
                src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iNDAwIiBmaWxsPSJ3aGl0ZSIgcng9IjEwIi8+CjwhLS0gR3JpZCBMaW5lcyAtLT4KPHN0eWxlPi5ncmlkIHsgc3Ryb2tlOiAjZjBmMGYwOyBzdHJva2Utd2lkdGg6IDF9PC9zdHlsZT4KPGcgY2xhc3M9ImdyaWQiPgo8bGluZSB4MT0iNjAiIHkxPSI0MCIgeDI9IjYwIiB5Mj0iMzYwIi8+CjxsaW5lIHgxPSI2MCIgeTE9IjM2MCIgeDI9IjU2MCIgeTI9IjM2MCIvPgo8IS0tIFZlcnRpY2FsIGdyaWQgLS0+CjxsaW5lIHgxPSIxMjAiIHkxPSI0MCIgeDI9IjEyMCIgeTI9IjM2MCIvPgo8bGluZSB4MT0iMTgwIiB5MT0iNDAiIHgyPSIxODAiIHkyPSIzNjAiLz4KPGxpbmUgeDE9IjI0MCIgeTE9IjQwIiB4Mj0iMjQwIiB5Mj0iMzYwIi8+CjxsaW5lIHgxPSIzMDAiIHkxPSI0MCIgeDI9IjMwMCIgeTI9IjM2MCIvPgo8bGluZSB4MT0iMzYwIiB5MT0iNDAiIHgyPSIzNjAiIHkyPSIzNjAiLz4KPGxpbmUgeDE9IjQyMCIgeTE9IjQwIiB4Mj0iNDIwIiB5Mj0iMzYwIi8+CjxsaW5lIHgxPSI0ODAiIHkxPSI0MCIgeDI9IjQ4MCIgeTI9IjM2MCIvPgo8bGluZSB4MT0iNTQwIiB5MT0iNDAiIHgyPSI1NDAiIHkyPSIzNjAiLz4KPCEtLSBIb3Jpem9udGFsIGdyaWQgLS0+CjxsaW5lIHgxPSI2MCIgeTE9IjgwIiB4Mj0iNTYwIiB5Mj0iODAiLz4KPGxpbmUgeDE9IjYwIiB5MT0iMTIwIiB4Mj0iNTYwIiB5Mj0iMTIwIi8+CjxsaW5lIHgxPSI2MCIgeTE9IjE2MCIgeDI9IjU2MCIgeTI9IjE2MCIvPgo8bGluZSB4MT0iNjAiIHkxPSIyMDAiIHgyPSI1NjAiIHkyPSIyMDAiLz4KPGxpbmUgeDE9IjYwIiB5MT0iMjQwIiB4Mj0iNTYwIiB5Mj0iMjQwIi8+CjxsaW5lIHgxPSI2MCIgeTE9IjI4MCIgeDI9IjU2MCIgeTI9IjI4MCIvPgo8bGluZSB4MT0iNjAiIHkxPSIzMjAiIHgyPSI1NjAiIHkyPSIzMjAiLz4KPC9nPgo8IS0tIEVsYm93IExpbmUgLS0+CjxwYXRoIGQ9Ik0gMTAwIDgwIEwgMTYwIDEyMCBMIDIyMCAyMDAgTCAyODAgMjYwIEwgMzQwIDI5MCBMIDQWMCAMMIMIEIDQ2MCAzMDAgTCA1MjAgMzEwIiBzdHJva2U9IiMzYjgyZjYiIHN0cm9rZS13aWR0aD0iMyIgZmlsbD0ibm9uZSIvPgo8IS0tIERhdGEgUG9pbnRzIC0tPgo8Y2lyY2xlIGN4PSIxMDAiIGN5PSI4MCIgcj0iNSIgZmlsbD0iIzNiODJmNiIvPgo8Y2lyY2xlIGN4PSIxNjAiIGN5PSIxMjAiIHI9IjUiIGZpbGw9IiMzYjgyZjYiLz4KPGNY2NjbGUgY3g9IjIyMCIgY3k9IjIwMCIgcj0iNSIgZmlsbD0iIzNiODJmNiIvPgo8Y2lyY2xlIGN4PSIyODAiIGN5PSIyNjAiIHI9IjUiIGZpbGw9IiMzYjgyZjYiLz4KPGNY2NjbGUgY3g9IjM0MCIgY3k9IjI5MCIgcj0iNSIgZmlsbD0iIzNiODJmNiIvPgo8Y2lyY2xlIGN4PSI0MDAiIGN5PSIzMDAiIHI9IjUiIGZpbGw9IiMzYjgyZjYiLz4KPGNY2NjbGUgY3g9IjQ2MCIgY3k9IjMwMCIgcj0iNSIgZmlsbD0iIzNiODJmNiIvPgo8Y2lyY2xlIGN4PSI1MjAiIGN5PSIzMTAiIHI9IjUiIGZpbGw9IiMzYjgyZjYiLz4KPCEtLSBFbGJvdyBQb2ludCAtLT4KPGxpbmUgeDE9IjI4MCIgeTE9IjQwIiB4Mj0iMjgwIiB5Mj0iMzYwIiBzdHJva2U9IiMyM0Q2OTMiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWRhc2hhcnJheT0iNSw1Ii8+Cjx0ZXh0IHg9IjI5MCIgeT0iNjAiIHN0eWxlPSJmb250LWZhbWlseTogQXJpYWwsIHNhbnMtc2VyaWY7IGZvbnQtc2l6ZTogMTJweDsgZmlsbDogIzIzRDY5MyI+ZWxib3cgYXQgayA9IDQ8L3RleHQ+Cjx0ZXh0IHg9IjMwMCIgeT0iNzUiIHN0eWxlPSJmb250LWZhbWlseTogQXJpYWwsIHNhbnMtc2VyaWY7IGZvbnQtc2l6ZTogMTBweDsgZmlsbDogIzY2NiI+c2NvcmUgPSA3NTAzLjMxMjwvdGV4dD4KPCEtLSBBeGVzIC0tPgo8bGluZSB4MT0iNjAiIHkxPSIzNjAiIHgyPSI1NjAiIHkyPSIzNjAiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxsaW5lIHgxPSI2MCIgeTE9IjM2MCIgeDI9IjYwIiB5Mj0iNDAiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSIyIi8+Cjx0ZXh0IHg9IjMwMCIgeT0iMzkwIiBzdHlsZT0iZm9udC1mYW1pbHk6IEFyaWFsLCBzYW5zLXNlcmlmOyBmb250LXNpemU6IDEycHgiPms8L3RleHQ+Cjx0ZXh0IHg9IjIwIiB5PSIyMDAiIHN0eWxlPSJmb250LWZhbWlseTogQXJpYWwsIHNhbnMtc2VyaWY7IGZvbnQtc2l6ZTogMTJweCIgdHJhbnNmb3JtPSJyb3RhdGUoLTkwIDIwIDIwMCkiPkRpc3RvcnRpb24gU2NvcmU8L3RleHQ+CjwvZz4KPC9zdmc+" 
                alt="Elbow Method Chart" 
                className="chart-image"
              />
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