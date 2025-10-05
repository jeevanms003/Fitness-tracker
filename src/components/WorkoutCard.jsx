// E:\fitness-tracker\src\components\WorkoutCard.jsx
import './WorkoutCard.css';

export default function WorkoutCard({ workout }) {
  return (
    <div className="ft-workout-card">
      <h4>{workout.type}</h4>
      <p>Duration: {workout.duration} min</p>
      <p>Date: {workout.date}</p>
    </div>
  );
}