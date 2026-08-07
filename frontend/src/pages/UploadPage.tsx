import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { analysisAPI } from '../lib/api';
import toast from 'react-hot-toast';
import { Upload, FileText, X, Sparkles, AlertCircle } from 'lucide-react';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) setFile(accepted[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'text/plain': ['.txt'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  const handleAnalyze = async () => {
    if (!file) { toast.error('Please upload your resume'); return; }
    if (!jobDescription.trim() || jobDescription.trim().length < 50) {
      toast.error('Please paste the full job description (min 50 chars)'); return;
    }
    setLoading(true);
    const toastId = toast.loading('AI is analyzing your resume... This takes ~20 seconds');
    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('jobDescription', jobDescription);
      const res = await analysisAPI.analyze(formData);
      toast.dismiss(toastId);
      toast.success('Analysis complete!');
      navigate(`/results/${res.data.id}`, { state: { result: res.data } });
    } catch (err: any) {
      toast.dismiss(toastId);
      toast.error(err.response?.data?.error || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-black text-slate-900 mb-2 text-center">Analyze Your Resume</h1>
          <p className="text-slate-500 text-center mb-10">Upload your resume and paste the job description to get started</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* File Upload */}
            <div className="card shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-sky-600" /> Your Resume
              </h2>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
                  ${isDragActive ? 'border-sky-500 bg-sky-50' : 'border-slate-300 hover:border-sky-400 hover:bg-slate-50/50'}`}
              >
                <input {...getInputProps()} />
                <AnimatePresence>
                  {file ? (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
                        <FileText className="w-8 h-8 text-emerald-600" />
                      </div>
                      <p className="text-slate-900 font-semibold">{file.name}</p>
                      <p className="text-slate-500 text-sm mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                      <button onClick={(e) => { e.stopPropagation(); setFile(null); }}
                        className="mt-3 text-red-600 hover:text-red-700 flex items-center gap-1 mx-auto text-sm font-medium">
                        <X className="w-4 h-4" /> Remove
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-800 font-medium">Drop your resume here</p>
                      <p className="text-slate-500 text-sm mt-1">or click to browse</p>
                      <p className="text-slate-400 text-xs mt-3">PDF, TXT up to 10MB</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Job Description */}
            <div className="card shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-sky-600" /> Job Description
              </h2>
              <textarea
                id="jobDescription"
                value={jobDescription}
                onChange={e => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here...&#10;&#10;Include: Job title, responsibilities, required skills, qualifications, etc."
                className="input-field h-[260px] resize-none"
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-slate-400 text-xs flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> More detail = better analysis
                </p>
                <p className="text-slate-400 text-xs">{jobDescription.length} chars</p>
              </div>
            </div>
          </div>

          {/* Analyze Button */}
          <motion.div className="mt-8 text-center">
            <button
              id="analyzeBtn"
              onClick={handleAnalyze}
              disabled={loading || !file || !jobDescription.trim()}
              className="btn-primary text-lg py-5 px-16 glow-blue inline-flex items-center gap-3"
            >
              {loading ? (
                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analyzing...</>
              ) : (
                <><Sparkles className="w-5 h-5" /> Analyze & Rewrite Resume</>
              )}
            </button>
            <p className="text-slate-500 text-sm mt-3">Average time: 20-30 seconds</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
