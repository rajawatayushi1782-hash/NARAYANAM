const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
['index.html', 'apartments.html', 'contact.html'].forEach(f => {
  const p = path.join(root, f);
  if (!fs.existsSync(p)) return;
  let content = fs.readFileSync(p, 'utf8');
  content = content.replace(/\sintegrity="[^"]*"/gi, '');
  content = content.replace(/\sintegrity='[^']*'/gi, '');
  content = content.replace(/\scrossorigin="[^"]*"/gi, '');
  content = content.replace(/\scrossorigin='[^']*'/gi, '');
  fs.writeFileSync(p, content);
  console.log('Successfully cleaned integrity & crossorigin from', f);
});
