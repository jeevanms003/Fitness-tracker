import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AppContext = createContext();

// Use relative URL which will be proxied
const API_URL = '/api';

export const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);

  // State
  const [user, setUser] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [meals, setMeals] = useState([]);
  const [waterIntake, setWaterIntake] = useState(0);
  const [steps, setSteps] = useState(0);
  const [dailyStatsHistory, setDailyStatsHistory] = useState([]);
  const [goals, setGoals] = useState({
    calories: 2500,
    steps: 10000,
    activeMinutes: 60,
    water: 2500
  });

  // Initial Fetch
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/data`);
      const data = res.data;

      if (data.user) setUser(data.user);
      if (data.workouts) setWorkouts(data.workouts);
      if (data.meals) setMeals(data.meals);
      if (data.goals) setGoals(data.goals);
      if (data.dailyStats) setDailyStatsHistory(data.dailyStats);
      if (data.waterIntake !== undefined) setWaterIntake(data.waterIntake);
      if (data.steps !== undefined) setSteps(data.steps);
    } catch (err) {
      console.error("Failed to fetch data from backend", err);
    } finally {
      setLoading(false);
    }
  };

  const syncUser = async (newUser) => {
    setUser(newUser);
    await axios.post(`${API_URL}/user`, newUser);
  };

  const syncGoals = async (newGoals) => {
    setGoals(newGoals);
    await axios.post(`${API_URL}/goals`, newGoals);
  };

  const addWorkout = async (workout) => {
    // Optimistic Update
    const tempId = Date.now();
    const newWorkout = { ...workout, id: tempId };
    setWorkouts([...workouts, newWorkout]);

    const estimatedSteps = (workout.duration || 0) * 100;
    setSteps(prev => prev + estimatedSteps);

    try {
      const res = await axios.post(`${API_URL}/workouts`, workout);
      setWorkouts(prev => prev.map(w => w.id === tempId ? res.data : w));
    } catch (e) {
      console.error(e);
      setWorkouts(prev => prev.filter(w => w.id !== tempId));
      setSteps(prev => prev - estimatedSteps);
    }
  };

  const removeWorkout = async (id) => {
    setWorkouts(prev => prev.filter(w => (w.id || w._id) !== id));
    await axios.delete(`${API_URL}/workouts/${id}`);
  }

  const addMeal = async (meal) => {
    const tempId = Date.now();
    const newMeal = { ...meal, id: tempId };
    setMeals([...meals, newMeal]);

    try {
      const res = await axios.post(`${API_URL}/meals`, meal);
      setMeals(prev => prev.map(m => m.id === tempId ? res.data : m));
    } catch (e) {
      setMeals(prev => prev.filter(m => m.id !== tempId));
    }
  };

  const removeMeal = async (id) => {
    setMeals(prev => prev.filter(m => (m.id || m._id) !== id));
    await axios.delete(`${API_URL}/meals/${id}`);
  };

  const syncWater = async (amount, dateStr = null) => {
    // Optimistically update dailyStatsHistory
    const targetDate = dateStr || new Date().toISOString().split('T')[0];

    setDailyStatsHistory(prev => {
      const existing = prev.find(d => d.date === targetDate);
      if (existing) {
        return prev.map(d => d.date === targetDate ? { ...d, waterIntake: amount } : d);
      } else {
        return [...prev, { date: targetDate, waterIntake: amount, steps: 0 }];
      }
    });

    const isToday = !dateStr || dateStr === new Date().toISOString().split('T')[0];
    if (isToday) setWaterIntake(amount);

    await axios.post(`${API_URL}/water`, { amount, date: dateStr });
  };

  const updateSteps = async (totalSteps, dateStr = null) => {
    const targetDate = dateStr || new Date().toISOString().split('T')[0];

    setDailyStatsHistory(prev => {
      const existing = prev.find(d => d.date === targetDate);
      if (existing) {
        return prev.map(d => d.date === targetDate ? { ...d, steps: totalSteps } : d);
      } else {
        return [...prev, { date: targetDate, steps: totalSteps, waterIntake: 0 }];
      }
    });

    const isToday = !dateStr || dateStr === new Date().toISOString().split('T')[0];
    if (isToday) setSteps(totalSteps);

    await axios.post(`${API_URL}/steps`, { steps: totalSteps, date: dateStr });
  };

  const logout = () => {
    setUser(null);
  };

  const getStatsForDate = (dateStr) => {
    // dateStr format: YYYY-MM-DD
    const dayStat = dailyStatsHistory.find(d => d.date === dateStr);

    // Filter workouts and meals for this date
    // Note: workouts/meals store full date objects/strings, so we need to compare YYYY-MM-DD parts
    const dayWorkouts = workouts.filter(w => new Date(w.date).toISOString().split('T')[0] === dateStr);
    const dayMeals = meals.filter(m => new Date(m.date || Date.now()).toISOString().split('T')[0] === dateStr);

    return {
      waterIntake: dayStat ? dayStat.waterIntake : 0,
      steps: dayStat ? dayStat.steps : 0,
      workouts: dayWorkouts,
      meals: dayMeals,
      caloriesConsumed: dayMeals.reduce((acc, curr) => acc + (parseInt(curr.calories) || 0), 0),
      proteinConsumed: dayMeals.reduce((acc, curr) => acc + (parseInt(curr.protein) || 0), 0),
      caloriesBurned: dayWorkouts.reduce((acc, curr) => acc + (curr.calories || (parseInt(curr.duration) * 5) || 0), 0),
    };
  };

  // --- Derived Stats for TODAY (Default) ---
  const todayCaloriesConsumed = meals.reduce((acc, curr) => {
    // rudimentary check for today strictly if needed, but keeping existing logic which sums ALL meals (bug in original? no, original code summed all meals in the array, essentially simplistic. I should probably filter for "today" to make stats accurate)
    // Wait, let's look at original logic: `meals.reduce...`. If `meals` contains all history, then `todayCaloriesConsumed` was actually "All Time Calories" which is wrong.
    // Let's fix this to be TODAY's stats by default.
    const isToday = new Date(curr.date || Date.now()).toISOString().split('T')[0] === new Date().toISOString().split('T')[0];
    return isToday ? acc + (parseInt(curr.calories) || 0) : acc;
  }, 0);

  const todayCaloriesBurned = workouts.reduce((acc, curr) => {
    const isToday = new Date(curr.date).toISOString().split('T')[0] === new Date().toISOString().split('T')[0];
    return isToday ? acc + (parseInt(curr.calories) || parseInt(curr.duration) * 5) : acc;
  }, 0);

  const todayActiveMinutes = workouts.reduce((acc, curr) => {
    const isToday = new Date(curr.date).toISOString().split('T')[0] === new Date().toISOString().split('T')[0];
    return isToday ? acc + (parseInt(curr.duration) || 0) : acc;
  }, 0);

  return (
    <AppContext.Provider value={{
      loading,
      user, setUser: syncUser, logout,
      workouts, addWorkout, removeWorkout,
      meals, addMeal, removeMeal,
      waterIntake, setWaterIntake: syncWater,
      goals, setGoals: syncGoals,
      updateSteps,
      getStatsForDate,
      stats: {
        caloriesConsumed: todayCaloriesConsumed,
        caloriesBurned: todayCaloriesBurned,
        activeMinutes: todayActiveMinutes,
        waterIntake, // This is already specific to "today" from backend logic
        steps // This is already specific to "today" from backend logic
      }
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
