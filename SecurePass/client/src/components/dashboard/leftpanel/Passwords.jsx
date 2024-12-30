import React, { useState, useEffect } from "react";
import "./Passwords.css";

const Passwords = () => {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState({
    dataUsername: "",
    dataPassword: "",
    dataWebsite: "",
    dataNotes: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [activeEntryIndex, setActiveEntryIndex] = useState(null);


  const fetchEntries = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5050/api/data", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleAddEntry = async () => {
    try {
      const response = await fetch("http://localhost:5050/api/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
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
        await fetchEntries();
      } else {
        const data = await response.json();
        console.error("Error adding entry:", data.message);
      }
    } catch (error) {
      console.error("Error adding entry:", error);
    }
  };

  const handleDeleteEntry = async (dataId) => {
    try {
      console.log('Deleting entry with ID:', dataId);

      const response = await fetch(`http://localhost:5050/api/data`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ dataId }), // Send the dataId in the request body
      });

      if (response.ok) {
        console.log("Entry deleted successfully");
        await fetchEntries(); // Refresh the entries after successful deletion
      } else {
        console.error("Error deleting entry");
      }
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
  };

  const deleteAll = async () => {
    try {
      console.log("Deleting all items");
  
      const response = await fetch(`http://localhost:5050/api/data/all`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log(result.message); // Log the success message
        await fetchEntries(); // Refresh the entries after successful deletion
      } else {
        const error = await response.json();
        console.error("Error deleting all items:", error.message);
      }
    } catch (error) {
      console.error("Error deleting all items:", error);
    }
  };

  return (
    <div className="passwords-tab">
      <h2>Passwords</h2>
      {!isAdding && (
        <div className="password-buttons">
          <button onClick={() => setIsAdding(true)}>Add Entry</button>
          <button onClick={() => deleteAll()}>Delete All</button>
        </div>
      )}

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
            <div key={index} className="entry"  onClick={() => setActiveEntryIndex(activeEntryIndex === index ? null : index)}>
              <p>
                Website: {entry.dataWebsite}
              </p>
              {activeEntryIndex === index && (
                <div className="entry-details">
                  {/* <p>ID: { entry.dataId}</p> */}
                  <p>Username: {entry.dataUsername}</p>
                  <p>Password: {entry.dataPassword}</p>
                  <p>Notes: {entry.dataNotes}</p>
                  <button onClick={() => handleEditEntry(index)}>Edit</button>
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
