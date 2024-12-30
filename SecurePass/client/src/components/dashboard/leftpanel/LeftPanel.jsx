import React from "react";
import "./LeftPanel.css";

const LeftPanel = ({ onTabSelect }) => {
  const tabs = ["My Profile", "Passwords", "Settings", "Help"];

  return (
    <div className="left-panel">
      {tabs.map((tab, index) => (
        <button
          key={index}
          onClick={() => onTabSelect(tab)}
          className="tab-button"
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default LeftPanel;
