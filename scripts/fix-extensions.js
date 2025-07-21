import fs from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const glob = require('glob');

const files = glob.sync('dist/**/*.js');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  content = content.replace(
    /from\s+(['"])(\.\/[^'"]+?)(?<!\.js)(\1)/g,
    'from $1$2.js$3'
  );
  fs.writeFileSync(file, content);
}
console.log(`✅ Patched ${files.length} file(s) with ".js" import extensions`);