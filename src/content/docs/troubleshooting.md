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
| `GitHub is still not connected after 10 minutes. Add the repository to the Lyngo GitHub App, then run lyngo init again.` | The wait ended (9 minutes without a terminal). Install the Lyngo app on the repository: the app, Configure, Repository access. Then `lyngo init`. |
| `WAITING FOR THE PERSON: open the link above, add the repository to the Lyngo GitHub App, then run lyngo init again.` | Exit code 3: `CI` is set or you passed `--no-wait`. Add the repository on GitHub, then run `lyngo init` again. |
| `GitHub reports the repository as connected, but Lyngo cannot see it yet.` | Wait a minute and run `lyngo init` again. |
| `choose the languages with --languages fr,de.` | No terminal to ask in. Pass the flag. |
| `the languages were not saved.` | The message above it says why: the plan, a scan in progress, a code Lyngo does not know. |
| `the server asked for files this working tree does not have` | The setup needs a file that is not in your checkout. Pull, then `lyngo init`. |
| `npm is not installed, so the new packages are not.` or `npm install failed (exit 1).` | Run the install command it prints in the repository, then restart your dev server. |
| `the patch did not apply (…); it is at /tmp/lyngo-….patch` | Your working tree changed between the read and the write. Apply the patch by hand or run `lyngo localize` again. |
| `connection problem (…), trying again in 2 s (1/4).` | Nothing: the CLI tries again after 2, 5 and 10 seconds. |
| `could not reach https://lyngo.app (…).` | The network failed on every try. Check your connection and run the command again. |
| `the server did not finish within 65 minutes (job …). Run the command again later.` | The job is still on the server. Run the command again later; `LYNGO_JOB_TIMEOUT` sets a longer wait. |
| `Lyngo could not finish this job on the server.` | Run the command again. If it fails again, write to us with the job id it prints. |
| `No such job for this project: it may have expired (jobs are kept for a day).` | Run the command again. |
| `too many calls. Wait a minute and try again.` | 60 calls a minute per token. |
| `xx is not one of the project's languages` | `lyngo init --languages …` first. |
| `Lyngo: the CLI is not on PATH. Install it: npm i -g @prettifystudio/lyngo-cli` | The Stop hook cannot find `lyngo`. Install the CLI. |
| `This lyngo CLI is too old. Update it: npm i -g @prettifystudio/lyngo-cli` | CLI 0.2.6 and older. Run the command it prints. |
| `This lyngo CLI (0.2.12) is too old; Lyngo needs 0.2.13 or newer. Update it: npm i -g @prettifystudio/lyngo-cli` | Lyngo does not accept this version any more. Run the command it prints, then your command again. See [Updates](/get-started/#updates). |
| `Lyngo CLI 0.2.13 is available (you have 0.2.12): npm i -g @prettifystudio/lyngo-cli` | A newer CLI is on npm. Run the command when it suits you. The line comes at most once a day. See [Updates](/get-started/#updates). |

## Warnings in the report

`lyngo localize` and `lyngo translate` end with `warnings (N):`, the first 10 and `… and N more`. A scan of a push shows the same cases on the scan page, each under a title of its own.

| warning | what to do |
|---|---|
| `Enum labels: ServerStatus: getLabel() added, …` | Nothing: the [enum-label](/frameworks/enum-labels/) edits of this run. |
| `Enum labels, left as written: <place> (<Enum>): the file is not in this change` (or `<path> is not in this change`) | Lyngo edits only the files you sent; it read this one from GitHub. Run `lyngo localize --all`, which sends every source file, or push and let the GitHub App scan. |
| `Enum labels, left as written: <place> (<Enum>): no file of this change shows it as text that Lyngo can edit` (a scan says `no page shows it as text that Lyngo can edit`) | Lyngo adds a label field only with a page read it rewrites. If a page shows the value, show the label there by hand. |
| `Enum labels, API docs: status_label: may be missing from the OpenAPI docs in …` | A resource now sends a label field. Add it where your OpenAPI docs describe that resource. Lyngo does not edit API docs. |
| `Left as written, may be stored: <path>:<line> '<text>'` | A database write may store this text, so it stays in the source language. If the text is only shown and never saved, wrap it in `__()` by hand. |
| `Left as written: text next to a raw echo, …` | Lyngo never puts a raw `{!! !!}` echo in a translated sentence. Wrap the text by hand if it is copy. |
| `Left as written: a sentence that picks a part by a condition and cannot be split into one sentence per case, <path>:<line>: <text>` | The sentence has more than one part picked by a condition, or a call Lyngo cannot split. Write one sentence per case, or move the condition out of the sentence, then run `lyngo localize` again. |
| `No longer used, delete from the catalogs when no other file calls them: <path>: '<key>', …` | A call became one sentence per case. Search the code for each key, and delete it from every catalog when no file calls it. |
| `Machine text in your catalog, copied unchanged: <key> (consider building it in code, not in translations)` | The value is a command, a path, a URL or a format. Every language gets it as it is, never translated. Move it into code when you can. |
| `Not added to the catalog, machine text: <key>` | The text is for a program, not a person. The code keeps it as written. Nothing to do. |
| `mixed-language source: <path>:<line>` | A condition on the locale picks between texts and could not become one key. Use one key and put the other text in that language's catalog. |
| `Judged by its content only (the repository could not be read in full): <view>` | Lyngo could not read the code that renders the view. Run the command again. |

`lyngo init` can print one more note, after the setup patch:

| note | what to do |
|---|---|
| `The language switch route /locale/{locale} is public. Lyngo could not find the authentication of the pages that show the switcher: <reason>. If only signed-in users see the switcher, add your authentication middleware to this route.` | If only signed-in users see the switcher, add your `auth` middleware to the route. Otherwise keep it public. |

## Things that look wrong but are not

- **"Detection reads master on GitHub. Push first for an exact result."** Detection reads the branch on GitHub, not your disk. If your local branch is ahead, push, then run `init` again.
- **A label stayed in English.** The engine fails closed: a word the program also compares or resolves is left alone. `lyngo check <file>` shows what it sees. Wrap it by hand if it is copy; the key and the translations follow at the next `localize`.
- **"1 flagged for review"** on a language. The value is written; the verifier wants a human eye on it. Read it in the catalog.
- **A new language has few keys.** It was added without a catalog. `lyngo translate <code>` fills it.
- **`files changed` is higher than the files with strings.** An [enum-label](/frameworks/enum-labels/) edit changes files without wrapping a string.

## Still stuck

Write to hello@lyngo.app with the command you ran and its output. The output never contains your token.
