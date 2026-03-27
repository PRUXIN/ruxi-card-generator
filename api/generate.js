module.exports = async function handler(req, res) {
  const industry = req.query.industry || 'accountants';
  const theme = req.query.theme || 'light';
  const headline = req.query.headline || 'Your phones ring at 9pm. Clara answers.';
  const subheadline = req.query.subheadline || 'Never miss a new client enquiry.';
  const painstat = req.query.painstat || '62% of clients switch firms due to poor communication';
  const cta = req.query.cta || 'Book a Demo';

  const industryConfig = {
    'accountants': {
      file: 'Accountants.png',
      accent: '#C9A84C',
      label: 'AI FOR ACCOUNTANCY FIRMS',
      overlay: 'missedcall',
      ctaColor: '#C9A84C',
      ctaTextColor: '#0A0508'
    },
    'legal': {
      file: 'Legal _ Solicitors.png',
      accent: '#4573CD',
      label: 'AI FOR LEGAL PRACTICES',
      overlay: 'incomingcall',
      ctaColor: '#4573CD',
      ctaTextColor: '#FFFFFF'
    },
    'realestate': {
      file: 'Real Estate.png',
      accent: '#E07B30',
      label: 'AI FOR ESTATE AGENTS',
      overlay: 'buyerenquiry',
      ctaColor: '#E07B30',
      ctaTextColor: '#FFFFFF'
    },
    'restaurants': {
      file: 'Restaurants _ Hospitality.png',
      accent: '#038D80',
      label: 'AI FOR HOSPITALITY',
      overlay: 'unansweredcall',
      ctaColor: '#038D80',
      ctaTextColor: '#FFFFFF'
    }
  };

  const config = industryConfig[industry.toLowerCase()] || industryConfig['accountants'];
  const imageUrl = `https://raw.githubusercontent.com/PRUXIN/clara-card-generator/main/assets/${encodeURIComponent(config.file)}`;

  let bgBase64 = null;
  try {
    const imgRes = await fetch(imageUrl);
    const arrayBuffer = await imgRes.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    bgBase64 = `data:image/png;base64,${Buffer.from(binary, 'binary').toString('base64')}`;
  } catch (e) {
    bgBase64 = null;
  }

  const isDark = theme === 'dark';
  const bg = isDark ? '#07091A' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#0A0508';
  const subColor = isDark ? '#AAAACC' : '#444444';
  const accent = config.accent;

  // Smart headline split
  let lines = [];
  if (headline.includes('.') && headline.replace(/\.$/, '').includes('.')) {
    // Multiple sentences — split at each period
    lines = headline.split('.').filter(s => s.trim()).map(s => s.trim() + '.');
  } else {
    // Single sentence — split by words
    const words = headline.split(' ');
    const mid = Math.ceil(words.length / 2);
    lines = [words.slice(0, mid).join(' '), words.slice(mid).join(' ')].filter(l => l);
  }

  // Overlay per industry
  const overlayMap = {
    'missedcall': `
      <rect x="840" y="330" width="175" height="36" rx="18" fill="#E13A3A"/>
      <rect x="853" y="342" width="12" height="12" rx="6" fill="white" opacity="0.4"/>
      <text x="935" y="353" font-family="Arial,sans-serif" font-size="11" font-weight="bold" fill="white" text-anchor="middle" letter-spacing="0.8">MISSED CALL</text>
    `,
    'incomingcall': `
      <rect x="720" y="160" width="200" height="310" rx="20" fill="white" opacity="0.9"/>
      <rect x="740" y="175" width="160" height="160" rx="80" fill="rgba(0,0,0,0.05)"/>
      <text x="820" y="265" font-family="Arial,sans-serif" font-size="40" text-anchor="middle" fill="#4573CD">☎</text>
      <text x="820" y="310" font-family="Arial,sans-serif" font-size="12" fill="rgba(0,0,0,0.6)" text-anchor="middle">Incoming Call</text>
      <text x="820" y="335" font-family="Arial,sans-serif" font-size="16" font-weight="bold" fill="#0A0508" text-anchor="middle">Unknown Caller</text>
      <rect x="745" y="415" width="50" height="50" rx="25" fill="rgba(251,44,54,0.9)"/>
      <text x="770" y="447" font-family="Arial,sans-serif" font-size="20" text-anchor="middle" fill="white">✕</text>
      <rect x="825" y="415" width="50" height="50" rx="25" fill="rgba(0,201,80,0.9)"/>
      <text x="850" y="447" font-family="Arial,sans-serif" font-size="20" text-anchor="middle" fill="white">✓</text>
      <rect x="840" y="165" width="130" height="30" rx="15" fill="#132F67"/>
      <text x="905" y="185" font-family="Arial,sans-serif" font-size="10" font-weight="bold" fill="white" text-anchor="middle" letter-spacing="0.6">NEW ENQUIRY</text>
    `,
    'buyerenquiry': `
      <rect x="730" y="185" width="240" height="72" rx="14" fill="white" opacity="0.95"/>
      <rect x="744" y="199" width="38" height="38" rx="19" fill="${accent}" opacity="0.2"/>
      <rect x="755" y="208" width="4" height="16" rx="2" fill="${accent}"/>
      <rect x="762" y="212" width="4" height="20" rx="2" fill="${accent}"/>
      <rect x="769" y="208" width="4" height="16" rx="2" fill="${accent}"/>
      <text x="798" y="217" font-family="Arial,sans-serif" font-size="13" font-weight="bold" fill="#0A0508">Buyer Enquiry</text>
      <text x="798" y="235" font-family="Arial,sans-serif" font-size="11" fill="rgba(0,0,0,0.6)">3-bed Southside</text>
    `,
    'unansweredcall': `
      <rect x="740" y="195" width="210" height="36" rx="18" fill="#01FDE0"/>
      <text x="845" y="218" font-family="Arial,sans-serif" font-size="11" font-weight="bold" fill="#0A0508" text-anchor="middle" letter-spacing="1">3RD UNANSWERED CALL</text>
      <circle cx="845" cy="300" r="45" fill="${accent}" opacity="0.85"/>
      <text x="845" y="315" font-family="Arial,sans-serif" font-size="36" text-anchor="middle" fill="white">☎</text>
    `
  };

  const overlay = bgBase64 ? (overlayMap[config.overlay] || '') : '';

  const bgImageTag = bgBase64 ? `
    <clipPath id="imgClip">
      <rect x="580" y="36" width="580" height="556" rx="16"/>
    </clipPath>
    <image x="580" y="36" width="580" height="556" href="${bgBase64}" preserveAspectRatio="xMidYMid slice" clip-path="url(#imgClip)" opacity="0.85"/>
    <defs>
      <linearGradient id="fade" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:${bg};stop-opacity:1"/>
        <stop offset="45%" style="stop-color:${bg};stop-opacity:0"/>
      </linearGradient>
    </defs>
    <rect x="580" y="36" width="580" height="556" fill="url(#fade)"/>
    ${overlay}
  ` : '';

  // Clara logo (bars) top left
  const claraLogo = `
    <rect x="40" y="28" width="5" height="18" rx="2.5" fill="#7B5EA7"/>
    <rect x="49" y="22" width="5" height="28" rx="2.5" fill="#7B5EA7"/>
    <rect x="58" y="26" width="5" height="20" rx="2.5" fill="#7B5EA7"/>
    <rect x="58" y="20" width="5" height="4" rx="2" fill="#00E5AA"/>
    <text x="72" y="43" font-family="Arial,sans-serif" font-size="13" font-weight="bold" fill="${textColor}" letter-spacing="1">CLARA</text>
    <text x="72" y="56" font-family="Arial,sans-serif" font-size="9" fill="${isDark ? '#888899' : '#888899'}" letter-spacing="1">BY PRUXIN</text>
  `;

  // Dynamic y positions based on number of headline lines
  const headlineStartY = 130;
  const lineHeight = 58;
  const headlineEndY = headlineStartY + (lines.length * lineHeight);

  const svg = `<svg width="1200" height="628" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <rect width="1200" height="628" fill="${bg}"/>
    ${bgImageTag}
    ${claraLogo}

    <!-- Industry pill -->
    <rect x="40" y="78" width="${config.label.length * 7.5 + 32}" height="34" rx="17" fill="none" stroke="${accent}" stroke-width="1.5"/>
    <text x="${40 + (config.label.length * 7.5 + 32) / 2}" y="100" font-family="Arial,sans-serif" font-size="11" font-weight="bold" fill="${accent}" text-anchor="middle" letter-spacing="1">${config.label}</text>

    <!-- Headline -->
    ${lines.map((line, i) => `<text x="40" y="${headlineStartY + (i * lineHeight)}" font-family="Arial,sans-serif" font-size="46" font-weight="bold" fill="${textColor}" letter-spacing="-2">${line}</text>`).join('\n')}

    <!-- Subheadline -->
    <text x="40" y="${headlineEndY + 30}" font-family="Arial,sans-serif" font-size="17" fill="${subColor}">${subheadline}</text>

    <!-- Pain stat -->
    <text x="40" y="${headlineEndY + 68}" font-family="Arial,sans-serif" font-size="15" font-weight="bold" fill="${accent}">${painstat}</text>

    <!-- CTA Button -->
    <rect x="40" y="${headlineEndY + 90}" width="230" height="48" rx="24" fill="${config.ctaColor}"/>
    <text x="155" y="${headlineEndY + 120}" font-family="Arial,sans-serif" font-size="13" font-weight="bold" fill="${config.ctaTextColor}" text-anchor="middle" letter-spacing="0.5">${cta.toUpperCase()}</text>

    <!-- URL -->
    <text x="155" y="${headlineEndY + 158}" font-family="Arial,sans-serif" font-size="13" font-weight="bold" fill="#132F67" text-anchor="middle" text-decoration="underline">pruxin.com/clara</text>
  </svg>`;

  res.setHeader('Content-Type', 'image/svg+xml');
  res.status(200).send(svg);
};
