import React, { useState } from "react";
import LeftPanel from "./leftpanel/LeftPanel";
import MyProfile from "./profile/MyProfile";
import Passwords from "./passwords/Passwords";
import Settings from "./settings/Settings";
import Help from "./help/Help";
import "./Dashboard.css";
import Expenses from "../expenses/Expenses";

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
      case "Expenses":
        return <Expenses/>
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
