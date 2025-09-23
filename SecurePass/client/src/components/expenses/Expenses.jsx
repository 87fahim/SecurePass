import React, { useState, useEffect, useContext, useRef } from "react";
import "./Expenses.css";
import ImportCSV from "./ImportCSV";
import AuthContext from "../context/AuthProvider";
import DynamicForm from "../dynamics/DynamicForm";


const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
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
  const { auth } = useContext(AuthContext);

  const [activePage, setActivePage] = useState("Enter Data");
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [dataList, setDataList] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [isLoading, setIsLoading] = useState(true);

  // Modal ref for the Add form
  const addDialogRef = useRef(null);

  const showNotification = (message, type) =>
    setNotification({ message, type });

  const fetchAllEntries = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5050/api/expenses/all", {
        method: "GET",
        headers: { Authorization: `Bearer ${auth.accessToken}` },
      });
      if (response.ok) {
        const data = await response.json();
        setDataList(data);
      } else {
        throw new Error(`Error: ${response.statusText}`);
      }
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
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.accessToken}`,
        },
        body: JSON.stringify(valuesObject),
      });

      if (response.ok) {
        await fetchAllEntries();
        showNotification("Expense added successfully!", "success");
        closeAddDialog();
      } else {
        showNotification("Failed to add expense.", "error");
      }
    } catch (error) {
      showNotification("Error adding expense.", "error");
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      const response = await fetch("http://localhost:5050/api/expenses/one", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.accessToken}`,
        },
        body: JSON.stringify({ expenseId }),
      });
      if (response.ok) {
        fetchAllEntries();
        showNotification("Expense deleted successfully!", "success");
      } else {
        showNotification("Failed to delete expense.", "error");
      }
    } catch (error) {
      showNotification("Error deleting expense.", "error");
    }
  };

  const handleDeleteAllExpenses = async () => {
    try {
      const response = await fetch("http://localhost:5050/api/expenses/all", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.accessToken}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        fetchAllEntries();
        showNotification("All expenses deleted successfully!", "success");
      } else if (response.status === 403) {
        showNotification(data.message, "error");
      }
    } catch (error) {
      showNotification("Error deleting all expenses.", "error");
    }
  };

  // Sorting
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
      {/* Sidebar */}
      <aside className="sidebar">
        <ul>
          <li
            className={`menu-item ${activePage === "Enter Data" ? "active" : ""}`}
            onClick={() => setActivePage("Enter Data")}
          >
            Enter Data
          </li>
          <li
            className={`menu-item ${activePage === "Stats" ? "active" : ""}`}
            onClick={() => setActivePage("Stats")}
          >
            Stats
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="content">
        {activePage === "Enter Data" && (
          <div>
            <h2 className="section-title">Enter Data</h2>

            {/* Primary actions */}
            <div className="option-buttons" style={{ marginBottom: 12 }}>
              <button className="button" onClick={openAddDialog}>Add</button>
              <ImportCSV setDataList={setDataList} />
              <button className="expenses-options-button" onClick={handleDeleteAllExpenses}>
                Delete All
              </button>
            </div>

            {/* Add Expense Modal */}
            <dialog ref={addDialogRef} onCancel={closeAddDialog}>
              <h3 style={{ marginTop: 0 }}>Add Expense</h3>
              <DynamicForm
                fields={expenseFields}
                initialValues={initialExpenseValues}
                submitLabel="Save"
                onSubmit={handleAddExpense}
                onCancel={closeAddDialog}     // <-- DynamicForm now owns Cancel/Close
                resetOnCancel={true}          // <-- optional: clear inputs when canceling
                className="input-form"
              />
            </dialog>

            <Notification
              message={notification.message}
              type={notification.type}
              onClose={() => setNotification({ message: "", type: "" })}
            />

            <h3 className="table-title">Existing Data</h3>
            <div className="table-container">
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
                  </tr>
                </thead>
                <tbody>
                  {dataList.map((data, index) => (
                    <tr key={index}>
                      <td>{data.date}</td>
                      <td>{data.type}</td>
                      <td>{data.category}</td>
                      <td>{data.subCategory}</td>
                      <td>{data.occurrence}</td>
                      <td>${data.amount}</td>
                      <td>{data.card}</td>
                      <td>{data.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
