"use client";
import React, { useState, useEffect, useRef, FormEvent } from 'react';
import {
  Code,
  Cpu,
  Globe,
  Smartphone,
  Database,
  ArrowRight,
  CheckCircle2,
  Layers,
  Zap,
  ShieldCheck,
  Users,
  Menu,
  X,
  ChevronRight,
  MapPin,
  Mail,
  Linkedin,
  Twitter,
  Instagram,
  Terminal,
  Sparkles,
  Bot,
  Loader2,
  MessageSquare,
  Send,
  Minimize2,
  RefreshCw,
  Server,
  LayoutTemplate,
  Calculator,
  TrendingUp,
  Clock,
  FileCode,
  ArrowUpRight,
  AlertTriangle,
  LucideIcon
} from 'lucide-react';

// --- KONFIGURASI API KEY ---
// PENTING: Tempel API Key Gemini Anda di dalam tanda kutip di bawah ini.
// Dapatkan key gratis di: https://aistudio.google.com/app/apikey
const NEXT_PUBLIC_GEMINI_API_KEY = "AIzaSyDnM6DJJa4MPVWxALbIBiDK0vuvhiWlmp0";

// --- Types & Interfaces ---

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'ghost' | 'white' | 'ai' | 'secondary';
  className?: string;
  onClick?: () => void;
  icon?: LucideIcon;
  disabled?: boolean;
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface SectionTagProps {
  children: React.ReactNode;
}

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

interface NavigationProps {
  activePage: string;
  setPage: (page: string) => void;
  isScrolled: boolean;
  onOpenAI: () => void;
}

interface HeroProps {
  setPage: (page: string) => void;
  onOpenAI: () => void;
}

interface ArchitectResult {
  title: string;
  summary: string;
  features: string[];
  stack: string[];
  timeline: string;
  advice: string;
}

interface TechStackResult {
  frontend: string;
  backend: string;
  database: string;
  cloud: string;
  reason: string;
}

interface ROIResult {
  hoursSaved: string | number;
  efficiency: string;
  summary: string;
}

interface MigrationResult {
  riskLevel: string;
  strategy: string;
  cloudTarget: string;
  summary: string;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

// --- Design System & Theme Configuration ---

const THEME = {
  colors: {
    primary: "bg-blue-600 hover:bg-blue-700",
    primaryText: "text-blue-600",
    secondary: "bg-slate-900 text-white",
    accent: "text-teal-500",
    bg: "bg-slate-50",
    card: "bg-white",
    textMain: "text-slate-900",
    textMuted: "text-slate-500"
  }
};

// --- Components ---

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', onClick, icon: Icon, disabled }) => {
  const baseStyle = "inline-flex items-center justify-center px-6 py-3 text-sm font-medium transition-all duration-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary: `${THEME.colors.primary} text-white shadow-lg shadow-blue-500/30 hover:-translate-y-0.5`,
    outline: "border border-slate-300 text-slate-700 bg-transparent hover:bg-slate-50",
    ghost: "text-slate-600 hover:text-blue-600 hover:bg-blue-50",
    white: "bg-white text-blue-900 hover:bg-slate-100 shadow-md",
    ai: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-purple-500/30 hover:-translate-y-0.5 border border-purple-400/20",
    secondary: "bg-slate-800 text-white hover:bg-slate-700 shadow-md"
  };

  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
      {Icon && <Icon className="ml-2 h-4 w-4" />}
    </button>
  );
};

const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-xl transition-shadow duration-300 ${className}`}>
    {children}
  </div>
);

const SectionTag: React.FC<SectionTagProps> = ({ children }) => (
  <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold uppercase tracking-wider mb-4">
    {children}
  </span>
);

const Badge: React.FC<BadgeProps> = ({ children, className = "" }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-800 mr-2 mb-2 ${className}`}>
    {children}
  </span>
);

// --- FEATURE 1: Gemini Architect Modal ---

const GeminiArchitectModal: React.FC<{ isOpen: boolean; onClose: () => void; setPage: (page: string) => void }> = ({ isOpen, onClose, setPage }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ArchitectResult | null>(null);
  const [error, setError] = useState('');

  const generateBlueprint = async () => {
    if (!prompt.trim()) return;
    if (!NEXT_PUBLIC_GEMINI_API_KEY || NEXT_PUBLIC_GEMINI_API_KEY === "ISI_API_KEY_GEMINI_ANDA_DISINI") {
      setError("API Key belum dipasang. Silakan edit kode dan masukkan key dari Google AI Studio.");
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    const systemPrompt = `
      You are the Senior Solutions Architect AI for PT. Vista Primora Nusantara.
      Response Format: JSON object ONLY.
      Structure:
      {
        "title": "Project Title",
        "summary": "Executive summary.",
        "features": ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
        "stack": ["Tech 1", "Tech 2"],
        "timeline": "Estimated timeline",
        "advice": "Strategic advice."
      }
    `;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${NEXT_PUBLIC_GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `Project Idea: ${prompt}` }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
            generationConfig: { responseMimeType: "application/json" }
          })
        }
      );

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (aiText) setResult(JSON.parse(aiText));
      else throw new Error("No blueprint generated.");

    } catch (err: any) {
      setError(err.message || "Connection failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-gradient-to-r from-slate-900 to-blue-900 p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg text-purple-300"><Sparkles size={20} /></div>
            <div>
              <h3 className="text-white font-bold text-lg">Vista AI Architect</h3>
              <p className="text-blue-200 text-xs">Powered by Google Gemini</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors"><X size={24} /></button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {!result ? (
            <>
              <p className="text-slate-600 mb-4">Describe your dream software project. Our AI will generate an instant technical blueprint.</p>
              <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="I want to build a platform that..." className="w-full h-32 p-4 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none resize-none mb-4 text-slate-800 placeholder:text-slate-400" />
              {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">{error}</div>}
              <div className="flex justify-end">
                <Button variant="ai" onClick={generateBlueprint} disabled={loading || !prompt.trim()} className="w-full sm:w-auto">
                  {loading ? <><Loader2 className="animate-spin mr-2 h-4 w-4" /> Analyzing...</> : <><Sparkles className="mr-2 h-4 w-4" /> Generate Blueprint</>}
                </Button>
              </div>
            </>
          ) : (
            <div className="animate-fade-in">
              <div className="flex justify-between items-start mb-4">
                <div><Badge className="bg-purple-100 text-purple-700 mb-2">AI Generated Proposal</Badge><h2 className="text-2xl font-bold text-slate-900">{result.title}</h2></div>
              </div>
              <p className="text-slate-600 mb-6 text-lg leading-relaxed border-l-4 border-purple-500 pl-4 bg-slate-50 py-2">{result.summary}</p>
              <div className="grid sm:grid-cols-2 gap-6 mb-6">
                <div><h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2"><Layers size={16} className="text-blue-600" /> Core Features</h4><ul className="space-y-2">{result.features.map((f, i) => (<li key={i} className="flex items-start gap-2 text-sm text-slate-600"><CheckCircle2 size={14} className="text-green-500 mt-0.5 shrink-0" />{f}</li>))}</ul></div>
                <div><h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2"><Cpu size={16} className="text-blue-600" /> Stack</h4><div className="flex flex-wrap gap-2">{result.stack.map((s, i) => (<span key={i} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded border border-slate-200">{s}</span>))}</div><div className="mt-4"><h4 className="font-bold text-slate-900 mb-1 text-sm">Est. Timeline</h4><p className="text-sm text-slate-600">{result.timeline}</p></div></div>
              </div>
              <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-lg mb-6"><h4 className="font-bold text-yellow-800 text-sm mb-1 flex items-center gap-2"><Zap size={14} /> Architect's Advice</h4><p className="text-sm text-yellow-700 italic">"{result.advice}"</p></div>
              <div className="flex gap-3 flex-col sm:flex-row"><Button variant="primary" className="flex-1" onClick={() => { onClose(); setPage('contact'); }}>Discuss this Blueprint</Button><Button variant="outline" onClick={() => setResult(null)}>New Idea</Button></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- FEATURE 2: VistaBot (AI Chat Widget) ---

const VistaBotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hello! I'm VistaBot. Ask me about our services, tech stack, or how we work." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    if (!NEXT_PUBLIC_GEMINI_API_KEY || NEXT_PUBLIC_GEMINI_API_KEY === "ISI_API_KEY_GEMINI_ANDA_DISINI") {
      setMessages(prev => [...prev, { role: 'model', text: "Error: API Key belum dikonfigurasi. Mohon developer memasukkan API Key di page.tsx." }]);
      setLoading(false);
      return;
    }

    const systemPrompt = `
      You are VistaBot, the AI assistant for PT. Vista Primora Nusantara.
      Company Info:
      - Services: Custom Software, Mobile/Web Apps (Next.js, React Native), ERP Systems, Cloud Infrastructure (AWS/GCP).
      - Values: Reliability, Clean Code, Enterprise Grade Security.
      - Location: Bandung, Indonesia.
      - Contact: hello@vistaprimora.com.
      
      Guidelines:
      - Be professional, concise, and helpful.
      - If asked about prices, say "Pricing depends on the project scope. Please contact our team for a detailed quote."
      - Keep answers under 3 sentences if possible.
    `;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${NEXT_PUBLIC_GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [...messages, userMsg].map(m => ({ role: m.role === 'model' ? 'model' : 'user', parts: [{ text: m.text }] })),
            systemInstruction: { parts: [{ text: systemPrompt }] }
          })
        }
      );
      const data = await response.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having trouble connecting right now.";
      setMessages(prev => [...prev, { role: 'model', text: reply }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm offline at the moment." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      <div className={`bg-white rounded-2xl shadow-2xl border border-slate-200 w-80 sm:w-96 mb-4 overflow-hidden transition-all duration-300 origin-bottom-right pointer-events-auto flex flex-col ${isOpen ? 'opacity-100 scale-100 translate-y-0 h-[500px]' : 'opacity-0 scale-95 translate-y-10 h-0'}`}>
        {/* Chat Header */}
        <div className="bg-slate-900 p-4 flex justify-between items-center text-white shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-600 rounded-lg"><Bot size={18} /></div>
            <div><h3 className="font-bold text-sm">VistaBot AI</h3><div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-400"></span><span className="text-[10px] text-slate-300">Online</span></div></div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white"><Minimize2 size={18} /></button>
        </div>

        {/* Chat Body */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] px-3 py-2.5 rounded-2xl text-sm ${m.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm'}`}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start"><div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm"><Loader2 className="w-4 h-4 animate-spin text-blue-600" /></div></div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-3 bg-white border-t border-slate-100 shrink-0">
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
            <input
              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" disabled={loading || !input.trim()} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`pointer-events-auto h-14 w-14 rounded-full shadow-xl flex items-center justify-center text-white transition-all duration-300 hover:scale-110 ${isOpen ? 'bg-slate-700 rotate-90' : 'bg-blue-600'}`}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
};

// --- FEATURE 3: Smart RFQ Polisher in Contact Form ---

const Contact = () => {
  const [message, setMessage] = useState('');
  const [polishing, setPolishing] = useState(false);

  const handlePolish = async () => {
    if (!message.trim()) return;
    if (!NEXT_PUBLIC_GEMINI_API_KEY || NEXT_PUBLIC_GEMINI_API_KEY === "ISI_API_KEY_GEMINI_ANDA_DISINI") {
      alert("API Key belum diset!");
      return;
    }

    setPolishing(true);
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${NEXT_PUBLIC_GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `Rewrite this user query to be a professional, business-ready Request for Proposal (RFP) for an IT consultancy. Keep it under 100 words. User Query: "${message}"` }] }]
          })
        }
      );
      const data = await response.json();
      const polished = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (polished) setMessage(polished);
    } catch (e) {
      // Silent fail
    } finally {
      setPolishing(false);
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-blue-600 rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row">

          {/* Contact Info */}
          <div className="lg:w-5/12 p-10 lg:p-16 bg-blue-700 text-white flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-6">Let's build something great together.</h2>
              <p className="text-blue-100 mb-12 leading-relaxed">
                Ready to modernize your IT infrastructure? Fill out the form or drop us an email. We typically respond within 24 hours.
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-600 border border-blue-400 flex items-center justify-center">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-blue-200 uppercase tracking-wider">Headquarters</p>
                    <p className="font-medium">Bandung, Indonesia</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-600 border border-blue-400 flex items-center justify-center">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-blue-200 uppercase tracking-wider">Email</p>
                    <p className="font-medium">hello@vistaprimora.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 lg:mt-0 flex gap-4">
              <a href="#" className="hover:text-blue-200 transition-colors"><Linkedin /></a>
              <a href="#" className="hover:text-blue-200 transition-colors"><Twitter /></a>
              <a href="#" className="hover:text-blue-200 transition-colors"><Instagram /></a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:w-7/12 p-10 lg:p-16 bg-white">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                  <input type="email" className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" placeholder="john@company.com" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Project Type</label>
                <select className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white">
                  <option>Web Development</option>
                  <option>Mobile App</option>
                  <option>IT Consulting</option>
                  <option>Enterprise System</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-slate-700">Message</label>
                  <button type="button" onClick={handlePolish} disabled={polishing || !message} className="text-xs font-medium text-purple-600 hover:text-purple-700 flex items-center gap-1 transition-colors disabled:opacity-50">
                    {polishing ? <Loader2 className="animate-spin w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                    AI Refine
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  placeholder="Tell us about your project goals..."
                ></textarea>
              </div>

              <Button className="w-full py-4 text-base">Send Message</Button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

// --- FEATURE 4: Tech Stack Advisor (Existing) ---

const TechStackAdvisor = () => {
  const [industry, setIndustry] = useState('');
  const [recommendation, setRecommendation] = useState<TechStackResult | null>(null);
  const [loading, setLoading] = useState(false);

  const getAdvice = async () => {
    if (!industry.trim()) return;
    if (!NEXT_PUBLIC_GEMINI_API_KEY || NEXT_PUBLIC_GEMINI_API_KEY === "ISI_API_KEY_GEMINI_ANDA_DISINI") {
      alert("API Key belum diset!");
      return;
    }

    setLoading(true);

    const systemPrompt = `
      You are a CTO (Chief Technology Officer) for an IT consultancy.
      User will input an industry or app idea (e.g. "Fintech", "E-commerce").
      You must recommend a tech stack.
      
      Response JSON Format:
      {
        "frontend": "React Native / Next.js",
        "backend": "Go / Node.js",
        "database": "PostgreSQL / MongoDB",
        "cloud": "AWS / GCP",
        "reason": "Short explanation why this stack fits the industry (max 2 sentences)."
      }
    `;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${NEXT_PUBLIC_GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `Industry/Idea: ${industry}` }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
            generationConfig: { responseMimeType: "application/json" }
          })
        }
      );
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) setRecommendation(JSON.parse(text));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 text-white py-16 my-12 rounded-3xl relative overflow-hidden shadow-2xl mx-4 lg:mx-0">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[100px] opacity-20 -mr-20 -mt-20"></div>
      <div className="relative z-10 px-8 lg:px-16">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-12">
          <div className="lg:w-1/2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase mb-6">
              <Sparkles size={12} /> New AI Feature
            </div>
            <h3 className="text-3xl font-bold mb-4">Smart Tech Stack Advisor</h3>
            <p className="text-slate-400 mb-8 leading-relaxed">
              Not sure which technology fits your business? Enter your industry (e.g., "Healthcare", "Crypto Exchange", "Marketplace"), and our AI CTO will recommend the optimal infrastructure.
            </p>

            <div className="flex gap-3">
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g. Telemedicine App"
                className="flex-1 px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
              <Button variant="ai" onClick={getAdvice} disabled={loading || !industry}>
                {loading ? <Loader2 className="animate-spin" /> : 'Analyze'}
              </Button>
            </div>
          </div>

          <div className="lg:w-1/2 w-full">
            {recommendation ? (
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-6 rounded-2xl animate-fade-in">
                <h4 className="text-xl font-bold text-white mb-4 border-b border-slate-700 pb-2">CTO Recommendation</h4>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-slate-800 rounded-lg">
                    <span className="text-xs text-slate-500 uppercase block mb-1">Frontend</span>
                    <span className="font-medium text-blue-300 flex items-center gap-2"><LayoutTemplate size={14} /> {recommendation.frontend}</span>
                  </div>
                  <div className="p-3 bg-slate-800 rounded-lg">
                    <span className="text-xs text-slate-500 uppercase block mb-1">Backend</span>
                    <span className="font-medium text-green-300 flex items-center gap-2"><Terminal size={14} /> {recommendation.backend}</span>
                  </div>
                  <div className="p-3 bg-slate-800 rounded-lg">
                    <span className="text-xs text-slate-500 uppercase block mb-1">Database</span>
                    <span className="font-medium text-yellow-300 flex items-center gap-2"><Database size={14} /> {recommendation.database}</span>
                  </div>
                  <div className="p-3 bg-slate-800 rounded-lg">
                    <span className="text-xs text-slate-500 uppercase block mb-1">Cloud</span>
                    <span className="font-medium text-purple-300 flex items-center gap-2"><Server size={14} /> {recommendation.cloud}</span>
                  </div>
                </div>
                <p className="text-sm text-slate-400 italic border-l-2 border-blue-500 pl-3">
                  "{recommendation.reason}"
                </p>
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center text-center h-full min-h-[200px]">
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-600">
                  <Cpu size={24} />
                </div>
                <p className="text-slate-500 text-sm">Results will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- FEATURE 5: ROI Calculator (Existing) ---

const ROICalculator = () => {
  const [processDesc, setProcessDesc] = useState('');
  const [analysis, setAnalysis] = useState<ROIResult | null>(null);
  const [loading, setLoading] = useState(false);

  const calculateROI = async () => {
    if (!processDesc.trim()) return;
    if (!NEXT_PUBLIC_GEMINI_API_KEY || NEXT_PUBLIC_GEMINI_API_KEY === "ISI_API_KEY_GEMINI_ANDA_DISINI") {
      alert("API Key belum diset!");
      return;
    }

    setLoading(true);
    const systemPrompt = `
      You are a Business Analyst.
      User will describe a manual business process.
      You must estimate the savings if this was digitized.
      
      Response JSON Format:
      {
        "hoursSaved": "Number (e.g. 120)",
        "efficiency": "Percentage (e.g. 300%)",
        "summary": "Short professional analysis of the bottleneck and solution (max 20 words)."
      }
    `;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${NEXT_PUBLIC_GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `Manual Process: ${processDesc}` }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
            generationConfig: { responseMimeType: "application/json" }
          })
        }
      );
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) setAnalysis(JSON.parse(text));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-16 p-8 bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-2xl shadow-lg">
      <div className="text-center mb-8">
        <Badge className="bg-green-100 text-green-700 mb-3">Vista Business Intelligence</Badge>
        <h3 className="text-2xl font-bold text-slate-900">ROI Estimator</h3>
        <p className="text-slate-600 max-w-xl mx-auto">
          Tell us your current manual workflow, and our AI will calculate how much time and money you could save with custom software.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-stretch">
        <div className="flex-1">
          <textarea
            className="w-full h-full min-h-[180px] p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-slate-700"
            placeholder="e.g., We have 3 staff members who spend 4 hours every Friday manually copying data from paper receipts into Excel..."
            value={processDesc}
            onChange={(e) => setProcessDesc(e.target.value)}
          />
        </div>
        <div className="flex-1 flex flex-col justify-center">
          {!analysis ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center text-blue-200">
                <Calculator size={32} />
              </div>
              <Button variant="ai" onClick={calculateROI} disabled={loading || !processDesc} className="w-full">
                {loading ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Calculate Impact
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 animate-fade-in">
              <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
                <div className="flex items-center gap-2 text-blue-600 mb-1">
                  <Clock size={16} /> <span className="text-xs font-bold uppercase">Hours Saved/Mo</span>
                </div>
                <p className="text-3xl font-black text-slate-900">{analysis.hoursSaved}h</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-green-100 shadow-sm">
                <div className="flex items-center gap-2 text-green-600 mb-1">
                  <TrendingUp size={16} /> <span className="text-xs font-bold uppercase">Efficiency</span>
                </div>
                <p className="text-3xl font-black text-slate-900">+{analysis.efficiency}</p>
              </div>
              <div className="col-span-2 bg-slate-900 text-white p-4 rounded-xl">
                <span className="text-xs text-slate-400 uppercase font-bold block mb-2">AI Analysis</span>
                <p className="text-sm leading-relaxed">"{analysis.summary}"</p>
              </div>
              <Button variant="outline" onClick={() => setAnalysis(null)} className="col-span-2">Recalculate</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- FEATURE 6: Code Refactor Demo (Existing) ---

const CodeRefactorDemo = () => {
  const [dirtyCode, setDirtyCode] = useState(`function calculate(a, b) {
  // bad naming
  var x = a + b; 
  if(x > 10) {
    return true;
  } else {
    return false;
  }
}`);
  const [cleanCode, setCleanCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRefactor = async () => {
    setLoading(true);
    if (!NEXT_PUBLIC_GEMINI_API_KEY || NEXT_PUBLIC_GEMINI_API_KEY === "ISI_API_KEY_GEMINI_ANDA_DISINI") {
      alert("API Key belum diset!");
      setLoading(false);
      return;
    }

    const systemPrompt = `
      You are a Senior Software Engineer advocating for Clean Code.
      Refactor the provided code to be modern (ES6+), concise, and robust.
      Add a short comment block at the top explaining the changes.
      Return only the code block content (no markdown ticks).
    `;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${NEXT_PUBLIC_GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `Code to refactor:\n${dirtyCode}` }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] }
          })
        }
      );
      const data = await response.json();
      const result = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (result) setCleanCode(result.replace(/```/g, ''));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-16 bg-slate-900 rounded-2xl p-8 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-3xl opacity-20"></div>

      <div className="flex flex-col md:flex-row items-center justify-between mb-8 relative z-10">
        <div>
          <Badge className="bg-blue-900 text-blue-300 border border-blue-800 mb-2">Interactive Demo</Badge>
          <h3 className="text-2xl font-bold text-white">Experience Our "Clean Code" Standard</h3>
          <p className="text-slate-400 text-sm max-w-md mt-2">
            See how our engineers transform messy, legacy logic into maintainable, enterprise-grade software using our AI-assisted toolkit.
          </p>
        </div>
        <Button variant="ai" onClick={handleRefactor} disabled={loading} className="mt-4 md:mt-0">
          {loading ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2 h-4 w-4" />}
          Refactor Code
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6 relative z-10">
        <div className="bg-slate-950 rounded-xl border border-slate-800 p-4">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
            <span className="text-xs text-red-400 font-mono font-bold">BEFORE: Legacy Code</span>
          </div>
          <textarea
            value={dirtyCode}
            onChange={(e) => setDirtyCode(e.target.value)}
            className="w-full h-48 bg-transparent text-slate-400 font-mono text-sm outline-none resize-none"
            spellCheck="false"
          />
        </div>

        <div className="bg-slate-950 rounded-xl border border-blue-900/50 p-4 relative overflow-hidden">
          {loading && <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center z-20"><Loader2 className="animate-spin text-blue-500" /></div>}
          <div className="flex items-center justify-between mb-3 border-b border-blue-900/30 pb-2">
            <span className="text-xs text-green-400 font-mono font-bold flex items-center gap-2"><CheckCircle2 size={12} /> AFTER: Vista Standard</span>
          </div>
          <div className="w-full h-48 overflow-auto text-blue-100 font-mono text-sm whitespace-pre">
            {cleanCode || "// Click 'Refactor Code' to see the magic..."}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- FEATURE 7: Migration Consultant (New) ---

const MigrationConsultant = () => {
  const [legacyStack, setLegacyStack] = useState('');
  const [report, setReport] = useState<MigrationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const assessMigration = async () => {
    if (!legacyStack.trim()) return;
    if (!NEXT_PUBLIC_GEMINI_API_KEY || NEXT_PUBLIC_GEMINI_API_KEY === "ISI_API_KEY_GEMINI_ANDA_DISINI") {
      alert("API Key belum diset!");
      return;
    }

    setLoading(true);

    const systemPrompt = `
      You are a Modernization Architect. 
      The user will provide their current legacy stack (e.g. "VB.NET 2008, SQL Server 2005").
      You must provide a migration strategy.
      
      Response JSON Format:
      {
        "riskLevel": "High/Medium/Low",
        "strategy": "Rehost / Replatform / Refactor",
        "cloudTarget": "AWS Lambda / Google Cloud Run / Azure App Service",
        "summary": "A concise 2-sentence explanation of the recommended path."
      }
    `;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${NEXT_PUBLIC_GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `Legacy Stack: ${legacyStack}` }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
            generationConfig: { responseMimeType: "application/json" }
          })
        }
      );
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) setReport(JSON.parse(text));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-16 border border-slate-200 rounded-2xl p-8 bg-white relative overflow-hidden group hover:border-blue-200 transition-colors">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="lg:w-1/3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase mb-4">
            <AlertTriangle size={12} /> Legacy Systems
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">Modernization Assessor</h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-6">
            Stuck with outdated technology? Enter your current stack to get an instant AI-generated migration strategy to the cloud.
          </p>
          <textarea
            className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none mb-4"
            rows={3}
            placeholder="e.g. PHP 5.4, MySQL 5.5, hosted on physical server..."
            value={legacyStack}
            onChange={(e) => setLegacyStack(e.target.value)}
          />
          <Button variant="secondary" onClick={assessMigration} disabled={loading || !legacyStack} className="w-full justify-center bg-slate-800 text-white hover:bg-slate-700">
            {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            Assess Risk
          </Button>
        </div>

        <div className="lg:w-2/3 w-full">
          {!report ? (
            <div className="h-full min-h-[250px] bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
              <Server size={48} className="mb-4 opacity-50" />
              <p className="text-sm">Migration report will appear here</p>
            </div>
          ) : (
            <div className="h-full bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-xl p-6 animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-bold text-slate-900 flex items-center gap-2"><FileCode size={18} className="text-blue-600" /> Strategy Report</h4>
                <Badge className={`${report.riskLevel === 'High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  Risk Level: {report.riskLevel}
                </Badge>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                  <span className="text-xs text-slate-400 uppercase font-bold block mb-1">Strategy</span>
                  <span className="font-bold text-slate-800 flex items-center gap-2"><ArrowUpRight size={14} className="text-green-500" /> {report.strategy}</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                  <span className="text-xs text-slate-400 uppercase font-bold block mb-1">Cloud Target</span>
                  <span className="font-bold text-slate-800 flex items-center gap-2"><Globe size={14} className="text-blue-500" /> {report.cloudTarget}</span>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <span className="text-xs text-blue-600 uppercase font-bold block mb-2">Architect's Summary</span>
                <p className="text-sm text-slate-700 leading-relaxed">"{report.summary}"</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Main Page Components ---

const Navigation: React.FC<NavigationProps> = ({ activePage, setPage, isScrolled, onOpenAI }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'portfolio', label: 'Work' },
    { id: 'process', label: 'Process' },
    { id: 'about', label: 'About' },
  ];

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => setPage('home')}
        >
          <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-teal-500 rounded-lg flex items-center justify-center text-white shadow-lg">
            <span className="font-bold text-lg">V</span>
          </div>
          <div className="flex flex-col">
            <span className={`font-bold leading-none tracking-tight ${isScrolled ? 'text-slate-900' : 'text-slate-900'}`}>
              VISTA PRIMORA
            </span>
            <span className="text-[0.6rem] uppercase tracking-widest text-slate-500">Nusantara</span>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setPage(link.id)}
              className={`text-sm font-medium transition-colors ${activePage === link.id
                  ? 'text-blue-600'
                  : 'text-slate-600 hover:text-blue-600'
                }`}
            >
              {link.label}
            </button>
          ))}

          {/* AI Trigger Button in Nav */}
          <button
            onClick={onOpenAI}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-600 text-xs font-bold uppercase tracking-wide rounded-full border border-purple-100 hover:bg-purple-100 transition-colors"
          >
            <Sparkles size={12} /> AI Architect
          </button>

          <Button variant="primary" onClick={() => setPage('contact')}>
            Discuss Project
          </Button>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-slate-600"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          {isMobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-xl md:hidden p-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setPage(link.id);
                setIsMobileOpen(false);
              }}
              className="text-left px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => { onOpenAI(); setIsMobileOpen(false); }}
            className="text-left px-4 py-2 text-purple-600 font-medium hover:bg-purple-50 rounded-lg flex items-center gap-2"
          >
            <Sparkles size={16} /> Vista AI Architect
          </button>
          <Button className="w-full" onClick={() => { setPage('contact'); setIsMobileOpen(false); }}>
            Contact Us
          </Button>
        </div>
      )}
    </header>
  );
};

const Hero: React.FC<HeroProps> = ({ setPage, onOpenAI }) => (
  <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-50">
    {/* Abstract Background Elements */}
    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-200/30 blur-3xl"></div>
    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-teal-200/30 blur-3xl"></div>

    {/* Grid Pattern Overlay */}
    <div className="absolute inset-0 bg-[url('[https://grainy-gradients.vercel.app/noise.svg](https://grainy-gradients.vercel.app/noise.svg)')] opacity-20 mix-blend-soft-light"></div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm mb-8 animate-fade-in-up">
        <span className="flex h-2 w-2 rounded-full bg-teal-500 animate-pulse"></span>
        <span className="text-xs font-semibold text-slate-600 tracking-wide uppercase">Accepting New Enterprise Projects</span>
      </div>

      <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 leading-[1.1]">
        We Engineer <br className="hidden sm:block" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
          Digital Excellence
        </span>
      </h1>

      <p className="text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
        PT. Vista Primora Nusantara transforms complex business challenges into elegant software solutions. We build scalable, future-proof technology for forward-thinking enterprises.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Button onClick={() => setPage('contact')} icon={ArrowRight} className="w-full sm:w-auto">
          Start Your Transformation
        </Button>
        <Button variant="ai" onClick={onOpenAI} className="w-full sm:w-auto" icon={Sparkles}>
          Generate Blueprint ✨
        </Button>
      </div>

      {/* Trusted By Strip */}
      <div className="mt-16 pt-8 border-t border-slate-200/60">
        <p className="text-sm text-slate-400 font-medium mb-6 uppercase tracking-widest">Trusted by Industry Leaders</p>
        <div className="flex flex-wrap justify-center gap-8 lg:gap-16 opacity-50 grayscale">
          {/* Placeholder Logos */}
          <div className="text-xl font-bold text-slate-800">ACME Corp</div>
          <div className="text-xl font-bold text-slate-800">GlobalBank</div>
          <div className="text-xl font-bold text-slate-800">Starlight Logistics</div>
          <div className="text-xl font-bold text-slate-800">TechFlow</div>
        </div>
      </div>
    </div>
  </section>
);

const Services = () => {
  const services = [
    {
      title: "Custom Software Development",
      description: "Tailor-made software solutions designed to address your specific business bottlenecks and operational goals.",
      icon: Code,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      title: "Mobile & Web Apps",
      description: "High-performance, responsive applications built with Next.js and React Native that engage users and drive conversion.",
      icon: Smartphone,
      color: "text-teal-600",
      bg: "bg-teal-50"
    },
    {
      title: "Enterprise Systems (ERP)",
      description: "Robust integrated management systems that unify your data, finance, and supply chain into one dashboard.",
      icon: Database,
      color: "text-indigo-600",
      bg: "bg-indigo-50"
    },
    {
      title: "Cloud Infrastructure",
      description: "Scalable cloud architecture on AWS/GCP ensuring your digital assets are secure, fast, and always available.",
      icon: Globe,
      color: "text-sky-600",
      bg: "bg-sky-50"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <SectionTag>Our Expertise</SectionTag>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">End-to-End Digital Solutions</h2>
          <p className="text-slate-600">We don't just write code; we build business assets. Our engineering team covers the full spectrum of modern IT needs.</p>
        </div>

        <div className="flex flex-col gap-12 mb-16">
          {/* Existing AI Feature */}
          <TechStackAdvisor />

          {/* NEW AI FEATURE: Migration Consultant */}
          <MigrationConsultant />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, idx) => (
            <Card key={idx} className="p-6 h-full flex flex-col hover:border-blue-200 group cursor-default">
              <div className={`w-12 h-12 ${service.bg} ${service.color} rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <service.icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed flex-grow">{service.description}</p>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-blue-600 text-sm font-medium cursor-pointer hover:underline">
                Learn more <ChevronRight size={16} />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

const Portfolio = () => {
  const projects = [
    {
      title: "Nusantara Logistics ERP",
      category: "System Integration",
      description: "A comprehensive fleet management and inventory tracking system for a national logistics provider.",
      stats: "30% Efficiency Boost",
      image: "bg-slate-800",
      tags: ["Next.js", "Node.js", "PostgreSQL"]
    },
    {
      title: "BankSyariah Mobile",
      category: "Fintech",
      description: "Secure mobile banking application serving 500k+ users with real-time transaction processing.",
      stats: "99.99% Uptime",
      image: "bg-blue-900",
      tags: ["React Native", "AWS", "Cybersecurity"]
    },
    {
      title: "UrbanMarket E-Commerce",
      category: "Retail Platform",
      description: "High-scale multi-vendor marketplace with integrated payment gateways and AI recommendation engine.",
      stats: "2M+ Daily Hits",
      image: "bg-teal-800",
      tags: ["React", "GraphQL", "Stripe"]
    }
  ];

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="max-w-2xl">
            <SectionTag>Selected Work</SectionTag>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">Engineered for Impact</h2>
          </div>
          <Button variant="outline" className="mt-4 md:mt-0 hidden md:inline-flex">View Full Portfolio</Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {projects.map((project, idx) => (
            <div key={idx} className="group relative bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-300">
              {/* Abstract Project Thumbnail */}
              <div className={`h-48 ${project.image} relative overflow-hidden`}>
                <div className="absolute inset-0 opacity-30 bg-[url('[https://grainy-gradients.vercel.app/noise.svg](https://grainy-gradients.vercel.app/noise.svg)')]"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Layers className="text-white/20 h-20 w-20 transform group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="absolute bottom-4 left-4">
                  <span className="bg-white/10 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium border border-white/20">
                    {project.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{project.title}</h3>
                <p className="text-slate-500 text-sm mb-4 h-12">{project.description}</p>

                <div className="flex flex-wrap mb-6">
                  {project.tags.map(tag => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold">Key Result</p>
                    <p className="text-sm font-bold text-blue-600">{project.stats}</p>
                  </div>
                  <button className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-blue-600 hover:text-white transition-colors">
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center md:hidden">
          <Button variant="outline">View Full Portfolio</Button>
        </div>
      </div>
    </section>
  );
};

const Process = () => {
  const steps = [
    { num: "01", title: "Discovery", desc: "We dive deep into your business goals and technical requirements." },
    { num: "02", title: "Blueprint", desc: "Architecture design, UI/UX prototyping, and stack selection." },
    { num: "03", title: "Develop", desc: "Agile engineering with bi-weekly sprints and rigorous code reviews." },
    { num: "04", title: "Launch & Scale", desc: "Deployment, user training, and continuous reliability monitoring." },
  ];

  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-500 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="text-blue-400 font-bold tracking-wider uppercase text-sm">How We Work</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">The Vista Methodology</h2>
        </div>

        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {steps.map((step, idx) => (
            <div key={idx} className="relative group">
              <div className="text-6xl font-black text-slate-800 mb-4 group-hover:text-slate-700 transition-colors select-none">
                {step.num}
              </div>
              <div className="absolute top-8 left-2 w-12 h-1 bg-blue-600 mb-4"></div>
              <h3 className="text-xl font-bold mb-2 mt-4">{step.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* NEW FEATURE ADDED HERE: ROI Estimator */}
        <ROICalculator />
      </div>
    </section>
  );
};

const About = () => (
  <section className="py-20 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <SectionTag>About Us</SectionTag>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            Building the Digital Backbone of Indonesia
          </h2>
          <div className="prose prose-slate text-slate-600 mb-8">
            <p className="mb-4">
              Founded with a vision to accelerate digital transformation across the archipelago,
              <strong> PT. Vista Primora Nusantara</strong> combines local market understanding with world-class engineering standards.
            </p>
            <p>
              We believe technology shouldn't just "work"—it should be an asset that drives revenue, reduces friction, and scales effortlessly. From Bandung to the world, we are your partners in innovation.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 rounded-lg text-green-600 mt-1">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Reliability</h4>
                <p className="text-xs text-slate-500 mt-1">99.9% SLA Guarantee</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-100 rounded-lg text-purple-600 mt-1">
                <Zap size={18} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Speed</h4>
                <p className="text-xs text-slate-500 mt-1">Rapid Deployment</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="aspect-square rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="grid grid-cols-2 gap-4 p-8 opacity-40">
                <div className="w-32 h-40 bg-slate-300 rounded-xl"></div>
                <div className="w-32 h-40 bg-slate-400 rounded-xl mt-12"></div>
                <div className="w-32 h-40 bg-slate-400 rounded-xl -mt-12"></div>
                <div className="w-32 h-40 bg-slate-300 rounded-xl"></div>
              </div>
            </div>
            {/* Floating Stat Card */}
            <div className="absolute bottom-8 left-8 right-8 bg-white p-6 rounded-xl shadow-xl border border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-500 text-sm font-medium">Clients Satisfaction</span>
                <span className="text-blue-600 font-bold">4.9/5.0</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 w-[98%] h-full rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const WhyUs = () => {
  const reasons = [
    { icon: ShieldCheck, title: "Enterprise Grade", desc: "Security and scalability are baked in from line one of code." },
    { icon: Users, title: "Dedicated Teams", desc: "You don't get freelancers. You get a dedicated pod of experts." },
    { icon: Terminal, title: "Clean Code", desc: "Maintainable, documented, and modern codebases that last." },
    { icon: Layers, title: "Full Lifecycle", desc: "From idea to maintenance, we handle the entire tech journey." },
  ];

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900">Why Choose Vista Primora?</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {reasons.map((r, i) => (
            <Card key={i} className="p-6 text-center hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 mx-auto bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-700 mb-4 shadow-sm">
                <r.icon size={20} />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">{r.title}</h3>
              <p className="text-sm text-slate-500">{r.desc}</p>
            </Card>
          ))}
        </div>

        {/* NEW FEATURE: Code Refactor Demo */}
        <CodeRefactorDemo />
      </div>
    </section>
  );
};

const Footer: React.FC<{ setPage: (page: string) => void }> = ({ setPage }) => (
  <footer className="bg-slate-900 text-slate-300 py-16 border-t border-slate-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-2 mb-6 text-white">
            <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-teal-500 rounded-lg flex items-center justify-center font-bold">V</div>
            <span className="font-bold text-lg tracking-tight">VISTA PRIMORA</span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed mb-6">
            Premier IT solutions provider based in Bandung. We enable enterprises to navigate the digital landscape with precision engineering.
          </p>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Services</h4>
          <ul className="space-y-4 text-sm">
            <li className="hover:text-blue-400 cursor-pointer transition-colors">Custom Software</li>
            <li className="hover:text-blue-400 cursor-pointer transition-colors">Web Development</li>
            <li className="hover:text-blue-400 cursor-pointer transition-colors">Mobile Apps</li>
            <li className="hover:text-blue-400 cursor-pointer transition-colors">Cloud Integration</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Company</h4>
          <ul className="space-y-4 text-sm">
            <li onClick={() => setPage('about')} className="hover:text-blue-400 cursor-pointer transition-colors">About Us</li>
            <li onClick={() => setPage('portfolio')} className="hover:text-blue-400 cursor-pointer transition-colors">Case Studies</li>
            <li className="hover:text-blue-400 cursor-pointer transition-colors">Careers</li>
            <li onClick={() => setPage('contact')} className="hover:text-blue-400 cursor-pointer transition-colors">Contact</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Legal</h4>
          <ul className="space-y-4 text-sm">
            <li className="hover:text-blue-400 cursor-pointer transition-colors">Privacy Policy</li>
            <li className="hover:text-blue-400 cursor-pointer transition-colors">Terms of Service</li>
          </ul>
        </div>
      </div>

      <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center">
        <p className="text-xs text-slate-500">&copy; {new Date().getFullYear()} PT. Vista Primora Nusantara. All rights reserved.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          {/* Social icons repeated for footer bottom */}
        </div>
      </div>
    </div>
  </footer>
);

// --- Main App Shell ---

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top on page change simulation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage]);

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return (
          <>
            <Hero setPage={setActivePage} onOpenAI={() => setIsAIModalOpen(true)} />
            <Services />
            <Portfolio />
            <WhyUs />
            <About />
            <Contact />
          </>
        );
      case 'services':
        return (
          <div className="pt-20">
            <div className="bg-slate-50 py-16 text-center">
              <h1 className="text-4xl font-bold text-slate-900">Our Services</h1>
              <p className="text-slate-600 mt-4 max-w-2xl mx-auto">Technical excellence delivered across every platform.</p>
            </div>
            <Services />
            <Process />
            <Contact />
          </div>
        );
      case 'portfolio':
        return (
          <div className="pt-20">
            <div className="bg-slate-50 py-16 text-center">
              <h1 className="text-4xl font-bold text-slate-900">Case Studies</h1>
              <p className="text-slate-600 mt-4 max-w-2xl mx-auto">Real problems solved with intelligent code.</p>
            </div>
            <Portfolio />
            <Contact />
          </div>
        );
      case 'about':
        return (
          <div className="pt-20">
            <div className="bg-slate-50 py-16 text-center">
              <h1 className="text-4xl font-bold text-slate-900">Our Philosophy</h1>
            </div>
            <About />
            <WhyUs />
            <div className="bg-white py-16 text-center">
              <h3 className="text-2xl font-bold mb-8">Meet The Team</h3>
              <p className="text-slate-500 italic">Team photos would be displayed here in a grid layout.</p>
            </div>
            <Contact />
          </div>
        );
      case 'process':
        return (
          <div className="pt-20">
            <Process />
            <WhyUs />
            <Contact />
          </div>
        );
      case 'contact':
        return (
          <div className="pt-20">
            <Contact />
          </div>
        );
      default:
        return <Hero setPage={setActivePage} onOpenAI={() => setIsAIModalOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <Navigation
        activePage={activePage}
        setPage={setActivePage}
        isScrolled={isScrolled}
        onOpenAI={() => setIsAIModalOpen(true)}
      />
      <main>
        {renderPage()}
      </main>
      <Footer setPage={setActivePage} />

      {/* AI Features */}
      <GeminiArchitectModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        setPage={setActivePage}
      />
      <VistaBotWidget />
    </div>
  );
}