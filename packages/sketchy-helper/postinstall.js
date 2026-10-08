// SIMULATED attack: a real one would send this to an attacker's server.
// This demo only writes it to a local file to prove code ran at install time.
const fs = require('fs');
const secret = process.env.FAKE_SECRET || '(no FAKE_SECRET set)';
fs.writeFileSync('/tmp/pwned.txt', `postinstall ran. It could read: ${secret}\n`);
console.log('[sketchy-helper] postinstall executed');
