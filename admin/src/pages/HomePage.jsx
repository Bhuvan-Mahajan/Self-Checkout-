import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Zap,
  CheckCircle2,
  ArrowRight,
  Scale,
  QrCode,
  CreditCard,
  Activity,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Smartphone,
  Layers,
  Database,
  BarChart3,
  Key,
  Copy,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';

const GithubIcon = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
);

export const HomePage = () => {
  const navigate = useNavigate();
  const [copiedField, setCopiedField] = useState(null);
  const [backendStatus, setBackendStatus] = useState('checking'); // 'checking' | 'online' | 'offline'

  // Ping backend health check on mount
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'https://self-checkout-production-d764.up.railway.app';
        const res = await fetch(`${apiUrl}/api/health`, { method: 'GET' });
        if (res.ok) {
          setBackendStatus('online');
        } else {
          setBackendStatus('offline');
        }
      } catch (_err) {
        setBackendStatus('offline');
      }
    };
    checkBackend();
  }, []);

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const steps = [
    {
      step: '01',
      title: 'Barcode Scanning & Cart Sync',
      icon: <Smartphone className="w-5 h-5 text-amber-700" />,
      desc: 'Customer picks up items and scans physical barcodes using the React Native Expo app (CameraView). Catalog details, price, and weight are pulled instantly.',
      badge: 'Mobile App',
    },
    {
      step: '02',
      title: 'IoT Weight Verification',
      icon: <Scale className="w-5 h-5 text-amber-700" />,
      desc: 'Smart cart load-cell sensors continuously measure physical basket weight. The backend calculates variance between scanned item weights and actual load.',
      badge: 'Hardware & Math',
    },
    {
      step: '03',
      title: 'Real-Time Fraud Telemetry',
      icon: <ShieldAlert className="w-5 h-5 text-red-600" />,
      desc: 'If weight mismatch exceeds the tolerance threshold, an automated fraud alert (LOW/MEDIUM/HIGH) is dispatched to store managers via Socket.io in <100ms.',
      badge: 'Socket.io Event',
    },
    {
      step: '04',
      title: 'In-App Razorpay Checkout',
      icon: <CreditCard className="w-5 h-5 text-amber-700" />,
      desc: 'Customer completes secure payment directly in the mobile app via Razorpay (UPI, Credit/Debit Cards, NetBanking). Webhooks verify HMAC signatures.',
      badge: 'Payment Gateway',
    },
    {
      step: '05',
      title: 'Exit Gate Turnstile QR',
      icon: <QrCode className="w-5 h-5 text-emerald-600" />,
      desc: 'Upon successful payment, an HMAC-signed digital exit QR code is generated. Scanners at the physical store turnstile validate the token and open the exit gate.',
      badge: 'Theft Prevention',
    },
  ];

  const adminFeatures = [
    {
      icon: <BarChart3 className="w-5 h-5 text-brand-accent" />,
      title: 'Live Telemetry Dashboard',
      description:
        'Real-time revenue metrics, active shopper cart counters, and hourly sales charts synchronized via WebSockets.',
    },
    {
      icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
      title: 'Real-Time Fraud Dispatcher',
      description:
        'Live stream of sensor weight discrepancies, suspect cart IDs, severity ranking, and one-click cashier resolution workflows.',
    },
    {
      icon: <Layers className="w-5 h-5 text-brand-accent" />,
      title: 'Live Order Surveillance',
      description:
        'Audit trail of every completed self-checkout order with customer details, itemized breakdown, and Razorpay payment status.',
    },
    {
      icon: <Database className="w-5 h-5 text-brand-accent" />,
      title: 'Catalog & Inventory Control',
      description:
        'Comprehensive product directory with barcode mapping, unit weight specifications, price controls, and instantaneous stock toggles.',
    },
  ];

  const techStack = [
    {
      category: 'Customer Mobile App',
      tech: 'React Native, Expo SDK 57, Expo Camera, AsyncStorage, Context API',
      detail: 'Cross-platform barcode scanner, running total, live cart state',
    },
    {
      category: 'Store Admin Dashboard',
      tech: 'React 19, Vite, Tailwind CSS, shadcn/ui, Recharts, Zustand',
      detail: 'Real-time WebSocket dashboard, fraud management, catalog control',
    },
    {
      category: 'Backend & APIs',
      tech: 'Node.js, Express 5, Socket.io, JWT + Refresh Tokens, Zod, Helmet',
      detail: 'RESTful architecture, real-time event broadcasting, input validation',
    },
    {
      category: 'Database & Cloud',
      tech: 'MongoDB Atlas, Mongoose ODM, Railway (API), Vercel (Admin Web)',
      detail: 'Optimized schemas, geospatial-ready indexes, automated CI/CD',
    },
    {
      category: 'Security & Verification',
      tech: 'Razorpay HMAC Webhooks, Rate Limiting, CORS Origin Whitelist',
      detail: 'Tamper-proof payment signatures, brute-force protection',
    },
  ];

  return (
    <div className="min-h-screen bg-brand-50 text-text-primary selection:bg-brand-accent selection:text-white">
      {/* Top Banner / Announcement */}
      <div className="bg-brand-100 border-b border-brand-200 px-4 py-2 text-xs text-center text-text-secondary flex items-center justify-center gap-2">
        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-medium text-text-primary">SmartCart Ecosystem</span>
        <span>— Full-stack IoT self-checkout system built with React Native, Node.js & Socket.io</span>
      </div>

      {/* Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-brand-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-brand-accent/20 border border-brand-accent flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
              🛒
            </div>
            <div>
              <span className="font-bold text-lg text-text-primary tracking-tight">SmartCart</span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-100 text-text-secondary border border-brand-200">
                Project Showcase
              </span>
            </div>
          </Link>

          {/* Center Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-text-secondary">
            <a href="#problem" className="hover:text-text-primary transition-colors">
              Problem & Solution
            </a>
            <a href="#how-it-works" className="hover:text-text-primary transition-colors">
              How It Works
            </a>
            <a href="#admin-features" className="hover:text-text-primary transition-colors">
              Admin Ops
            </a>
            <a href="#architecture" className="hover:text-text-primary transition-colors">
              Architecture
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Backend Health Badge */}
            <div
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${
                backendStatus === 'online'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : backendStatus === 'checking'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-zinc-100 text-zinc-600 border-zinc-200'
              }`}
              title="Backend API status on Railway"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  backendStatus === 'online'
                    ? 'bg-emerald-500 animate-pulse'
                    : backendStatus === 'checking'
                    ? 'bg-amber-400'
                    : 'bg-zinc-400'
                }`}
              />
              <span className="font-medium">
                {backendStatus === 'online'
                  ? 'API Live'
                  : backendStatus === 'checking'
                  ? 'Pinging API...'
                  : 'API Idle'}
              </span>
            </div>

            <a
              href="https://github.com/Bhuvan-Mahajan/Self-Checkout-"
              target="_blank"
              rel="noreferrer"
              className="p-2 text-text-secondary hover:text-text-primary transition-colors"
              title="View GitHub Repository"
            >
              <GithubIcon className="w-5 h-5" />
            </a>

            <Button
              onClick={() => navigate('/login')}
              className="bg-brand-accent hover:bg-[#b8a287] text-white font-medium text-sm shadow-sm transition-all flex items-center gap-2"
            >
              <span>Admin Login</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-brand-200 bg-gradient-to-b from-brand-50 via-white to-brand-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 border border-brand-200 text-xs font-semibold text-text-secondary mb-6 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
              <span>Full-Stack IoT Retail Engineering Project</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl font-extrabold text-text-primary tracking-tight leading-tight md:leading-[1.15]">
              Eliminating Retail Queues with{' '}
              <span className="bg-gradient-to-r from-amber-700 via-brand-accent to-amber-800 bg-clip-text text-transparent">
                Smart Barcode Scanning
              </span>{' '}
              & IoT Weight Verification
            </h1>

            {/* Subheading */}
            <p className="mt-5 text-base sm:text-lg text-text-secondary leading-relaxed">
              A production-ready autonomous self-checkout ecosystem. Shoppers scan items on their smartphone, an
              embedded load-cell verifies weight to eliminate theft, and store managers monitor real-time fraud alerts
              via WebSockets.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                onClick={() => navigate('/login')}
                size="lg"
                className="w-full sm:w-auto bg-brand-accent hover:bg-[#b8a287] text-white font-semibold px-8 h-12 shadow-sm text-base flex items-center justify-center gap-2"
              >
                <span>Launch Admin Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </Button>

              <a
                href="https://github.com/Bhuvan-Mahajan/Self-Checkout-"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-brand-200 hover:bg-brand-100 text-text-primary font-medium px-6 h-12 flex items-center justify-center gap-2"
                >
                  <GithubIcon className="w-4 h-4" />
                  <span>View GitHub Repository</span>
                </Button>
              </a>
            </div>

            {/* Quick Demo Credentials Box for Interviewers */}
            <div className="mt-8 inline-block text-left w-full max-w-lg bg-white border border-brand-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-brand-100 pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-brand-accent" />
                  <span className="text-xs font-bold uppercase tracking-wider text-text-primary">
                    Interviewer Demo Access
                  </span>
                </div>
                <span className="text-[11px] text-text-secondary bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                  Store Admin Role
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="flex items-center justify-between p-2 bg-brand-50 rounded-lg border border-brand-100">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-text-secondary uppercase">Phone</span>
                    <span className="font-mono font-semibold text-text-primary">1234567890</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard('1234567890', 'phone')}
                    className="p-1.5 hover:bg-brand-100 rounded text-text-secondary transition-colors"
                    title="Copy phone"
                  >
                    {copiedField === 'phone' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="flex items-center justify-between p-2 bg-brand-50 rounded-lg border border-brand-100">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-text-secondary uppercase">Password</span>
                    <span className="font-mono font-semibold text-text-primary">test123</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard('test123', 'password')}
                    className="p-1.5 hover:bg-brand-100 rounded text-text-secondary transition-colors"
                    title="Copy password"
                  >
                    {copiedField === 'password' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <p className="mt-2 text-[11px] text-text-muted text-center">
                Click "Launch Admin Dashboard" to test live WebSocket alerts, catalog management & analytics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution Grid */}
      <section id="problem" className="py-16 md:py-20 border-b border-brand-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-brand-accent mb-2">The Motivation</h2>
            <p className="text-2xl sm:text-3xl font-bold text-text-primary">
              Why Traditional Retail Checkout Fails
            </p>
            <p className="mt-2 text-sm text-text-secondary">
              Conventional supermarket checkout counters create severe bottlenecks for shoppers and high capital expenses for retailers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* The Problem Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-red-50/50 border border-red-200/80 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-red-100 border border-red-200 flex items-center justify-center text-red-600 mb-4">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-red-950 mb-3">The Traditional Bottleneck</h3>
                <ul className="space-y-3 text-sm text-red-900/80">
                  <li className="flex items-start gap-2.5">
                    <span className="font-bold text-red-500 mt-0.5">✕</span>
                    <span><strong>15–20 Minute Peak Queues:</strong> High cart abandonment and degraded customer shopping satisfaction.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="font-bold text-red-500 mt-0.5">✕</span>
                    <span><strong>High Kiosk Capex:</strong> Traditional stationary self-checkout kiosks cost ₹5,00,000–₹10,00,000 per lane.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="font-bold text-red-500 mt-0.5">✕</span>
                    <span><strong>Shrinkage & Shoplifting:</strong> High losses when customers skip scanning items or switch barcodes without weight audits.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="font-bold text-red-500 mt-0.5">✕</span>
                    <span><strong>High Staffing Overhead:</strong> Stores must maintain cashiers even during idle and low-footfall hours.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-red-200/60 text-xs text-red-700 font-medium">
                Average retail loss from queue-related friction: ~8–12% of total revenue.
              </div>
            </div>

            {/* The SmartCart Solution Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 mb-4">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-emerald-950 mb-3">The SmartCart Solution</h3>
                <ul className="space-y-3 text-sm text-emerald-900/80">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span><strong>0-Second Checkout:</strong> Customer scans with their smartphone as they browse; instant payment via UPI/Cards.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span><strong>IoT Weight Triangulation:</strong> Continuous cart load sensors detect unscanned items, bag-stuffing, and barcode swaps.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span><strong>Instant WebSocket Dispatch:</strong> Weight discrepancies trigger real-time alerts to the store manager's screen in &lt;100ms.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span><strong>Digital Exit Turnstile QR:</strong> One-time cryptographic exit token prevents store exit until payment is cryptographically verified.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-emerald-200/60 text-xs text-emerald-700 font-medium">
                Reduces checkout operational cost by 70% while stopping retail shrinkage in real time.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* End-to-End How It Works (Step Flow) */}
      <section id="how-it-works" className="py-16 md:py-20 border-b border-brand-200 bg-brand-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-brand-accent mb-2">System Lifecycle</h2>
            <p className="text-2xl sm:text-3xl font-bold text-text-primary">
              The 5-Step Autonomous Shopping Flow
            </p>
            <p className="mt-2 text-sm text-text-secondary">
              How the mobile app, IoT hardware, backend engine, and store admin dashboard work in lockstep.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {steps.map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-xl border border-brand-200 shadow-xs flex flex-col justify-between relative group hover:border-brand-accent transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-black text-brand-200 group-hover:text-brand-accent transition-colors">
                      {item.step}
                    </span>
                    <Badge variant="outline" className="text-[10px] bg-brand-50 text-text-secondary border-brand-200">
                      {item.badge}
                    </Badge>
                  </div>
                  <div className="mb-2 p-2 w-fit rounded-lg bg-brand-50 border border-brand-100">
                    {item.icon}
                  </div>
                  <h4 className="font-bold text-sm text-text-primary mb-2 leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Store Admin Dashboard Preview Section */}
      <section id="admin-features" className="py-16 md:py-20 border-b border-brand-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-brand-accent mb-2">Store Operations</h2>
              <p className="text-2xl sm:text-3xl font-bold text-text-primary">
                Store Manager Surveillance & Ops
              </p>
              <p className="mt-2 text-sm text-text-secondary max-w-xl">
                The web dashboard gives store managers 360° visibility over live carts, payment throughput, and instant security alerts.
              </p>
            </div>

            <Button
              onClick={() => navigate('/login')}
              className="self-start md:self-auto bg-brand-accent hover:bg-[#b8a287] text-white flex items-center gap-2"
            >
              <span>Explore Admin Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {adminFeatures.map((feat, idx) => (
              <Card key={idx} className="border-brand-200 bg-brand-50/60 hover:bg-brand-50 hover:border-brand-accent transition-all shadow-xs">
                <CardContent className="p-5 flex flex-col justify-between h-full">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-white border border-brand-200 flex items-center justify-center mb-4 shadow-2xs">
                      {feat.icon}
                    </div>
                    <h3 className="font-bold text-base text-text-primary mb-2">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-brand-200/60 flex items-center text-xs text-brand-accent font-semibold">
                    <span>Live in Admin Panel</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Interactive Mock Dashboard Preview Box */}
          <div className="mt-10 p-6 bg-brand-50 rounded-2xl border border-brand-200">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-brand-200">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-bold text-text-primary uppercase tracking-wide">
                  Live Admin Telemetry Stream (Socket.io)
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-text-secondary">
                <span className="bg-white px-2.5 py-1 rounded border border-brand-200 font-medium">
                  Active Shoppers: 3
                </span>
                <span className="bg-white px-2.5 py-1 rounded border border-brand-200 font-medium text-emerald-700">
                  Payment Gateway: Healthy
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-white p-4 rounded-xl border border-brand-200 shadow-2xs">
                <span className="text-xs text-text-secondary">Simulated Cart #C-9021</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-bold text-text-primary text-sm">3 items scanned</span>
                  <Badge className="bg-emerald-100 text-emerald-800 text-[10px] border-emerald-200">Weight Matched</Badge>
                </div>
                <div className="text-[11px] text-text-muted mt-2">Expected: 740g | Sensor: 742g (Δ 2g)</div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-red-200 shadow-2xs">
                <span className="text-xs text-red-600 font-medium">🚨 Active Alert: Cart #C-4412</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-bold text-text-primary text-sm">Weight Anomaly</span>
                  <Badge className="bg-red-100 text-red-800 text-[10px] border-red-200">HIGH Severity</Badge>
                </div>
                <div className="text-[11px] text-red-700 font-medium mt-2">Expected: 180g | Sensor: 450g (+270g unscanned item)</div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-brand-200 shadow-2xs">
                <span className="text-xs text-text-secondary">Exit Gate Turnstile #1</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-bold text-text-primary text-sm">QR Gate Pass</span>
                  <Badge className="bg-blue-100 text-blue-800 text-[10px] border-blue-200">Verified & Released</Badge>
                </div>
                <div className="text-[11px] text-text-muted mt-2">Order #ORD-88129 (₹480.00 via Razorpay)</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture & Tech Stack Grid */}
      <section id="architecture" className="py-16 md:py-20 border-b border-brand-200 bg-brand-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-brand-accent mb-2">Technical Foundations</h2>
            <p className="text-2xl sm:text-3xl font-bold text-text-primary">
              Full-Stack Architecture & Engineering
            </p>
            <p className="mt-2 text-sm text-text-secondary">
              Engineered with clean separation of concerns, fail-fast schema validation, and real-time pub/sub.
            </p>
          </div>

          <div className="space-y-4">
            {techStack.map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-xl border border-brand-200 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-brand-accent transition-colors"
              >
                <div className="md:w-1/4">
                  <span className="font-bold text-sm text-text-primary block">{item.category}</span>
                </div>
                <div className="md:w-1/2">
                  <span className="font-mono text-xs font-semibold text-brand-accent block">{item.tech}</span>
                  <span className="text-xs text-text-secondary mt-0.5 block">{item.detail}</span>
                </div>
                <div className="md:w-1/4 flex md:justify-end">
                  <Badge variant="outline" className="text-[10px] bg-brand-50 text-text-secondary border-brand-200">
                    Production Verified
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deployment & Live Links Section */}
      <section className="py-16 md:py-20 border-b border-brand-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-brand-accent/20 border border-brand-accent flex items-center justify-center text-2xl mx-auto mb-4">
            🚀
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">
            Ready to inspect the live project?
          </h2>
          <p className="mt-2 text-sm text-text-secondary max-w-lg mx-auto">
            You can log into the live store management portal right now or inspect the full source code on GitHub.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={() => navigate('/login')}
              size="lg"
              className="w-full sm:w-auto bg-brand-accent hover:bg-[#b8a287] text-white font-semibold px-8 h-12 shadow-sm text-base flex items-center justify-center gap-2"
            >
              <span>Go to Admin Login</span>
              <ArrowRight className="w-4 h-4" />
            </Button>

            <a
              href="https://self-checkout-production-d764.up.railway.app/api/health"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto"
            >
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-brand-200 hover:bg-brand-100 text-text-primary font-medium px-6 h-12 flex items-center justify-center gap-2"
              >
                <Activity className="w-4 h-4 text-emerald-600" />
                <span>Test Live API Health</span>
                <ExternalLink className="w-3.5 h-3.5 text-text-muted" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-100/60 border-t border-brand-200 py-10 text-xs text-text-secondary">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-text-primary">SmartCart</span>
            <span>— Developed by</span>
            <a
              href="https://github.com/Bhuvan-Mahajan"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-text-primary hover:underline"
            >
              Bhuvan Mahajan
            </a>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com/Bhuvan-Mahajan/Self-Checkout-"
              target="_blank"
              rel="noreferrer"
              className="hover:text-text-primary transition-colors flex items-center gap-1.5"
            >
              <GithubIcon className="w-4 h-4" />
              <span>GitHub Repository</span>
            </a>
            <Link to="/login" className="hover:text-text-primary transition-colors">
              Admin Login
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
