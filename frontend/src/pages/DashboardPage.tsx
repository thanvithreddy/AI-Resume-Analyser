import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { analysisAPI } from '../lib/api';
import toast from 'react-hot-toast';
import { FileText, ArrowRight, Clock, Plus, Trash2 } from 'lucide-react';

export default function DashboardPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    analysisAPI.getHistory()
      .then(res => setHistory(res.data))
      .catch(() => toast.error('Failed to load history'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // Prevent card navigation click
    if (!window.confirm('Are you sure you want to delete this analysis history?')) return;
    
    try {
      await analysisAPI.delete(id);
      setHistory(prev => prev.filter(item => item.id !== id));
      toast.success('Analysis history deleted');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to delete analysis');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-sky-500/30 border-t-sky-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-black text-slate-900">Analysis History</h1>
              <p className="text-slate-500 text-sm mt-1">View or manage your previous resume analyses and AI rewrites</p>
            </div>
            <Link to="/upload" className="btn-primary flex items-center justify-center gap-2 text-sm py-3 px-6">
              <Plus className="w-4 h-4" /> New Analysis
            </Link>
          </div>

          {/* History List */}
          {history.length === 0 ? (
            <div className="card text-center py-16 shadow-sm border border-slate-200">
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-sky-200">
                <FileText className="w-8 h-8 text-sky-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No analyses yet</h3>
              <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">Upload your first resume and job description to get instant ATS scores and AI rewrites</p>
              <Link to="/upload" className="btn-primary inline-flex items-center gap-2 text-sm py-3 px-6">
                Start First Analysis <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {history.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => navigate(`/results/${item.id}`, { state: { result: item } })}
                    className="card glass-hover cursor-pointer shadow-sm border border-slate-200/80 group relative"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center border border-sky-200">
                        <FileText className="w-5 h-5 text-sky-600" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          item.overallScore >= 80 ? 'bg-emerald-100 text-emerald-800' :
                          item.overallScore >= 60 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          Score: {item.overallScore}/100
                        </span>
                        <button
                          onClick={(e) => handleDelete(e, item.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Analysis"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 truncate mb-1 pr-6">{item.resumeFileName}</h3>
                    <div className="flex items-center gap-1 text-slate-400 text-xs mb-4">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(item.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 text-center">
                      <div>
                        <div className="text-slate-400 text-[10px] font-semibold uppercase">ATS</div>
                        <div className="text-slate-800 font-bold text-sm">{item.atsScore}%</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-[10px] font-semibold uppercase">Skills</div>
                        <div className="text-slate-800 font-bold text-sm">{item.skillsScore}%</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-[10px] font-semibold uppercase">Experience</div>
                        <div className="text-slate-800 font-bold text-sm">{item.experienceScore}%</div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-end text-sky-600 font-semibold text-xs group-hover:translate-x-1 transition-transform">
                      View Full Analysis <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

        </motion.div>
      </div>
    </div>
  );
}
