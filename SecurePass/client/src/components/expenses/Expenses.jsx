import React, { useState, useEffect, useContext } from "react";
import "./Expenses.css";
import ImportCSV from "./ImportCSV";
import AuthContext from "../context/AuthProvider";


const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, 3000); // Auto-hide after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null; // Ensure notification appears only if there's text

  return (
    <div className={`notification ${type}`}>
      <span>{message}</span>
      <span onClick={onClose} className="close-notification">&times;</span>
    </div>
  );
};


const Expenses = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const [activePage, setActivePage] = useState("Enter Data");
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    type: "",
    category: "",
    subCategory: "",
    occurrence: "",
    amount: "",
    card: "",
    description: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [activeEntryIndex, setActiveEntryIndex] = useState(null);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [dataList, setDataList] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const showNotification = (message, type) => {
    setNotification({ message, type });
  };

  // Handle Form Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fetchAllEntries = async () => {
    setIsLoading(true);
    console.log("test:", auth.accessToken)
    try {
      const response = await fetch("http://localhost:5050/api/expenses/all", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,// Use the token from context
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log('received all data: ', data);
        // setEntries(data);
        setDataList(data);
      } else {
        throw new Error(`Error: ${response.statusText}`);
      }
    } catch (error) {
      console.log(error)
      // console.error("Error fetching entries:", error);
      showNotification("Failed to load entries.", "error");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchAllEntries();
  }, []);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5050/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.accessToken}`,
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setFormData({
          date: new Date().toISOString().split("T")[0],
          type: "",
          category: "",
          subCategory: "",
          occurrence: "",
          amount: "",
          card: "",
          description: "",
        });
        fetchAllEntries();
        showNotification("Expense added successfully!", "success");
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

  // Sorting Function
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sortedData = [...dataList].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setSortConfig({ key, direction });
    setDataList(sortedData);
  };

  return (
    <div className="container">
      {/* Sidebar */}
      <aside className="sidebar">
        <ul>
          <li className={`menu-item ${activePage === "Enter Data" ? "active" : ""}`} onClick={() => setActivePage("Enter Data")}>
            Enter Data
          </li>
          <li className={`menu-item ${activePage === "Stats" ? "active" : ""}`} onClick={() => setActivePage("Stats")}>
            Stats
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="content">
        {activePage === "Enter Data" && (
          <div>
            <h2 className="section-title">Enter Data</h2>
            <form onSubmit={handleAddExpense} className="input-form">
              <input type="date" name="date" value={formData.date} onChange={handleChange} className="input" />
              <input type="text" name="type" placeholder="Type" value={formData.type} onChange={handleChange} className="input" />
              <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} className="input" />
              <input type="text" name="subCategory" placeholder="Sub-Category" value={formData.subCategory} onChange={handleChange} className="input" />
              <input type="text" name="occurrence" placeholder="Occurrence" value={formData.occurrence} onChange={handleChange} className="input" />
              <input type="number" name="amount" placeholder="Amount" value={formData.amount} onChange={handleChange} className="input" />
              <input type="text" name="card" placeholder="Card" value={formData.card} onChange={handleChange} className="input" />
              <input type="text" name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="input" />
              <button type="submit" className="button">Submit</button>
            </form>

            {/* Import CSV Feature */}
             <div className="option-buttons">
              <ImportCSV setDataList={setDataList} />
              <button className="expenses-options-button" onClick={handleDeleteAllExpenses}>Delete All</button>
            </div>

            <Notification
              message={notification.message}
              type={notification.type}
              onClose={() => setNotification({ message: "", type: "" })}
            />
            {/* Data Table */}
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







