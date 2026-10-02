import multer from 'multer';
import { randomUUID } from 'node:crypto';
import { serviceImageDirectory } from '../config/uploads.js';

const imageExtensions = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, serviceImageDirectory),
  filename: (_req, file, callback) => callback(null, `${randomUUID()}${imageExtensions[file.mimetype] || ''}`),
});

export const uploadServiceImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, callback) => {
    if (!imageExtensions[file.mimetype]) {
      return callback(new Error('Use a JPG, PNG, WebP, or GIF image under 5 MB.'));
    }
    return callback(null, true);
  },
});

export const isValidRasterImage = (mimeType, bytes) => {
  if (mimeType === 'image/jpeg') return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (mimeType === 'image/png') return bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  if (mimeType === 'image/gif') return bytes.subarray(0, 6).toString('ascii').match(/^GIF8[79]a$/) !== null;
  if (mimeType === 'image/webp') {
    return bytes.subarray(0, 4).toString('ascii') === 'RIFF'
      && bytes.subarray(8, 12).toString('ascii') === 'WEBP';
  }
  return false;
};
