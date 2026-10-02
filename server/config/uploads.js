import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

dotenv.config();

const defaultUploadDirectory = process.env.VERCEL
  ? path.join('/tmp', 'tarotbykashif-uploads')
  : fileURLToPath(new URL('../../uploads/', import.meta.url));
export const uploadDirectory = path.resolve(process.env.SERVICE_UPLOAD_DIR || defaultUploadDirectory);
export const serviceImageDirectory = path.join(uploadDirectory, 'services');

fs.mkdirSync(serviceImageDirectory, { recursive: true });
