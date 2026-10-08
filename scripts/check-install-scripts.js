// Fails the build if any dependency in package-lock.json runs code at install
// time (preinstall/install/postinstall) and isn't on the reviewed allowlist.
const fs = require('fs');

const lock = JSON.parse(fs.readFileSync('package-lock.json', 'utf8'));
const allowlist = JSON.parse(fs.readFileSync('install-script-allowlist.json', 'utf8'));

const flagged = Object.entries(lock.packages || {})
  .filter(([path, pkg]) => path && pkg.hasInstallScript)
  .map(([path, pkg]) => ({ name: path.replace(/^.*node_modules\//, ''), version: pkg.version }))
  .filter(({ name }) => !allowlist.includes(name));

if (flagged.length) {
  console.error('::error::Dependencies with unreviewed install scripts:');
  flagged.forEach(({ name, version }) => console.error(`  - ${name}@${version}`));
  console.error('Review the package. If it is legitimate, add it to install-script-allowlist.json in a reviewed PR.');
  process.exit(1);
}
console.log('No unreviewed install scripts found.');
