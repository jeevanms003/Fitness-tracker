import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState({ name: '', age: '', height: '', weight: '' });
  const [workouts, setWorkouts] = useState([]);
  const [diet, setDiet] = useState([]);
  const [waterIntake, setWaterIntake] = useState(0);

  // Load saved data on first render
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    const savedWorkouts = JSON.parse(localStorage.getItem('workouts'));
    const savedDiet = JSON.parse(localStorage.getItem('diet'));
    const savedWater = JSON.parse(localStorage.getItem('waterIntake'));

    if (savedUser) setUser(savedUser);
    if (savedWorkouts) setWorkouts(savedWorkouts);
    if (savedDiet) setDiet(savedDiet);
    if (savedWater) setWaterIntake(savedWater);
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  // Save workouts
  useEffect(() => {
    localStorage.setItem('workouts', JSON.stringify(workouts));
  }, [workouts]);

  // Save diet
  useEffect(() => {
    localStorage.setItem('diet', JSON.stringify(diet));
  }, [diet]);

  // Save water intake
  useEffect(() => {
    localStorage.setItem('waterIntake', JSON.stringify(waterIntake));
  }, [waterIntake]);

  return (
    <AppContext.Provider value={{
      user, setUser,
      workouts, setWorkouts,
      diet, setDiet,
      waterIntake, setWaterIntake
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
