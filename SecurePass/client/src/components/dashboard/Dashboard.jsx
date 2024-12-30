import React, { useState } from "react";
import LeftPanel from "./leftpanel/LeftPanel";
import MyProfile from "./leftpanel/MyProfile";
import Passwords from "./leftpanel/Passwords";
import Settings from "./leftpanel/Settings";
import Help from "./leftpanel/Help";
import "./Dashboard.css";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("My Profile");

  const renderActiveTab = () => {
    switch (activeTab) {
      case "My Profile":
        return <MyProfile />;
      case "Passwords":
        return <Passwords />;
      case "Settings":
        return <Settings />;
      case "Help":
        return <Help />;
      default:
        return null;
    }
  };

  return (
    <div className="dashboard">
      <LeftPanel onTabSelect={setActiveTab} />
      <div className="dashboard-content">{renderActiveTab()}</div>
    </div>
  );
};

export default Dashboard;
