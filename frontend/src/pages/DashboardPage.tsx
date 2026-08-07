import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { analysisAPI } from '../lib/api';
import { AnalysisResult } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { FileText, Upload, TrendingUp, Clock, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

function ScoreBar({ score, color }: { score: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
      <span className="text-white/60 text-sm w-8">{score}</span>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analysisAPI.getHistory()
      .then(res => setHistory(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const avgScore = history.length > 0 ? Math.round(history.reduce((a, b) => a + b.overallScore, 0) / history.length) : 0;
  const bestScore = history.length > 0 ? Math.max(...history.map(h => h.overallScore)) : 0;

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Welcome */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-black text-white">Dashboard</h1>
              <p className="text-white/50 mt-1">Welcome back, {user?.fullName} 👋</p>
            </div>
            <Link to="/upload" id="newAnalysisBtn"
              className="btn-primary flex items-center gap-2">
              <Upload className="w-4 h-4" /> New Analysis
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { icon: FileText, label: 'Total Analyses', value: history.length, color: 'from-blue-500 to-cyan-500' },
              { icon: TrendingUp, label: 'Average Score', value: avgScore, color: 'from-purple-500 to-pink-500' },
              { icon: Clock, label: 'Best Score', value: bestScore, color: 'from-green-500 to-emerald-500' },
            ].map(({ icon: Icon, label, value, color }) => (
              <motion.div key={label} whileHover={{ y: -3 }} className="card glass-hover">
                <div className={`w-10 h-10 bg-gradient-to-br ${color} rounded-lg flex items-center justify-center mb-3`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-3xl font-black text-white">{value}</div>
                <div className="text-white/50 text-sm mt-1">{label}</div>
              </motion.div>
            ))}
          </div>

          {/* History */}
          <div className="card">
            <h2 className="section-title">Analysis History</h2>
            {loading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-white/40">Loading...</p>
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <p className="text-white/40 mb-4">No analyses yet</p>
                <Link to="/upload" className="btn-primary inline-flex items-center gap-2">
                  <Upload className="w-4 h-4" /> Analyze your first resume
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((item, i) => (
                  <motion.div key={item.id}
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  >
                    <Link to={`/results/${item.id}`}
                      className="flex items-center gap-4 p-4 rounded-xl glass glass-hover group">
                      <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-primary-400 font-black text-lg">{item.overallScore}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold truncate">{item.resumeFileName}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <ScoreBar score={item.atsScore} color="#0ea5e9" />
                          <span className="text-white/30 text-xs whitespace-nowrap">
                            ATS: {item.atsScore}
                          </span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-white/40 text-sm">
                          {item.createdAt ? format(new Date(item.createdAt), 'MMM d, yyyy') : ''}
                        </p>
                        <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-white mt-1 ml-auto transition-colors" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
