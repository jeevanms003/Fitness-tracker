// E:\fitness-tracker\src\pages\Dashboard.jsx
import { Link } from 'react-router-dom';
import './Dashboard.css';

export default function Dashboard() {
  return (
    <div className="ft-dashboard-container">
      <h2 className="ft-dashboard-title">
        <span className="ft-icon"></span> Fitness Dashboard
      </h2>
      <p className="ft-dashboard-subtitle">Track your progress, stay motivated!</p>

      <nav className="ft-nav-menu">
        <Link to="/profile" className="ft-nav-link ft-profile-link">
          <span className="ft-nav-icon"></span>
          <span className="ft-nav-text">Profile</span>
        </Link>
        <Link to="/workout" className="ft-nav-link ft-workout-link">
          <span className="ft-nav-icon"></span>
          <span className="ft-nav-text">Workout Tracker</span>
        </Link>
        <Link to="/diet" className="ft-nav-link ft-diet-link">
          <span className="ft-nav-icon"></span>
          <span className="ft-nav-text">Diet Log</span>
        </Link>
        <Link to="/water" className="ft-nav-link ft-water-link">
          <span className="ft-nav-icon"></span>
          <span className="ft-nav-text">Water Intake</span>
        </Link>
        <Link to="/log" className="ft-nav-link ft-log-link">
          <span className="ft-nav-icon"></span>
          <span className="ft-nav-text">Daily Activity Log</span>
        </Link>
      </nav>
    </div>
  );
}