import React from "react";
import "./ImportCSV.css";
import useAuth from "../../hooks/userAuth";

/**
 * Robust-ish CSV parser with:
 * - Delimiter auto-detect (comma, semicolon, tab)
 * - Quoted fields (double quotes) and escaped quotes ("")
 * - Newlines inside quoted fields
 * Returns: { headers: string[], rows: Array<Record<string, any>> }
 */
function parseCSVSmart(text) {
  // Normalize line endings
  const input = String(text).replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // Detect delimiter by sampling first non-empty line
  const firstLine = input.split("\n").find((l) => l.trim().length > 0) || "";
  const candidates = [",", ";", "\t"];
  let delimiter = ",";

  let bestScore = -1;
  for (const d of candidates) {
    const parts = splitLine(firstLine, d);
    // Score: prefer more columns but not absurdly many
    const score = parts.length;
    if (score > bestScore) {
      bestScore = score;
      delimiter = d;
    }
  }

  // Parse state machine across entire text to keep quoted newlines
  const rows = [];
  let curField = "";
  let curRow = [];
  let i = 0;
  const N = input.length;
  let inQuotes = false;

  while (i < N) {
    const ch = input[i];

    if (inQuotes) {
      if (ch === '"') {
        // Check escaped quote
        if (i + 1 < N && input[i + 1] === '"') {
          curField += '"';
          i += 2;
          continue;
        }
        // Closing quote
        inQuotes = false;
        i += 1;
        continue;
      }
      // Regular char inside quotes (including newlines)
      curField += ch;
      i += 1;
      continue;
    } else {
      if (ch === '"') {
        inQuotes = true;
        i += 1;
        continue;
      }
      if (ch === delimiter) {
        curRow.push(curField);
        curField = "";
        i += 1;
        continue;
      }
      if (ch === "\n") {
        curRow.push(curField);
        rows.push(curRow);
        curRow = [];
        curField = "";
        i += 1;
        continue;
      }
      // Regular char
      curField += ch;
      i += 1;
    }
  }
  // Flush last field/row if any
  if (curField.length > 0 || inQuotes || curRow.length > 0) {
    curRow.push(curField);
  }
  if (curRow.length) rows.push(curRow);

  // Remove empty trailing rows
  const cleaned = rows.filter((r) => r.some((c) => String(c).trim().length > 0));
  if (cleaned.length === 0) return { headers: [], rows: [] };

  // Decide header presence: if first row has all non-empty and there are >=2 rows, treat it as header
  const headerRow = cleaned[0].map((h) => String(h).trim());
  const dataRows = cleaned.slice(1);
  const hasHeader = headerRow.some((h) => h.length > 0) && dataRows.length > 0;

  let headers;
  let body;

  if (hasHeader) {
    headers = headerRow.map((h, idx) => (h || `Column_${idx + 1}`));
    body = dataRows;
  } else {
    // No headers -> synthesize
    const maxLen = Math.max(...cleaned.map((r) => r.length));
    headers = new Array(maxLen).fill(0).map((_, i) => `Column_${i + 1}`);
    body = cleaned;
  }

  // Trim cells; build objects
  const objects = body.map((row) => {
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = (row[i] ?? "").trim();
    });
    return obj;
  });

  return { headers, rows: objects, delimiter };
}

function splitLine(line, delimiter) {
  let inQuotes = false;
  let cur = "";
  const parts = [];
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === delimiter) {
        parts.push(cur);
        cur = "";
      } else {
        cur += ch;
      }
    }
  }
  parts.push(cur);
  return parts;
}

/**
 * Props:
 * - onAppend(rows: object[])   -> called with parsed objects to add to table (recommended)
 * - setDataList(fn|array)      -> kept for backward compatibility
 * - persistUrl?: string        -> optional endpoint to POST { rows } after parsing
 */
const ImportCSV = ({ onAppend, setDataList, persistUrl }) => {
  const { isAuthenticated } = useAuth();

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const { rows } = parseCSVSmart(text);

      if (!rows || rows.length === 0) {
        // clear the input so selecting same file again re-triggers onChange
        event.target.value = "";
        return;
      }

      // Update UI (prefer onAppend; fall back to setDataList if provided)
      if (typeof onAppend === "function") {
        onAppend(rows);
      } else if (typeof setDataList === "function") {
        setDataList((prev) => [...(Array.isArray(prev) ? prev : []), ...rows]);
      }

      // Optional persistence: send raw rows to your backend if configured
      if (persistUrl) {
        try {
          const resp = await fetch(persistUrl, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rows }),
          });
          if (!resp.ok) {
            const err = await resp.json().catch(() => ({}));
            console.error("Persist failed:", err.message || resp.statusText);
          }
        } catch (e) {
          console.error("Persist error:", e);
        }
      }
    } catch (e) {
      console.error("CSV parse error:", e);
    } finally {
      // clear the input so selecting same file again re-triggers onChange
      event.target.value = "";
    }
  };

  return (
    <div className="upload-file-container">
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
