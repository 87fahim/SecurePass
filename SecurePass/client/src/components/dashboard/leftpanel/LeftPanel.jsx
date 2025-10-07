import React, { useEffect, useState } from "react";
import "./LeftPanel.css";

// Icons
import { BiSolidUserCircle } from "react-icons/bi";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaLink, FaMoneyBillWave, FaCog, FaQuestionCircle } from "react-icons/fa";
import { LuPanelLeftOpen, LuPanelLeftClose } from "react-icons/lu";

const TABS = [
  { key: "My Profile", icon: BiSolidUserCircle },
  { key: "Passwords",  icon: RiLockPasswordFill },
  { key: "My Links",   icon: FaLink },
  { key: "Expenses",   icon: FaMoneyBillWave },
  { key: "Settings",   icon: FaCog },
  { key: "Help",       icon: FaQuestionCircle },
];

const LeftPanel = ({ activeTab, onTabSelect }) => {
  const [collapsed, setCollapsed] = useState(true);

  // persist collapsed state
  useEffect(() => {
    const saved = localStorage.getItem("leftpanel:collapsed");
    if (saved !== null) setCollapsed(saved === "true");
  }, []);
  
  useEffect(() => {
    localStorage.setItem("leftpanel:collapsed", String(collapsed));
  }, [collapsed]);

  const toggle = () => setCollapsed(c => !c);

  return (
    <aside className={`left-panel ${collapsed ? "collapsed" : ""}`} aria-label="Sidebar navigation">
      <div className="lp-header">
        {!collapsed && <span className="lp-title">Dashboard</span>}
        <button
          className="collapse-btn"
          onClick={toggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand" : "Collapse"}
        >
          {collapsed ? <LuPanelLeftOpen /> : <LuPanelLeftClose />}
        </button>
      </div>

      <nav className="lp-nav" role="navigation">
        {TABS.map(({ key, icon: Icon }) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              className={`tab-button ${isActive ? "active" : ""}`}
              onClick={() => onTabSelect(key)}
              aria-current={isActive ? "page" : undefined}
              aria-label={key}
              title={key}                // shows tooltip when collapsed
            >
              <span className="tab-icon"><Icon /></span>
              {!collapsed && <span className="tab-label">{key}</span>}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default LeftPanel;
