import React, { useState, useEffect, useContext } from "react";
import "./Passwords.css";
import AuthContext from "../../context/AuthProvider";




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

const Passwords = () => {
  const [entries, setEntries] = useState([]);
  const { auth, setAuth } = useContext(AuthContext);
  const [newEntry, setNewEntry] = useState({
    dataUsername: "",
    dataPassword: "",
    dataWebsite: "",
    dataNotes: "",
  });
  // console.log('entry:', newEntry);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [activeEntryIndex, setActiveEntryIndex] = useState(null);
  const [notification, setNotification] = useState({ message: "", type: "" });

  const showNotification = (message, type) => {
    setNotification({ message, type });
  };

  const fetchAllEntries = async () => {
    setIsLoading(true);
    console.log("test:", auth.accessToken)
    try {
      const response = await fetch("http://localhost:5050/api/data/all", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,// Use the token from context
        },
      });
      if (response.ok) {
        const data = await response.json();
        setEntries(data);
      } else {
        throw new Error(`Error: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching entries:", error);
      showNotification("Failed to load entries.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllEntries();
  }, []);
  
  const handleAddEntry = async () => {
    try {
      console.log("====>", auth.accessToken)
      const response = await fetch("http://localhost:5050/api/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.accessToken}`,
        },
        body: JSON.stringify(newEntry),
      });
      if (response.ok) {
        setNewEntry({
          dataUsername: "",
          dataPassword: "",
          dataWebsite: "",
          dataNotes: "",
        });
        setIsAdding(false); // Hide the Add Entry form
        await fetchAllEntries();
        showNotification("Entry added successfully!", "success");
      } else {
        const data = await response.json();
        console.error("Error adding entry:", data.message);
        showNotification(data.message, "error");
      }
    } catch (error) {
      console.error("Error adding entry:", error);
      showNotification("Failed to add entry.", "error");
    }
  };
  const handleDeleteEntry = async (dataId) => {
    try {
      const response = await fetch(`http://localhost:5050/api/data/one`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.accessToken}`, // Token from context
        },
        body: JSON.stringify({ dataId }),
      });
      const result = await response.json();
      console.log(result);
      if (response.ok) {
        await fetchAllEntries(); // Refresh entries
        showNotification("Entry deleted successfully!", "success");
      } else {
        const errorData = await response.json();
        showNotification(
          errorData?.message || "Failed to delete entry.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error deleting entry:", error);
      showNotification("Error deleting entry. Please try again later.", "error");
    }
  };
  

  const deleteAll = async () => {
    try {
      const response = await fetch(`http://localhost:5050/api/data/all`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.accessToken}`,
        },
      });

      if (response.ok) {
        await fetchAllEntries();
        showNotification("All items deleted successfully!", "success");
      } else {
        showNotification("Failed to delete all items.", "error");
      }
    } catch (error) {
      console.error("Error deleting all items:", error);
      showNotification("Error deleting all items.", "error");
    }
  };

  return (
    <div className="passwords-tab">

      <h2>Passwords</h2>
      {!isAdding && (
        <div className="password-buttons">
          <button onClick={() => setIsAdding(true)}>Add Entry</button>
          <button onClick={deleteAll}>Delete All</button>
        </div>
      )}
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: "", type: "" })}
      />
      {isAdding && (
        <div className="add-entry">
          <input
            type="text"
            placeholder="Username"
            value={newEntry.dataUsername}
            onChange={(e) =>
              setNewEntry({ ...newEntry, dataUsername: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="Password"
            value={newEntry.dataPassword}
            onChange={(e) =>
              setNewEntry({ ...newEntry, dataPassword: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="URL"
            value={newEntry.dataWebsite}
            onChange={(e) =>
              setNewEntry({ ...newEntry, dataWebsite: e.target.value })
            }
          />
          <textarea
            placeholder="Notes"
            value={newEntry.dataNotes}
            onChange={(e) =>
              setNewEntry({ ...newEntry, dataNotes: e.target.value })
            }
          ></textarea>
          <button onClick={handleAddEntry}>Save</button>
          <button onClick={() => setIsAdding(false)}>Cancel</button>
        </div>
      )}

      <div className="entries-list">
        <h3>Existing Entries</h3>
        {isLoading ? (
          <p>Loading...</p>
        ) : entries.length > 0 ? (
          entries.map((entry, index) => (
            <div
              key={index}
              className="entry"
              onClick={() =>
                setActiveEntryIndex(activeEntryIndex === index ? null : index)
              }
            >
              <p>Website: {entry.dataWebsite}</p>
              {activeEntryIndex === index && (
                <div className="entry-details">
                  <p>Username: {entry.dataUsername}</p>
                  <p>Password: {entry.dataPassword}</p>
                  <p>Notes: {entry.dataNotes}</p>
                  <button onClick={() => handleDeleteEntry(entry.dataId)}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No entries found.</p>
        )}
      </div>
    </div>
  );
};

export default Passwords;
