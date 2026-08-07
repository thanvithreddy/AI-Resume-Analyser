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
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">ResumeAI</span>
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link to="/upload"
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-medium">
                <Upload className="w-4 h-4" /> Analyze
              </Link>
              <Link to="/dashboard"
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-medium">
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {user?.fullName?.charAt(0).toUpperCase()}
                </div>
                <button onClick={handleLogout}
                  className="flex items-center gap-1 text-white/50 hover:text-red-400 transition-colors text-sm">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white/70 hover:text-white transition-colors text-sm font-medium">Login</Link>
              <Link to="/register" className="btn-primary text-sm py-2 px-4">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
