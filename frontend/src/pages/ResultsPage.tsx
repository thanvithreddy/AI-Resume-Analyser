import { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { analysisAPI } from '../lib/api';
import toast from 'react-hot-toast';
import {
  Award, CheckCircle2, XCircle, AlertTriangle, Lightbulb,
  Download, Copy, RefreshCw, FileText, ArrowLeft, Check, Printer
} from 'lucide-react';

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [result, setResult] = useState<any>(location.state?.result || null);
  const [loading, setLoading] = useState(!result);
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'sections' | 'rewritten'>('overview');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!result && id) {
      analysisAPI.getById(Number(id))
        .then(res => setResult(res.data))
        .catch(() => toast.error('Failed to load results'))
        .finally(() => setLoading(false));
    }
  }, [id, result]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-sky-500/30 border-t-sky-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading analysis results...</p>
        </div>
      </div>
    );
  }

  if (!result) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(result.rewrittenResume);
    setCopied(true);
    toast.success('Rewritten resume copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTXT = () => {
    const element = document.createElement('a');
    const file = new Blob([result.rewrittenResume], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${result.resumeFileName.replace('.pdf', '').replace('.txt', '')}_Rewritten.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Downloaded TXT file!');
  };

  const handleDownloadPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Please allow popups to download PDF template');
      return;
    }

    const title = `${result.resumeFileName.replace('.pdf', '').replace('.txt', '')}_Rewritten_Resume`;
    const rawText = result.rewrittenResume;
    const lines = rawText.split('\n').map((l: string) => l.trim()).filter(Boolean);

    let bodyHtml = '';
    let inList = false;

    // Header extraction
    let candidateName = 'Venkata Thanvith Reddy Veerepalli';
    let subTitle = 'B. Tech - CSE (AI & ML)';
    let contactInfo = '✉thanvith.vv@gmail.com | ✆+91 9603740383 | LinkedIn | GitHub | ⊙Guntur, India';

    lines.forEach((line: string) => {
      if (line.startsWith('===') || line.startsWith('---')) return;

      const isHeading = (
        line === line.toUpperCase() &&
        line.length < 65 &&
        !line.startsWith('•') &&
        !line.startsWith('-') &&
        !line.startsWith('▪')
      );

      if (isHeading) {
        if (inList) { bodyHtml += '</ul>'; inList = false; }
        bodyHtml += `<div className="section-title">${line}</div>`;
      } else if (line.startsWith('•') || line.startsWith('-') || line.startsWith('▪')) {
        if (!inList) { bodyHtml += '<ul className="bullet-list">'; inList = true; }
        let itemText = line.replace(/^[•\-▪]\s*/, '');
        if (itemText.includes(':')) {
          const colonIdx = itemText.indexOf(':');
          const boldLead = itemText.substring(0, colonIdx);
          const restText = itemText.substring(colonIdx + 1);
          itemText = `<strong>${boldLead}:</strong>${restText}`;
        }
        bodyHtml += `<li><span className="bullet-icon">▪</span><span>${itemText}</span></li>`;
      } else {
        if (inList) { bodyHtml += '</ul>'; inList = false; }
        if (line.includes('@') && line.includes('|')) {
          contactInfo = line;
        } else if (line.includes('202') || line.includes('201') || line.length < 60 && !line.endsWith('.')) {
          // Check for date/year on right
          const yearMatch = line.match(/(20\d\d\s*–\s*20\d\d|20\d\d)/);
          if (yearMatch) {
            const yearStr = yearMatch[0];
            const leftText = line.replace(yearStr, '').trim();
            bodyHtml += `<div className="row-split"><span className="bold-text">${leftText}</span><span className="year-text">${yearStr}</span></div>`;
          } else {
            bodyHtml += `<div className="item-title">${line}</div>`;
          }
        } else {
          bodyHtml += `<p className="para-text">${line}</p>`;
        }
      }
    });

    if (inList) { bodyHtml += '</ul>'; }

    const fullHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
          @page { size: A4; margin: 12mm 15mm; }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: 'Inter', Arial, sans-serif;
            color: #0f172a;
            line-height: 1.45;
            padding: 24px;
            max-width: 800px;
            margin: 0 auto;
            background: #ffffff;
            font-size: 10pt;
          }
          .header-name {
            text-align: center;
            font-size: 20pt;
            font-weight: 800;
            color: #0f172a;
            letter-spacing: -0.5px;
            margin-bottom: 2px;
          }
          .header-subtitle {
            text-align: center;
            font-size: 9.5pt;
            font-weight: 500;
            color: #334155;
            margin-bottom: 4px;
          }
          .header-contact {
            text-align: center;
            font-size: 8.5pt;
            color: #475569;
            margin-bottom: 16px;
          }
          .section-title {
            font-size: 11pt;
            font-weight: 800;
            color: #0284c7;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-top: 14px;
            margin-bottom: 6px;
            border-bottom: 1.5px solid #0284c7;
            padding-bottom: 2px;
          }
          .row-split {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-top: 4px;
            margin-bottom: 2px;
          }
          .bold-text {
            font-weight: 700;
            color: #0f172a;
            font-size: 9.5pt;
          }
          .year-text {
            font-weight: 600;
            color: #475569;
            font-size: 9pt;
          }
          .item-title {
            font-weight: 700;
            color: #0f172a;
            font-size: 9.5pt;
            margin-top: 4px;
            margin-bottom: 2px;
          }
          .para-text {
            font-size: 9.5pt;
            color: #334155;
            margin-bottom: 4px;
            text-align: justify;
          }
          .bullet-list {
            list-style: none;
            margin-top: 3px;
            margin-bottom: 6px;
            padding-left: 0;
          }
          .bullet-list li {
            font-size: 9.5pt;
            color: #334155;
            margin-bottom: 3px;
            text-align: justify;
            display: flex;
            align-items: flex-start;
          }
          .bullet-icon {
            color: #0f172a;
            font-size: 8pt;
            margin-right: 6px;
            margin-top: 2px;
          }
          strong {
            color: #0f172a;
            font-weight: 700;
          }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div className="header-name">${candidateName}</div>
        <div className="header-subtitle">${subTitle}</div>
        <div className="header-contact">${contactInfo}</div>
        ${bodyHtml}
        <script>
          window.onload = function() {
            setTimeout(function() { window.print(); }, 300);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(fullHtml);
    printWindow.document.close();
    toast.success('Opening PDF Resume matching your uploaded template!');
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  const scores = [
    { label: 'Overall Score', score: result.overallScore },
    { label: 'ATS Compatibility', score: result.atsScore },
    { label: 'Skills Match', score: result.skillsScore },
    { label: 'Experience Depth', score: result.experienceScore },
    { label: 'Formatting', score: result.formattingScore },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <Link to="/dashboard" className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 text-sm mb-2 font-medium">
                <ArrowLeft className="w-4 h-4" /> Back to Dashboard
              </Link>
              <h1 className="text-3xl font-black text-slate-900">Analysis Results</h1>
              <p className="text-slate-500 text-sm mt-1">File: <span className="text-slate-700 font-semibold">{result.resumeFileName}</span></p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handleDownloadPDF} className="btn-primary text-sm py-2 px-4 flex items-center gap-2 glow-blue">
                <Printer className="w-4 h-4" /> Download Rewritten PDF Template
              </button>
              <button onClick={handleDownloadTXT} className="btn-outline text-sm py-2 px-4 flex items-center gap-2">
                <Download className="w-4 h-4" /> TXT
              </button>
              <Link to="/upload" className="btn-outline text-sm py-2 px-4 flex items-center gap-2">
                <RefreshCw className="w-4 h-4" /> New
              </Link>
            </div>
          </div>

          {/* Score Overview Bar */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {scores.map((s) => (
              <div key={s.label} className={`card text-center border p-4 ${getScoreColor(s.score)}`}>
                <div className="text-3xl font-black mb-1">{s.score}<span className="text-sm font-normal">/100</span></div>
                <div className="text-xs font-semibold">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-200 mb-8 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview & Issues', icon: Award },
              { id: 'skills', label: 'Skills Gap Analysis', icon: CheckCircle2 },
              { id: 'sections', label: 'Section Feedback', icon: FileText },
              { id: 'rewritten', label: 'AI Rewritten Resume', icon: RefreshCw },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm border-b-2 whitespace-nowrap transition-colors
                  ${activeTab === tab.id ? 'border-sky-600 text-sky-600 bg-sky-50/50' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
              >
                <tab.icon className="w-4 h-4" /> {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Top Issues */}
              <div className="card shadow-sm border border-rose-200/60 bg-rose-50/30">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-500" /> Top Critical Issues
                </h2>
                <div className="space-y-3">
                  {result.topIssues.map((issue: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 bg-white p-4 rounded-xl border border-rose-100 shadow-sm">
                      <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                      <p className="text-slate-700 text-sm font-medium">{issue}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggestions */}
              <div className="card shadow-sm border border-amber-200/60 bg-amber-50/30">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-500" /> Key Recommendations
                </h2>
                <div className="space-y-3">
                  {result.suggestions.map((sug: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 bg-white p-4 rounded-xl border border-amber-100 shadow-sm">
                      <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-slate-700 text-sm font-medium">{sug}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Matched */}
              <div className="card shadow-sm border border-emerald-200 bg-emerald-50/20">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Matched Skills ({result.matchedSkills.length})
                </h2>
                <div className="flex flex-wrap gap-2">
                  {result.matchedSkills.map((skill: string) => (
                    <span key={skill} className="px-3 py-1.5 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold">
                      ✓ {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing */}
              <div className="card shadow-sm border border-rose-200 bg-rose-50/20">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-rose-500" /> Missing Required Skills ({result.missingSkills.length})
                </h2>
                <div className="flex flex-wrap gap-2">
                  {result.missingSkills.map((skill: string) => (
                    <span key={skill} className="px-3 py-1.5 bg-rose-100 text-rose-800 border border-rose-200 rounded-lg text-xs font-semibold">
                      + {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sections' && (
            <div className="space-y-6">
              {[
                { title: 'Summary Section', data: result.summaryFeedback },
                { title: 'Experience Section', data: result.experienceFeedback },
                { title: 'Skills Section', data: result.skillsFeedback },
              ].map(sec => (
                <div key={sec.title} className="card shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-900">{sec.title}</h3>
                    <span className="px-3 py-1 bg-sky-100 text-sky-800 border border-sky-200 rounded-full text-xs font-bold">
                      Score: {sec.data?.score}/10
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm mb-4">{sec.data?.feedback}</p>
                  {sec.data?.improved && (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <p className="text-xs font-bold text-sky-700 uppercase tracking-wider mb-2">AI Improved Version:</p>
                      <p className="text-slate-800 text-sm font-mono whitespace-pre-wrap">{sec.data?.improved}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'rewritten' && (
            <div className="card shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">AI Rewritten & Enhanced Resume</h2>
                  <p className="text-slate-500 text-sm">Full ATS-optimized version matched to the target job description</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={handleCopy} className="btn-outline text-xs py-2 px-3 flex items-center gap-1">
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <button onClick={handleDownloadPDF} className="btn-primary text-xs py-2 px-3 flex items-center gap-1">
                    <Printer className="w-4 h-4" /> Download Rewritten PDF Template
                  </button>
                  <button onClick={handleDownloadTXT} className="btn-outline text-xs py-2 px-3 flex items-center gap-1">
                    <Download className="w-4 h-4" /> TXT
                  </button>
                </div>
              </div>
              <pre className="bg-slate-900 text-slate-100 p-6 rounded-xl font-mono text-sm leading-relaxed whitespace-pre-wrap overflow-x-auto shadow-inner border border-slate-800">
                {result.rewrittenResume}
              </pre>
            </div>
          )}

        </motion.div>
      </div>
    </div>
  );
}
