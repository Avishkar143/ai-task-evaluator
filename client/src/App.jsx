import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './supabase';

// Import Components
import Layout from './components/Layout';

// Import Pages
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import SubmitTask from './pages/SubmitTask';
import MyTasks from './pages/MyTasks';
import Reports from './pages/Reports';
import TaskResult from './pages/TaskResult';
import Payment from './pages/Payment';

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check active session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. Listen for login/logout events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return null; // Prevent flickering while checking auth

  return (
    <BrowserRouter>
      {/* Layout wraps all routes to provide consistent Navbar/Footer */}
      <Layout session={session}>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<Home />} />
          
          {/* Auth Routes: Redirect to dashboard if already logged in */}
          <Route path="/login" element={session ? <Navigate to="/" /> : <Login />} />
          <Route path="/signup" element={session ? <Navigate to="/" /> : <SignUp />} />
          
          {/* Protected Routes: Require Login */}
          <Route 
            path="/dashboard" 
            element={session ? <Dashboard session={session} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/submit" 
            element={session ? <SubmitTask session={session} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/my-tasks" 
            element={session ? <MyTasks session={session} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/reports" 
            element={session ? <Reports session={session} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/task/:id" 
            element={session ? <TaskResult /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/payment/:id" 
            element={session ? <Payment session={session} /> : <Navigate to="/login" />} 
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}