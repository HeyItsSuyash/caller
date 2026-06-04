'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useSpring } from 'framer-motion';
import { 
  PhoneCall, 
  Activity, 
  Cpu, 
  Database, 
  HeartHandshake, 
  Globe2, 
  Code2, 
  Terminal as TermIcon, 
  Layers, 
  ShieldAlert, 
  Play, 
  ArrowUpRight,
  Flame,
  Award,
  Zap,
  Building2,
  Stethoscope,
  Briefcase,
  Search,
  ChevronRight,
  Sparkles,
  TrendingUp,
  X,
  Lock,
  Mail,
  User,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

// Marketing components
import FloatingParticles from '../components/marketing/FloatingParticles';
import AnimatedGrid from '../components/marketing/AnimatedGrid';
import GlowButton from '../components/marketing/GlowButton';
import FeatureCard from '../components/marketing/FeatureCard';
import DashboardPreview from '../components/marketing/DashboardPreview';
import HeroVisual from '../components/marketing/HeroVisual';
import ArchitectureFlow from '../components/marketing/ArchitectureFlow';
import PricingCards from '../components/marketing/PricingCards';
import TestimonialCard from '../components/marketing/TestimonialCard';

const AnimatedCounter = ({ value, decimals = 0, suffix = '', prefix = '' }: { value: number; decimals?: number; suffix?: string; prefix?: string }) => {
  const [count, setCount] = useState(0);
  const [inView, setInView] = useState(false);
  const elementRef = React.useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const end = value;
    const duration = 1.5;
    let startTime: number | null = null;

    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      setCount(progress * (end - start) + start);
      if (progress < 1) {
        requestAnimationFrame(animateCount);
      }
    };

    requestAnimationFrame(animateCount);
  }, [value, inView]);

  return <span ref={elementRef}>{prefix}{count.toFixed(decimals)}{suffix}</span>;
};

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'websocket' | 'sip' | 'webhooks'>('websocket');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [accountType, setAccountType] = useState<'personal' | 'agency'>('personal');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:3001';

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      const endpoint = authMode === 'login' ? '/auth/login' : '/auth/signup';
      const payload = authMode === 'login' 
        ? { email, password }
        : { name, email, password, accountType };

      const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = '/workspace';
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('token')) {
      setIsLoggedIn(true);
    }
  }, []);

  const features = [
    { icon: Zap, title: 'Realtime Voice Intelligence', desc: 'Convert stream packets using ffmpeg and feed Whisper APIs in under 200ms.', glow: 'emerald' as const },
    { icon: PhoneCall, title: 'Autonomous AI Calling', desc: 'Trigger SIP outbound dialing directly through automated CRM queue webhooks.', glow: 'neutral' as const },
    { icon: Database, title: 'Knowledge-Grounded', desc: 'RAG mapping utilizing MongoDB knowledge bases to guarantee zero bot hallucination.', glow: 'indigo' as const },
    { icon: HeartHandshake, title: 'Human Handoff APIs', desc: 'Trigger instant Twilio webhook redirects to transfer calls to local call centers.', glow: 'neutral' as const },
    { icon: Layers, title: 'AI-Powered CRM', desc: 'Extract custom JSON entities and sentiment, converting calls into active CRM leads.', glow: 'indigo' as const },
    { icon: Globe2, title: 'SIP Telecom Infrastructure', desc: 'Carrier-grade telephony abstraction layers ready for Twilio, Exotel, and Plivo.', glow: 'neutral' as const },
    { icon: Sparkles, title: 'Multilingual Hinglish', desc: 'Optimized voice accents blending Hindi and English matching natural Indian speech.', glow: 'emerald' as const },
    { icon: Cpu, title: 'Enterprise Latency Clocks', desc: 'Complete observation mapping showing STT, LLM inference, and TTS processing speeds.', glow: 'neutral' as const },
  ];

  const useCases = [
    { icon: Building2, title: 'Universities', desc: 'Automate student admission queries, registration fee options, and guidelines.' },
    { icon: Stethoscope, title: 'Healthcare', desc: 'Book appointments and follow up on post-discharge recovery parameters.' },
    { icon: Briefcase, title: 'Recruitment', desc: 'Perform first-round phone interviews and screen resume variables autonomously.' },
    { icon: TrendingUp, title: 'Sales Teams', desc: 'Ingest lead queues and perform automated callback campaigns in seconds.' }
  ];

  const codeSnippets = {
    websocket: `// Connect to VANI Live Audio Stream Gateway
const socket = new WebSocket('wss://api.caller.work/twilio/stream');

socket.on('message', (packet) => {
  const binaryPayload = JSON.parse(packet);
  if (binaryPayload.event === 'media') {
    // μ-law 8kHz binary audio chunks
    ffmpeg.stdin.write(Buffer.from(binaryPayload.media.payload, 'base64'));
  }
});`,
    sip: `<!-- Configure Voice Webhook Routes -->
<Response>
  <Say voice="Polly.Aditi" language="en-IN">
    VANI connection established. Initiating stream...
  </Say>
  <Connect>
    <Stream url="wss://api.caller.work/twilio/stream" />
  </Connect>
</Response>`,
    webhooks: `// Handle Post-Call Lead CRM updates
app.post('/api/widget/call', async (req, res) => {
  const { agentId, phoneNumber } = req.body;
  const lead = await LeadService.createLead({
    phone: phoneNumber,
    entity_id: agentId,
    status: 'new'
  });
  res.json({ success: true, leadId: lead._id });
});`
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white font-sans antialiased selection:bg-white selection:text-black overflow-hidden relative radial-mesh">
      
      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-white origin-left z-50"
        style={{ scaleX }}
      />

      {/* Ambient Noise Texture */}
      <div className="noise-overlay" />
      
      {/* Background Visual Layers */}
      <FloatingParticles />
      <AnimatedGrid />

      {/* STICKY NAVBAR */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#020202]/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-lg">
              <Activity className="text-black w-4.5 h-4.5" />
            </div>
            <span className="font-black text-sm tracking-tight uppercase italic">CALLER OS</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-neutral-400">
            <Link href="#features" className="hover:text-white transition-colors">Platform</Link>
            <Link href="#architecture" className="hover:text-white transition-colors">Architecture</Link>
            <Link href="#usecases" className="hover:text-white transition-colors">Enterprise</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
          </nav>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <GlowButton onClick={() => window.location.href = '/workspace'}>
                Launch Console
              </GlowButton>
            ) : (
              <>
                <button 
                  onClick={() => { setAuthMode('login'); setIsAuthModalOpen(true); }}
                  className="text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-white transition-colors bg-transparent border-none"
                >
                  Login
                </button>
                <GlowButton onClick={() => { setAuthMode('signup'); setIsAuthModalOpen(true); }}>
                  Get Started
                </GlowButton>
              </>
            )}
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center overflow-visible">
        
        {/* Background Circular Dialer (Covering the entire hero backdrop) */}
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0 flex items-center justify-center">
          <div className="absolute w-[600px] h-[600px] flex items-center justify-center opacity-40">
            {/* Dialer Ring 1 (Concentric outer rotating) */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute w-[580px] h-[580px] border border-white/5 rounded-full flex items-center justify-center"
            >
              <div className="absolute top-0 w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_#10b981]" />
              <div className="absolute bottom-0 w-2 h-2 rounded-full bg-white/25" />
            </motion.div>

            {/* Dialer Ring 2 (Dashed middle reverse rotating) */}
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute w-[460px] h-[460px] border border-dashed border-white/10 rounded-full flex items-center justify-center"
            >
              <div className="absolute left-0 w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_12px_#6366f1]" />
              <div className="absolute right-0 w-1.5 h-1.5 rounded-full bg-white/20" />
            </motion.div>

            {/* Ring 3 (Expanding Active Pulse Wave) */}
            <motion.div 
              animate={{ scale: [0.8, 1.3, 0.8], opacity: [0.05, 0.25, 0.05] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-[320px] h-[320px] border-2 border-emerald-500/10 rounded-full"
            />
          </div>
        </div>

        {/* Left Side Info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-6 space-y-8"
        >
          {/* Trust Badges */}
          <div className="flex flex-wrap gap-2.5">
            {['Sub-500ms Latency', 'SIP-Ready Telephony', 'Hinglish Native', 'RAG Data Grounded'].map((badge) => (
              <span key={badge} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8.5px] font-black uppercase tracking-wider text-neutral-400">
                {badge}
              </span>
            ))}
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-5.5xl font-black tracking-tighter uppercase italic leading-[0.95] font-display">
              AI Voice Agents <br />
              <span className="bg-gradient-to-r from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent">
                For Real Conversations.
              </span>
            </h1>
            <p className="text-xs font-semibold text-neutral-400 leading-relaxed max-w-lg">
              Caller OS represents realtime Voice AI Workforce Infrastructure. Deploy customized Hinglish telephone agents grounded strictly on local data room vectors to automate outbound sales and support.
            </p>
          </div>

          <div className="flex gap-4">
            <GlowButton onClick={() => { setAuthMode('signup'); setIsAuthModalOpen(true); }}>
              Deploy AI Agent
            </GlowButton>
            <GlowButton variant="secondary" onClick={() => { setAuthMode('login'); setIsAuthModalOpen(true); }}>
              View Live Demo
            </GlowButton>
          </div>
        </motion.div>

        {/* Right Side Mockup */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-6"
        >
          <HeroVisual />
        </motion.div>
      </section>

      {/* METRICS & SOCIAL PROOF */}
      <section className="relative z-10 border-y border-white/5 bg-white/[0.002] py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: 'Voice Minutes Streamed', val: 42.8, dec: 1, suf: 'M+' },
            { label: 'Avg System Latency', val: 480, dec: 0, suf: 'ms' },
            { label: 'Active Telephony Channels', val: 2400, dec: 0, suf: '+' },
            { label: 'CRM Lead Conversion Rate', val: 84.2, dec: 1, suf: '%' },
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="space-y-2"
            >
              <p className="text-[9px] font-black uppercase tracking-widest text-neutral-500">{stat.label}</p>
              <h3 className="text-3xl font-black tracking-tight text-white leading-none font-display">
                <AnimatedCounter value={stat.val} decimals={stat.dec} suffix={stat.suf} />
              </h3>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-24 space-y-16">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto space-y-4"
        >
          <span className="text-[9px] font-black uppercase tracking-[0.25em] text-neutral-500">Robust Infrastructure</span>
          <h2 className="text-3xl font-black uppercase tracking-tight italic font-display">Engineered for Production Operations</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <FeatureCard 
                icon={feat.icon} 
                title={feat.title} 
                description={feat.desc} 
                glowColor={feat.glow} 
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* PLATFORM ARCHITECTURE */}
      <motion.section 
        id="architecture" 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-7xl mx-auto px-6 py-16"
      >
        <ArchitectureFlow />
      </motion.section>

      {/* USE CASES */}
      <section id="usecases" className="relative z-10 max-w-7xl mx-auto px-6 py-24 space-y-16">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto space-y-4"
        >
          <span className="text-[9px] font-black uppercase tracking-[0.25em] text-neutral-500">Use Cases</span>
          <h2 className="text-3xl font-black uppercase tracking-tight italic font-display">Industry Integrations</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {useCases.map((uc, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02, borderColor: 'rgba(255, 255, 255, 0.15)', boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.8)' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="p-6 border border-white/5 bg-white/[0.003] transition-all space-y-4 rounded-2xl cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-neutral-950 border border-white/10 flex items-center justify-center text-neutral-400">
                <uc.icon className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-[11px] font-black uppercase tracking-widest text-white leading-none font-display">{uc.title}</h3>
              <p className="text-[11px] text-neutral-500 font-semibold leading-relaxed">{uc.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* DEVELOPER SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-5 space-y-6"
        >
          <span className="text-[9px] font-black uppercase tracking-[0.25em] text-neutral-500">Developer First</span>
          <h2 className="text-3xl font-black uppercase tracking-tight italic font-display">Voice Channels via Code</h2>
          <p className="text-xs text-neutral-400 font-semibold leading-relaxed">
            Provision active Twilio streams, hook Webhook pipelines, and deploy localized models using REST APIs. Integrates seamlessly into local SIP networks.
          </p>
          
          <div className="flex gap-4 border-b border-white/5 pb-2 shrink-0">
            {['websocket', 'sip', 'webhooks'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`text-[9px] font-black uppercase tracking-widest pb-2 border-b-2 transition-all bg-transparent shadow-none ${
                  activeTab === tab ? 'border-white text-white' : 'border-transparent text-neutral-500'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Code Console Mockup */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-7 bg-[#030303] border border-white/5 rounded-3xl p-6 font-mono relative overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
            </div>
            <span className="text-[8px] text-neutral-600 font-bold uppercase tracking-wider">caller_os_sdk.js</span>
          </div>
          
          <pre className="text-[10.5px] text-neutral-400 leading-relaxed overflow-x-auto scrollbar-hide py-2">
            <code>{codeSnippets[activeTab]}</code>
          </pre>
        </motion.div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="relative z-10 max-w-7xl mx-auto px-6 py-24 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-400">Pricing Matrix</span>
          <h2 className="text-3xl font-black uppercase tracking-tight italic">Plans for Scale</h2>
        </div>
        
        <PricingCards />
      </section>

      {/* TESTIMONIALS */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-16 space-y-12">
        <h3 className="text-xs font-black uppercase tracking-widest text-neutral-500 text-center">Grounded Success quotes</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TestimonialCard 
            quote="Deploying VANI Admission Bot reduced student support load by 85% during admissions. The Hinglish blend feels exceptionally native."
            author="Dr. Anand S."
            role="Dean of Admissions"
            company="VANI Group"
          />
          <TestimonialCard 
            quote="Outbound callback campaigns are now completely automated. Hot leads land directly in our CRM pipeline in seconds."
            author="Vikram K."
            role="Director of Growth"
            company="Nexus Real Estate"
          />
          <TestimonialCard 
            quote="Low latency makes all the difference. Sub-500ms voice synthesis makes conversation flow exactly like talking to a human."
            author="Priya M."
            role="Head of Operations"
            company="MedLink Group"
          />
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-20 my-16 border border-white/10 bg-[#080808]/90 rounded-3xl text-center space-y-8 shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,#6366f1/5,transparent_100%)] pointer-events-none" />
        
        <div className="space-y-4 max-w-2xl mx-auto">
          <h2 className="text-4xl font-black tracking-tighter uppercase italic leading-[0.95]">
            Deploy Your AI Workforce Today.
          </h2>
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-widest leading-relaxed">
            Realtime multilingual voice infrastructure. Free trial includes 1,000 minutes and 2 active agents.
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <GlowButton onClick={() => { setAuthMode('signup'); setIsAuthModalOpen(true); }}>
            Deploy Agent
          </GlowButton>
          <GlowButton variant="secondary" onClick={() => { setAuthMode('login'); setIsAuthModalOpen(true); }}>
            Talk to Sales
          </GlowButton>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/5 bg-[#020202] py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-white">Platform</span>
            <ul className="space-y-2 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
              <li><Link href="#features" className="hover:text-white transition-colors">Core Features</Link></li>
              <li><Link href="#architecture" className="hover:text-white transition-colors">Architecture Flow</Link></li>
              <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing Options</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-white">Developers</span>
            <ul className="space-y-2 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
              <li><Link href="#" className="hover:text-white transition-colors">API Documentation</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">WebSocket SDK</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">SIP Gateways</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-white">Company</span>
            <ul className="space-y-2 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
              <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-white">Carrier Telemetry</span>
            <div className="flex items-center gap-2 text-[9px] font-black uppercase text-emerald-500 tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>All Systems Operational</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 border-t border-white/5 pt-8 flex justify-between items-center text-[9px] font-black text-neutral-600 uppercase tracking-[0.4em]">
          <span>© 2026 CALLER OS • GLOBAL VOICE INFRASTRUCTURE</span>
        </div>
      </footer>

      {/* Dynamic Glassmorphic Authentication Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a]/90 border border-white/10 rounded-[32px] w-full max-w-[420px] p-10 space-y-8 animate-in zoom-in-95 duration-200 shadow-[0_24px_80px_rgba(0,0,0,0.8)] relative">
            
            {/* Top Close Button */}
            <button 
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 transition-colors border-none"
            >
              <X className="w-5 h-5 text-neutral-400 hover:text-white" />
            </button>

            {/* Title / Identity */}
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-lg">
                <Activity className="text-black w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight uppercase italic text-white">
                  {authMode === 'login' ? 'Access Console' : 'Deploy OS Workspace'}
                </h3>
                <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest mt-1">
                  {authMode === 'login' ? 'Secure Authentication' : 'Initialize Infrastructure'}
                </p>
              </div>
            </div>

            {/* Error notifications */}
            {authError && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl text-[10px] font-bold flex items-center gap-3 animate-in shake duration-300">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-5">
              {authMode === 'signup' && (
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-neutral-500 ml-1">Identity Name</label>
                  <div className="relative group">
                    <User className="w-4 h-4 text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-white transition-colors" />
                    <input 
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Anand S."
                      className="w-full py-3.5 pl-11 pr-4 bg-white/[0.02] border border-white/10 rounded-2xl text-xs font-semibold focus:border-white focus:ring-0 text-white placeholder:text-neutral-600"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-neutral-500 ml-1">Workspace Email</label>
                <div className="relative group">
                  <Mail className="w-4 h-4 text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-white transition-colors" />
                  <input 
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full py-3.5 pl-11 pr-4 bg-white/[0.02] border border-white/10 rounded-2xl text-xs font-semibold focus:border-white focus:ring-0 text-white placeholder:text-neutral-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-neutral-500 ml-1">Access Key</label>
                <div className="relative group">
                  <Lock className="w-4 h-4 text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-white transition-colors" />
                  <input 
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full py-3.5 pl-11 pr-4 bg-white/[0.02] border border-white/10 rounded-2xl text-xs font-semibold focus:border-white focus:ring-0 text-white placeholder:text-neutral-600"
                  />
                </div>
              </div>

              {authMode === 'signup' && (
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-neutral-500 ml-1">Organization Tier</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div 
                      onClick={() => setAccountType('personal')}
                      className={`p-3 border rounded-2xl cursor-pointer text-center transition-all ${
                        accountType === 'personal' ? 'border-white bg-white/5' : 'border-white/5 hover:border-white/10'
                      }`}
                    >
                      <span className="text-[10px] font-black uppercase tracking-wider block text-white">Starter</span>
                    </div>
                    <div 
                      onClick={() => setAccountType('agency')}
                      className={`p-3 border rounded-2xl cursor-pointer text-center transition-all ${
                        accountType === 'agency' ? 'border-white bg-white/5' : 'border-white/5 hover:border-white/10'
                      }`}
                    >
                      <span className="text-[10px] font-black uppercase tracking-wider block text-white">Enterprise</span>
                    </div>
                  </div>
                </div>
              )}

              <button 
                type="submit"
                disabled={authLoading}
                className="w-full py-4 mt-2 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-neutral-100 transition-all flex items-center justify-center gap-2"
              >
                <span>{authLoading ? 'Authorizing Session...' : authMode === 'login' ? 'Authorize Console' : 'Launch Workspace'}</span>
                {!authLoading && <ChevronRight className="w-4 h-4" />}
              </button>
            </form>

            <div className="h-[1px] w-full bg-white/5" />

            <div className="text-center text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
              {authMode === 'login' ? (
                <>
                  New to Caller OS?{' '}
                  <button 
                    onClick={() => setAuthMode('signup')}
                    className="text-white hover:underline bg-transparent p-0 border-none font-black"
                  >
                    Deploy Workspace
                  </button>
                </>
              ) : (
                <>
                  Already registered?{' '}
                  <button 
                    onClick={() => setAuthMode('login')}
                    className="text-white hover:underline bg-transparent p-0 border-none font-black"
                  >
                    Authorize Session
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
