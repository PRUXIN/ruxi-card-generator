import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

// ─────────────────────────────────────────
// INDUSTRY THEME CONFIG
// Extracted directly from Figma designs
// ─────────────────────────────────────────
const THEMES = {
  accountants: {
    tag: 'AI FOR ACCOUNTANCY FIRMS',
    dark:  { bg:'#07091a', accent:'#c9a84c', pain:'#c9a84c',  text:'#ffffff', sub:'rgba(255,255,255,0.75)', grad:'rgba(7,9,26',   ctaBg:'#c9a84c', ctaText:'#07091a', url:'#b8c8e8' },
    light: { bg:'#ffffff', accent:'#c9a84c', pain:'#b98d10',  text:'#000000', sub:'rgba(0,0,0,0.70)',       grad:'rgba(255,255,255', ctaBg:'#c9a84c', ctaText:'#0a0508', url:'#132f67' },
  },
  legal: {
    tag: 'AI FOR LEGAL PRACTICES',
    dark:  { bg:'#0a090f', accent:'#b8c8e8', pain:'#b8c8e8',  text:'#ffffff', sub:'rgba(255,255,255,0.75)', grad:'rgba(10,9,15',  ctaBg:'#b8c8e8', ctaText:'#0a090f', url:'#b8c8e8' },
    light: { bg:'#ffffff', accent:'#b8c8e8', pain:'#6a8aaf',  text:'#000000', sub:'rgba(0,0,0,0.70)',       grad:'rgba(255,255,255', ctaBg:'#b8c8e8', ctaText:'#0a090f', url:'#132f67' },
  },
  realestate: {
    tag: 'AI FOR ESTATE AGENTS',
    dark:  { bg:'#080a05', accent:'#e07b30', pain:'#e07b30',  text:'#ffffff', sub:'rgba(255,255,255,0.75)', grad:'rgba(8,10,5',   ctaBg:'#e07b30', ctaText:'#080a05', url:'#b8c8e8' },
    light: { bg:'#ffffff', accent:'#e07b30', pain:'#c05a10',  text:'#000000', sub:'rgba(0,0,0,0.70)',       grad:'rgba(255,255,255', ctaBg:'#e07b30', ctaText:'#080a05', url:'#132f67' },
  },
  restaurants: {
    tag: 'AI FOR HOSPITALITY',
    dark:  { bg:'#0a0508', accent:'#c47fa0', pain:'#c47fa0',  text:'#ffffff', sub:'rgba(255,255,255,0.75)', grad:'rgba(10,5,8',   ctaBg:'#c47fa0', ctaText:'#0a0508', url:'#b8c8e8' },
    light: { bg:'#ffffff', accent:'#c47fa0', pain:'#a05070',  text:'#000000', sub:'rgba(0,0,0,0.70)',       grad:'rgba(255,255,255', ctaBg:'#c47fa0', ctaText:'#0a0508', url:'#132f67' },
  },
};

export default async function handler(req) {
  const { searchParams } = new URL(req.url);

  // ── Read all parameters from Make.com ──
  const industry   = (searchParams.get('industry')   || 'accountants').toLowerCase().replace(/\s/g,'').replace('realestate','realestate').replace('legal/solicitors','legal').replace('restaurants/hospitality','restaurants');
  const theme      = (searchParams.get('theme')      || 'dark').toLowerCase();
  const headline   = searchParams.get('headline')    || 'Your phones ring at 9pm. Clara answers.';
  const subheadline= searchParams.get('subheadline') || 'Never miss a new client enquiry. Clara handles calls 24/7.';
  const painstat   = searchParams.get('painstat')    || '';
  const cta        = searchParams.get('cta')         || 'Book a Demo';
  const bgImageUrl = searchParams.get('bgImageUrl')  || '';

  // ── Resolve theme config ──
  const cfg = (THEMES[industry] || THEMES.accountants)[theme] || THEMES.accountants.dark;
  const tag = (THEMES[industry] || THEMES.accountants).tag;

  // ── Fetch background image as ArrayBuffer ──
  let bgData = null;
  if (bgImageUrl) {
    try {
      const res = await fetch(bgImageUrl);
      bgData = await res.arrayBuffer();
    } catch(e) { /* no bg image if fetch fails */ }
  }

  // ── Build gradient overlay ──
  // Left side = solid bg colour, right side = transparent
  const gradientOverlay = `linear-gradient(to right, ${cfg.grad},1) 0%, ${cfg.grad},0.85) 30%, ${cfg.grad},0.3) 65%, ${cfg.grad},0) 100%)`;

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 628,
          display: 'flex',
          background: cfg.bg,
          fontFamily: 'Inter, sans-serif',
          overflow: 'hidden',
          position: 'relative',
        }}
      >

        {/* ── Background image (right half) ── */}
        {bgData && (
          <img
            src={bgData}
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              width: 620,
              height: 628,
              objectFit: 'cover',
              opacity: 0.75,
              borderRadius: 16,
            }}
          />
        )}

        {/* ── Gradient overlay over bg image ── */}
        {bgData && (
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              width: 700,
              height: 628,
              background: gradientOverlay,
              display: 'flex',
            }}
          />
        )}

        {/* ── MISSED CALL badge ── */}
        {bgData && (
          <div
            style={{
              position: 'absolute',
              right: 80,
              bottom: 150,
              background: '#e13a3a',
              border: '1px solid rgba(255,100,103,0.5)',
              borderRadius: 100,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
            }}
          >
            <div style={{ fontSize: 12, color: 'white' }}>📞</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'white', letterSpacing: 0.6 }}>
              MISSED CALL
            </div>
          </div>
        )}

        {/* ── LEFT CONTENT COLUMN ── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '40px',
            width: 580,
            height: 628,
            position: 'relative',
            zIndex: 10,
          }}
        >

          {/* Top section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

            {/* ── Clara by Pruxin Logo ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              {/* Bars */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 36 }}>
                {[18, 26, 34, 26, 18].map((h, i) => (
                  <div
                    key={i}
                    style={{
                      width: 7,
                      height: h,
                      background: 'linear-gradient(to bottom, #00fff0, #007a66)',
                      borderRadius: 4,
                    }}
                  />
                ))}
              </div>
              {/* Text */}
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: cfg.text, letterSpacing: 1 }}>
                  CLARA
                </div>
                <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.6)', letterSpacing: 2 }}>
                  BY PRUXIN
                </div>
              </div>
            </div>

            {/* ── Industry tag pill ── */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `1px solid ${cfg.accent}`,
                borderRadius: 100,
                padding: '8px 16px',
                marginBottom: 20,
                width: 'fit-content',
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, color: cfg.accent, letterSpacing: 1 }}>
                {tag}
              </div>
            </div>

            {/* ── Headline ── */}
            <div
              style={{
                fontSize: 46,
                fontWeight: 800,
                color: cfg.text,
                lineHeight: 1.2,
                letterSpacing: -1.5,
                marginBottom: 16,
                maxWidth: 500,
              }}
            >
              {headline}
            </div>

            {/* ── Subheadline ── */}
            <div
              style={{
                fontSize: 18,
                fontWeight: 400,
                color: cfg.sub,
                lineHeight: 1.5,
                letterSpacing: -0.3,
                marginBottom: 20,
                maxWidth: 480,
              }}
            >
              {subheadline}
            </div>

            {/* ── Pain stat ── */}
            {painstat && (
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 500,
                  color: cfg.pain,
                  lineHeight: 1.3,
                  letterSpacing: -0.3,
                  maxWidth: 480,
                }}
              >
                {painstat}
              </div>
            )}

          </div>

          {/* Bottom: CTA + URL */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* CTA Button */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: cfg.ctaBg,
                borderRadius: 100,
                padding: '14px 32px',
                width: 'fit-content',
              }}
            >
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: cfg.ctaText,
                  letterSpacing: 0.5,
                  textTransform: 'uppercase',
                }}
              >
                {cta}
              </div>
            </div>

            {/* URL */}
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: cfg.url,
                textDecoration: 'underline',
                letterSpacing: -0.3,
              }}
            >
              pruxin.com/clara
            </div>
          </div>

        </div>
      </div>
    ),
    {
      width: 1200,
      height: 628,
    }
  );
}
