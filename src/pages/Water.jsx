// E:\fitness-tracker\src\pages\Water.jsx
import { useAppContext } from '../context/AppProvider';
import { useState } from 'react';
import './Water.css';

export default function Water() {
  const { waterIntake, setWaterIntake } = useAppContext();
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);

  const addWater = (ml) => {
    setWaterIntake(prev => prev + ml); // you can change this to per-day logic later
  };

  return (
    <div className="ft-water-container">
      <h2 className="ft-water-title">Water Tracker</h2>
      <div className="ft-water-form">
        <input
          type="date"
          className="ft-water-input"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <div className="ft-water-buttons">
          <button className="ft-water-button" onClick={() => addWater(250)}>+250ml</button>
          <button className="ft-water-button" onClick={() => addWater(500)}>+500ml</button>
          <button className="ft-water-button reset" onClick={() => setWaterIntake(0)}>Reset</button>
        </div>
      </div>
      <div className="ft-water-status">
        <p>You've consumed: <strong>{waterIntake} ml</strong> on {date}</p>
      </div>
    </div>
  );
}