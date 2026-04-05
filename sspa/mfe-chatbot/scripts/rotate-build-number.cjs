// scripts/rotate-build-number.cjs
// Script padrão para rotação de build number por projeto Node.js
const fs = require('fs');
const path = require('path');

const buildFile = path.resolve(__dirname, '../build-number.json');
let buildNumber = 0;
if (fs.existsSync(buildFile)) {
  try {
    const data = JSON.parse(fs.readFileSync(buildFile, 'utf8'));
    buildNumber = typeof data.build === 'number' ? data.build : 0;
  } catch (e) {
    buildNumber = 0;
  }
}
buildNumber++;
fs.writeFileSync(buildFile, JSON.stringify({ build: buildNumber }, null, 2));
console.log(`Build number: ${buildNumber}`);
