import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthProvider";
import './ImportCSV.css'
const ImportCSV = ({ setDataList }) => {
  const { auth, setAuth } = useContext(AuthContext);
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async ({ target }) => {
      const csvData = target.result.split("\n").slice(1); // Assuming first row is headers

      const expenses = csvData
        .map(row => row.split(","))
        .filter(cols => cols.length >= 7) // Ensure valid rows
        .map(cols => ({
          date: cols[0].trim(),
          type: cols[1].trim(),
          category: cols[2].trim(),
          subCategory: cols[3].trim(),
          occurrence: cols[4].trim(),
          amount: parseFloat(cols[5].trim().replace('$', '')),
          card: cols[6].trim(),
          description: cols[7]?.trim() || "",
        }));

      // Update UI
      setDataList(prevData => [...prevData, ...expenses]);

      // Send to Backend for Database Storage
      try {
        const response = await fetch("http://localhost:5050/api/expenses/bulk", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.accessToken}`,
          },
          body: JSON.stringify({ expenses }),
        });
       
        if (!response.ok) throw new Error("Failed to save expenses to DB");

        console.log("CSV Data successfully stored in DB.");
      } catch (error) {
        console.error("Error uploading CSV data:", error);
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="upload-file-container">
      <button className="upload-button" onClick={handleFileUpload}>Upload</button>
      <input className="choose-file" type="file" accept=".csv" onChange={handleFileUpload} />
      
    </div>
  );
};

export default ImportCSV;
