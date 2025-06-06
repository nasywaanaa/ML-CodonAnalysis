import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, BarChart3 } from 'lucide-react';
import '../index.css';

import logoKDS from '../assets/images/logoKDS.png';

const UploadPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  

  const handleFileSelect = (file: File) => {
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
    } else {
      alert('Please select a valid CSV file');
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleStartAnalysis = async () => {
    if (!selectedFile) {
      alert('Please select a CSV file first');
      return;
    }
  
    setIsUploading(true);
  
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
  
      const response = await fetch('https://ml-codonanalysis.onrender.com/analyze', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Failed to analyze the file');
      }
  
      const result = await response.json();
  

      sessionStorage.setItem('analysisResult', JSON.stringify({
        kingdom_distribution: result.kingdom_distribution,
        classification_summary: result.classification_summary, 
      }));
  
      navigate('/result');
      } catch (error) {
        if (error instanceof Error) {
          alert('Analysis failed: ' + error.message);
        } else {
          alert('Analysis failed: Unknown error');
        }
      }
    
  };
  
  
  


  return (
    <div className="upload-container">
      <div className="upload-content">
        <div className="upload-left">
          <div>
            <div className="upload-logo-container">
            <img src={logoKDS} alt="Logo KDS" className="upload-logo" />
            </div>
            <div className="upload-divider"></div>
            <p className="upload-subtitle">Analysis for Codon</p>
          </div>
          
          <div className="upload-description">
            <p>
              Codon Chronicle is a bioinformatics analysis platform that clusters 
              species based on codon usage patterns using a clustering 
              algorithm. The results are visualized through a PCA scatter plot to 
              illustrate cluster structures and the position of the input species, 
              along with an Elbow Method graph to determine the optimal 
              number of clusters.
            </p>
          </div>
        </div>

        <div className="upload-right">
          <div className="upload-card">
            <div className="upload-card-inner">
                <h2 className="upload-card-title">
                Upload Your CSV
                </h2>
                
                <div
                className={`upload-area ${isDragOver ? 'drag-over' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleUploadClick}
                >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileInputChange}
                />
                
                <div className="upload-icon-container">
                    {selectedFile ? (
                    <FileText className="upload-icon file-selected" />
                    ) : (
                    <Upload className="upload-icon" />
                    )}
                </div>
                
                {selectedFile ? (
                    <div className="upload-file-info">
                    <p className="upload-file-name">
                        {selectedFile.name}
                    </p>
                    <p className="upload-file-size">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                    </div>
                ) : (
                    <div className="upload-placeholder">
                    <p className="upload-placeholder-title">
                        Upload CSV File
                    </p>
                    <p className="upload-placeholder-text">
                        Click to browse or drag and drop your CSV file here
                    </p>
                    </div>
                )}
                </div>

                <button
                onClick={handleStartAnalysis}
                disabled={!selectedFile || isUploading}
                className="upload-button"
                >
                {isUploading ? (
                    <>
                    <div className="upload-spinner"></div>
                    Processing...
                    </>
                ) : (
                    <>
                    <BarChart3 size={20} />
                    Start Analysis
                    </>
                )}
                </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;