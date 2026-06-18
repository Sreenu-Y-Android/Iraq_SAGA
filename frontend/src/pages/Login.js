import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Shield, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { BSK_HERO, LOCAL_FALLBACK } from '../config/bskMedia';

/* ──────────────────────────────────────────────────────────────────────────
   Inline SVG: Crescent & Star — Iraq / Islamic symbol.
   ────────────────────────────────────────────────────────────────────────── */
const CrescentStarSVG = ({ className = '', style = {}, color = '#FFFFFF' }) => (
  <svg
    viewBox="0 0 200 200"
    className={className}
    style={style}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Crescent */}
    <circle cx="90" cy="100" r="68" fill={color} opacity="0.9" />
    <circle cx="115" cy="85" r="58" fill="#CE1126" />
    {/* Star */}
    <polygon
      points="155,55 160,72 178,72 164,82 169,99 155,89 141,99 146,82 132,72 150,72"
      fill={color}
      opacity="0.9"
    />
  </svg>
);

/* ──────────────────────────────────────────────────────────────────────────
   Iraq flag stripe ribbon
   ────────────────────────────────────────────────────────────────────────── */
const IraqFlagRibbon = () => (
  <div className="inline-flex h-1.5 w-44 overflow-hidden rounded-full shadow-md">
    <div className="flex-1 bg-[#CE1126]" />
    <div className="flex-1 bg-white flex items-center justify-center" />
    <div className="flex-1 bg-[#000000]" />
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
        navigate('/telangana-map'); // Iraq map landing
      }
    } catch (err) {
      // toast handled inside AuthContext
    } finally {
      setLoading(false);
    }
  };

  /* Pre-computed crescent / particle layouts so SSR & rerenders stay stable */
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
        colour: i % 3 === 0 ? '#CE1126' : i % 3 === 1 ? '#FFFFFF' : '#FFD700',
      })),
    []
  );

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden flex items-center justify-center p-4 sm:p-6"
      style={{
        background:
          'radial-gradient(circle at 15% 20%, #CE1126 0%, transparent 35%),' +
          'radial-gradient(circle at 85% 80%, #8B0000 0%, transparent 40%),' +
          'linear-gradient(135deg, #0a0a0a 0%, #1a0000 35%, #CE1126 65%, #8B0000 100%)',
      }}
    >
      {/* ─── decorative rotating crescent rings (very soft) ─────────── */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-[520px] h-[520px] opacity-10 iraq-spin-slow">
        <CrescentStarSVG className="w-full h-full" color="#FFFFFF" />
      </div>
      <div className="pointer-events-none absolute -bottom-48 -right-48 w-[620px] h-[620px] opacity-[0.07] iraq-spin-reverse">
        <CrescentStarSVG className="w-full h-full" color="#FFFFFF" />
      </div>

      {/* ─── rising saffron particles ─────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {particles.map((p) => (
          <span
            key={p.id}
            className="iraq-particle absolute rounded-full"
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
            className="iraq-symbol-float absolute"

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
            <CrescentStarSVG className="w-full h-full" color="#FFFFFF" />
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
          {/* outer red glow */}
          <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-br from-red-400 via-red-700 to-black opacity-80 blur-[2px]" aria-hidden="true" />

          <div className="relative grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden bg-white/95 backdrop-blur-xl border border-white/40 shadow-[0_25px_60px_-15px_rgba(124,45,18,0.55)]">

            {/* ───────── LEFT: Iraq portrait panel ───────── */}
            <div
              className="relative hidden lg:flex flex-col justify-between p-10 text-white overflow-hidden min-h-[640px]"
              style={{
                background:
                  'radial-gradient(circle at 20% 20%, rgba(206,17,38,0.55) 0%, transparent 45%),' +
                  'radial-gradient(circle at 80% 80%, rgba(139,0,0,0.6) 0%, transparent 50%),' +
                  'linear-gradient(135deg, #0a0a0a 0%, #1a0000 45%, #CE1126 100%)',
              }}
            >
              {/* decorative rotating lotus */}
              <div className="pointer-events-none absolute -top-20 -right-20 w-[360px] h-[360px] opacity-15 iraq-spin-slow">
                <CrescentStarSVG className="w-full h-full" color="#FFFFFF" />
              </div>
              <div className="pointer-events-none absolute -bottom-24 -left-16 w-[300px] h-[300px] opacity-10 iraq-spin-reverse">
                <CrescentStarSVG className="w-full h-full" color="#FFFFFF" />
              </div>

              {/* top: ribbon + country mark */}
              <div className="relative z-10 flex items-center gap-3">
                <IraqFlagRibbon />
                <span className="text-[10px] font-bold tracking-[0.32em] uppercase text-red-100/90">
                  Iraq · Intelligence Platform
                </span>
              </div>

              {/* centre: large Iraq president portrait */}
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="relative w-56 h-56 xl:w-64 xl:h-64 mb-6">
                  <div className="absolute inset-0 iraq-symbol-bloom">
                    <CrescentStarSVG className="w-full h-full" color="rgba(255,255,255,0.15)" />
                  </div>
                  <div className="absolute inset-4 rounded-full overflow-hidden border-[4px] border-white/95 shadow-2xl" style={{boxShadow: '0 0 40px rgba(206,17,38,0.5)'}}>
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
                  className="text-4xl xl:text-5xl font-heading font-extrabold tracking-wider uppercase bg-clip-text text-transparent iraq-gradient-shimmer"
                  style={{
                    backgroundImage:
                      'linear-gradient(90deg, #FFFFFF 0%, #FFE7B3 25%, #FFFFFF 50%, #FFE7B3 75%, #FFFFFF 100%)',
                  }}
                >
                  IRAQ WATCH
                </h1>
                <p className="mt-2 text-base text-white/95 font-semibold tracking-[0.18em] uppercase">
                  Iraq Intelligence Platform
                </p>
                <p className="mt-1 text-[11px] text-red-100/90 font-medium tracking-[0.32em] uppercase">
                  President · Prime Minister · Security · Politics
                </p>
                <div className="mx-auto mt-4 h-[2px] w-32 origin-center bg-gradient-to-r from-transparent via-red-300 to-transparent iraq-underline-pulse" />
                <p className="mt-4 text-sm text-white/85 max-w-sm leading-relaxed">
                  Real-time social media intelligence for Iraq — political mentions, war updates, security alerts, and public sentiment across all 18 governorates.
                </p>
              </div>

              {/* bottom: footer tagline */}
              <div className="relative z-10 flex items-center justify-center gap-2 text-[10px] text-red-100/90 font-semibold tracking-wider uppercase">
                <span>Republic of Iraq</span>
                <span className="h-1 w-1 rounded-full bg-red-200/80" />
                <span>جمهورية العراق</span>
              </div>
            </div>

            {/* ───────── RIGHT: login form panel ───────── */}
            <div className="relative p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
              {/* compact mobile-only hero (left panel is hidden on mobile) */}
              <div className="lg:hidden text-center mb-6">
                <div className="relative mx-auto mb-4 w-24 h-24">
                  <div className="absolute inset-0 iraq-symbol-bloom">
                    <CrescentStarSVG className="w-full h-full" color="rgba(206,17,38,0.3)" />
                  </div>
                  <div className="absolute inset-2 rounded-full overflow-hidden border-[3px] border-white/95">
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
                <h1 className="text-2xl font-heading font-extrabold tracking-wider uppercase text-red-900">
                  Iraq Watch
                </h1>
                <p className="text-[11px] text-red-700/80 font-medium tracking-[0.32em] uppercase mt-0.5">
                  Iraq Intelligence Platform
                </p>
              </div>

              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-red-100">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-red-400 to-red-700 blur-sm opacity-70" />
                  <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-red-600 to-red-900 shadow-lg">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-heading font-bold text-red-900">
                    Secure Command Access
                  </h2>
                  <p className="text-[11px] text-red-700/80 font-medium tracking-wide">
                    Iraq Watch · Authorised personnel only
                  </p>
                </div>
                <Sparkles className="ml-auto h-4 w-4 text-red-500 animate-pulse" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-5" data-testid="login-form">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-red-900">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500/70 pointer-events-none" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@iraqwatch.iq"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      data-testid="email-input"
                      className="h-12 pl-10 border-2 border-red-200 bg-red-50/30 focus:border-red-600 focus:ring-red-500/20 text-base rounded-lg"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-red-900">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500/70 pointer-events-none" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      data-testid="password-input"
                      className="h-12 pl-10 border-2 border-red-200 bg-red-50/30 focus:border-red-600 focus:ring-red-500/20 text-base rounded-lg"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  data-testid="login-submit-btn"
                  className="group relative w-full h-12 overflow-hidden text-base font-extrabold uppercase tracking-wider text-white border-0 rounded-lg shadow-lg shadow-red-700/40 transition-all duration-200 hover:shadow-xl hover:shadow-red-700/50 active:scale-[0.985] disabled:opacity-75"
                  style={{
                    background:
                      'linear-gradient(90deg, #7f0000 0%, #CE1126 35%, #e63950 65%, #CE1126 100%)',
                    backgroundSize: '200% 100%',
                    animation: 'iraqGradientShimmer 4s linear infinite',
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
                <div className="flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md bg-red-50 text-red-700 border border-red-100">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Encrypted
                </div>
                <div className="flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md bg-slate-50 text-slate-800 border border-slate-100">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                  24×7 Watch
                </div>
                <div className="flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md bg-rose-50 text-rose-700 border border-rose-100">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                  Audit-Logged
                </div>
              </div>

              <p className="mt-6 text-center text-[10px] text-red-700/60">
                © {new Date().getFullYear()} Iraq Watch · Secure intelligence platform
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
