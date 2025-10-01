import React from "react";
import "./ImportCSV.css";
import useAuth from "../../hooks/userAuth"; // or "../../hooks/userAuth" based on location

const ImportCSV = ({ setDataList }) => {
  const { isAuthenticated } = useAuth(); // optional: show guard/notice

  const parseCSV = (text) => {
    // Minimal parsing: handles CRLF and trims; NOT safe for quoted commas.
    // If you need robust parsing, use Papa Parse instead.
    return text
      .trim()
      .split(/\r?\n/)
      .filter((line) => line.trim().length > 0);
  };

  const toExpense = (cols) => ({
    date: cols[0]?.trim() || "",
    type: cols[1]?.trim() || "",
    category: cols[2]?.trim() || "",
    subCategory: cols[3]?.trim() || "",
    occurrence: cols[4]?.trim() || "",
    amount: Number((cols[5] || "").replace(/[$,\s]/g, "")) || 0,
    card: cols[6]?.trim() || "",
    description: cols[7]?.trim() || "",
  });

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result || "";
      const lines = parseCSV(text);
      if (lines.length === 0) return;

      // Assume first line is headers
      const dataLines = lines.slice(1);

      // Naive split — replace with Papa Parse if your CSV has quoted commas
      const expenses = dataLines
        .map((row) => row.split(","))
        .filter((cols) => cols.length >= 7)
        .map(toExpense);

      // Update UI
      setDataList((prev) => [...prev, ...expenses]);

      // Send to backend (cookie-based auth)
      try {
        const response = await fetch("http://localhost:5050/api/expenses/bulk", {
          method: "POST",
          credentials: "include",              // ✅ send HttpOnly cookie
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ expenses }),
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(err.message || "Failed to save expenses to DB");
        }

        console.log("CSV Data successfully stored in DB.");
      } catch (error) {
        console.error("Error uploading CSV data:", error);
      } finally {
        // clear the input so selecting same file again re-triggers onChange
        event.target.value = "";
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="upload-file-container">
      {/* Use label+input pairing so clicking the label opens the chooser */}
      <label className="upload-label" htmlFor="csv-input">Upload CSV</label>
      <input
        id="csv-input"
        className="choose-file"
        type="file"
        accept=".csv,text/csv"
        onChange={handleFileUpload}
      />
      {!isAuthenticated && (
        <p className="upload-hint">Please log in before uploading.</p>
      )}
    </div>
  );
};

export default ImportCSV;
