// UploadForm.jsx
import React, { useState } from "react";
import axios from "axios";

const BACKEND_BASE = "http://localhost:5000"; // <- ensure this matches your running Flask app

/**
 * Props expected by your app:
 *  setResults(resultsArray)
 *  setTotalClauses(number)
 *  setError(string)
 *  setLoading(bool)
 */
const UploadForm = ({ setResults, setTotalClauses, setError, setLoading }) => {
  const [file, setFile] = useState(null);
  const [missingClausesLocal, setMissingClausesLocal] = useState([]);
  const [amendedContractText, setAmendedContractText] = useState("");

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
    // reset any previous UI
    setMissingClausesLocal([]);
    setAmendedContractText("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a PDF or DOCX file to upload.");
      return;
    }

    setLoading(true);
    setResults([]); // clear previous
    setTotalClauses(0);
    setMissingClausesLocal([]);
    setAmendedContractText("");
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(`${BACKEND_BASE}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 120000, // 2 min in case pdf is large
      });

      const data = res.data;

      // Backend field names:
      // data.analysis -> array of clause analyses (your app used this earlier)
      // data.total_clauses -> integer
      // data.missing_clauses -> list (may be empty)
      // data.modified_contract_download -> relative URL (e.g. "/download_modified?filename=...") OR null
      // data.modified_contract_filename -> filename saved on server

      if (data.analysis) {
        setResults(data.analysis);
      } else {
        setResults([]);
      }

      if (typeof data.total_clauses === "number") {
        setTotalClauses(data.total_clauses);
      }

      if (data.missing_clauses && Array.isArray(data.missing_clauses)) {
        // store locally for UI; you can also lift it up if needed
        setMissingClausesLocal(data.missing_clauses);
      }

      // If backend produced a modified contract, open download in new tab
      if (data.modified_contract_download) {
        // modified_contract_download is a relative path like "/download_modified?filename=..."
        // construct full URL
        const downloadUrl =
          data.modified_contract_download.startsWith("http")
            ? data.modified_contract_download
            : `${BACKEND_BASE}${data.modified_contract_download}`;

        // open in new tab to trigger download
        window.open(downloadUrl, "_blank");

        // optional: fetch the docx as text to preview (not recommended for binary)
        // instead, you may show the filename
        setAmendedContractText(
          data.modified_contract_filename
            ? `Modified file created on server: ${data.modified_contract_filename}`
            : `Modified contract ready for download: ${downloadUrl}`
        );
      } else {
        setAmendedContractText("");
      }
    } catch (err) {
      console.error("Upload error:", err);
      // try to extract message
      let msg = "Upload failed.";
      if (err.response && err.response.data) {
        // backend returned JSON error
        msg = err.response.data.error || JSON.stringify(err.response.data);
      } else if (err.message) {
        msg = err.message;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-form">
      <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={onFileChange}
          className="form-control"
        />

        <button
          type="submit"
          className={`btn ${file ? "btn-primary" : "btn-secondary"}`}
          disabled={!file}
        >
          {file ? "Upload & Analyze" : "Choose a file first"}
        </button>
      </form>

      {/* Local UI for missing clauses & amended contract result */}
      {missingClausesLocal && missingClausesLocal.length > 0 && (
        <div className="mt-3 alert alert-warning">
          <h5>Missing Clauses Detected</h5>
          <ul>
            {missingClausesLocal.map((m, idx) => {
              // backend returns tuples e.g. ["HIPAA","Data Privacy Protection Right"]
              if (Array.isArray(m)) {
                return (
                  <li key={idx}>
                    <strong>{m[0]}:</strong> {m[1]}
                  </li>
                );
              }
              // or objects
              return <li key={idx}>{JSON.stringify(m)}</li>;
            })}
          </ul>
        </div>
      )}

      {amendedContractText && (
        <div className="mt-3 alert alert-success">
          <h5>Modified Contract</h5>
          <p>{amendedContractText}</p>
          <p>
            The modified contract (DOCX) should have opened in a new tab for download.
            If it didn't, check the backend `modified_contract_download` URL in the network tab.
          </p>
        </div>
      )}
    </div>
  );
};

export default UploadForm;
