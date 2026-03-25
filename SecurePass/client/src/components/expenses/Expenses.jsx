// import React, { useState, useEffect, useRef } from "react";
// import "./Expenses.css";
// import ImportCSV from "./ImportCSV";
// import DynamicForm from "../dynamics/DynamicForm";
// import useAuth from "../../hooks/userAuth"; // ← use the hook

// const Notification = ({ message, type, onClose }) => {
//   useEffect(() => {
//     if (message) {
//       const t = setTimeout(onClose, 3000);
//       return () => clearTimeout(t);
//     }
//   }, [message, onClose]);
//   if (!message) return null;
//   return (
//     <div className={`notification ${type}`}>
//       <span>{message}</span>
//       <span onClick={onClose} className="close-notification">&times;</span>
//     </div>
//   );
// };

// const Expenses = () => {
//   const { isAuthenticated } = useAuth(); // ← read from context via hook

//   const [activePage, setActivePage] = useState("Enter Data");
//   const [notification, setNotification] = useState({ message: "", type: "" });
//   const [dataList, setDataList] = useState([]);
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
//   const [isLoading, setIsLoading] = useState(true);

//   const addDialogRef = useRef(null);

//   const showNotification = (message, type) =>
//     setNotification({ message, type });

//   const fetchAllEntries = async () => {
//     setIsLoading(true);
//     try {
//       const response = await fetch("http://localhost:5050/api/expenses/all", {
//         method: "GET",
//         credentials: "include",                 // ✅ send HttpOnly cookie
//       });
//       if (!response.ok) throw new Error(response.statusText);
//       const data = await response.json();
//       setDataList(data);
//     } catch (error) {
//       showNotification("Failed to load entries.", "error");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAllEntries();
//   }, []);

//   const openAddDialog = () => addDialogRef.current?.showModal();
//   const closeAddDialog = () => addDialogRef.current?.close();

//   const expenseFields = [
//     { name: "date", label: "Date", type: "date", required: true },
//     { name: "type", label: "Type", type: "text" },
//     { name: "category", label: "Category", type: "text" },
//     { name: "subCategory", label: "Sub-Category", type: "text" },
//     { name: "occurrence", label: "Occurrence", type: "text" },
//     { name: "amount", label: "Amount", type: "number", required: true },
//     { name: "card", label: "Card", type: "text" },
//     { name: "description", label: "Description", type: "textarea" },
//   ];

//   const initialExpenseValues = {
//     date: new Date().toISOString().split("T")[0],
//     type: "",
//     category: "",
//     subCategory: "",
//     occurrence: "",
//     amount: "",
//     card: "",
//     description: "",
//   };

//   const handleAddExpense = async (_valuesArray, valuesObject) => {
//     try {
//       const response = await fetch("http://localhost:5050/api/expenses", {
//         method: "POST",
//         credentials: "include",                 // ✅ cookie-based auth
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(valuesObject),
//       });
//       if (!response.ok) throw new Error();
//       await fetchAllEntries();
//       showNotification("Expense added successfully!", "success");
//       closeAddDialog();
//     } catch {
//       showNotification("Failed to add expense.", "error");
//     }
//   };

//   const handleDeleteExpense = async (expenseId) => {
//     try {
//       const response = await fetch("http://localhost:5050/api/expenses/one", {
//         method: "DELETE",
//         credentials: "include",                 // ✅
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ expenseId }),
//       });
//       if (!response.ok) throw new Error();
//       await fetchAllEntries();
//       showNotification("Expense deleted successfully!", "success");
//     } catch {
//       showNotification("Failed to delete expense.", "error");
//     }
//   };

//   const handleDeleteAllExpenses = async () => {
//     try {
//       const response = await fetch("http://localhost:5050/api/expenses/all", {
//         method: "DELETE",
//         credentials: "include",                 // ✅
//         headers: { "Content-Type": "application/json" },
//       });
//       const data = await response.json().catch(() => ({}));
//       if (!response.ok) {
//         if (response.status === 403) {
//           showNotification(data.message || "Forbidden", "error");
//         } else {
//           throw new Error();
//         }
//       } else {
//         await fetchAllEntries();
//         showNotification("All expenses deleted successfully!", "success");
//       }
//     } catch {
//       showNotification("Error deleting all expenses.", "error");
//     }
//   };

//   const handleSort = (key) => {
//     let direction = "asc";
//     if (sortConfig.key === key && sortConfig.direction === "asc") {
//       direction = "desc";
//     }
//     const sorted = [...dataList].sort((a, b) => {
//       if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
//       if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
//       return 0;
//     });
//     setSortConfig({ key, direction });
//     setDataList(sorted);
//   };

//   return (
//     <div className="container">
//       <div className="tab-name">
//         <ul>
//           <li
//             className={`menu-item ${activePage === "Enter Data" ? "active" : ""}`}
//             onClick={() => setActivePage("Enter Data")}
//           >
//             Table View
//           </li>
//           <li
//             className={`menu-item ${activePage === "Stats" ? "active" : ""}`}
//             onClick={() => setActivePage("Stats")}
//           >
//             Chart View
//           </li>
//         </ul>
//       </div>

//       <nav className="expsenses-navbar">
//         <div className="option-buttons" style={{ marginBottom: 12 }}>
//           <button className="option-button add" onClick={openAddDialog}>Add</button>
//           <button className="option-button delete" onClick={handleDeleteAllExpenses}>Delete All</button>
//           <ImportCSV setDataList={setDataList} />
//         </div>
//         <dialog ref={addDialogRef} onCancel={closeAddDialog}>
//           <h3 style={{ marginTop: 0 }}>Add Expense</h3>
//           <DynamicForm
//             fields={expenseFields}
//             initialValues={initialExpenseValues}
//             submitLabel="Save"
//             onSubmit={handleAddExpense}
//             onCancel={closeAddDialog}
//             resetOnCancel={true}
//             className="input-form"
//           />
//         </dialog>

//         <Notification
//           message={notification.message}
//           type={notification.type}
//           onClose={() => setNotification({ message: "", type: "" })}
//         />
//       </nav>

//       <main className="content">

//         {activePage === "Enter Data" && (
//           <div className="table-container">
//             {isLoading ? (
//               <div style={{ padding: 16 }}>Loading…</div>
//             ) : (
//               <table className="table">
//                 <thead>
//                   <tr>
//                     <th onClick={() => handleSort("date")}>Date ⬍</th>
//                     <th onClick={() => handleSort("type")}>Type ⬍</th>
//                     <th onClick={() => handleSort("category")}>Category ⬍</th>
//                     <th onClick={() => handleSort("subCategory")}>Sub-Category ⬍</th>
//                     <th onClick={() => handleSort("occurrence")}>Occurrence ⬍</th>
//                     <th onClick={() => handleSort("amount")}>Amount ⬍</th>
//                     <th onClick={() => handleSort("card")}>Card ⬍</th>
//                     <th onClick={() => handleSort("description")}>Description ⬍</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {dataList.map((data) => (
//                     <tr key={data._id || `${data.date}-${data.amount}`}>
//                       <td>{data.date}</td>
//                       <td>{data.type}</td>
//                       <td>{data.category}</td>
//                       <td>{data.subCategory}</td>
//                       <td>{data.occurrence}</td>
//                       <td>${Number(data.amount).toFixed(2)}</td>
//                       <td>{data.card}</td>
//                       <td>{data.description}</td>
//                       <td>
//                         <button
//                           className="option-button delete"
//                           onClick={() => handleDeleteExpense(data._id)}
//                         >
//                           Delete
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         )}

//         {activePage === "Stats" && (
//           <div>
//             <h2 className="section-title">Stats</h2>
//             <p>Content will be added later</p>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default Expenses;


import React, { useState, useEffect, useMemo, useRef } from "react";
import "./Expenses.css";
import ImportCSV from "./ImportCSV";
import DynamicForm from "../dynamics/DynamicForm";
import useAuth from "../../hooks/userAuth"; // ← use the hook

// --- Small inline notification ---
const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    if (message) {
      const t = setTimeout(onClose, 3000);
      return () => clearTimeout(t);
    }
  }, [message, onClose]);
  if (!message) return null;
  return (
    <div className={`notification ${type}`}>
      <span>{message}</span>
      <span onClick={onClose} className="close-notification">&times;</span>
    </div>
  );
};

// --- Helpers: type detection + comparators ---
const isValidDate = (v) => {
  if (v == null || v === "") return false;
  // Try native parse first
  const t = Date.parse(v);
  if (!Number.isNaN(t)) return true;
  // Try common patterns (MM/DD/YYYY or DD/MM/YYYY or YYYY-MM-DD)
  const m = String(v).match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
  if (!m) return false;
  const mm = +m[1], dd = +m[2], yyyy = +((m[3].length === 2) ? ("20" + m[3]) : m[3]);
  const dt = new Date(yyyy, mm - 1, dd);
  return dt && dt.getMonth() === (mm - 1) && dt.getDate() === dd;
};

const toDate = (v) => {
  const p = Date.parse(v);
  if (!Number.isNaN(p)) return new Date(p);
  const m = String(v).match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
  if (m) {
    const mm = +m[1], dd = +m[2], yyyy = +((m[3].length === 2) ? ("20" + m[3]) : m[3]);
    return new Date(yyyy, mm - 1, dd);
  }
  return new Date(NaN);
};

const detectColumnType = (values) => {
  // Peek some values to infer
  let numericCount = 0, dateCount = 0, total = 0;
  for (const v of values) {
    if (v === null || v === undefined || v === "") continue;
    total++;
    const sv = String(v).trim();
    const num = Number(sv.replace(/[$, ]/g, ""));
    if (!Number.isNaN(num)) numericCount++;
    else if (isValidDate(sv)) dateCount++;
  }
  if (total === 0) return "text";
  if (numericCount / total > 0.6) return "number";
  if (dateCount / total > 0.6) return "date";
  return "text";
};

const buildSchema = (rows) => {
  // Union of all keys in order: try to keep header order from first row
  const keysOrdered = [];
  const seen = new Set();

  if (rows.length > 0) {
    for (const k of Object.keys(rows[0])) {
      if (!seen.has(k)) { seen.add(k); keysOrdered.push(k); }
    }
  }
  for (const r of rows) {
    for (const k of Object.keys(r)) {
      if (!seen.has(k)) { seen.add(k); keysOrdered.push(k); }
    }
  }

  // Column types
  const typeMap = {};
  for (const k of keysOrdered) {
    const colVals = rows.map((r) => r?.[k]);
    typeMap[k] = detectColumnType(colVals);
  }
  return { columns: keysOrdered, types: typeMap };
};

const Expenses = () => {
  const { isAuthenticated } = useAuth(); // may be used to conditionally guard
  const [activePage, setActivePage] = useState("Enter Data");
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [dataList, setDataList] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [isLoading, setIsLoading] = useState(true);
  const addDialogRef = useRef(null);

  const showNotification = (message, type) => setNotification({ message, type });

  // --- Fetch your existing expenses (optional; keeps your old workflow) ---
  const fetchAllEntries = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5050/api/expenses/all", {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error(response.statusText);
      const data = await response.json();
      // Ensure objects; if your API returns array of primitives, adapt here
      setDataList(Array.isArray(data) ? data : []);
    } catch (error) {
      showNotification("Failed to load entries.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchAllEntries(); }, []);

  // --- Dialog controls for manual add (kept for your expense flow) ---
  const openAddDialog = () => addDialogRef.current?.showModal();
  const closeAddDialog = () => addDialogRef.current?.close();

  const expenseFields = [
    { name: "date", label: "Date", type: "date", required: true },
    { name: "type", label: "Type", type: "text" },
    { name: "category", label: "Category", type: "text" },
    { name: "subCategory", label: "Sub-Category", type: "text" },
    { name: "occurrence", label: "Occurrence", type: "text" },
    { name: "amount", label: "Amount", type: "number", required: true },
    { name: "card", label: "Card", type: "text" },
    { name: "description", label: "Description", type: "textarea" },
  ];

  const initialExpenseValues = {
    date: new Date().toISOString().split("T")[0],
    type: "",
    category: "",
    subCategory: "",
    occurrence: "",
    amount: "",
    card: "",
    description: "",
  };

  const handleAddExpense = async (_valuesArray, valuesObject) => {
    try {
      const response = await fetch("http://localhost:5050/api/expenses", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(valuesObject),
      });
      if (!response.ok) throw new Error();
      await fetchAllEntries();
      showNotification("Expense added successfully!", "success");
      closeAddDialog();
    } catch {
      showNotification("Failed to add expense.", "error");
    }
  };

  // If row has _id -> call API; otherwise remove from local table only (CSV rows)
  const handleDeleteExpense = async (row) => {
    const expenseId = row?._id;
    if (!expenseId) {
      setDataList((prev) => prev.filter((r) => r !== row));
      showNotification("Row removed from table.", "success");
      return;
    }
    try {
      const response = await fetch("http://localhost:5050/api/expenses/one", {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expenseId }),
      });
      if (!response.ok) throw new Error();
      await fetchAllEntries();
      showNotification("Expense deleted successfully!", "success");
    } catch {
      showNotification("Failed to delete expense.", "error");
    }
  };

  const handleDeleteAllExpenses = async () => {
    // If current table has any _id, call API; else clear the UI
    const hasIds = dataList.some((r) => r && r._id);
    if (!hasIds) {
      setDataList([]);
      showNotification("All rows removed from table.", "success");
      return;
    }
    try {
      const response = await fetch("http://localhost:5050/api/expenses/all", {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (response.status === 403) {
          showNotification(data.message || "Forbidden", "error");
        } else {
          throw new Error();
        }
      } else {
        await fetchAllEntries();
        showNotification("All expenses deleted successfully!", "success");
      }
    } catch {
      showNotification("Error deleting all expenses.", "error");
    }
  };

  // --- Dynamic schema derived from data ---
  const { columns, types } = useMemo(() => buildSchema(dataList), [dataList]);

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return dataList;
    const key = sortConfig.key;
    const dir = sortConfig.direction === "asc" ? 1 : -1;
    const colType = types[key] || "text";

    const getVal = (row) => row?.[key];

    const cmp = (a, b) => {
      const va = getVal(a);
      const vb = getVal(b);
      if (va == null && vb == null) return 0;
      if (va == null) return -1 * dir;
      if (vb == null) return 1 * dir;

      if (colType === "number") {
        const na = Number(String(va).replace(/[$, ]/g, ""));
        const nb = Number(String(vb).replace(/[$, ]/g, ""));
        if (Number.isNaN(na) && Number.isNaN(nb)) return 0;
        if (Number.isNaN(na)) return -1 * dir;
        if (Number.isNaN(nb)) return 1 * dir;
        return na === nb ? 0 : (na < nb ? -1 : 1) * dir;
      }

      if (colType === "date") {
        const da = toDate(va).getTime();
        const db = toDate(vb).getTime();
        if (Number.isNaN(da) && Number.isNaN(db)) return 0;
        if (Number.isNaN(da)) return -1 * dir;
        if (Number.isNaN(db)) return 1 * dir;
        return da === db ? 0 : (da < db ? -1 : 1) * dir;
      }

      // text
      return String(va).localeCompare(String(vb)) * dir;
    };

    const copy = [...dataList];
    copy.sort(cmp);
    return copy;
  }, [dataList, sortConfig, types]);

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  // Friendly display for cell (numbers get trimmed; dates shown as-is)
  const formatCell = (key, value) => {
    if (value == null) return "";
    const t = types[key] || "text";
    if (t === "number") {
      const n = Number(String(value).replace(/[$, ]/g, ""));
      if (Number.isNaN(n)) return String(value);
      return n.toLocaleString(undefined, { maximumFractionDigits: 6 });
    }
    return String(value);
  };

  return (
    <div className="container">
      
      <div className="tab-name">
        <ul>
          <li
            className={`menu-item ${activePage === "Enter Data" ? "active" : ""}`}
            onClick={() => setActivePage("Enter Data")}
          >
            Table View
          </li>
          <li
            className={`menu-item ${activePage === "Stats" ? "active" : ""}`}
            onClick={() => setActivePage("Stats")}
          >
            Chart View
          </li>
        </ul>
      </div>

      <nav className="expsenses-navbar">
        <div className="option-buttons" style={{ marginBottom: 12 }}>
          <button className="option-button add" onClick={openAddDialog}>Add</button>
          <button className="option-button delete" onClick={handleDeleteAllExpenses}>Delete All</button>
          {/* If you want to persist CSV rows, pass persistUrl prop below */}
          <ImportCSV
            setDataList={setDataList}
            onAppend={(rows) => setDataList((prev) => [...prev, ...rows])}
            // persistUrl="http://localhost:5050/api/uploads/csv" // ← optional
          />
        </div>

        <dialog ref={addDialogRef} onCancel={closeAddDialog}>
          <h3 style={{ marginTop: 0 }}>Add Expense</h3>
          <DynamicForm
            fields={expenseFields}
            initialValues={initialExpenseValues}
            submitLabel="Save"
            onSubmit={handleAddExpense}
            onCancel={closeAddDialog}
            resetOnCancel={true}
            className="input-form"
          />
        </dialog>

        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ message: "", type: "" })}
        />
      </nav>

      <main className="content">
        {activePage === "Enter Data" && (
          <div className="table-container">
            {isLoading ? (
              <div style={{ padding: 16 }}>Loading…</div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    {columns.map((col) => (
                      <th key={col} onClick={() => handleSort(col)}>
                        {col} ⬍
                      </th>
                    ))}
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedData.map((row, idx) => (
                    <tr key={row._id || `r-${idx}`}>
                      {columns.map((col) => (
                        <td key={`${row._id || idx}-${col}`}>
                          {formatCell(col, row[col])}
                        </td>
                      ))}
                      <td>
                        <button
                          className="option-button delete"
                          onClick={() => handleDeleteExpense(row)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activePage === "Stats" && (
          <div>
            <h2 className="section-title">Stats</h2>
            <p>Content will be added later</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Expenses;
