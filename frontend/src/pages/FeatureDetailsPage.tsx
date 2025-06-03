import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import search from "../assets/images/search.png";
import Papa from "papaparse";
import "../feature-details.css";

interface FeatureRow {
  Cluster: string;
  Kingdom: string;
  Feature: string;
  FeatureDescription: string;
  FeatureDetail: string;
}

const FeatureDetailsPage: React.FC = () => {
  const [input, setInput] = useState("");
  const [data, setData] = useState<FeatureRow[]>([]);
  const [filtered, setFiltered] = useState<FeatureRow[]>([]);
  const [notFound, setNotFound] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/kingdom_cluster_feature_insight.csv")
      .then((res) => res.text())
      .then((csvText) => {
        const parsed = Papa.parse<FeatureRow>(csvText, {
          header: true,
          skipEmptyLines: true,
        });
        setData(parsed.data);
        setFiltered(parsed.data);
        setCurrentPage(1);
      });
  }, []);

  const handleSearch = () => {
    if (!input) {
      setFiltered(data);
      setNotFound(false);
      setCurrentPage(1);
      return;
    }
    const results = data.filter((row) =>
      row.Kingdom.toLowerCase().includes(input.toLowerCase())
    );
    setFiltered(results);
    setNotFound(results.length === 0);
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className="feature-page-container">
      <h1 className="feature-page-title">Feature Details</h1>
      <div className="feature-search-section">
        <div className="feature-search-bar">
          <input
            type="text"
            placeholder="Masukkan Kingdom"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button onClick={handleSearch}>
            <img src={search} alt="Search" className="search-icon" />
          </button>
        </div>

        {notFound && (
          <p style={{ color: "#ff6666", marginTop: "1rem" }}>
            Kingdom tidak ditemukan.
          </p>
        )}

        <div className="feature-result-table">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Kingdom</th>
                <th>Cluster</th>
                <th>Feature</th>
                <th>Feature Description</th>
                <th>Feature Detail</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((row, idx) => (
                <tr key={indexOfFirstItem + idx}>
                  <td>{indexOfFirstItem + idx + 1}</td>
                  <td>{row.Kingdom}</td>
                  <td>{row.Cluster}</td>
                  <td>{row.Feature}</td>
                  <td>{row.FeatureDescription}</td>
                  <td>{row.FeatureDetail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination-controls">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            ‹ Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next ›
          </button>
        </div>

        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <button
            onClick={() => navigate("/result")}
            style={{
              backgroundColor: "#23D693",
              color: "#0F0F0F",
              padding: "10px 20px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Back to Result Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeatureDetailsPage;
