{/*import React, { useRef, useState } from "react";
import "./sur.Dashboard.css";

const SurveyorDashboard = () => {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [ulpin, setUlpin] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSearch = () => {
    console.log("Searching ULPIN:", ulpin);
  };

  return (
    <div className="surveyor-dashboard">

      <h1>Surveyor Dashboard</h1>*/}

      {/* CAD / BIM Upload */}
      {/*<div className="surveyor-section">
        <h2>Upload CAD / BIM File</h2>

        <div
          className="upload-box"
          onClick={() => fileInputRef.current.click()}
        >
          <p>
            {file ? file.name : "Click to upload CAD / BIM file"}
          </p>

          <span>DWG • DXF • IFC • RVT</span>

          <input
            ref={fileInputRef}
            type="file"
            accept=".dwg,.dxf,.ifc,.rvt"
            onChange={handleFileChange}
            hidden
          />
        </div>
      </div>*/}

      {/* ULPIN Search */}
      {/*<div className="surveyor-section">
        <h2>Search by ULPIN</h2>

        <div className="ulpin-box">
          <input
            type="text"
            placeholder="Enter ULPIN"
            value={ulpin}
            onChange={(e) => setUlpin(e.target.value)}
          />

          <button onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>

    </div>
  );
};

export default SurveyorDashboard;*/}

import React, { useRef, useState } from "react";
import "./sur.dashboard.css";
import { ULPIN_DATASET } from "../services/ulpinApi";

const SurveyorDashboard = () => {
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [ulpin, setUlpin] = useState("");
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSearch = () => {
    const searchValue = ulpin.trim().toUpperCase();

    const found = ULPIN_DATASET.find(
      (item) => item.ulpin.toUpperCase() === searchValue
    );

    setResult(found || "not-found");
  };

  return (
    <div className="surveyor-dashboard">

      <h1>Surveyor Dashboard</h1>

      {/* CAD / BIM Upload */}
      <div className="surveyor-section">
        <h2>Upload CAD / BIM File</h2>

        <div
          className="upload-box"
          onClick={() => fileInputRef.current.click()}
        >
          <p>
            {file
              ? file.name
              : "Click to upload CAD / BIM file"}
          </p>

          <span>DWG • DXF • IFC • RVT</span>

          <input
            ref={fileInputRef}
            type="file"
            accept=".dwg,.dxf,.ifc,.rvt"
            onChange={handleFileChange}
            hidden
          />
        </div>
      </div>

      {/* ULPIN Search */}
      <div className="surveyor-section">
        <h2>Search by ULPIN</h2>

        <div className="ulpin-box">

          <input
            type="text"
            placeholder="Enter ULPIN"
            value={ulpin}
            onChange={(e) => setUlpin(e.target.value)}
          />

          <button onClick={handleSearch}>
            Search
          </button>

        </div>

        {/* Search Result */}
        {result && (
          <div className="ulpin-result">

            {result === "not-found" ? (
              <p>ULPIN not found.</p>
            ) : (
              <>
                <p>
                  <strong>ULPIN:</strong> {result.ulpin}
                </p>

                <p>
                  <strong>Floor:</strong> {result.floor}
                </p>

                <p>
                  <strong>Unit:</strong> {result.unit}
                </p>

                <p>
                  <strong>Type:</strong> {result.type}
                </p>
              </>
            )}

          </div>
        )}

      </div>

    </div>
  );
};

export default SurveyorDashboard;