const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('slate-955')) {
    const updated = content.replace(/slate-955/g, 'slate-950');
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function traverse(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      traverse(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      replaceInFile(fullPath);
    }
  }
}

traverse(path.join(__dirname, '..', 'src'));
console.log('Finished correcting all typos!');
