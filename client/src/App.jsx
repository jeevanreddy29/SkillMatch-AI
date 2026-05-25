import React, { useState, useEffect } from 'react';
import { 
  Upload, FileText, CheckCircle, AlertTriangle, Lightbulb, 
  MessageSquare, Target, Loader2, Key, Settings, X, Sparkles, 
  ChevronRight, Check, Play, BookOpen, ThumbsUp, Send 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

// Realistic sample presets for instant demonstration
const PRESET_SAMPLES = {
  software_engineer: {
    score: 85,
    breakdown: {
      formatting: 90,
      keywords: 80,
      impact: 85
    },
    summary: "Innovative Full-Stack Software Engineer with 4+ years of experience specializing in React, Node.js, and modern cloud architectures. Adept at optimizing web application performance and leading backend microservice migrations.",
    skills: ["React", "Node.js", "Express", "PostgreSQL", "REST APIs", "AWS", "Git", "TypeScript", "Docker", "TailwindCSS", "Jest"],
    missing_skills: ["GraphQL", "Redis", "CI/CD (GitHub Actions)", "Kubernetes"],
    improvements: [
      "Quantify your achievements: Change 'Improved database query speed' to 'Optimized PostgreSQL indices and schemas, reducing average query response time by 45%'.",
      "Inject more cloud infrastructure and caching keywords like Redis and CI/CD directly into your professional summary.",
      "Ensure all social links and your portfolio website URL are hyperlinked and visually clean at the top of the resume layout.",
      "Add Jest/React Testing Library metrics to highlight code quality practices in prior roles."
    ],
    interview_questions: [
      "How do you approach state management and performance tuning in large React applications?",
      "Can you describe a scenario where you migrated an endpoint to a microservice? What challenges did you face?",
      "What is your approach to database indexing and query optimization in PostgreSQL?",
      "How do you secure REST APIs against unauthorized access and common web vulnerabilities?",
      "Explain a time you resolved a major production deployment issue. What was your debugging process?"
    ],
    job_match: {
      score: 88,
      matched_keywords: ["React", "Node.js", "PostgreSQL", "AWS", "Docker", "TypeScript"],
      missing_keywords: ["Kubernetes", "GraphQL", "Redis"],
      role_suitability: "You are an excellent technical fit for this Senior Full-Stack role. Your core frontend and backend stack aligns perfectly with their requirements. Highlighting your Docker and AWS experience will be key, and preparing answers around Redis and GraphQL will help bridge the remaining gaps."
    }
  },
  product_manager: {
    score: 78,
    breakdown: {
      formatting: 85,
      keywords: 72,
      impact: 78
    },
    summary: "User-centric Product Manager with 3+ years of experience leading cross-functional teams to design, build, and scale SaaS products. Expert in translating customer feedback into detailed PRDs and agile backlog prioritization.",
    skills: ["Product Strategy", "Backlog Grooming", "SaaS", "User Research", "Agile/Scrum", "Jira", "A/B Testing", "Figma", "Data Analytics"],
    missing_skills: ["SQL", "Product-Led Growth (PLG)", "Customer Journey Mapping", "Mixpanel"],
    improvements: [
      "Add more outcome-driven metrics: Replace 'Managed product lifecycle of core features' with 'Launched redesigned onboarding flow, increasing user activation by 22%'.",
      "Place your core 'Skills' section in a prominent sidebar or near the top of the resume layout to capture ATS priority scanning.",
      "Shorten your professional summary to 3 highly punchy, impact-focused sentences.",
      "Incorporate mentions of analytics tools like Mixpanel or Amplitude to demonstrate data-informed product decision patterns."
    ],
    interview_questions: [
      "How do you prioritize competing requests from engineering, sales, and senior executives?",
      "Walk me through a product launch that didn't go as planned. What did you learn?",
      "How do you use quantitative metrics to guide your product feature decisions?",
      "Describe how you work with UI/UX designers to translate user research into wireframes.",
      "What is your approach to defining and tracking success metrics (KPIs) for a newly released feature?"
    ],
    job_match: {
      score: 74,
      matched_keywords: ["Product Strategy", "SaaS", "Agile/Scrum", "Jira", "User Research"],
      missing_keywords: ["SQL", "Mixpanel", "Product-Led Growth"],
      role_suitability: "Your core product management methodologies and Agile execution skills match the job description very well. The target role, however, has a strong technical component focusing on SQL querying and Mixpanel analytics. Emphasizing any data-driven decisions you've made in the past will significantly strengthen your candidacy."
    }
  }
};

const LOADING_PHASES = [
  "Reading document format and parsing structural layout...",
  "Running optical keyword matching algorithms...",
  "Evaluating semantic experience density and impact score...",
  "Comparing competencies against standard industry benchmarks...",
  "Synthesizing customized AI technical interview questionnaires...",
  "Reviewing against target job requirements and formatting summaries..."
];

function App() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingPhaseIndex, setLoadingPhaseIndex] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  
  // Custom API Key storage
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [showSettings, setShowSettings] = useState(false);
  const [tempKey, setTempKey] = useState('');

  // Active optimizations checklist state
  const [completedImprovements, setCompletedImprovements] = useState({});

  // Mock Interview Console states
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [evaluatingAnswer, setEvaluatingAnswer] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [evaluationError, setEvaluationError] = useState(null);

  // Rotate loading text phases when loading is active
  useEffect(() => {
    let interval;
    if (loading) {
      setLoadingPhaseIndex(0);
      interval = setInterval(() => {
        setLoadingPhaseIndex((prev) => (prev + 1) % LOADING_PHASES.length);
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (
        selectedFile.type === 'application/pdf' || 
        selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        selectedFile.name.endsWith('.pdf') ||
        selectedFile.name.endsWith('.docx')
      ) {
        setFile(selectedFile);
        setError(null);
      } else {
        setError('Please upload a valid PDF or DOCX resume.');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setCompletedImprovements({});
    setActiveQuestionIndex(null);
    setEvaluationResult(null);

    const formData = new FormData();
    formData.append('file', file);
    if (jobDescription.trim()) {
      formData.append('job_description', jobDescription);
    }

    const headers = {};
    if (apiKey) {
      headers['X-Gemini-API-Key'] = apiKey;
    }

    try {
      const response = await axios.post(`${API_URL}/analyze`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          ...headers
        },
      });
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'An error occurred during resume analysis. Please check your network and try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadPresetSample = (presetKey) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setCompletedImprovements({});
    setActiveQuestionIndex(null);
    setEvaluationResult(null);

    // Simulate analysis loading phase briefly for high fidelity feel
    setTimeout(() => {
      setResult(PRESET_SAMPLES[presetKey]);
      setLoading(false);
    }, 1500);
  };

  const submitAnswerForEvaluation = async (question) => {
    if (!userAnswer.trim()) return;

    setEvaluatingAnswer(true);
    setEvaluationError(null);
    setEvaluationResult(null);

    const headers = {};
    if (apiKey) {
      headers['X-Gemini-API-Key'] = apiKey;
    }

    try {
      const response = await axios.post(`${API_URL}/evaluate-answer`, {
        question: question,
        answer: userAnswer,
        resume_context: result?.summary
      }, {
        headers: headers
      });
      setEvaluationResult(response.data);
    } catch (err) {
      console.error(err);
      setEvaluationError('Could not grade your response. Please try again.');
    } finally {
      setEvaluatingAnswer(false);
    }
  };

  const saveApiKey = () => {
    localStorage.setItem('gemini_api_key', tempKey);
    setApiKey(tempKey);
    setShowSettings(false);
  };

  const clearApiKey = () => {
    localStorage.removeItem('gemini_api_key');
    setApiKey('');
    setTempKey('');
    setShowSettings(false);
  };

  const toggleImprovement = (index) => {
    setCompletedImprovements(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981'; // Success Emerald
    if (score >= 60) return '#f59e0b'; // Warning Amber
    return '#ef4444'; // Error Rose
  };

  return (
    <div className="min-h-screen relative pb-20">
      {/* Dynamic Glowing Mesh Background */}
      <div className="bg-gradient-blur">
        <div className="gradient-circle circle-1"></div>
        <div className="gradient-circle circle-2"></div>
      </div>

      {/* Navigation Header */}
      <nav className="border-b border-white/5 bg-slate-950/20 backdrop-blur-md sticky top-0 z-50">
        <div className="container py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Target className="text-white" size={22} />
            </div>
            <span className="text-xl font-bold tracking-tight">
              SkillMatch <span className="text-gradient">AI</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                setTempKey(apiKey);
                setShowSettings(true);
              }}
              className="p-2.5 rounded-xl border border-white/5 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2 text-sm font-medium"
              title="API Key Configuration"
            >
              <Settings size={18} />
              <span className="hidden sm:inline">Settings</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass max-w-md w-full p-6 relative overflow-hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Key className="text-indigo-400" size={20} />
                  <h3 className="text-lg font-bold">API Key Configuration</h3>
                </div>
                <button 
                  onClick={() => setShowSettings(false)}
                  className="p-1 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-slate-400 leading-relaxed">
                  By default, SkillMatch AI runs on highly realistic mock outputs for evaluation. You can enter your personal <strong>Gemini API Key</strong> below to enable real-time AI analyses.
                </p>
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Gemini API Key</label>
                  <input 
                    type="password"
                    value={tempKey}
                    onChange={(e) => setTempKey(e.target.value)}
                    placeholder="Enter your key (AIzaSy...)"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button 
                    onClick={saveApiKey}
                    className="flex-grow btn-primary text-sm py-2.5 rounded-xl shadow-lg"
                  >
                    Save Configuration
                  </button>
                  {apiKey && (
                    <button 
                      onClick={clearApiKey}
                      className="px-4 py-2.5 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 rounded-xl text-sm font-semibold transition-all"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className="container pt-10">
        <AnimatePresence mode="wait">
          
          {/* 1. File Upload & Input State */}
          {!result && !loading && (
            <motion.div 
              key="uploader"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-4xl mx-auto space-y-10"
            >
              {/* Header Hero */}
              <div className="text-center space-y-4 max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  <Sparkles size={14} className="animate-pulse" /> Powered by Gemini AI
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                  Optimize Your Resume for <span className="text-gradient font-extrabold">ATS Success</span>
                </h1>
                <p className="text-base md:text-lg text-slate-400 leading-relaxed">
                  Upload your resume, optionally paste the target job description, and leverage advanced AI models to unlock skill gap insights and interactive mock interviews.
                </p>
              </div>

              {/* Quick Preset Demonstrations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                <button
                  onClick={() => loadPresetSample('software_engineer')}
                  className="p-4 rounded-2xl glass glass-hover text-left flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center flex-shrink-0">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-200">Load Full-Stack Engineer Sample</h4>
                    <p className="text-xs text-slate-400 mt-1">Instantly review a premium resume analysis and job matching audit.</p>
                  </div>
                </button>
                <button
                  onClick={() => loadPresetSample('product_manager')}
                  className="p-4 rounded-2xl glass glass-hover text-left flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-pink-500/15 text-pink-400 flex items-center justify-center flex-shrink-0">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-200">Load Product Manager Sample</h4>
                    <p className="text-xs text-slate-400 mt-1">Review tailored ATS enhancements, check-lists and practices.</p>
                  </div>
                </button>
              </div>

              {/* Main Inputs Dual Panel */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch mt-6">
                
                {/* Drag and Drop File Upload Area */}
                <div className="glass p-8 flex flex-col justify-between relative overflow-hidden">
                  <div className="space-y-4 text-center py-6">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shadow-inner">
                      {file ? <FileText size={32} /> : <Upload size={32} />}
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold">{file ? file.name : 'Select Resume Document'}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Drag and drop your PDF or DOCX file here,<br />or select it from your device storage.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-4 mt-6">
                    <label className="btn-primary w-full text-center py-3 rounded-xl cursor-pointer shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 font-bold transition-all text-sm">
                      {file ? 'Replace File' : 'Browse Files'}
                      <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.docx" />
                    </label>
                    {file && (
                      <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                        <CheckCircle size={14} /> Resume loaded successfully
                      </p>
                    )}
                  </div>
                </div>

                {/* Job Description Textarea */}
                <div className="glass p-8 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Target size={18} className="text-indigo-400" />
                      <h3 className="font-bold text-sm uppercase tracking-wider text-slate-200">Target Job Description (Optional)</h3>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Paste the requirements for the job you want to target. This unlocks an automated **Job Match Score** and directs keyword comparisons.
                    </p>
                    <textarea 
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste the description, roles, key competencies, and criteria here..."
                      className="w-full h-40 mt-3 p-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-xs resize-none leading-relaxed"
                    />
                  </div>
                </div>

              </div>

              {/* Action Button */}
              {file && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center pt-4"
                >
                  <button 
                    onClick={handleUpload}
                    className="btn-primary px-12 py-4 rounded-2xl text-base font-extrabold shadow-xl shadow-indigo-500/20 flex items-center gap-3 mx-auto"
                  >
                    <span>Analyze Loaded Resume</span>
                    <ChevronRight size={18} />
                  </button>
                </motion.div>
              )}

              {/* API Configuration Alert banner if empty */}
              {!apiKey && (
                <div className="p-4 rounded-2xl border border-yellow-500/10 bg-yellow-500/5 text-yellow-400/90 text-xs flex gap-3 max-w-xl mx-auto leading-relaxed">
                  <AlertTriangle size={18} className="flex-shrink-0 text-yellow-500" />
                  <div>
                    <strong>Demo Sandbox Mode:</strong> You haven't added a custom Gemini API Key yet. The analyzer will operate on highly realistic mock outputs for review. Open <strong>Settings</strong> at the top right to configure your key.
                  </div>
                </div>
              )}

              {error && (
                <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-sm flex gap-3 items-center max-w-xl mx-auto">
                  <AlertTriangle size={18} className="flex-shrink-0" />
                  <div>{error}</div>
                </div>
              )}
            </motion.div>
          )}

          {/* 2. Advanced Multi-phase Loading Spinner */}
          {loading && (
            <motion.div 
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-md mx-auto text-center py-20 space-y-6"
            >
              <div className="relative inline-flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border border-indigo-500/10 bg-indigo-500/5 flex items-center justify-center">
                  <Loader2 className="animate-spin text-indigo-400" size={36} />
                </div>
                <div className="absolute inset-0 w-20 h-20 rounded-full border-t border-indigo-500 filter blur-sm animate-pulse"></div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-bold">SkillMatch Engine Running</h3>
                <AnimatePresence mode="wait">
                  <motion.p 
                    key={loadingPhaseIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-xs text-indigo-400/80 font-medium tracking-wide h-6"
                  >
                    {LOADING_PHASES[loadingPhaseIndex]}
                  </motion.p>
                </AnimatePresence>
                <p className="text-xs text-slate-500 mt-2">Integrating LLM cognitive matrices for synthesis...</p>
              </div>
            </motion.div>
          )}

          {/* 3. Comprehensive Dashboard Results */}
          {result && !loading && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8 max-w-6xl mx-auto"
            >
              {/* Back Button and Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <button 
                    onClick={() => {setResult(null); setFile(null);}}
                    className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-wider flex items-center gap-1.5"
                  >
                    ← Back to Resume Upload
                  </button>
                  <h2 className="text-3xl font-extrabold tracking-tight mt-1 text-slate-100">
                    Your AI Optimization <span className="text-gradient">Dashboard</span>
                  </h2>
                </div>

                {/* Info Pills */}
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-slate-400 flex items-center gap-1.5">
                    <FileText size={12} className="text-indigo-400" />
                    {file ? file.name : 'Simulated Preset Resume'}
                  </span>
                  {result.job_match && (
                    <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs font-semibold text-indigo-400 flex items-center gap-1.5">
                      <Target size={12} />
                      Job Match Active
                    </span>
                  )}
                </div>
              </div>

              {/* TOP LAYOUT: Score breakdown & summary card */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                
                {/* Overall Score Radial Dial */}
                <div className="glass p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full filter blur-xl"></div>
                  
                  <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-6">Overall ATS Compatibility</h4>
                  
                  <div className="relative inline-flex items-center justify-center">
                    <svg className="w-36 h-36 transform -rotate-90">
                      <circle className="text-slate-900" strokeWidth="8" stroke="currentColor" fill="transparent" r="62" cx="72" cy="72" />
                      <circle 
                        className="transition-all duration-1000 ease-out" 
                        strokeWidth="8" 
                        strokeDasharray={389.5}
                        strokeDashoffset={389.5 - (389.5 * result.score) / 100}
                        strokeLinecap="round" 
                        stroke={getScoreColor(result.score)}
                        fill="transparent" 
                        r="62" cx="72" cy="72" 
                      />
                    </svg>
                    <span className="absolute text-4xl font-black tracking-tight" style={{ color: getScoreColor(result.score) }}>
                      {result.score}%
                    </span>
                  </div>

                  <p className="mt-6 text-xs text-slate-400 leading-relaxed max-w-[240px]">
                    {result.score >= 80 ? 'Excellent formatting and vocabulary. Highly optimized for scanner bots!' : 
                     result.score >= 60 ? 'Solid performance, but targeted keyword fixes will boost you to the top tier.' : 
                     'Needs fundamental corrections in layout structure and metrics.'}
                  </p>
                </div>

                {/* Sub-Score Breakdown Charts */}
                <div className="glass p-8 flex flex-col justify-between">
                  <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-4">Granular Scoring Matrix</h4>
                  
                  <div className="space-y-5 flex-grow flex flex-col justify-center">
                    
                    {/* Formatting Sub-Score */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-300">Layout & Formatting Structure</span>
                        <span className="text-indigo-400">{result.breakdown?.formatting || 80}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-950/80 rounded-full overflow-hidden border border-white/5">
                        <div 
                          className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                          style={{ width: `${result.breakdown?.formatting || 80}%` }}
                        />
                      </div>
                    </div>

                    {/* Keywords Sub-Score */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-300">Semantic Keyword Density</span>
                        <span className="text-purple-400">{result.breakdown?.keywords || 70}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-950/80 rounded-full overflow-hidden border border-white/5">
                        <div 
                          className="h-full bg-purple-500 rounded-full transition-all duration-1000"
                          style={{ width: `${result.breakdown?.keywords || 70}%` }}
                        />
                      </div>
                    </div>

                    {/* Impact Sub-Score */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-300">Impact Metrics & Action Verbs</span>
                        <span className="text-pink-400">{result.breakdown?.impact || 75}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-950/80 rounded-full overflow-hidden border border-white/5">
                        <div 
                          className="h-full bg-pink-500 rounded-full transition-all duration-1000"
                          style={{ width: `${result.breakdown?.impact || 75}%` }}
                        />
                      </div>
                    </div>

                  </div>
                  
                  <div className="text-[10px] text-slate-500 mt-4 leading-relaxed flex items-center gap-1.5">
                    <Sparkles size={12} className="text-indigo-400 flex-shrink-0" />
                    Scores mapped from deep structural and syntactic ATS parsers.
                  </div>
                </div>

                {/* Candidate Summary Panel */}
                <div className="glass p-8 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <FileText size={18} className="text-indigo-400" />
                      <h4 className="font-bold text-sm uppercase tracking-wider text-slate-200">Professional Context</h4>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed font-normal">
                      {result.summary}
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t border-white/5 mt-4">
                    <h5 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Identified Core Skill Pillars</h5>
                    <div className="flex flex-wrap gap-1.5 mt-2 max-h-[80px] overflow-y-auto pr-1">
                      {result.skills.slice(0, 5).map((skill, i) => (
                        <span key={i} className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-semibold text-indigo-400 rounded-md">
                          {skill}
                        </span>
                      ))}
                      {result.skills.length > 5 && (
                        <span className="text-[10px] text-slate-500 font-medium">+{result.skills.length - 5} more</span>
                      )}
                    </div>
                  </div>
                </div>

              </div>

              {/* JOB MATCH PANEL: Show direct keyword audit if available */}
              {result.job_match && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass p-8 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-40 h-40 bg-pink-500/5 rounded-full filter blur-2xl"></div>
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-pink-500/15 border border-pink-500/20 text-pink-400 flex items-center justify-center flex-shrink-0 shadow-lg shadow-pink-500/10">
                        <Target size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-200">Job Description Alignment Audit</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Automated side-by-side competency comparisons</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl self-start md:self-auto">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Job Match Score</span>
                      <span className="text-2xl font-black text-pink-400">{result.job_match.score}%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
                    
                    {/* Suitability text */}
                    <div className="lg:col-span-1 space-y-3">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles size={14} className="text-pink-400" /> Strategic Analysis
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed font-normal">
                        {result.job_match.role_suitability}
                      </p>
                    </div>

                    {/* Matched Keywords */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle size={14} /> Matched Competencies ({result.job_match.matched_keywords.length})
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        These key requirements from the target description are already well highlighted in your resume:
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {result.job_match.matched_keywords.map((kw, i) => (
                          <span key={i} className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-[10px] font-bold">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Missing Keywords */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
                        <AlertTriangle size={14} /> Critical Missing Keywords ({result.job_match.missing_keywords.length})
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        These key phrases are highly optimized in the job description but missing in your text:
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {result.job_match.missing_keywords.map((kw, i) => (
                          <span key={i} className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-lg text-[10px] font-bold animate-pulse">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>
                </motion.div>
              )}

              {/* CORE DETAILS ROW: Skill gap analyzer & actionable improvements */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                
                {/* Skill Gap lists */}
                <div className="glass p-8 space-y-6">
                  <div className="flex items-center gap-2">
                    <Target className="text-indigo-400" size={20} />
                    <h3 className="font-bold text-base uppercase tracking-wider text-slate-200">Semantic Skill Gap Index</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Identified Skills Card */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle size={14} className="text-emerald-400" /> Present in Resume
                      </h4>
                      <div className="flex flex-wrap gap-1.5 max-h-[220px] overflow-y-auto pr-1">
                        {result.skills.map((skill, i) => (
                          <span key={i} className="px-2.5 py-1 bg-white/5 border border-white/5 text-slate-300 rounded-lg text-[10px] font-medium hover:bg-white/10 transition-colors">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Missing Skills Card */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <AlertTriangle size={14} className="text-amber-500" /> Industry Recommended
                      </h4>
                      <div className="flex flex-wrap gap-1.5 max-h-[220px] overflow-y-auto pr-1">
                        {result.missing_skills.map((skill, i) => (
                          <span key={i} className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-lg text-[10px] font-bold">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actionable Improvement Checklist */}
                <div className="glass p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="text-indigo-400" size={20} />
                      <h3 className="font-bold text-base uppercase tracking-wider text-slate-200">ATS Formatting Fixes</h3>
                    </div>
                    
                    {/* Progress tracking badge */}
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-white/5 border border-white/10 px-2 py-1 rounded-md">
                      {Object.values(completedImprovements).filter(Boolean).length} / {result.improvements.length} Resolved
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed font-normal">
                    Click each AI audit ticket below as you optimize your resume to track your progress:
                  </p>

                  <ul className="space-y-3.5">
                    {result.improvements.map((tip, i) => {
                      const isDone = completedImprovements[i];
                      return (
                        <li 
                          key={i} 
                          onClick={() => toggleImprovement(i)}
                          className={`flex items-start gap-3.5 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                            isDone 
                              ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-500 line-through' 
                              : 'bg-white/5 border-white/5 text-slate-300 hover:border-white/10 hover:bg-white/10'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center border transition-all ${
                            isDone 
                              ? 'bg-emerald-500 border-emerald-500 text-white' 
                              : 'border-slate-700 bg-slate-900 text-transparent'
                          }`}>
                            <Check size={12} strokeWidth={3} />
                          </div>
                          
                          <span className="text-xs font-normal leading-relaxed text-left flex-grow">
                            {tip}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

              </div>

              {/* MOCK INTERVIEW SIMULATOR: Click questions to practice draw */}
              <div className="glass p-8 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/15 border border-purple-500/20 text-purple-400 flex items-center justify-center shadow-lg shadow-purple-500/10 flex-shrink-0">
                    <MessageSquare size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-200">Interactive AI Mock Interview Coach</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Select a customized question below to practice typing your answer and receive real-time ratings and feedback.</p>
                  </div>
                </div>

                {/* Questions Grid drawer layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
                  
                  {/* Left Column: Questions List */}
                  <div className="lg:col-span-1 space-y-2.5">
                    <h5 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Tailored Interview Questions</h5>
                    
                    {result.interview_questions.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setActiveQuestionIndex(i);
                          setUserAnswer('');
                          setEvaluationResult(null);
                          setEvaluationError(null);
                        }}
                        className={`w-full p-4 rounded-xl border text-left text-xs font-semibold leading-relaxed transition-all flex items-start gap-3 ${
                          activeQuestionIndex === i 
                            ? 'bg-purple-500/10 border-purple-500/30 text-purple-300 shadow-md' 
                            : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:border-white/10 hover:text-slate-200'
                        }`}
                      >
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-extrabold">
                          {i + 1}
                        </span>
                        <span className="flex-grow">{q}</span>
                      </button>
                    ))}
                  </div>

                  {/* Right Column: Dynamic Interactive Practice Console */}
                  <div className="lg:col-span-2">
                    <AnimatePresence mode="wait">
                      {activeQuestionIndex !== null ? (
                        <motion.div
                          key={activeQuestionIndex}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="p-6 rounded-2xl border border-white/10 bg-slate-950/40 h-full flex flex-col justify-between"
                        >
                          <div className="space-y-4 flex-grow">
                            
                            {/* Question highlight */}
                            <div className="space-y-1">
                              <span className="text-[9px] font-bold tracking-wider text-purple-400 uppercase">Question #{activeQuestionIndex + 1} Under Practice</span>
                              <h4 className="text-sm font-bold text-slate-200 italic">
                                "{result.interview_questions[activeQuestionIndex]}"
                              </h4>
                            </div>

                            {/* Response Box */}
                            {!evaluationResult && (
                              <div className="space-y-2 pt-2">
                                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Your Response</label>
                                <textarea
                                  value={userAnswer}
                                  onChange={(e) => setUserAnswer(e.target.value)}
                                  disabled={evaluatingAnswer}
                                  placeholder="Type your response here using the STAR format (Situation, Task, Action, Result) if applicable..."
                                  className="w-full h-32 p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-xs resize-none leading-relaxed"
                                />
                                
                                <div className="flex justify-between items-center pt-2">
                                  <span className="text-[10px] text-slate-500">Focus on metrics, methods, and outcomes.</span>
                                  <button
                                    onClick={() => submitAnswerForEvaluation(result.interview_questions[activeQuestionIndex])}
                                    disabled={evaluatingAnswer || !userAnswer.trim()}
                                    className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-purple-500/10 transition-all"
                                  >
                                    {evaluatingAnswer ? <Loader2 className="animate-spin" size={14} /> : <Send size={12} />}
                                    {evaluatingAnswer ? 'Evaluating Answer...' : 'Submit Response'}
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Evaluation Loader spinner */}
                            {evaluatingAnswer && (
                              <div className="py-8 text-center space-y-3">
                                <Loader2 className="animate-spin text-purple-400 mx-auto" size={24} />
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Synthesizing constructive evaluations...</p>
                              </div>
                            )}

                            {/* Evaluation result review panel */}
                            {evaluationResult && (
                              <motion.div 
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-5 pt-3"
                              >
                                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Evaluation Metrics</span>
                                  
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-slate-400">Response Quality Rating:</span>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                                      evaluationResult.rating === 'Strong' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' :
                                      evaluationResult.rating === 'Average' ? 'bg-amber-500/10 border border-amber-500/20 text-amber-500' :
                                      'bg-red-500/10 border border-red-500/20 text-red-400'
                                    }`}>
                                      {evaluationResult.rating}
                                    </span>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                                  {/* Feedback card */}
                                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2 flex flex-col justify-between">
                                    <div>
                                      <div className="flex items-center gap-1.5 text-slate-300 font-bold text-xs uppercase tracking-wider">
                                        <ThumbsUp size={14} className="text-purple-400" />
                                        <span>Constructive Feedback</span>
                                      </div>
                                      <p className="text-[11px] text-slate-400 leading-relaxed mt-2 font-normal font-sans">
                                        {evaluationResult.feedback}
                                      </p>
                                    </div>
                                    <div className="text-[9px] text-slate-500 italic mt-2">Adjust your wording based on these notes.</div>
                                  </div>

                                  {/* Model exemplar answer */}
                                  <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 space-y-2 flex flex-col justify-between">
                                    <div>
                                      <div className="flex items-center gap-1.5 text-slate-300 font-bold text-xs uppercase tracking-wider">
                                        <BookOpen size={14} className="text-indigo-400" />
                                        <span>Model Exemplar Response</span>
                                      </div>
                                      <p className="text-[11px] text-slate-400 leading-relaxed mt-2 italic font-serif">
                                        "{evaluationResult.sample_answer}"
                                      </p>
                                    </div>
                                    <div className="text-[9px] text-slate-500 font-semibold tracking-wider uppercase text-indigo-400 mt-2">STAR Benchmark Response</div>
                                  </div>
                                </div>

                                <div className="pt-2 flex justify-end">
                                  <button
                                    onClick={() => {
                                      setEvaluationResult(null);
                                      setUserAnswer('');
                                    }}
                                    className="px-4 py-2 border border-slate-700 bg-slate-900 text-slate-400 hover:text-white rounded-lg text-xs font-semibold hover:border-slate-600 transition-all"
                                  >
                                    Try Answering Again
                                  </button>
                                </div>
                              </motion.div>
                            )}

                            {evaluationError && (
                              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl">
                                {evaluationError}
                              </div>
                            )}

                          </div>
                        </motion.div>
                      ) : (
                        <div className="h-full rounded-2xl border border-white/5 border-dashed flex flex-col items-center justify-center text-center p-12 text-slate-500">
                          <Play size={24} className="text-slate-600 animate-pulse" />
                          <h4 className="font-bold text-sm text-slate-400 mt-4">Practice Sandbox Inactive</h4>
                          <p className="text-xs text-slate-500 mt-1 max-w-sm">Select any question on the left to start typing your answer and practice with real-time AI mentoring.</p>
                        </div>
                      )}
                    </AnimatePresence>
                  </div>

                </div>

              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Elegant Footer */}
      <footer className="absolute bottom-0 left-0 w-full py-6 text-center text-slate-600 text-xs border-t border-white/5 bg-slate-950/40">
        <p>© 2026 SkillMatch AI Suite. Built with React and Gemini 1.5 Flash.</p>
      </footer>
    </div>
  );
}

export default App;
