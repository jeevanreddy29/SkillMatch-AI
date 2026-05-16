import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertTriangle, Lightbulb, MessageSquare, Target, Loader2, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf' || selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setFile(selectedFile);
        setError(null);
      } else {
        setError('Please upload a PDF or DOCX file.');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_URL}/analyze`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'var(--success)';
    if (score >= 50) return 'var(--warning)';
    return 'var(--error)';
  };

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-blur">
        <div className="gradient-circle circle-1"></div>
        <div className="gradient-circle circle-2"></div>
      </div>

      {/* Navigation */}
      <nav className="container py-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Target className="text-white" size={24} />
          </div>
          <span className="text-2xl font-bold tracking-tight">SkillMatch <span className="text-gradient">AI</span></span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
          <a href="#" className="hover:text-white transition-colors">Features</a>
          <a href="#" className="hover:text-white transition-colors">Pricing</a>
          <a href="#" className="hover:text-white transition-colors">About</a>
        </div>
      </nav>

      <main className="container pb-20">
        {!result ? (
          <section className="mt-12 md:mt-24 text-center max-w-3xl mx-auto animate-fade-in">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              Elevate Your <span className="text-gradient">Career</span> with AI
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-slate-400 mb-12"
            >
              Upload your resume and get an instant AI-powered analysis of your ATS score, skill gaps, and personalized improvement tips.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="glass p-12 max-w-xl mx-auto glass-hover"
            >
              <div className="flex flex-col items-center gap-6">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center ${file ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-500'}`}>
                  {file ? <FileText size={40} /> : <Upload size={40} />}
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">{file ? file.name : 'Choose a file'}</h3>
                  <p className="text-sm text-slate-500">PDF or DOCX (Max 5MB)</p>
                </div>

                <label className="btn-primary inline-block cursor-pointer">
                  {file ? 'Change Resume' : 'Select Resume'}
                  <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.docx" />
                </label>

                {file && (
                  <button 
                    onClick={handleUpload}
                    disabled={loading}
                    className="flex items-center gap-2 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : null}
                    {loading ? 'Analyzing...' : 'Analyze Now →'}
                  </button>
                )}

                {error && (
                  <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center gap-2">
                    <AlertTriangle size={16} />
                    {error}
                  </div>
                )}
              </div>
            </motion.div>
          </section>
        ) : (
          <section className="mt-12 animate-fade-in">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Left Column: Summary & Score */}
              <div className="w-full md:w-1/3 space-y-6">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass p-8 text-center"
                >
                  <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-4">ATS Compatibility Score</h3>
                  <div className="relative inline-flex items-center justify-center">
                    <svg className="w-32 h-32">
                      <circle className="text-slate-800" strokeWidth="8" stroke="currentColor" fill="transparent" r="58" cx="64" cy="64" />
                      <circle 
                        className="transition-all duration-1000 ease-out" 
                        strokeWidth="8" 
                        strokeDasharray={364.4}
                        strokeDashoffset={364.4 - (364.4 * result.score) / 100}
                        strokeLinecap="round" 
                        stroke={getScoreColor(result.score)}
                        fill="transparent" 
                        r="58" cx="64" cy="64" 
                      />
                    </svg>
                    <span className="absolute text-3xl font-bold" style={{ color: getScoreColor(result.score) }}>{result.score}%</span>
                  </div>
                  <p className="mt-4 text-sm text-slate-400">
                    {result.score > 80 ? 'Excellent! Your resume is highly optimized.' : 
                     result.score > 50 ? 'Good, but there is room for improvement.' : 
                     'Needs significant optimization for ATS systems.'}
                  </p>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="glass p-8"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <FileText size={20} className="text-indigo-400" />
                    <h3 className="font-semibold text-lg">Professional Summary</h3>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {result.summary}
                  </p>
                </motion.div>

                <button 
                  onClick={() => {setResult(null); setFile(null);}}
                  className="w-full py-4 text-slate-500 hover:text-white transition-colors text-sm font-medium"
                >
                  ← Analyze Another Resume
                </button>
              </div>

              {/* Right Column: Skills & Details */}
              <div className="w-full md:w-2/3 space-y-8">
                {/* Skills Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass p-6"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle size={20} className="text-emerald-400" />
                      <h3 className="font-semibold">Identified Skills</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {result.skills.map((skill, i) => (
                        <span key={i} className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass p-6"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <AlertTriangle size={20} className="text-amber-400" />
                      <h3 className="font-semibold">Missing Keywords</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {result.missing_skills.map((skill, i) => (
                        <span key={i} className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full text-xs font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Improvements */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="glass p-8"
                >
                  <div className="flex items-center gap-2 mb-6">
                    <Lightbulb size={24} className="text-indigo-400" />
                    <h3 className="font-bold text-xl">Resume Improvements</h3>
                  </div>
                  <ul className="space-y-4">
                    {result.improvements.map((tip, i) => (
                      <li key={i} className="flex gap-3 text-slate-400 text-sm">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs text-indigo-400 font-bold">
                          {i + 1}
                        </span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Interview Prep */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="glass p-8"
                >
                  <div className="flex items-center gap-2 mb-6">
                    <MessageSquare size={24} className="text-purple-400" />
                    <h3 className="font-bold text-xl">AI Interview Questions</h3>
                  </div>
                  <div className="space-y-4">
                    {result.interview_questions.map((q, i) => (
                      <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-xl text-slate-300 text-sm italic">
                        "{q}"
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="container py-12 border-t border-white/5 text-center text-slate-500 text-sm">
        <p>© 2026 SkillMatch AI. Powered by Gemini Pro.</p>
      </footer>
    </div>
  );
}

export default App;
