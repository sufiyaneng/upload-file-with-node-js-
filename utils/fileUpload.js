import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Manually define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const saveUploadedFile = (req, callback) => {
  const boundary = req.headers['content-type'].split('boundary=')[1];
  if (!boundary) return callback(new Error('Boundary not found'));

  let rawData = Buffer.alloc(0);

  req.on('data', (chunk) => {
    rawData = Buffer.concat([rawData, chunk]);
  });

  req.on('end', () => {
    const parts = rawData.toString().split(`--${boundary}`);
    const filePart = parts.find((part) => part.includes('Content-Disposition: form-data;') && part.includes('filename='));
    if (!filePart) return callback(new Error('File not found in request'));

    const fileMatch = filePart.match(/filename="(.+)"/);
    if (!fileMatch || !fileMatch[1]) return callback(new Error('Invalid file data'));

    const filename = fileMatch[1];
    const fileDataStart = filePart.indexOf('\r\n\r\n') + 4;
    const fileDataEnd = filePart.lastIndexOf('\r\n');
    const fileData = filePart.slice(fileDataStart, fileDataEnd);

    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }

    const filePath = path.join(uploadsDir, filename);
    fs.writeFileSync(filePath, fileData, { encoding: 'binary' });

    callback(null, filePath);
  });

  req.on('error', (err) => callback(err));
};

export default saveUploadedFile;
