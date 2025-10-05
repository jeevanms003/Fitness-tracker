import { useAppContext } from '../context/AppProvider';
import { useState } from 'react';
import './DailyLog.css';

export default function DailyLog() {
  const { workouts, diet, waterIntake } = useAppContext();
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);

  const isSameDay = (timestamp, dayStr) => {
    const target = new Date(timestamp).toISOString().split('T')[0];
    return target === dayStr;
  };

  const todayWorkouts = workouts.filter(w => isSameDay(w.date, selectedDate));
  const todayDiet = diet.filter(d => isSameDay(d.date, selectedDate));
  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  return (
    <div className="ft-dailylog-container">
      <h2 className="ft-dailylog-title">Daily Log</h2>
      <input
        type="date"
        className="ft-dailylog-date-input"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />

      <section className="ft-dailylog-section">
        <h3 className="workouts">Workouts</h3>
        {todayWorkouts.length === 0 ? <p className="ft-dailylog-no-data">No workouts</p> : todayWorkouts.map((w, i) => (
          <div key={i} className="ft-dailylog-item">{w.type} — {w.duration} min</div>
        ))}
      </section>

      <section className="ft-dailylog-section">
        <h3 className="diet">Diet</h3>
        {todayDiet.length === 0 ? <p className="ft-dailylog-no-data">No meals</p> : todayDiet.map((d, i) => (
          <div key={i} className="ft-dailylog-item">{d.food} — {d.calories} cal</div>
        ))}
      </section>

      <section className="ft-dailylog-section">
        <h3 className="water">Water Intake</h3>
        <p className="ft-dailylog-no-data">{isToday ? waterIntake : 'Only tracked for today'}</p>
      </section>
    </div>
  );
}