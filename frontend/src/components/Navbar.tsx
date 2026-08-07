import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { LogOut, LayoutDashboard, Upload, Sparkles } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-200/80 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">ResumeAI</span>
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link to="/upload"
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium">
                <Upload className="w-4 h-4" /> Analyze
              </Link>
              <Link to="/dashboard"
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium">
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm">
                  {user?.fullName?.charAt(0).toUpperCase()}
                </div>
                <button onClick={handleLogout}
                  className="flex items-center gap-1 text-slate-400 hover:text-red-600 transition-colors text-sm">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium">Login</Link>
              <Link to="/register" className="btn-primary text-sm py-2 px-4">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
