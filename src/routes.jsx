import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Workout from './pages/Workout';
import Diet from './pages/Diet';
import Water from './pages/Water';
import DailyLog from './pages/DailyLog';
// ...


export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/workout" element={<Workout />} />
        <Route path="/diet" element={<Diet />} />
        <Route path="/water" element={<Water />} />
        <Route path="/log" element={<DailyLog />} />
      </Routes>
    </BrowserRouter>
  );
}