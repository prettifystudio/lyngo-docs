---
title: "Troubleshooting"
description: "Every message the CLI can print, and what to do."
---

| message | what to do |
|---|---|
| `not logged in. Run lyngo login first.` | `lyngo login`. |
| `the token was refused (revoked or expired). Run lyngo login.` | Someone revoked it in Settings, CLI, or it belongs to another host. `lyngo login`. |
| `the code expired. Run lyngo login again.` | Codes last 15 minutes. |
| `the login was cancelled in the browser.` | Run it again and confirm. |
| `the server did not answer with a login code. Check LYNGO_HOST.` | `LYNGO_HOST` points somewhere that is not Lyngo. |
| `not a git repository. Run lyngo inside your project.` | `cd` into the repository. |
| `this repository has no origin remote. Add the GitHub remote first.` | `git remote add origin git@github.com:you/app.git`. |
| `No Lyngo project for this repository. Run lyngo init.` | The remote is not a project you can see. `lyngo init`, or ask the owner. |
| `GitHub is still not connected after 10 minutes. Run lyngo init again once it is.` | Install the Lyngo app on the repository: the app, Configure, Repository access. Then `lyngo init`. |
| `GitHub reports the repository as connected, but Lyngo cannot see it yet.` | Wait a minute and run `lyngo init` again. |
| `choose the languages with --languages fr,de.` | No terminal to ask in. Pass the flag. |
| `the languages were not saved.` | The message above it says why: the plan, a scan in progress, a code Lyngo does not know. |
| `the server asked for files this working tree does not have` | The setup needs a file that is not in your checkout. Pull, then `lyngo init`. |
| `the patch did not apply (…); it is at /tmp/lyngo-….patch` | Your working tree changed between the read and the write. Apply the patch by hand or run `lyngo localize` again. |
| `too many calls. Wait a minute and try again.` | 60 calls a minute per token. |
| `xx is not one of the project's languages` | `lyngo init --languages …` first. |

## Things that look wrong but are not

- **"Detection reads master on GitHub. Push first for an exact result."** Detection reads the branch on GitHub, not your disk. If your local branch is ahead, push, then run `init` again.
- **A label stayed in English.** The engine fails closed: a word the program also compares or resolves is left alone. `lyngo check <file>` shows what it sees. Wrap it by hand if it is copy; the key and the translations follow at the next `localize`.
- **"1 flagged for review"** on a language. The value is written; the verifier wants a human eye on it. Read it in the catalog.
- **A new language has few keys.** It was added without a catalog. `lyngo translate <code>` fills it.

## Still stuck

Write to hello@lyngo.app with the command you ran and its output. The output never contains your token.
