// E:\fitness-tracker\src\pages\Diet.jsx
import { useAppContext } from '../context/AppProvider';
import { useState } from 'react';
import './Diet.css';

export default function Diet() {
  const { diet, setDiet } = useAppContext();
  const [food, setFood] = useState('');
  const [calories, setCalories] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);

  const addMeal = () => {
    if (food && calories && date) {
      setDiet([...diet, { food, calories, date }]);
      setFood('');
      setCalories('');
    }
  };

  return (
    <div className="ft-diet-container">
      <h2 className="ft-diet-title">Diet Log</h2>
      <div className="ft-diet-form">
        <input
          type="date"
          className="ft-diet-input"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          className="ft-diet-input"
          value={food}
          onChange={(e) => setFood(e.target.value)}
          placeholder="Food"
        />
        <input
          className="ft-diet-input"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          placeholder="Calories"
          type="number"
        />
        <button className="ft-diet-button" onClick={addMeal}>
          Add Meal
        </button>
      </div>

      <div className="ft-diet-list">
        {diet.length === 0 ? (
          <div className="ft-diet-item">No meals logged</div>
        ) : (
          diet.map((d, idx) => (
            <div key={idx} className="ft-diet-item">
              <b>{d.food}</b>: {d.calories} cal on {new Date(d.date).toLocaleDateString()}
            </div>
          ))
        )}
      </div>
    </div>
  );
}