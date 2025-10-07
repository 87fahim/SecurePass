import React from "react";
import "./LeftPanel.css";
import { BiSolidUserCircle } from "react-icons/bi";

const LeftPanel = ({ onTabSelect }) => {
  const tabs = ["My Profile", "Passwords", "My Links", "Expenses", "Settings", "Help"];

  return (
    <div className="left-panel">
      
      {tabs.map((tab, index) => (
        <button
          key={index}
          onClick={() => onTabSelect(tab)}
          className="tab-button"
        >
          <span>{tab}</span>
        </button>
      ))}
    </div>
  );
};

export default LeftPanel;
