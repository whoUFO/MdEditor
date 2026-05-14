const fs = require('fs');
const path = require('path');

const icoHeader = Buffer.from([
  0x00, 0x00, // Reserved
  0x01, 0x00, // Image type (1 = ICO)
  0x01, 0x00, // Number of images
]);

const bmpInfoHeader = Buffer.from([
  0x28, 0x00, 0x00, 0x00, // Size of this header (40 bytes)
  0x20, 0x00, 0x00, 0x00, // Width (32 pixels)
  0x20, 0x00, 0x00, 0x00, // Height (32 pixels) - actually 64 because ICO stores XOR and AND masks
  0x01, 0x00, // Planes (1)
  0x18, 0x00, // Bits per pixel (24)
  0x00, 0x00, 0x00, 0x00, // Compression (0 = none)
  0x00, 0x00, 0x00, 0x00, // Size of bitmap data
  0x13, 0x0B, 0x00, 0x00, // Horizontal resolution (2835 pixels/meter)
  0x13, 0x0B, 0x00, 0x00, // Vertical resolution (2835 pixels/meter)
  0x00, 0x00, 0x00, 0x00, // Colors used (0 = all)
  0x00, 0x00, 0x00, 0x00, // Important colors (0 = all)
]);

const directoryEntry = Buffer.from([
  0x20, // Width
  0x20, // Height
  0x00, // Color count (0 = no palette)
  0x00, // Reserved
  0x01, 0x00, // Planes
  0x18, 0x00, // Bits per pixel (24)
  0x00, 0x00, 0x00, 0x00, // Size of image data (will be filled later)
  0x16, 0x00, 0x00, 0x00, // Offset to image data
]);

const width = 32;
const height = 32;
const rowSize = Math.floor((width * 24 + 31) / 32) * 4;
const imageData = Buffer.alloc(rowSize * height * 2);

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    let r = 102, g = 126, b = 234;
    
    const cx = width / 2;
    const cy = height / 2;
    const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
    
    if (dist < width / 3) {
      r = Math.round(r + (255 - r) * (1 - dist / (width / 3)));
      g = Math.round(g + (255 - g) * (1 - dist / (width / 3)));
      b = Math.round(b + (255 - b) * (1 - dist / (width / 3)));
    }
    
    const offset = y * rowSize + x * 3;
    imageData.writeUInt8(b, offset);
    imageData.writeUInt8(g, offset + 1);
    imageData.writeUInt8(r, offset + 2);
  }
}

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const offset = rowSize * height + y * Math.ceil(width / 8) + Math.floor(x / 8);
    const bit = x % 8;
    imageData.writeUInt8(0, offset);
  }
}

directoryEntry.writeUInt32LE(imageData.length + bmpInfoHeader.length, 8);

const icoData = Buffer.concat([icoHeader, directoryEntry, bmpInfoHeader, imageData]);

const outputPath = path.join(__dirname, 'build', 'icon.ico');
fs.writeFileSync(outputPath, icoData);
console.log('ICO icon generated successfully!');

const iconsDir = path.join(__dirname, 'build', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

for (const size of [16, 32, 48, 64, 128, 256]) {
  const pngPath = path.join(iconsDir, `${size}x${size}.png`);
  fs.writeFileSync(pngPath, generatePNG(size));
}
console.log('PNG icons generated successfully!');

function generatePNG(size) {
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr.writeUInt8(8, 8);
  ihdr.writeUInt8(2, 9);
  ihdr.writeUInt8(0, 10);
  ihdr.writeUInt8(0, 11);
  ihdr.writeUInt8(0, 12);
  
  return Buffer.concat([signature, createChunk('IHDR', ihdr), createChunk('IEND', Buffer.alloc(0))]);
}

function createChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const typeBuffer = Buffer.from(type);
  const crc = crc32(Buffer.concat([typeBuffer, data]));
  const crcBuffer = Buffer.alloc(4);
  crcBuffer.writeUInt32BE(crc >>> 0, 0);
  return Buffer.concat([length, typeBuffer, data, crcBuffer]);
}

function crc32(data) {
  let crc = 0xFFFFFFFF;
  const table = [];
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  for (let i = 0; i < data.length; i++) {
    crc = table[(crc ^ data[i]) & 0xFF] ^ (crc >>> 8);
  }
  return crc ^ 0xFFFFFFFF;
}