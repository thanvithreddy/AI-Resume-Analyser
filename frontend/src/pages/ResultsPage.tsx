import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { analysisAPI } from '../lib/api';
import { AnalysisResult } from '../types';
import { CheckCircle, XCircle, AlertTriangle, Download,
  Target, Zap, User, Briefcase, Star, ArrowLeft, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

function ScoreCircle({ score, label, color }: { score: number; label: string; color: string }) {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-28 h-28">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
          <motion.circle cx="50" cy="50" r="45" fill="none" stroke={color} strokeWidth="8"
            strokeLinecap="round" strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black text-white">{score}</span>
          <span className="text-white/40 text-xs">/ 100</span>
        </div>
      </div>
      <span className="text-white/60 text-sm mt-2 font-medium">{label}</span>
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  if (score >= 80) return <span className="score-badge bg-green-500/20 text-green-400"><CheckCircle className="w-3 h-3" />{score}%</span>;
  if (score >= 60) return <span className="score-badge bg-yellow-500/20 text-yellow-400"><AlertTriangle className="w-3 h-3" />{score}%</span>;
  return <span className="score-badge bg-red-500/20 text-red-400"><XCircle className="w-3 h-3" />{score}%</span>;
}

export default function ResultsPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState<AnalysisResult | null>(location.state?.result || null);
  const [loading, setLoading] = useState(!result);
  const [activeTab, setActiveTab] = useState<'analysis' | 'rewritten'>('analysis');

  useEffect(() => {
    if (!result && id) {
      analysisAPI.getById(Number(id)).then(res => setResult(res.data)).catch(() => {
        toast.error('Failed to load analysis'); navigate('/dashboard');
      }).finally(() => setLoading(false));
    }
  }, [id]);

  const copyRewritten = () => {
    if (result?.rewrittenResume) {
      navigator.clipboard.writeText(result.rewrittenResume);
      toast.success('Rewritten resume copied to clipboard!');
    }
  };

  const downloadRewritten = () => {
    if (result?.rewrittenResume) {
      const blob = new Blob([result.rewrittenResume], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'rewritten-resume.txt'; a.click();
      toast.success('Downloaded!');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white/50">Loading results...</p>
      </div>
    </div>
  );

  if (!result) return null;

  const scoreColor = result.overallScore >= 80 ? '#22c55e' : result.overallScore >= 60 ? '#eab308' : '#ef4444';

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <button onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-white/50 hover:text-white mb-3 transition-colors text-sm">
                <ArrowLeft className="w-4 h-4" /> Back to Dashboard
              </button>
              <h1 className="text-4xl font-black text-white">Analysis Results</h1>
              <p className="text-white/40 mt-1">{result.resumeFileName}</p>
            </div>
            <div className="text-center">
              <div className="text-6xl font-black" style={{ color: scoreColor }}>{result.overallScore}</div>
              <div className="text-white/40 text-sm">Overall Score</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {(['analysis', 'rewritten'] as const).map(tab => (
              <button key={tab} id={`tab-${tab}`} onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  activeTab === tab ? 'bg-primary-500 text-white' : 'glass text-white/50 hover:text-white'
                }`}>
                {tab === 'analysis' ? '📊 Analysis' : '✨ Rewritten Resume'}
              </button>
            ))}
          </div>

          {activeTab === 'analysis' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* Score Circles */}
              <div className="card">
                <h2 className="section-title">Score Breakdown</h2>
                <div className="flex flex-wrap justify-around gap-8">
                  <ScoreCircle score={result.overallScore} label="Overall" color={scoreColor} />
                  <ScoreCircle score={result.atsScore} label="ATS Score" color="#0ea5e9" />
                  <ScoreCircle score={result.skillsScore} label="Skills" color="#8b5cf6" />
                  <ScoreCircle score={result.experienceScore} label="Experience" color="#f97316" />
                  <ScoreCircle score={result.formattingScore} label="Formatting" color="#22c55e" />
                </div>
              </div>

              {/* Skills */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card">
                  <h2 className="section-title flex items-center gap-2 text-xl">
                    <CheckCircle className="w-5 h-5 text-green-400" /> Matched Skills
                    <ScoreBadge score={result.skillsScore} />
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {result.matchedSkills.length > 0 ? result.matchedSkills.map(s => (
                      <span key={s} className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm border border-green-500/30">{s}</span>
                    )) : <p className="text-white/40 text-sm">No skills matched</p>}
                  </div>
                </div>
                <div className="card">
                  <h2 className="section-title flex items-center gap-2 text-xl">
                    <XCircle className="w-5 h-5 text-red-400" /> Missing Skills
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {result.missingSkills.length > 0 ? result.missingSkills.map(s => (
                      <span key={s} className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm border border-red-500/30">{s}</span>
                    )) : <p className="text-white/40 text-sm">No missing skills — great match!</p>}
                  </div>
                </div>
              </div>

              {/* Section Feedback */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[{ label: 'Summary', icon: User, data: result.summaryFeedback },
                  { label: 'Experience', icon: Briefcase, data: result.experienceFeedback },
                  { label: 'Skills', icon: Star, data: result.skillsFeedback }].map(({ label, icon: Icon, data }) => (
                  <div key={label} className="card">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-white flex items-center gap-2">
                        <Icon className="w-4 h-4 text-primary-400" /> {label}
                      </h3>
                      <span className="text-primary-400 font-bold">{data?.score}/10</span>
                    </div>
                    <p className="text-white/60 text-sm mb-3">{data?.feedback}</p>
                    {data?.improved && (
                      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                        <p className="text-green-400 text-xs font-semibold mb-1">✨ Improved Version</p>
                        <p className="text-white/70 text-xs leading-relaxed">{data.improved}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Issues & Suggestions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card">
                  <h2 className="section-title flex items-center gap-2 text-xl">
                    <AlertTriangle className="w-5 h-5 text-yellow-400" /> Top Issues
                  </h2>
                  <ul className="space-y-2">
                    {result.topIssues.map((issue, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                        <span className="w-6 h-6 bg-yellow-500/20 text-yellow-400 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">{i + 1}</span>
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="card">
                  <h2 className="section-title flex items-center gap-2 text-xl">
                    <Zap className="w-5 h-5 text-primary-400" /> AI Suggestions
                  </h2>
                  <ul className="space-y-2">
                    {result.suggestions.map((s, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                        <CheckCircle className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'rewritten' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-black text-white flex items-center gap-2">
                      <Target className="w-6 h-6 text-primary-400" /> AI Rewritten Resume
                    </h2>
                    <p className="text-white/40 text-sm mt-1">Optimized for ATS and tailored to the job description</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={copyRewritten} id="copyResumeBtn"
                      className="flex items-center gap-2 btn-outline text-sm py-2">
                      <Copy className="w-4 h-4" /> Copy
                    </button>
                    <button onClick={downloadRewritten} id="downloadResumeBtn"
                      className="flex items-center gap-2 btn-primary text-sm py-2">
                      <Download className="w-4 h-4" /> Download
                    </button>
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <pre className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                    {result.rewrittenResume}
                  </pre>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
