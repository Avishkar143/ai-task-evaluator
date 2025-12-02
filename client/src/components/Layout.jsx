import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../supabase';
import { 
  Code2, 
  FileText, 
  ShieldCheck, 
  Mail, 
  LogOut 
} from 'lucide-react';

export default function Layout({ children, session }) {
  const location = useLocation();

  // Helper to highlight the active tab
  const isActive = (path) => {
    return location.pathname === path ? 'text-blue-600 font-semibold' : 'hover:text-blue-600 transition-colors';
  };

  // Navigation Links for Logged In Users
  const authenticatedLinks = (
    <>
      <Link to="/dashboard" className={isActive('/dashboard')}>
        Dashboard
      </Link>
      <Link to="/submit" className={isActive('/submit')}>
        Submit Task
      </Link>
      <Link to="/my-tasks" className={isActive('/my-tasks')}>
        My Tasks
      </Link>
      <Link to="/reports" className={isActive('/reports')}>
        Reports
      </Link>
    </>
  );

  // Navigation Links for Public Users
  const publicLinks = (
    <>
      <Link to="/login" className="text-gray-600 hover:text-black font-medium transition-colors">
        Log In
      </Link>
      <Link to="/signup">
        <button className="bg-black text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors shadow-md shadow-blue-600/20">
          Sign Up
        </button>
      </Link>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-black">
      {/* --- FIXED NAVBAR --- */}
      <nav className="w-full bg-white py-4 border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo - Always clicks to Home */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-black group">
            <Code2 className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
            <span>Smart Task Evaluator</span>
          </Link>
          
          <div className="flex items-center gap-8 text-sm font-medium text-gray-600">
            {session ? authenticatedLinks : publicLinks}
            
            {session && (
              <button 
                onClick={() => supabase.auth.signOut()} 
                className="flex items-center gap-2 text-red-500 hover:text-red-700 font-bold transition-colors ml-4 pl-4 border-l border-gray-200"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* --- DYNAMIC PAGE CONTENT --- */}
      <main className="flex-grow">
        {children}
      </main>

      {/* --- FIXED FOOTER --- */}
      <footer className="bg-black text-white py-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 text-sm">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-bold text-lg text-white">
              <Code2 className="w-5 h-5 text-blue-500" />
              <span>Smart Task Evaluator</span>
            </div>
            <p className="text-gray-500 leading-relaxed">
              AI-powered coding task evaluation for Gen-AI Full-Stack Developer hiring.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-bold mb-6 text-white text-base">Platform</h4>
            <ul className="space-y-4 text-gray-500">
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link to="/submit" className="hover:text-white transition-colors">Submit Task</Link></li>
              <li><Link to="/my-tasks" className="hover:text-white transition-colors">My Tasks</Link></li>
              <li><Link to="/reports" className="hover:text-white transition-colors">Reports</Link></li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-bold mb-6 text-white text-base">Resources</h4>
            <ul className="space-y-4 text-gray-500">
              <li className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
                <FileText className="w-4 h-4" /> Documentation
              </li>
              <li className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
                <ShieldCheck className="w-4 h-4" /> Privacy Policy
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold mb-6 text-white text-base">Contact</h4>
            <ul className="space-y-4 text-gray-500">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" /> 
                <a href="mailto:support@smartevaluator.ai" className="hover:text-white transition-colors">
                  support@smartevaluator.ai
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="max-w-7xl mx-auto px-6 pt-12 mt-12 border-t border-gray-900 text-center text-gray-600 text-xs">
          &copy; 2025 Smart Task Evaluator. All rights reserved.
        </div>
      </footer>
    </div>
  );
}