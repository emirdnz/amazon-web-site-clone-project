const CATEGORY_STYLES = {
  'Elektronik': { start: '#0F172A', end: '#2563EB', accent: '#60A5FA' },
  'Ev & Yaşam': { start: '#1F2937', end: '#10B981', accent: '#6EE7B7' },
  'Moda': { start: '#4C1D95', end: '#DB2777', accent: '#F9A8D4' },
  'Gıda': { start: '#78350F', end: '#F59E0B', accent: '#FCD34D' },
  'Oyuncak': { start: '#7C2D12', end: '#EA580C', accent: '#FDBA74' },
  'Kitap': { start: '#1E3A8A', end: '#6366F1', accent: '#A5B4FC' },
  'Spor': { start: '#14532D', end: '#22C55E', accent: '#86EFAC' },
  'Güzellik': { start: '#831843', end: '#EC4899', accent: '#F9A8D4' },
};

function escapeXml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function getProductPlaceholder(product = {}) {
  const palette = CATEGORY_STYLES[product.category] || {
    start: '#1F2937',
    end: '#4B5563',
    accent: '#E5E7EB',
  };

  const title = escapeXml((product.name || 'Ürün Görseli').slice(0, 28));
  const subtitle = escapeXml(product.brand || product.category || 'Amazon Clone');

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${palette.start}" />
          <stop offset="100%" stop-color="${palette.end}" />
        </linearGradient>
      </defs>
      <rect width="800" height="800" rx="44" fill="url(#bg)" />
      <circle cx="660" cy="130" r="78" fill="${palette.accent}" fill-opacity="0.18" />
      <circle cx="150" cy="660" r="110" fill="${palette.accent}" fill-opacity="0.12" />
      <rect x="140" y="140" width="520" height="320" rx="30" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" />
      <path d="M240 390c60-110 100-150 160-150s100 40 160 150" fill="none" stroke="${palette.accent}" stroke-width="26" stroke-linecap="round" />
      <circle cx="400" cy="255" r="52" fill="${palette.accent}" fill-opacity="0.9" />
      <text x="400" y="565" text-anchor="middle" font-size="42" font-family="Arial, sans-serif" font-weight="700" fill="#FFFFFF">${title}</text>
      <text x="400" y="620" text-anchor="middle" font-size="26" font-family="Arial, sans-serif" fill="rgba(255,255,255,0.82)">${subtitle}</text>
      <text x="400" y="690" text-anchor="middle" font-size="24" font-family="Arial, sans-serif" fill="#FFD166">Görsel yüklenemedi</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function applyImageFallback(event, product = {}) {
  const img = event.currentTarget;
  if (img.dataset.fallbackApplied === 'true') return;
  img.dataset.fallbackApplied = 'true';
  img.src = getProductPlaceholder(product);
}
