# Supply Chain Gate PoC

Practice repo. I wanted to get hands on with writing my own GitHub Actions workflow from scratch and with npm supply chain risk. So I built a small gate and a fake malicious package to test it against.

## The problem

SCA tools (Snyk, `npm audit`) catch packages with known CVEs. But a new malicious package or a hijacked update isn't in any database yet. And npm packages can run code on install (`postinstall`), so if CI runs `npm install` first, that code runs on the runner before any scan does.

## What the workflow does

On every PR into `main`:

1. `npm ci --ignore-scripts`: install only what's pinned in the lockfile, and don't run install scripts
2. `scripts/check-install-scripts.js`: fail if any dependency has an install script that isn't on the allowlist (npm marks these with `hasInstallScript` in the lockfile)
3. `npm audit --audit-level=high`: fail on known Critical/High vulns

Read-only permissions. Set as a required check on `main`.

## Testing it

`packages/sketchy-helper` is a fake malicious package (local only, never published). Its postinstall reads a fake secret and writes it to a file.

| Test | Result |
| --- | --- |
| Plain `npm install` with sketchy-helper | postinstall runs, reads the fake secret |
| Pipeline with sketchy-helper | script never runs, install-script check fails |
| Pipeline with `lodash@4.17.20` | install-script check passes, `npm audit` fails |

| Pipeline with `lodash@4.17.20` | install-script check passes, `npm audit` fails |

---

**Malicious install script blocked (PR #1):**


<img width="2764" height="1298" alt="Screenshot 2026-10-07 231658" src="https://github.com/user-attachments/assets/99773755-db6c-4157-bd35-60e7babdebd4" />

---

**Known-vulnerable package blocked (PR #2):**


<img width="2850" height="1362" alt="Screenshot 2026-10-07 232325" src="https://github.com/user-attachments/assets/eff96b25-ec4b-4274-8edf-2a59bfa6cc6d" />


## What it doesn't cover

- Malicious code that runs on import instead of install
- Typosquatting and dependency confusion 
