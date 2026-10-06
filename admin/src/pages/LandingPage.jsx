import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Shield, Zap, BarChart3, Smartphone, Lock, ExternalLink, CheckCircle } from 'lucide-react';

const Github = ({ size = 18, color = 'currentColor', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const COLORS = {
  bg: '#F9F8F6',
  card: '#EFE9E3',
  border: '#D9CFC7',
  accent: '#C9B59C',
  accentDark: '#A8957E',
  text: '#2D2D2D',
  textSecondary: '#6B6560',
  textMuted: '#A8A09A',
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: 'easeOut' },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

const features = [
  { icon: ShoppingCart, title: 'Scan-as-You-Go', desc: 'Customers scan products with their phone while shopping — no cashier needed.' },
  { icon: Shield, title: 'Fraud Detection', desc: 'BLE weight sensors cross-check cart weight in real-time, flagging mismatches within ±10g tolerance.' },
  { icon: Zap, title: 'Instant Checkout', desc: 'Razorpay-powered payment in under 10 seconds. No queues, no waiting.' },
  { icon: BarChart3, title: 'Admin Analytics', desc: 'Live dashboard with revenue charts, fraud alerts, and order management.' },
  { icon: Smartphone, title: 'React Native App', desc: 'Cross-platform mobile app built with Expo — works on iOS, Android, and browser.' },
  { icon: Lock, title: 'Secure by Design', desc: 'JWT refresh rotation, httpOnly cookies, bcrypt hashing, HMAC webhook verification.' },
];

const techStack = [
  { label: 'Backend', items: ['Node.js', 'Express', 'MongoDB', 'Socket.io'] },
  { label: 'Mobile', items: ['React Native', 'Expo', 'Zustand', 'expo-camera'] },
  { label: 'Admin', items: ['React', 'Vite', 'Tailwind CSS', 'Recharts'] },
  { label: 'DevOps', items: ['Docker', 'GitHub Actions', 'Railway', 'Vercel'] },
  { label: 'Payments', items: ['Razorpay', 'Webhooks', 'Idempotency'] },
  { label: 'Security', items: ['JWT', 'bcrypt', 'HMAC', 'Role-based Access'] },
];

const FloatingOrb = ({ style }) => (
  <motion.div
    style={style}
    animate={{ y: [0, -20, 0], scale: [1, 1.05, 1] }}
    transition={{ duration: 5 + Math.random() * 3, repeat: Infinity, ease: 'easeInOut' }}
    className="absolute rounded-full blur-3xl opacity-40 pointer-events-none"
  />
);

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ background: COLORS.bg, color: COLORS.text, minHeight: '100vh', fontFamily: 'Inter, sans-serif', overflowX: 'hidden' }}>
      
      {/* Floating background orbs */}
      <FloatingOrb style={{ width: 400, height: 400, background: COLORS.accent, top: -100, right: -100 }} />
      <FloatingOrb style={{ width: 300, height: 300, background: COLORS.border, bottom: 200, left: -80 }} />
      <FloatingOrb style={{ width: 200, height: 200, background: COLORS.card, top: '40%', right: '10%' }} />

      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ borderBottom: `1px solid ${COLORS.border}`, background: `${COLORS.bg}dd`, backdropFilter: 'blur(12px)' }}
        className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 15 }}
            style={{ background: COLORS.accent, padding: 8, borderRadius: 12 }}
          >
            <ShoppingCart size={22} color="#fff" />
          </motion.div>
          <span style={{ fontWeight: 700, fontSize: 20, color: COLORS.text }}>SmartCart</span>
        </div>
        <div className="flex items-center gap-3">
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="https://github.com/bhuvanpm10/self-checkout"
            target="_blank"
            rel="noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: 6, color: COLORS.textSecondary, fontSize: 14, textDecoration: 'none' }}
          >
            <Github size={16} /> GitHub
          </motion.a>
          <motion.button
            whileHover={{ scale: 1.05, background: COLORS.accentDark }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/login')}
            style={{ background: COLORS.accent, color: '#fff', border: 'none', borderRadius: 10, padding: '8px 20px', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}
          >
            Admin Login
          </motion.button>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="relative px-6 pt-24 pb-20 text-center max-w-4xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.div variants={fadeUp} custom={0}>
            <span style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, color: COLORS.accentDark, borderRadius: 100, padding: '6px 16px', fontSize: 13, fontWeight: 600, display: 'inline-block', marginBottom: 24 }}>
              🛒 Final Year Project · BMS Institute of Technology · ECE 2023–2027
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            custom={1}
            style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: 24, letterSpacing: '-0.02em' }}
          >
            Self-Checkout That
            <br />
            <span style={{ color: COLORS.accentDark }}>Actually Works.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={2}
            style={{ fontSize: 18, color: COLORS.textSecondary, maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.7 }}
          >
            SmartCart eliminates checkout queues with scan-as-you-go shopping, BLE weight-sensor fraud detection, and instant Razorpay payments — all in a full-stack, production-deployed system.
          </motion.p>

          <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-3 justify-center">
            <motion.button
              whileHover={{ scale: 1.05, background: COLORS.accentDark }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              style={{ background: COLORS.accent, color: '#fff', border: 'none', borderRadius: 12, padding: '14px 32px', fontWeight: 700, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <Lock size={18} /> View Admin Dashboard
            </motion.button>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://github.com/bhuvanpm10/self-checkout"
              target="_blank"
              rel="noreferrer"
              style={{ background: COLORS.card, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: '14px 32px', fontWeight: 600, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}
            >
              <Github size={18} /> View Source
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Animated stat cards */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="grid grid-cols-3 gap-4 mt-20 max-w-lg mx-auto"
        >
          {[
            { value: '7', label: 'DB Models' },
            { value: '20+', label: 'API Endpoints' },
            { value: '0', label: 'Queues' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              custom={i + 4}
              whileHover={{ y: -4, scale: 1.03 }}
              style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: '20px 12px', textAlign: 'center' }}
            >
              <div style={{ fontSize: 32, fontWeight: 800, color: COLORS.accentDark }}>{stat.value}</div>
              <div style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 4 }}>{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Problem → Solution */}
      <section style={{ background: COLORS.card, borderTop: `1px solid ${COLORS.border}`, borderBottom: `1px solid ${COLORS.border}` }} className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            <motion.h2 variants={fadeUp} style={{ fontSize: 32, fontWeight: 800, textAlign: 'center', marginBottom: 48 }}>
              The Problem We Solved
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                variants={fadeUp}
                style={{ background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 20, padding: 28 }}
              >
                <div style={{ fontSize: 28, marginBottom: 12 }}>😤</div>
                <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 10, color: COLORS.text }}>Before SmartCart</h3>
                {['Long billing queues at supermarkets', 'Manual scanning by cashiers is slow', 'Peak hour congestion is a nightmare', 'No way to verify cart contents fast'].map(p => (
                  <div key={p} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8 }}>
                    <span style={{ color: '#E53935', marginTop: 2 }}>✗</span>
                    <span style={{ color: COLORS.textSecondary, fontSize: 14 }}>{p}</span>
                  </div>
                ))}
              </motion.div>
              <motion.div
                variants={fadeUp}
                style={{ background: COLORS.bg, border: `1px solid ${COLORS.accent}`, borderRadius: 20, padding: 28 }}
              >
                <div style={{ fontSize: 28, marginBottom: 12 }}>✨</div>
                <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 10, color: COLORS.text }}>After SmartCart</h3>
                {['Scan products as you pick them up', 'Weight sensor auto-detects fraud', 'Pay instantly with Razorpay UPI', 'Admin monitors everything in real-time'].map(p => (
                  <div key={p} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8 }}>
                    <CheckCircle size={16} style={{ color: '#4CAF50', marginTop: 2, flexShrink: 0 }} />
                    <span style={{ color: COLORS.textSecondary, fontSize: 14 }}>{p}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          <motion.h2 variants={fadeUp} style={{ fontSize: 32, fontWeight: 800, textAlign: 'center', marginBottom: 12 }}>
            What It Does
          </motion.h2>
          <motion.p variants={fadeUp} style={{ textAlign: 'center', color: COLORS.textSecondary, marginBottom: 48, fontSize: 16 }}>
            A complete, production-ready retail automation system
          </motion.p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -6, scale: 1.02 }}
                style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 20, padding: 24, cursor: 'default' }}
              >
                <div style={{ background: COLORS.accent, borderRadius: 12, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <f.icon size={22} color="#fff" />
                </div>
                <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ color: COLORS.textSecondary, fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Tech Stack */}
      <section style={{ background: COLORS.card, borderTop: `1px solid ${COLORS.border}`, borderBottom: `1px solid ${COLORS.border}` }} className="px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            <motion.h2 variants={fadeUp} style={{ fontSize: 32, fontWeight: 800, textAlign: 'center', marginBottom: 48 }}>
              Tech Stack
            </motion.h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {techStack.map((category, i) => (
                <motion.div
                  key={category.label}
                  variants={fadeUp}
                  custom={i}
                  whileHover={{ y: -4 }}
                  style={{ background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 20 }}
                >
                  <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.accentDark, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
                    {category.label}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {category.items.map(item => (
                      <span
                        key={item}
                        style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: '4px 10px', fontSize: 13, color: COLORS.text, fontWeight: 500 }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 text-center max-w-2xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          <motion.h2 variants={fadeUp} style={{ fontSize: 36, fontWeight: 800, marginBottom: 16 }}>
            See It Live
          </motion.h2>
          <motion.p variants={fadeUp} style={{ color: COLORS.textSecondary, fontSize: 16, marginBottom: 36, lineHeight: 1.7 }}>
            The admin dashboard is live and fully functional. Login with the demo credentials to explore fraud alerts, analytics, and order management.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05, background: COLORS.accentDark }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              style={{ background: COLORS.accent, color: '#fff', border: 'none', borderRadius: 12, padding: '14px 36px', fontWeight: 700, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <ExternalLink size={18} /> Open Admin Dashboard
            </motion.button>
          </motion.div>
          <motion.p variants={fadeUp} style={{ color: COLORS.textMuted, fontSize: 13, marginTop: 16 }}>
            Demo: admin@smartcart.com · password: Admin@123
          </motion.p>
        </motion.div>
      </section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        style={{ borderTop: `1px solid ${COLORS.border}`, padding: '24px 24px', textAlign: 'center', color: COLORS.textMuted, fontSize: 13 }}
      >
        Built by <strong style={{ color: COLORS.text }}>Bhuvan P M</strong> · BMS Institute of Technology · ECE 2023–2027
        <br />
        <span style={{ fontSize: 12, marginTop: 4, display: 'block' }}>SmartCart · Full-Stack Self-Checkout System</span>
      </motion.footer>
    </div>
  );
}
