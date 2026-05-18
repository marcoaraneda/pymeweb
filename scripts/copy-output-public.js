import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');
const sourceDir = path.join(projectRoot, '.output', 'public');
const destDir = path.join(projectRoot, 'public');

// Create the destination directory if it doesn't exist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Function to copy directory recursively
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const files = fs.readdirSync(src);
  files.forEach(file => {
    const srcFile = path.join(src, file);
    const destFile = path.join(dest, file);
    const stat = fs.statSync(srcFile);

    if (stat.isDirectory()) {
      copyDir(srcFile, destFile);
    } else {
      fs.copyFileSync(srcFile, destFile);
    }
  });
}

// Execute the copy
try {
  console.log(`Copying from ${sourceDir} to ${destDir}...`);
  copyDir(sourceDir, destDir);
  console.log('Generated public .output/public');
  console.log('Successfully copied build output to public directory');
} catch (error) {
  console.error('Error copying directory:', error);
  process.exit(1);
}
