import sharp from 'sharp';
import { mkdir } from 'fs/promises';
import { join } from 'path';

const sizes = [
  16,    // favicon
  32,    // favicon
  192,   // PWA icon
  512,   // PWA icon
  180    // Apple touch icon
];

async function generateIcons() {
  try {
    // Ensure public directory exists
    await mkdir('public', { recursive: true });
    
    // Generate PNG files for each size
    for (const size of sizes) {
      await sharp('public/masked-icon.svg')
        .resize(size, size)
        .png()
        .toFile(`public/icon-${size}x${size}.png`);
    }
    
    // Generate specific files
    // PWA icons
    await sharp('public/icon-192x192.png')
      .toFile('public/pwa-192x192.png');
    
    await sharp('public/icon-512x512.png')
      .toFile('public/pwa-512x512.png');
    
    // Apple touch icon
    await sharp('public/icon-180x180.png')
      .toFile('public/apple-touch-icon.png');
    
    // Favicon (combine 16x16 and 32x32)
    const favicon16 = await sharp('public/icon-16x16.png').toBuffer();
    const favicon32 = await sharp('public/icon-32x32.png').toBuffer();
    
    await sharp(favicon16)
      .extend({
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .toFile('public/favicon.ico');
    
    console.log('Icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons(); 