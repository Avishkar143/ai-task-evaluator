import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../supabase';
import { 
  Code2, 
  FileText, 
  ShieldCheck, 
  Mail, 
  LogOut,
  Menu,
  X 
} from 'lucide-react';

export default function Layout({ children, session }) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Helper to highlight the active tab
  const isActive = (path) => {
    return location.pathname === path ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600 transition-colors';
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // --- NAVIGATION LINKS DATA ---
  // We separate data from UI so we can reuse it for both Desktop and Mobile menus
  const authenticatedLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Submit Task', path: '/submit' },
    { name: 'My Tasks', path: '/my-tasks' },
    { name: 'Reports', path: '/reports' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-black">
      
      {/* --- NAVBAR --- */}
      <nav className="w-full bg-white py-4 border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-black group z-50" onClick={closeMobileMenu}>
            <Code2 className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
            <span>Smart Task Evaluator</span>
          </Link>
          
          {/* --- DESKTOP MENU (Hidden on Mobile) --- */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            {session ? (
              <>
                {authenticatedLinks.map((link) => (
                  <Link key={link.path} to={link.path} className={isActive(link.path)}>
                    {link.name}
                  </Link>
                ))}
                <button 
                  onClick={() => supabase.auth.signOut()} 
                  className="flex items-center gap-2 text-red-500 hover:text-red-700 font-bold transition-colors ml-4 pl-4 border-l border-gray-200"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </>
            ) : (
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
            )}
          </div>

          {/* --- MOBILE MENU TOGGLE BUTTON --- */}
          <button 
            className="md:hidden text-gray-600 hover:text-black z-50 p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* --- MOBILE MENU OVERLAY (Visible only when open) --- */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl py-6 px-6 flex flex-col gap-4 animate-in slide-in-from-top-5 duration-200">
            {session ? (
              <>
                {authenticatedLinks.map((link) => (
                  <Link 
                    key={link.path} 
                    to={link.path} 
                    className={`text-lg py-2 ${isActive(link.path)}`}
                    onClick={closeMobileMenu}
                  >
                    {link.name}
                  </Link>
                ))}
                <hr className="border-gray-100 my-2" />
                <button 
                  onClick={() => {
                    supabase.auth.signOut();
                    closeMobileMenu();
                  }} 
                  className="flex items-center gap-2 text-red-500 font-bold text-lg py-2"
                >
                  <LogOut className="w-5 h-5" /> Sign Out
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-600 font-medium text-lg py-2 block"
                  onClick={closeMobileMenu}
                >
                  Log In
                </Link>
                <Link to="/signup" onClick={closeMobileMenu}>
                  <button className="w-full bg-black text-white px-5 py-3 rounded-lg text-base font-medium hover:bg-gray-800 transition-colors shadow-md">
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>
        )}
      </nav>

      {/* --- DYNAMIC PAGE CONTENT --- */}
      <main className="flex-grow">
        {children}
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-black text-white py-12 md:py-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 text-sm">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-bold text-lg text-white">
              <Code2 className="w-5 h-5 text-blue-500" />
              <span>Smart Task Evaluator</span>
            </div>
            <p className="text-gray-500 leading-relaxed max-w-xs">
              AI-powered coding task evaluation for Gen-AI Full-Stack Developer hiring.
            </p>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-bold mb-4 md:mb-6 text-white text-base">Platform</h4>
            <ul className="space-y-3 text-gray-500">
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link to="/submit" className="hover:text-white transition-colors">Submit Task</Link></li>
              <li><Link to="/my-tasks" className="hover:text-white transition-colors">My Tasks</Link></li>
              <li><Link to="/reports" className="hover:text-white transition-colors">Reports</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 md:mb-6 text-white text-base">Resources</h4>
            <ul className="space-y-3 text-gray-500">
              <li className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
                <FileText className="w-4 h-4" /> Documentation
              </li>
              <li className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
                <ShieldCheck className="w-4 h-4" /> Privacy Policy
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 md:mb-6 text-white text-base">Contact</h4>
            <ul className="space-y-3 text-gray-500">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" /> 
                <a href="mailto:support@smartevaluator.ai" className="hover:text-white transition-colors">
                  support@smartevaluator.ai
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 pt-8 mt-8 border-t border-gray-900 text-center text-gray-600 text-xs">
          &copy; 2025 Smart Task Evaluator. All rights reserved.
        </div>
      </footer>
    </div>
  );
}