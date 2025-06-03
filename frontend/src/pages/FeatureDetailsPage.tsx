import React, { useState } from "react";
import search from "../assets/images/search.png";
import "../feature-details.css";

const FeatureDetailsPage: React.FC = () => {
  const [inputId, setInputId] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async () => {
    setNotFound(false);
    setData([]);

    if (!inputId) return;

    try {
      const response = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            query {
              getFeatureDetails(ID: ${inputId}) {
                Cluster
                Kingdom
                Feature
                FeatureDescription
                FeatureDetail
              }
            }
          `,
        }),
      });

      const json = await response.json();
      const result = json.data.getFeatureDetails;

      if (Array.isArray(result) && result.length > 0) {
        setData(result);
      } else if (result) {
        setData([result]);
      } else {
        setNotFound(true);
      }
    } catch (err) {
      console.error("Search failed:", err);
      setNotFound(true);
    }
  };

  return (
    <div className="feature-page-container">
      <h1 className="feature-page-title">Feature Details</h1>
      <div className="feature-search-section">
        <div className="feature-search-bar">
          <input
            type="text"
            placeholder="Insert Feature ID"
            value={inputId}
            onChange={(e) => setInputId(e.target.value)}
          />
          <button onClick={handleSearch}>
            <img src={search} alt="Search" className="search-icon" />
          </button>
        </div>

        {notFound && (
          <p style={{ color: "#ff6666", marginTop: "1rem" }}>Data not found.</p>
        )}

        {data.length > 0 && (
          <div className="feature-result-box">
            <table className="feature-table">
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
                {data.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.Kingdom}</td>
                    <td>{item.Cluster}</td>
                    <td>{item.Feature}</td>
                    <td>{item.FeatureDescription}</td>
                    <td>{item.FeatureDetail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeatureDetailsPage;
