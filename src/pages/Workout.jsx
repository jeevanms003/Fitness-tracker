// E:\fitness-tracker\src\pages\Workout.jsx
import { useState } from 'react';
import { useAppContext } from '../context/AppProvider';
import WorkoutCard from '../components/WorkoutCard';
import './Workout.css';

export default function Workout() {
  const { workouts, setWorkouts } = useAppContext();
  const [type, setType] = useState('');
  const [duration, setDuration] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);

  const addWorkout = () => {
    if (type && duration && date) {
      const newWorkout = { type, duration, date };
      setWorkouts([...workouts, newWorkout]);
      setType('');
      setDuration('');
    }
  };

  return (
    <div className="ft-workout-container">
      <h2 className="ft-workout-title">Workout Tracker</h2>
      <div className="ft-workout-form">
        <input
          type="date"
          className="ft-workout-input"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          className="ft-workout-input"
          value={type}
          onChange={(e) => setType(e.target.value)}
          placeholder="Workout Type"
        />
        <input
          className="ft-workout-input"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="Duration (min)"
          type="number"
        />
        <button className="ft-workout-button" onClick={addWorkout}>
          Add Workout
        </button>
      </div>

      <div className="ft-workout-list">
        {workouts.length === 0 ? (
          <div className="ft-workout-card">No workouts logged</div>
        ) : (
          workouts.map((w, idx) => (
            <WorkoutCard key={idx} workout={{ ...w, date: new Date(w.date).toLocaleDateString() }} />
          ))
        )}
      </div>
    </div>
  );
}