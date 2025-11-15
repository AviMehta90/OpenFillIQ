#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs');
const path = require('path');

// Create a simple PNG file (solid color square)
function createPNG(size, outputPath) {
  // PNG signature
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR chunk (image dimensions)
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(size, 0); // Width
  ihdrData.writeUInt32BE(size, 4); // Height
  ihdrData[8] = 8; // Bit depth
  ihdrData[9] = 2; // Color type (RGB)
  ihdrData[10] = 0; // Compression
  ihdrData[11] = 0; // Filter
  ihdrData[12] = 0; // Interlace

  const ihdr = createChunk('IHDR', ihdrData);

  // Create a simple purple gradient image data
  const bytesPerPixel = 3; // RGB
  const rowBytes = size * bytesPerPixel + 1; // +1 for filter byte
  const imageData = Buffer.alloc(rowBytes * size);

  for (let y = 0; y < size; y++) {
    imageData[y * rowBytes] = 0; // Filter byte
    for (let x = 0; x < size; x++) {
      const idx = y * rowBytes + 1 + x * bytesPerPixel;
      // Purple gradient
      imageData[idx] = 0x66; // R
      imageData[idx + 1] = 0x7e; // G
      imageData[idx + 2] = 0xea; // B
    }
  }

  // Compress image data (simplified - just use uncompressed for now)
  const zlib = require('zlib');
  const compressed = zlib.deflateSync(imageData);

  const idat = createChunk('IDAT', compressed);
  const iend = createChunk('IEND', Buffer.alloc(0));

  const png = Buffer.concat([signature, ihdr, idat, iend]);
  fs.writeFileSync(outputPath, png);
}

function createChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);

  const typeBuffer = Buffer.from(type, 'ascii');
  const crc = crc32(Buffer.concat([typeBuffer, data]));
  const crcBuffer = Buffer.alloc(4);
  crcBuffer.writeUInt32BE(crc, 0);

  return Buffer.concat([length, typeBuffer, data, crcBuffer]);
}

function crc32(data) {
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i++) {
    crc ^= data[i];
    for (let j = 0; j < 8; j++) {
      crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// Create icons
const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

console.log('Creating placeholder icons...');

createPNG(16, path.join(iconsDir, 'icon-16.png'));
console.log(' Created icon-16.png');

createPNG(32, path.join(iconsDir, 'icon-32.png'));
console.log(' Created icon-32.png');

createPNG(48, path.join(iconsDir, 'icon-48.png'));
console.log(' Created icon-48.png');

createPNG(128, path.join(iconsDir, 'icon-128.png'));
console.log(' Created icon-128.png');

console.log('\n All icons created successfully!');
