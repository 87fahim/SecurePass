import React, { useState, useEffect } from "react";
import "./Passwords.css";
import useAuth from "../../../hooks/userAuth"; // ⬅️ adjust path if your hook is elsewhere
import { useNotification } from "../../notifications/NotificationProvider";

const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;
  return (
    <div className={`notification ${type}`}>
      <span>{message}</span>
      <span onClick={onClose} className="close-notification">&times;</span>
    </div>
  );
};

const Passwords = () => {
  const { isAuthenticated } = useAuth(); // ⬅️ from AuthProvider via hook
  
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState({
    dataUsername: "",
    dataPassword: "",
    dataWebsite: "",
    dataNotes: "",
  });
  const { notify, confirm } = useNotification();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [activeEntryIndex, setActiveEntryIndex] = useState(null);
  const [notification, setNotification] = useState({ message: "", type: "" });

  const fetchAllEntries = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5050/api/data/all", {
        method: "GET",
        credentials: "include",                // ✅ HttpOnly cookie flows
      });
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      setEntries(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching entries:", err);
      notify({message: `Cannot fetch items due to ${err}`})
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllEntries();
  }, []);

  const handleAddEntry = async () => {
    try {
      const res = await fetch("http://localhost:5050/api/data", {
        method: "POST",
        credentials: "include",                // ✅
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEntry),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        notify({ message: data.message || "Failed to add entry.", type: "error" });
        return;
      }
      setNewEntry({ dataUsername: "", dataPassword: "", dataWebsite: "", dataNotes: "" });
      setIsAdding(false);
      await fetchAllEntries();
      notify({ message: "Entry added successfully!", type: "success" });
    } catch (err) {
      console.error("Error adding entry:", err);
      notify({ message: "Failed to add entry.", type: "error" });
    }
  };

  const handleDeleteEntry = async (dataId) => {
    try {
      const res = await fetch("http://localhost:5050/api/data/one", {
        method: "DELETE",
        credentials: "include",                // ✅
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataId }),
      });
      const result = await res.json().catch(() => ({}));
      if (!res.ok) {
        notify({ message: result?.message || "Failed to delete entry.", type: "error" });
        return;
      }
      await fetchAllEntries();
      notify({
        message: "Entry deleted.",
        type: "success",
        actions: [
          {
            label: "Undo",
            onClick: async () => {
              notify({message:"call your restore API here, then refresh", type: "info"})
              // optional: call your restore API here, then refresh
              await fetchAllEntries();
              notify({ message: "Restored.", type: "info" });
            },
          },
        ],
      });
    } catch (err) {
      console.error("Error deleting entry:", err);
      notify({ message: "Error deleting entry.", type: "error" });
    }
  };

  const deleteAll = async () => {
    try {
      const res = await fetch("http://localhost:5050/api/data/all", {
        method: "DELETE",
        credentials: "include",                // ✅
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        notify({message:"Failed to delete all items.", type: "error", actions: [{label: "Retry", onClick:deleteAll}]})
        return;
      }
      await fetchAllEntries();
      notify({message:"All items deleted successfully!", type: "success"})
    } catch (err) {
      console.error("Error deleting all items:", err);
      notify({message: `Error deleting all items due to ${err}`, type: "error"})
    }
  };

  return (
    <div className="passwords-tab">
      <h2>Passwords</h2>

      {!isAuthenticated && (
        <p className="notice">Please log in to view and manage your passwords.</p>
      )}

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
            onChange={(e) => setNewEntry({ ...newEntry, dataUsername: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            value={newEntry.dataPassword}
            onChange={(e) => setNewEntry({ ...newEntry, dataPassword: e.target.value })}
          />
          <input
            type="text"
            placeholder="URL"
            value={newEntry.dataWebsite}
            onChange={(e) => setNewEntry({ ...newEntry, dataWebsite: e.target.value })}
          />
          <textarea
            placeholder="Notes"
            value={newEntry.dataNotes}
            onChange={(e) => setNewEntry({ ...newEntry, dataNotes: e.target.value })}
          />
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
              key={entry.dataId || entry._id || index}
              className="entry"
              onClick={() =>
                setActiveEntryIndex(activeEntryIndex === index ? null : index)
              }
            >
              <p>Website: {entry.dataWebsite}</p>
              {activeEntryIndex === index && (
                <div className="entry-details">
                  <p>Username: {entry.dataUsername}</p>
                  {/* Consider masking the password by default; reveal on click */}
                  <p>Password: {entry.dataPassword}</p>
                  <p>Notes: {entry.dataNotes}</p>
                  <button onClick={() => handleDeleteEntry(entry.dataId || entry._id)}>
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
