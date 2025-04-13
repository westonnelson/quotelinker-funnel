/* eslint-disable no-console */
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const CYAN_COLOR = '#00F2F2';
const SOURCE_LOGO = path.join(__dirname, '../src/assets/q-logo.png');
const PUBLIC_DIR = path.join(__dirname, '../public');

const FAVICON_SIZES = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 192, name: 'android-chrome-192x192.png' },
  { size: 512, name: 'android-chrome-512x512.png' },
];

async function generateFavicons() {
  try {
    // Ensure the public directory exists
    await fs.mkdir(PUBLIC_DIR, { recursive: true });

    // Generate each size
    for (const { size, name } of FAVICON_SIZES) {
      await sharp(SOURCE_LOGO)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .toFile(path.join(PUBLIC_DIR, name));
      
      console.log(`Generated ${name}`);
    }

    // Generate ICO file containing multiple sizes
    const icoSizes = [16, 32, 48];
    const icoBuffers = await Promise.all(
      icoSizes.map(size =>
        sharp(SOURCE_LOGO)
          .resize(size, size, {
            fit: 'contain',
            background: { r: 255, g: 255, b: 255, alpha: 0 }
          })
          .toBuffer()
      )
    );

    // Use the first buffer as favicon.ico
    await fs.writeFile(
      path.join(PUBLIC_DIR, 'favicon.ico'),
      icoBuffers[0]
    );

    console.log('Generated favicon.ico');
    console.log('All favicons generated successfully!');
  } catch (error) {
    console.error('Error generating favicons:', error);
    process.exit(1);
  }
}

generateFavicons(); 