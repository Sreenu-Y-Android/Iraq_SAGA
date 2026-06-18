import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Shield, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { BSK_HERO, LOCAL_FALLBACK } from '../config/bskMedia';

/* ──────────────────────────────────────────────────────────────────────────
   Inline SVG: BJP Lotus mark (party symbol). Pure SVG so it scales crisply
   and can be tinted via fill.
   ────────────────────────────────────────────────────────────────────────── */
const LotusSVG = ({ className = '', style = {}, primary = '#FF6F00', secondary = '#FFB300', stem = '#138808' }) => (
  <svg
    viewBox="0 0 200 200"
    className={className}
    style={style}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="petalGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={secondary} stopOpacity="1" />
        <stop offset="60%" stopColor={primary} stopOpacity="1" />
        <stop offset="100%" stopColor="#C2410C" stopOpacity="1" />
      </linearGradient>
      <linearGradient id="petalGradientInner" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFD27F" stopOpacity="1" />
        <stop offset="100%" stopColor={primary} stopOpacity="1" />
      </linearGradient>
    </defs>
    {/* outer petals */}
    <g transform="translate(100 110)">
      {[-60, -30, 0, 30, 60].map((deg) => (
        <path
          key={`o-${deg}`}
          d="M0 0 C -22 -45 -10 -85 0 -95 C 10 -85 22 -45 0 0 Z"
          fill="url(#petalGradient)"
          stroke="#7C2D12"
          strokeWidth="1.2"
          transform={`rotate(${deg})`}
        />
      ))}
      {/* inner petals */}
      {[-40, -15, 10, 35].map((deg, i) => (
        <path
          key={`i-${deg}`}
          d="M0 0 C -14 -32 -6 -62 0 -70 C 6 -62 14 -32 0 0 Z"
          fill="url(#petalGradientInner)"
          stroke="#9A3412"
          strokeWidth="1"
          transform={`rotate(${deg - 12})`}
        />
      ))}
      {/* center */}
      <circle cx="0" cy="-12" r="9" fill={secondary} stroke="#7C2D12" strokeWidth="1.2" />
      <circle cx="0" cy="-12" r="4" fill="#FFFFFF" opacity="0.75" />
    </g>
    {/* stem & leaves */}
    <path d="M100 115 Q 98 145 92 170" stroke={stem} strokeWidth="3.5" fill="none" strokeLinecap="round" />
    <path d="M92 170 Q 70 160 60 145 Q 78 150 92 170 Z" fill={stem} opacity="0.85" />
    <path d="M92 170 Q 118 160 132 148 Q 112 152 92 170 Z" fill={stem} opacity="0.85" />
  </svg>
);

/* ──────────────────────────────────────────────────────────────────────────
   BJP Tri-colour decorative ribbon
   ────────────────────────────────────────────────────────────────────────── */
const TriColourRibbon = () => (
  <div className="bjp-flag-wave inline-flex h-1.5 w-44 overflow-hidden rounded-full shadow-md">
    <div className="flex-1 bg-[#FF9933]" />
    <div className="flex-1 bg-white flex items-center justify-center">
      <div className="h-1 w-1 rounded-full bg-[#063e8a]" />
    </div>
    <div className="flex-1 bg-[#138808]" />
  </div>
);

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userData = await login(email, password);
      if (userData?.role === 'dial100') {
        navigate('/dial-100-incident-reporting');
      } else {
        navigate('/telangana-map'); // Telangana map landing
      }
    } catch (err) {
      // toast handled inside AuthContext
    } finally {
      setLoading(false);
    }
  };

  /* Pre-computed lotus / particle layouts so SSR & rerenders stay stable */
  const lotuses = useMemo(
    () =>
      Array.from({ length: 9 }).map((_, i) => ({
        id: i,
        left: `${(i * 11 + 4) % 100}%`,
        size: 36 + ((i * 13) % 56),
        delay: `${(i * 1.7) % 16}s`,
        duration: `${16 + ((i * 3) % 10)}s`,
        drift: `${((i % 2 === 0 ? 1 : -1) * (20 + (i * 7) % 60))}px`,
        opacity: 0.18 + ((i * 7) % 30) / 100,
      })),
    []
  );

  const particles = useMemo(
    () =>
      Array.from({ length: 28 }).map((_, i) => ({
        id: i,
        left: `${(i * 7 + 2) % 100}%`,
        size: 3 + ((i * 5) % 6),
        delay: `${(i * 0.6) % 10}s`,
        duration: `${7 + ((i * 2) % 8)}s`,
        drift: `${((i % 2 === 0 ? 1 : -1) * (10 + (i * 5) % 40))}px`,
        colour: i % 3 === 0 ? '#FFB300' : i % 3 === 1 ? '#FF9933' : '#FFFFFF',
      })),
    []
  );

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden flex items-center justify-center p-4 sm:p-6"
      style={{
        background:
          'radial-gradient(circle at 15% 20%, #FFB300 0%, transparent 35%),' +
          'radial-gradient(circle at 85% 80%, #C2410C 0%, transparent 40%),' +
          'linear-gradient(135deg, #7C2D12 0%, #C2410C 35%, #FF6F00 65%, #FF9933 100%)',
      }}
    >
      {/* ─── decorative rotating petal rings (very soft) ─────────────── */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-[520px] h-[520px] opacity-10 bjp-petal-spin-slow">
        <LotusSVG className="w-full h-full" primary="#FFFFFF" secondary="#FFE7B3" stem="#FFFFFF" />
      </div>
      <div className="pointer-events-none absolute -bottom-48 -right-48 w-[620px] h-[620px] opacity-[0.07] bjp-petal-spin-reverse">
        <LotusSVG className="w-full h-full" primary="#FFFFFF" secondary="#FFE7B3" stem="#FFFFFF" />
      </div>

      {/* ─── rising saffron particles ─────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {particles.map((p) => (
          <span
            key={p.id}
            className="bjp-particle absolute rounded-full"
            style={{
              left: p.left,
              bottom: '-10px',
              width: p.size,
              height: p.size,
              background: p.colour,
              boxShadow: `0 0 ${p.size * 2}px ${p.colour}`,
              '--particle-duration': p.duration,
              '--particle-delay': p.delay,
              '--particle-drift': p.drift,
              opacity: 0.55,
            }}
          />
        ))}
      </div>

      {/* ─── floating lotus flowers ──────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {lotuses.map((l) => (
          <div
            key={l.id}
            className="bjp-lotus-float absolute"
            style={{
              left: l.left,
              bottom: '-100px',
              width: l.size,
              height: l.size,
              '--lotus-duration': l.duration,
              '--lotus-delay': l.delay,
              '--lotus-drift': l.drift,
              '--lotus-opacity': l.opacity,
              '--lotus-scale': 1,
              filter: 'drop-shadow(0 6px 18px rgba(0,0,0,0.35))',
            }}
          >
            <LotusSVG className="w-full h-full" />
          </div>
        ))}
      </div>

      {/* ─── diagonal pinstripe overlay for depth ────────────────────── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, transparent 0, transparent 30px, rgba(255,255,255,0.5) 30px, rgba(255,255,255,0.5) 31px)',
        }}
      />

      {/* ─── two-column split: left portrait, right login ─────────────── */}
      <div className="relative z-10 w-full max-w-6xl">
        <div className="relative">
          {/* outer saffron glow */}
          <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-br from-amber-200 via-orange-400 to-orange-700 opacity-80 blur-[2px]" aria-hidden="true" />

          <div className="relative grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden bg-white/95 backdrop-blur-xl border border-white/40 shadow-[0_25px_60px_-15px_rgba(124,45,18,0.55)]">

            {/* ───────── LEFT: BSK portrait panel ───────── */}
            <div
              className="relative hidden lg:flex flex-col justify-between p-10 text-white overflow-hidden min-h-[640px]"
              style={{
                background:
                  'radial-gradient(circle at 20% 20%, rgba(255,179,0,0.55) 0%, transparent 45%),' +
                  'radial-gradient(circle at 80% 80%, rgba(194,65,12,0.6) 0%, transparent 50%),' +
                  'linear-gradient(135deg, #7C2D12 0%, #C2410C 45%, #FF6F00 100%)',
              }}
            >
              {/* decorative rotating lotus */}
              <div className="pointer-events-none absolute -top-20 -right-20 w-[360px] h-[360px] opacity-15 bjp-petal-spin-slow">
                <LotusSVG className="w-full h-full" primary="#FFFFFF" secondary="#FFE7B3" stem="#FFFFFF" />
              </div>
              <div className="pointer-events-none absolute -bottom-24 -left-16 w-[300px] h-[300px] opacity-10 bjp-petal-spin-reverse">
                <LotusSVG className="w-full h-full" primary="#FFFFFF" secondary="#FFE7B3" stem="#FFFFFF" />
              </div>

              {/* top: ribbon + party mark */}
              <div className="relative z-10 flex items-center gap-3">
                <TriColourRibbon />
                <span className="text-[10px] font-bold tracking-[0.32em] uppercase text-amber-100/90">
                  BJP · Telangana
                </span>
              </div>

              {/* centre: large BSK portrait */}
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="relative w-56 h-56 xl:w-64 xl:h-64 mb-6">
                  <div className="absolute inset-0 bjp-lotus-bloom">
                    <LotusSVG className="w-full h-full" />
                  </div>
                  <div className="absolute inset-4 rounded-full overflow-hidden bjp-saffron-glow border-[4px] border-white/95 shadow-2xl">
                    <img
                      src={BSK_HERO.src}
                      alt={BSK_HERO.alt}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        if (e.currentTarget.dataset.fallbackUsed) {
                          e.currentTarget.style.display = 'none';
                          return;
                        }
                        e.currentTarget.dataset.fallbackUsed = '1';
                        e.currentTarget.src = LOCAL_FALLBACK;
                      }}
                    />
                  </div>
                </div>

                <h1
                  className="text-4xl xl:text-5xl font-heading font-extrabold tracking-wider uppercase bg-clip-text text-transparent bjp-gradient-shimmer"
                  style={{
                    backgroundImage:
                      'linear-gradient(90deg, #FFFFFF 0%, #FFE7B3 25%, #FFFFFF 50%, #FFE7B3 75%, #FFFFFF 100%)',
                  }}
                >
                  BSK Watch
                </h1>
                <p className="mt-2 text-base text-white/95 font-semibold tracking-[0.18em] uppercase">
                  Shri Bandi Sanjay Kumar
                </p>
                <p className="mt-1 text-[11px] text-amber-100/90 font-medium tracking-[0.32em] uppercase">
                  Member of Parliament · Karimnagar
                </p>
                <div className="mx-auto mt-4 h-[2px] w-32 origin-center bg-gradient-to-r from-transparent via-amber-200 to-transparent bjp-underline-pulse" />
                <p className="mt-4 text-sm text-white/85 max-w-sm leading-relaxed">
                  Real-time social media intelligence for BJP Telangana — mentions, sentiment, alerts &amp; grievances of the people of Karimnagar.
                </p>
              </div>

              {/* bottom: footer tagline */}
              <div className="relative z-10 flex items-center justify-center gap-2 text-[10px] text-amber-100/90 font-semibold tracking-wider uppercase">
                <span>Bharatiya Janata Party</span>
                <span className="h-1 w-1 rounded-full bg-amber-200/80" />
                <span>Karimnagar Lok Sabha</span>
              </div>
            </div>

            {/* ───────── RIGHT: login form panel ───────── */}
            <div className="relative p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
              {/* compact mobile-only hero (left panel is hidden on mobile) */}
              <div className="lg:hidden text-center mb-6">
                <div className="relative mx-auto mb-4 w-24 h-24">
                  <div className="absolute inset-0 bjp-lotus-bloom">
                    <LotusSVG className="w-full h-full" />
                  </div>
                  <div className="absolute inset-2 rounded-full overflow-hidden bjp-saffron-glow border-[3px] border-white/95">
                    <img
                      src={BSK_HERO.src}
                      alt={BSK_HERO.alt}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        if (e.currentTarget.dataset.fallbackUsed) {
                          e.currentTarget.style.display = 'none';
                          return;
                        }
                        e.currentTarget.dataset.fallbackUsed = '1';
                        e.currentTarget.src = LOCAL_FALLBACK;
                      }}
                    />
                  </div>
                </div>
                <h1 className="text-2xl font-heading font-extrabold tracking-wider uppercase text-orange-900">
                  BSK Watch
                </h1>
                <p className="text-[11px] text-orange-700/80 font-medium tracking-[0.32em] uppercase mt-0.5">
                  Shri Bandi Sanjay Kumar
                </p>
              </div>

              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-orange-100">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-amber-300 to-orange-500 blur-sm opacity-70" />
                  <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-orange-500 to-orange-700 shadow-lg">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-heading font-bold text-orange-900">
                    Secure Command Access
                  </h2>
                  <p className="text-[11px] text-orange-700/80 font-medium tracking-wide">
                    BJP Telangana · Authorised personnel only
                  </p>
                </div>
                <Sparkles className="ml-auto h-4 w-4 text-amber-500 animate-pulse" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-5" data-testid="login-form">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-orange-900">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-orange-500/70 pointer-events-none" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@bskwatch.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      data-testid="email-input"
                      className="h-12 pl-10 border-2 border-orange-200 bg-orange-50/30 focus:border-orange-500 focus:ring-orange-500/20 text-base rounded-lg"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-orange-900">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-orange-500/70 pointer-events-none" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      data-testid="password-input"
                      className="h-12 pl-10 border-2 border-orange-200 bg-orange-50/30 focus:border-orange-500 focus:ring-orange-500/20 text-base rounded-lg"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  data-testid="login-submit-btn"
                  className="group relative w-full h-12 overflow-hidden text-base font-extrabold uppercase tracking-wider text-white border-0 rounded-lg shadow-lg shadow-orange-600/40 transition-all duration-200 hover:shadow-xl hover:shadow-orange-600/50 active:scale-[0.985] disabled:opacity-75"
                  style={{
                    background:
                      'linear-gradient(90deg, #C2410C 0%, #FF6F00 35%, #FF9933 65%, #FFB300 100%)',
                    backgroundSize: '200% 100%',
                    animation: 'bjpGradientShimmer 4s linear infinite',
                  }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Authenticating…
                      </>
                    ) : (
                      <>
                        <Shield className="h-4 w-4" />
                        Enter Command Centre
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </span>
                </Button>
              </form>

              {/* Three quick reassurance pills */}
              <div className="mt-5 grid grid-cols-3 gap-2 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wide">
                <div className="flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md bg-orange-50 text-orange-700 border border-orange-100">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Encrypted
                </div>
                <div className="flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md bg-amber-50 text-amber-800 border border-amber-100">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                  24×7 Watch
                </div>
                <div className="flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md bg-rose-50 text-rose-700 border border-rose-100">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                  Audit-Logged
                </div>
              </div>

              <p className="mt-6 text-center text-[10px] text-orange-700/60">
                © {new Date().getFullYear()} BSK Watch · Secure intelligence platform
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
