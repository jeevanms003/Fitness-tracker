import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Workout from './pages/Workout';
import Diet from './pages/Diet';
import Water from './pages/Water';
import DailyLog from './pages/DailyLog';
import Steps from './pages/Steps';
import Onboarding from './pages/Onboarding';
import { useAppContext } from './context/AppProvider';

function AppLayout() {
  const { user, loading } = useAppContext();

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-black text-white text-2xl">Loading Fitness Tracker...</div>;

  if (!user) {
    return (
      <Routes>
        <Route path="*" element={<Onboarding />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/workout" element={<Workout />} />
        <Route path="/diet" element={<Diet />} />
        <Route path="/water" element={<Water />} />
        <Route path="/log" element={<DailyLog />} />
        <Route path="/steps" element={<Steps />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}