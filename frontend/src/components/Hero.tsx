import { Phone, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

const COUNTRIES = [
  { code: '+91', label: '🇮🇳 IN' },
  { code: '+1', label: '🇺🇸 US' },
  { code: '+44', label: '🇬🇧 UK' },
  { code: '+971', label: '🇦🇪 UAE' },
  { code: '+61', label: '🇦🇺 AU' },
  { code: '+81', label: '🇯🇵 JP' },
  { code: '+49', label: '🇩🇪 DE' },
  { code: '+33', label: '🇫🇷 FR' },
  { code: '+7', label: '🇷🇺 RU' },
  { code: '+86', label: '🇨🇳 CN' },
];

export function Hero() {
  const [isDemoActive, setIsDemoActive] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  // Auto-detect country code
  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        if (data.country_calling_code) {
          setCountryCode(data.country_calling_code);
        }
      })
      .catch(err => console.error('Failed to auto-detect country:', err));
  }, []);

  const scrollToWaitlist = () => {
    document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCall = async (overrideNumber?: string) => {
    const targetNumber = overrideNumber || `${countryCode}${phoneNumber.replace(/^\+/, '')}`;
    if (!targetNumber) return;
    
    setLoading(true);
    setStatus('Initiating demo call...');

    const backendUrl = (import.meta.env.VITE_BACKEND_URL || '').trim().replace(/\/$/, '') || 'http://localhost:3000';

    try {
      const response = await fetch(`${backendUrl}/api/call`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: targetNumber }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('You will receive a call shortly');
        setTimeout(() => {
          setIsDemoActive(false);
          setPhoneNumber('');
          setStatus('');
        }, 5000);
      } else {
        throw new Error(data.error || 'Failed to call');
      }
    } catch (e: any) {
      setStatus(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center px-4 md:px-8 py-16 md:py-24 pt-32">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid md:grid-cols-[60%_40%] gap-12 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 md:space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="uppercase tracking-widest text-sm text-[#a78bfa]"
            >
              Coming Soon — Early Access
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-[#1a1f3a] text-4xl md:text-6xl lg:text-7xl leading-tight"
            >
              What if your AI called you first? Meet Caller.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-[#2d3748] text-lg md:text-xl leading-relaxed max-w-2xl"
            >
              Loneliness, stress, big decisions—they don&apos;t wait for you to open an app.
              Caller is the voice companion and advisor that reaches out, checks in, and
              remembers what matters. Because real relationships are proactive.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col md:flex-row gap-4 items-start md:items-center flex-wrap"
            >
              {!isDemoActive ? (
                <>
                  <motion.button
                    onClick={() => setIsDemoActive(true)}
                    whileHover={{ y: -2, boxShadow: '0 20px 40px rgba(167, 139, 250, 0.3)' }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-[#1a1f3a] text-white px-8 py-4 rounded-2xl flex items-center gap-3 text-lg shadow-lg hover:shadow-xl transition-shadow"
                  >
                    Try Demo
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>

                  <motion.button
                    onClick={() => handleCall('+916306987592')}
                    disabled={loading}
                    whileHover={{ y: -2, boxShadow: '0 20px 40px rgba(167, 139, 250, 0.3)' }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-[#a78bfa] text-white px-8 py-4 rounded-2xl flex items-center gap-3 text-lg shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Phone className="w-5 h-5" />}
                    Test Call (+916306987592)
                  </motion.button>

                  <motion.button
                    onClick={scrollToWaitlist}
                    whileHover={{ y: -2, boxShadow: '0 20px 40px rgba(255, 107, 107, 0.3)' }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-[#ff6b6b] text-white px-8 py-4 rounded-2xl flex items-center gap-3 text-lg shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <Phone className="w-5 h-5" />
                    Join the Waitlist
                  </motion.button>
                </>
              ) : (
                <div className="flex flex-col gap-4 w-full max-w-md">
                  <div className="flex flex-col md:flex-row gap-3">
                    <div className="flex-1 flex gap-0 border-2 border-[#1a1f3a]/10 rounded-2xl overflow-hidden focus-within:border-[#a78bfa] focus-within:ring-4 focus-within:ring-[#a78bfa]/10 transition-all bg-white shadow-sm">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="px-3 py-4 bg-gray-50/50 border-r border-[#1a1f3a]/10 outline-none cursor-pointer hover:bg-gray-100/50 transition-colors appearance-none min-w-[90px] text-[#1a1f3a] font-medium"
                      >
                        {COUNTRIES.map(c => (
                          <option key={c.code} value={c.code}>{c.label} {c.code}</option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        placeholder="9876543210"
                        className="flex-1 px-4 py-4 outline-none bg-transparent text-[#1a1f3a] placeholder:text-gray-400 font-medium"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    </div>
                    <motion.button
                      onClick={handleCall}
                      disabled={loading}
                      whileHover={{ y: -2, boxShadow: '0 10px 20px rgba(26, 31, 58, 0.2)' }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-[#1a1f3a] text-white px-8 py-4 rounded-2xl flex items-center justify-center gap-2 font-semibold disabled:opacity-50 min-w-[140px] transition-all"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                        <>
                          Call Me
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </motion.button>
                  </div>
                  <div className="flex items-center justify-between px-2">
                    {status ? (
                      <motion.p
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-sm font-medium text-[#a78bfa] flex items-center gap-2"
                      >
                        <span className="w-2 h-2 rounded-full bg-[#a78bfa] animate-pulse" />
                        {status}
                      </motion.p>
                    ) : <div />}
                    <button
                      onClick={() => setIsDemoActive(false)}
                      className="text-sm text-gray-500 hover:text-[#1a1f3a] font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              <span>|</span>
              <span className="flex items-center gap-1">✓ Early access perks</span>
              <span>|</span>
              <span className="flex items-center gap-1">✓ Be among the first</span>
            </motion.div>
          </motion.div>

          {/* Right Column - Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <motion.div
                animate={{
                  boxShadow: [
                    '0 0 40px rgba(167, 139, 250, 0.3)',
                    '0 0 60px rgba(255, 107, 107, 0.4)',
                    '0 0 40px rgba(167, 139, 250, 0.3)',
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="bg-gradient-to-br from-[#1a1f3a] via-[#2d3748] to-[#1a1f3a] p-8 md:p-12 rounded-3xl"
              >
                <div className="space-y-6">
                  {/* Phone mockup with incoming call */}
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 space-y-4">
                    <div className="text-white/60 text-sm">Incoming call...</div>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#ff6b6b] to-[#a78bfa] flex items-center justify-center">
                        <Phone className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <div className="text-white">Your Wellness Coach</div>
                        <div className="text-white/60 text-sm">Caller AI</div>
                      </div>
                    </div>

                    {/* Voice wave animation */}
                    <div className="flex items-center justify-center gap-1 h-16">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{
                            height: ['20px', '40px', '60px', '40px', '20px'],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: i * 0.1,
                          }}
                          className="w-2 bg-gradient-to-t from-[#ff6b6b] to-[#a78bfa] rounded-full"
                        />
                      ))}
                    </div>

                    <div className="text-white/80 text-center text-sm">
                      &ldquo;How are you feeling today?&rdquo;
                    </div>
                  </div>

                  {/* Context bubbles */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-white/70 text-sm"
                  >
                    Remembers your last conversation about work stress...
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-white/70 text-sm ml-auto max-w-[80%]"
                  >
                    Checks in proactively every Tuesday at 3pm
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section >
  );
}