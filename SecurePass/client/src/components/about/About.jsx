import React from 'react';
import './About.css';
import { useTheme } from '../context/ThemeProvider';

const About = () => {
  const { theme, themeColors } = useTheme();

  const cardStyle = {
    borderColor: themeColors.border,
    backgroundColor: themeColors.bg,
    color: themeColors.text,
  };

  return (
    <main
      className="about-page"
      style={{ backgroundColor: themeColors.bg, color: themeColors.text }}
    >
      <section className="about-hero" style={cardStyle}>
        <div className="about-hero-content">
          <span
            className="about-badge"
            style={{ color: themeColors.accent, borderColor: themeColors.border }}
          >
            Secure • Simple • Organized
          </span>

          <h1 style={{ color: themeColors.text }}>About SecurePass</h1>

          <p className="about-subtitle">
            SecurePass helps you manage passwords, important links, and personal
            information in one place with a clean interface and privacy-focused design.
          </p>
        </div>
      </section>

      <section className="about-grid">
        <article className="about-card" style={cardStyle}>
          <h2>What SecurePass Does</h2>
          <p>
            SecurePass is designed to make digital organization easier. You can keep
            login details, useful links, and personal records in one secure and simple
            place without the clutter of scattered notes and bookmarks.
          </p>
        </article>

        <article className="about-card" style={cardStyle}>
          <h2>Why People Use It</h2>
          <ul className="benefits-list">
            <li>Keep passwords and important info organized</li>
            <li>Save useful links for quick access later</li>
            <li>Reduce clutter across notes, bookmarks, and files</li>
            <li>Use a clean interface that is easy to navigate</li>
            <li>Keep privacy and security as a priority</li>
          </ul>
        </article>
      </section>

      <section className="about-card" style={cardStyle}>
        <h2>Main Features</h2>

        <div className="feature-grid">
          <div className="feature-item">
            <h3>Password Storage</h3>
            <p>
              Save and manage credentials in a structured way with secure backend handling.
            </p>
          </div>

          <div className="feature-item">
            <h3>Link Management</h3>
            <p>
              Organize bookmarks, resources, and frequently used links into categories.
            </p>
          </div>

          <div className="feature-item">
            <h3>Expense Tracking</h3>
            <p>
              Track personal expenses and import CSV data for easier financial management.
            </p>
          </div>

          <div className="feature-item">
            <h3>Responsive Interface</h3>
            <p>
              Built with React for a modern experience across desktop and mobile screens.
            </p>
          </div>

          <div className="feature-item">
            <h3>Modular Design</h3>
            <p>
              Organized architecture makes the app easier to maintain and extend.
            </p>
          </div>

          <div className="feature-item">
            <h3>Future Integrations</h3>
            <p>
              Ready for real-time features, WebSocket integrations, and AI-assisted tools.
            </p>
          </div>
        </div>
      </section>

      <section className="about-grid">
        <article className="about-card" style={cardStyle}>
          <h2>Security First</h2>
          <ul>
            <li>Store secrets in environment variables</li>
            <li>Use strong hashing such as bcrypt or argon2</li>
            <li>Prefer short-lived access tokens</li>
            <li>Use secure cookie strategies where possible</li>
            <li>Run under HTTPS in production</li>
            <li>Restrict CORS to trusted origins</li>
          </ul>
        </article>

        <article className="about-card" style={cardStyle}>
          <h2>Tech Stack</h2>
          <ul>
            <li><strong>Frontend:</strong> React + Vite</li>
            <li><strong>Backend:</strong> Node.js + Express</li>
            <li><strong>API Style:</strong> REST APIs</li>
            <li><strong>Database:</strong> Configured through environment variables</li>
            <li><strong>Optional Real-Time Layer:</strong> WebSocket / MCP-style support</li>
          </ul>
        </article>
      </section>

      <section className="about-card" style={cardStyle}>
        <h2>Getting Started</h2>
        <ol className="steps-list">
          <li>
            Start the client:
            <code>cd client && npm install && npm run dev</code>
          </li>
          <li>
            Copy <code>server/.env.example</code> to <code>server/.env</code> and fill
            in the required environment values.
          </li>
          <li>Start the backend server and connect it to your database.</li>
          <li>
            Optionally run the MCP/WebSocket server if your project uses real-time or
            model integrations.
          </li>
        </ol>
      </section>

      <section className="about-card" style={cardStyle}>
        <h2>Project Goals</h2>
        <p>
          SecurePass is focused on usability, privacy, and maintainability. The goal is
          to keep the experience simple for users while making the codebase flexible for
          future growth and enhancements.
        </p>
      </section>

      <footer className="about-footer" style={{ borderColor: themeColors.border }}>
        <p>Built with a focus on usability, privacy, and maintainability.</p>
        <p>
          Current theme: <strong>{theme}</strong>
        </p>
      </footer>
    </main>
  );
};

export default About;