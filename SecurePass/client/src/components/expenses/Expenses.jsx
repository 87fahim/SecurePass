import React, { useState, useEffect, useRef } from "react";
import "./Expenses.css";
import ImportCSV from "./ImportCSV";
import DynamicForm from "../dynamics/DynamicForm";
import useAuth from "../../hooks/userAuth"; // ← use the hook

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

const Expenses = () => {
  const { isAuthenticated } = useAuth(); // ← read from context via hook

  const [activePage, setActivePage] = useState("Enter Data");
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [dataList, setDataList] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [isLoading, setIsLoading] = useState(true);

  const addDialogRef = useRef(null);

  const showNotification = (message, type) =>
    setNotification({ message, type });

  const fetchAllEntries = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5050/api/expenses/all", {
        method: "GET",
        credentials: "include",                 // ✅ send HttpOnly cookie
      });
      if (!response.ok) throw new Error(response.statusText);
      const data = await response.json();
      setDataList(data);
    } catch (error) {
      showNotification("Failed to load entries.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllEntries();
  }, []);

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
        credentials: "include",                 // ✅ cookie-based auth
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

  const handleDeleteExpense = async (expenseId) => {
    try {
      const response = await fetch("http://localhost:5050/api/expenses/one", {
        method: "DELETE",
        credentials: "include",                 // ✅
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
    try {
      const response = await fetch("http://localhost:5050/api/expenses/all", {
        method: "DELETE",
        credentials: "include",                 // ✅
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

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    const sorted = [...dataList].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setSortConfig({ key, direction });
    setDataList(sorted);
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
          <ImportCSV setDataList={setDataList} />
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
                    <th onClick={() => handleSort("date")}>Date ⬍</th>
                    <th onClick={() => handleSort("type")}>Type ⬍</th>
                    <th onClick={() => handleSort("category")}>Category ⬍</th>
                    <th onClick={() => handleSort("subCategory")}>Sub-Category ⬍</th>
                    <th onClick={() => handleSort("occurrence")}>Occurrence ⬍</th>
                    <th onClick={() => handleSort("amount")}>Amount ⬍</th>
                    <th onClick={() => handleSort("card")}>Card ⬍</th>
                    <th onClick={() => handleSort("description")}>Description ⬍</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dataList.map((data) => (
                    <tr key={data._id || `${data.date}-${data.amount}`}>
                      <td>{data.date}</td>
                      <td>{data.type}</td>
                      <td>{data.category}</td>
                      <td>{data.subCategory}</td>
                      <td>{data.occurrence}</td>
                      <td>${Number(data.amount).toFixed(2)}</td>
                      <td>{data.card}</td>
                      <td>{data.description}</td>
                      <td>
                        <button
                          className="option-button delete"
                          onClick={() => handleDeleteExpense(data._id)}
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
