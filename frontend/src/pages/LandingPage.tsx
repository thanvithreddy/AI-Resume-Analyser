import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Target, RefreshCw, BarChart3, Shield, Zap, ArrowRight, CheckCircle } from 'lucide-react';

const features = [
  { icon: Target, title: 'ATS Score Analysis', desc: 'Know exactly how ATS systems will score your resume before you apply', color: 'from-blue-500 to-cyan-500' },
  { icon: BarChart3, title: 'Skill Gap Analysis', desc: 'See which skills you\'re missing and which ones perfectly match the JD', color: 'from-purple-500 to-pink-500' },
  { icon: RefreshCw, title: 'AI Resume Rewriter', desc: 'AI completely rewrites your resume with stronger language and ATS keywords', color: 'from-orange-500 to-red-500' },
  { icon: Shield, title: 'Section Feedback', desc: 'Detailed feedback on every section: Summary, Experience, Skills, Education', color: 'from-green-500 to-emerald-500' },
  { icon: Zap, title: 'Instant Results', desc: 'Get comprehensive analysis and rewritten resume in under 30 seconds', color: 'from-yellow-500 to-orange-500' },
  { icon: Sparkles, title: 'AI Suggestions', desc: 'Personalized improvement tips to dramatically boost your interview chances', color: 'from-pink-500 to-rose-500' },
];

const stats = [
  { value: '94%', label: 'ATS Pass Rate' },
  { value: '3x', label: 'More Interviews' },
  { value: '30s', label: 'Analysis Time' },
  { value: '10K+', label: 'Resumes Analyzed' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="hero-gradient min-h-screen flex items-center justify-center pt-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8 text-sm text-primary-400 font-medium">
              <Sparkles className="w-4 h-4" /> Powered by Google Gemini AI
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              Your Resume,{' '}
              <span className="gradient-text">Reimagined</span>
              <br /> by AI
            </h1>

            <p className="text-xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed">
              Upload your resume. Paste a job description. Get an ATS score, skill gap analysis,
              section feedback, and a completely <strong className="text-white">AI-rewritten version</strong> — in seconds.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register"
                className="btn-primary flex items-center justify-center gap-2 text-lg py-4 px-8 glow-blue">
                Analyze My Resume <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/login" className="btn-outline text-lg py-4 px-8">Sign In</Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
            {stats.map((stat) => (
              <div key={stat.label} className="card text-center">
                <div className="text-4xl font-black gradient-text mb-1">{stat.value}</div>
                <div className="text-white/50 text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Everything you need to
              <span className="gradient-text"> land the job</span>
            </h2>
            <p className="text-white/50 text-lg">One tool. Six powerful features. Unlimited potential.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="card glass-hover group cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="card text-center animated-gradient-bg border-primary-500/20 p-12"
          >
            <h2 className="text-4xl font-black text-white mb-4">Ready to get more interviews?</h2>
            <p className="text-white/60 mb-8">Join thousands of job seekers who landed their dream job with ResumeAI</p>
            <Link to="/register" className="btn-primary inline-flex items-center gap-2 text-lg py-4 px-10">
              Start for Free <ArrowRight className="w-5 h-5" />
            </Link>
            <div className="flex items-center justify-center gap-6 mt-6 text-white/40 text-sm">
              {['No credit card required', 'Free tier available', 'Instant results'].map(t => (
                <div key={t} className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-400" /> {t}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
