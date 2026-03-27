module.exports = async function handler(req, res) {
  const industry = req.query.industry || 'accountants';
  const theme = req.query.theme || 'light';
  const headline = req.query.headline || 'Your phones ring at 9pm. Clara answers.';
  const subheadline = req.query.subheadline || 'Never miss a new client enquiry.';
  const painstat = req.query.painstat || '62% of clients switch firms due to poor communication';
  const cta = req.query.cta || 'Book a Demo';

  // Industry config
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
      accent: '#C9A84C',
      label: 'AI FOR LAW FIRMS',
      overlay: 'missedcall',
      ctaColor: '#C9A84C',
      ctaTextColor: '#0A0508'
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
      accent: '#C9A84C',
      label: 'AI FOR HOSPITALITY',
      overlay: 'tablebooking',
      ctaColor: '#C9A84C',
      ctaTextColor: '#0A0508'
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
  const urlColor = '#132F67';
  const accent = config.accent;

  // Smart headline split by sentence (period) or word count
  let lines = [];
  if (headline.includes('.') && headline.indexOf('.') < headline.length - 1) {
    const parts = headline.split('.');
    lines = parts.filter(p => p.trim()).map(p => p.trim() + '.');
  } else {
    const words = headline.split(' ');
    const mid = Math.ceil(words.length / 2);
    lines = [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
  }

  // Overlay widget per industry
  let overlayTag = '';
  if (bgBase64) {
    if (config.overlay === 'missedcall') {
      overlayTag = `
        <rect x="830" y="340" width="170" height="36" rx="18" fill="#E13A3A" opacity="0.95"/>
        <text x="915" y="363" font-family="Arial,sans-serif" font-size="11" font-weight="bold" fill="white" text-anchor="middle" letter-spacing="0.8">● MISSED CALL</text>
      `;
    } else if (config.overlay === 'buyerenquiry') {
      overlayTag = `
        <rect x="740" y="190" width="220" height="70" rx="12" fill="white" opacity="0.95"/>
        <rect x="752" y="202" width="36" height="36" rx="18" fill="${accent}" opacity="0.2"/>
        <text x="770" y="225" font-family="Arial,sans-serif" font-size="16" fill="${accent}" text-anchor="middle">⌂</text>
        <text x="800" y="218" font-family="Arial,sans-serif" font-size="13" font-weight="bold" fill="#0A0508">Buyer Enquiry</text>
        <text x="800" y="236" font-family="Arial,sans-serif" font-size="11" fill="rgba(0,0,0,0.6)">3-bed Southside</text>
      `;
    } else if (config.overlay === 'tablebooking') {
      overlayTag = `
        <rect x="740" y="190" width="220" height="70" rx="12" fill="white" opacity="0.95"/>
        <rect x="752" y="202" width="36" height="36" rx="18" fill="${accent}" opacity="0.2"/>
        <text x="770" y="225" font-family="Arial,sans-serif" font-size="16" fill="${accent}" text-anchor="middle">♦</text>
        <text x="800" y="218" font-family="Arial,sans-serif" font-size="13" font-weight="bold" fill="#0A0508">Table Booked</text>
        <text x="800" y="236" font-family="Arial,sans-serif" font-size="11" fill="rgba(0,0,0,0.6)">Party of 4 · 7:30pm</text>
      `;
    }
  }

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
    ${overlayTag}
  ` : '';

  // Headline lines y positions
  const headlineY = [195, 255, 315];

  const svg = `<svg width="1200" height="628" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <rect width="1200" height="628" fill="${bg}"/>
    ${bgImageTag}

    <!-- Industry pill -->
    <rect x="40" y="80" width="${config.label.length * 8 + 32}" height="36" rx="18" fill="none" stroke="${accent}" stroke-width="1.5"/>
    <text x="${40 + (config.label.length * 8 + 32) / 2}" y="103" font-family="Arial,sans-serif" font-size="11" font-weight="bold" fill="${accent}" text-anchor="middle" letter-spacing="1">${config.label}</text>

    <!-- Headline -->
    ${lines.map((line, i) => `<text x="40" y="${headlineY[i]}" font-family="Arial,sans-serif" font-size="46" font-weight="bold" fill="${textColor}" letter-spacing="-2">${line}</text>`).join('\n')}

    <!-- Subheadline -->
    <text x="40" y="${headlineY[lines.length - 1] + 55}" font-family="Arial,sans-serif" font-size="18" fill="${subColor}">${subheadline}</text>

    <!-- Pain stat -->
    <text x="40" y="${headlineY[lines.length - 1] + 100}" font-family="Arial,sans-serif" font-size="15" font-weight="bold" fill="${accent}">${painstat}</text>

    <!-- CTA Button -->
    <rect x="40" y="${headlineY[lines.length - 1] + 130}" width="220" height="48" rx="24" fill="${config.ctaColor}"/>
    <text x="150" y="${headlineY[lines.length - 1] + 160}" font-family="Arial,sans-serif" font-size="13" font-weight="bold" fill="${config.ctaTextColor}" text-anchor="middle" letter-spacing="0.5">${cta.toUpperCase()}</text>

    <!-- URL -->
    <text x="150" y="${headlineY[lines.length - 1] + 195}" font-family="Arial,sans-serif" font-size="13" font-weight="bold" fill="${urlColor}" text-anchor="middle" text-decoration="underline">pruxin.com/clara</text>
  </svg>`;

  res.setHeader('Content-Type', 'image/svg+xml');
  res.status(200).send(svg);
};
