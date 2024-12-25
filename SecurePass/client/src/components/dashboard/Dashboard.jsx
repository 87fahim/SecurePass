import React from 'react';
import './Dashboard.css';

const HomeLoggedIn = () => {
  return (
    <div className="home-container">    
      <div className="search-section">
        <input type="text" placeholder="Search passwords..." className="search-bar" />
      </div>
      <div className="quick-actions">
        <button className="action-button">Add Password</button>
        <button className="action-button">Generate Password</button>
      </div>
      <div className="content-section">
        <div className="recent-activity">
          <h2>Recent Activity</h2>
          <ul>
            <li>Gmail (Last updated 2 days ago)</li>
            <li>Bank Account</li>
          </ul>
        </div>
        <div className="favorites">
          <h2>Favorite Logins</h2>
          <ul>
            <li>Facebook</li>
            <li>GitHub</li>
          </ul>
        </div>
      </div>
      <footer className="home-footer">
        <button className="settings-button">Manage Settings</button>
        <button className="logout-button">Logout</button>
      </footer>
    </div>
  );
};

export default HomeLoggedIn;
