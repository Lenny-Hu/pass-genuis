const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const outputDir = path.join(__dirname, '../public/icons');
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

fs.mkdirSync(outputDir, { recursive: true });

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#2F6BFF"/>
      <stop offset="100%" stop-color="#0E3FB4"/>
    </linearGradient>
    <linearGradient id="shine" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="120" fill="url(#bg)"/>
  <circle cx="170" cy="160" r="120" fill="url(#shine)" />
  
  <!-- Shield -->
  <path d="M256 110 L362 150 V252 C362 320 314 378 256 402 C198 378 150 320 150 252 V150 Z" fill="#FFFFFF" opacity="0.96"/>
  <path d="M256 150 L330 178 V250 C330 300 296 342 256 360 C216 342 182 300 182 250 V178 Z" fill="#2962FF" opacity="0.95"/>

  <!-- Key -->
  <circle cx="228" cy="250" r="34" fill="#FFFFFF"/>
  <circle cx="228" cy="250" r="18" fill="#2962FF"/>
  <rect x="258" y="240" width="96" height="20" rx="10" fill="#FFFFFF"/>
  <rect x="320" y="232" width="22" height="12" rx="4" fill="#FFFFFF"/>
  <rect x="348" y="232" width="22" height="12" rx="4" fill="#FFFFFF"/>

  <!-- Sparkles -->
  <path d="M360 160 l10 22 l22 10 l-22 10 l-10 22 l-10-22 l-22-10 l22-10 z" fill="#CDE1FF"/>
  <path d="M122 300 l7 16 l16 7 l-16 7 l-7 16 l-7-16 l-16-7 l16-7 z" fill="#CDE1FF"/>
</svg>`;

async function generate() {
  for (const size of sizes) {
    const filePath = path.join(outputDir, `icon-${size}x${size}.png`);
    await sharp(Buffer.from(svg))
      .resize(size, size)
      .png()
      .toFile(filePath);
  }
  console.log('✅ 生成 PassGenius 图标完成');
}

generate().catch((error) => {
  console.error('❌ 生成图标失败:', error);
  process.exit(1);
});
