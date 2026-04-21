const fs = require('fs');
const path = require('path');

const walk = (dir, callback) => {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(file => {
    let filepath = path.join(dir, file);
    let stat = fs.statSync(filepath);
    if (stat.isDirectory() && !filepath.includes('node_modules') && !filepath.includes('.git') && !filepath.includes('dist')) {
      walk(filepath, callback);
    } else if (stat.isFile() && (filepath.endsWith('.jsx') || filepath.endsWith('.js') || filepath.endsWith('.css') || filepath.endsWith('.html') || filepath.endsWith('.md') || filepath.endsWith('.json'))) {
      if (!filepath.includes('package-lock.json')) callback(filepath);
    }
  });
};

const root = __dirname;
let replacedCount = 0;

walk(root, (filepath) => {
  let original = fs.readFileSync(filepath, 'utf8');
  let content = original;

  content = content.replace(/Aptitude/g, 'Aptitude');
  content = content.replace(/Aptitude/g, 'Aptitude');
  content = content.replace(/aptitude/g, 'aptitude');
  content = content.replace(/APTITUDE/g, 'APTITUDE');
  content = content.replace(/Aptitude/gi, 'Aptitude');
  content = content.replace(/Aptitude /g, 'Aptitude ');
  content = content.replace(/aptitude-server/g, 'aptitude-server');

  if (content !== original) {
    fs.writeFileSync(filepath, content);
    console.log(`Updated ${filepath.replace(__dirname, '')}`);
    replacedCount++;
  }
});

console.log(`Total files updated: ${replacedCount}`);
