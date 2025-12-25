// removeVersions.js
const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'src');

function removeVersions(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      removeVersions(filePath);
    } else if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
      let content = fs.readFileSync(filePath, 'utf8');

      // Supprime toutes les versions dans les imports
      const updatedContent = content.replace(/(@[\w-]+)@[\d.]+/g, '$1');

      if (updatedContent !== content) {
        fs.writeFileSync(filePath, updatedContent, 'utf8');
        console.log(`Updated: ${filePath}`);
      }
    }
  });
}

removeVersions(folderPath);
console.log('Finished cleaning imports.');
