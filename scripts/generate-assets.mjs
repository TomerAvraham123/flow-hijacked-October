import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const source = fileURLToPath(new URL('../assets/mark.svg', import.meta.url));
const jobs = [
  ['icon.png', 1024, '#06131E'],
  ['favicon.png', 64, '#06131E'],
  ['splash-icon.png', 512, { r: 0, g: 0, b: 0, alpha: 0 }],
  ['android-icon-foreground.png', 432, { r: 0, g: 0, b: 0, alpha: 0 }],
  ['android-icon-background.png', 432, '#06131E'],
  ['android-icon-monochrome.png', 432, { r: 0, g: 0, b: 0, alpha: 0 }],
];

await Promise.all(
  jobs.map(async ([name, size, background]) => {
    const target = fileURLToPath(new URL(`../assets/${name}`, import.meta.url));
    await sharp(source)
      .resize(Number(size), Number(size), { fit: 'contain', background })
      .png()
      .toFile(target);
  }),
);

const playIcon = fileURLToPath(new URL('../store/play/icon-512.png', import.meta.url));
await sharp(source).resize(512, 512, { fit: 'contain', background: '#06131E' }).png().toFile(playIcon);

const featureGraphic = Buffer.from(`
<svg width="1024" height="500" viewBox="0 0 1024 500" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="1024" height="500" fill="#06131E"/>
  <path d="M-70 406C96 280 188 454 354 304C526 148 652 358 1100 104" stroke="#102C3F" stroke-width="2"/>
  <path d="M-82 442C94 316 202 484 378 328C554 172 688 374 1098 136" stroke="#174258" stroke-width="2" stroke-dasharray="9 12"/>
  <path d="M-42 354C122 234 218 398 372 264C536 120 682 302 1082 80" stroke="#2AA6A1" stroke-opacity="0.34" stroke-width="3"/>
  <circle cx="818" cy="244" r="144" stroke="#2AA6A1" stroke-width="11" transform="rotate(-18 818 244)"/>
  <ellipse cx="818" cy="244" rx="92" ry="154" stroke="#5E96C4" stroke-width="11" transform="rotate(31 818 244)"/>
  <path d="M668 316C722 334 758 216 814 244C872 274 902 170 986 186" stroke="#F5F0E6" stroke-width="12" stroke-linecap="round"/>
  <circle cx="830" cy="222" r="31" fill="#C79A3B"/>
  <text x="92" y="218" fill="#F5F0E6" font-family="sans-serif" font-size="66" font-weight="650" letter-spacing="3">FLOW</text>
  <text x="92" y="288" fill="#F5F0E6" font-family="sans-serif" font-size="66" font-weight="650" letter-spacing="3">HIJACKED</text>
  <path d="M94 326H414" stroke="#C79A3B" stroke-width="3"/>
  <text x="94" y="362" fill="#9BAAB4" font-family="sans-serif" font-size="18" letter-spacing="2">MOMENT · DEPTH · CONTINUITY</text>
</svg>`);

const featureTarget = fileURLToPath(new URL('../store/play/feature-graphic.png', import.meta.url));
await sharp(featureGraphic).png().toFile(featureTarget);
