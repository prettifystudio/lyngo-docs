---
title: "lyngo localize"
description: "Localize and translate what changed in the working tree."
---

```sh
lyngo localize [--all] [--languages fr,de] [--no-translate] [--dry] [--hook]
```

Reads the files you changed, sends them with the catalogs, applies the patch, prints the report. Nothing is committed.

```text
lyngo: 12 strings localized in 3 files; 9 new keys, 3 reused. (server 468e436)
  resources/js/pages/settings/Reminders.vue: "Payment reminders", "Days before due date", "Channel", …
  app/Http/Controllers/Settings/ReminderController.php: "Your reminder settings have been saved."
  resources/js/components/ReminderChannel.vue: "Email", "Text message"
  files changed: 3, catalogs changed: 4
  fr: 9 translated, 0 from memory
  de: 9 translated, 0 from memory
  ar: 8 translated, 1 from memory; 1 flagged for review: "Reminder message"
```

## The report, line by line

- **strings localized**: literals that were wrapped in your framework's call.
- **new keys**: added to the primary catalog. **reused**: already there; the translation existed too.
- **server**: the commit of the Lyngo server that answered, since CLI 0.2.15. Include it when you report a problem.
- **per file**: the strings wrapped there, the first six.
- **files changed**, **catalogs changed**: every file the patch changed, and the catalog files apart. A file can change without a wrapped string, for example by an [enum label](/frameworks/enum-labels/) edit.
- **enum labels**: the parts of the enum-label edits, for example `enum labels: 1 enum, 2 resources, 3 frontend reads, 1 type`. Shown only when there are some.
- **per language**: `translated` by the translator, `from memory` from the workspace's translation memory, `flagged for review` by the verifier (a placeholder moved, a plural form missing, a register mismatch, a cut phrase). A flagged value is still written; read it before you commit.
- **path keys no catalog holds**: path keys such as `auth.failed` that a file calls and no catalog has. Shown only when there are some; add the key or fix the call.
- **not translated yet**: `de: 40 keys not translated yet ("…", …): run lyngo translate de`. A call translates a limited number of keys per language; the keys over that limit wait for the next run or for `lyngo translate`.
- **skipped**: `skipped <path>: <reason>`, a path the server refused.
- **Laravel lang files added**: `Laravel lang files added: lang/fr/auth.php, …`, the stock Laravel files (`auth.php`, `pagination.php`, `passwords.php`, `validation.php`) that the patch added where they were missing.
- **encoding**: `converted to UTF-8 (was Windows-1252): <path>` and `left as written, not UTF-8: <path>`. See [Which files](#which-files).
- **submodules**: `<path> is a submodule: commit it there too`. See [Which files](#which-files).
- **warnings (N)**: texts left as written, values a database may store, machine text, keys no longer used, [enum labels](/frameworks/enum-labels/) left out. The first 10 are shown, then `… and N more`. [Troubleshooting](/troubleshooting/#warnings-in-the-report) says what to do for each.

When no file changed: `lyngo: nothing changed in the working tree.` When the server sends no patch back: `Nothing to change: every string a person reads already goes through an i18n call.`

## Which files

Changed files from `git status`, tracked or not, with these extensions: `.blade.php`, `.php`, `.tsx`, `.jsx`, `.ts`, `.js`, `.vue`, `.svelte`. Never under `vendor`, `node_modules`, `tests`, `database`, `storage`, `bootstrap`, `public`, `config` or `.git`.

Lyngo reads and writes UTF-8 only. Since CLI 0.2.14, a Windows-1252 file is converted to UTF-8 on disk before it is sent; its charset declaration then says UTF-8 too. The report names it: `converted to UTF-8 (was Windows-1252): <path>`. A file in another encoding is not sent and stays as it is. The report names it: `left as written, not UTF-8: <path>`.

Since CLI 0.2.14, the files of checked-out git submodules are sent too, with `--all` and as changed files. Their keys go to the app's catalogs. The report names each submodule that changed: `<path> is a submodule: commit it there too`. Commit the change in the submodule's repository too. A scan of a push cannot change a submodule; it names the submodules in a warning instead.

With the files go the catalogs from disk: the JSON catalogs of both catalog folders (Laravel's `lang` and the front-end's own, when they differ) and Laravel's `lang/<code>/*.php`. The CLI reads them again before every call.

## Jobs on the server

Since CLI 0.2.7, each call is a job on the server. The CLI sends the call, gets a job id at once, and asks for the job's state every 2.5 seconds until it is done. While it waits it prints `... Lyngo is still working (running, 30 s)` every 15 seconds. It waits up to 65 minutes; `LYNGO_JOB_TIMEOUT` sets another limit in seconds.

A job takes up to 100 files. With more, the server names the rest, and the CLI sends them in the next job with the catalogs as they are on disk then. The files of one enum (the enum, its models, resources, types and the components that read it) go in the same job. You see one report.

## A patch that does not apply

Your working tree can change between the read and the write. Since CLI 0.2.13, when the patch does not apply as a whole, the CLI applies it file by file and names each file:

```text
  the patch did not apply as a whole; each file alone:
    applied: resources/views/welcome.blade.php
    failed: app/Http/Controllers/HomeController.php (patch failed: app/Http/Controllers/HomeController.php:12; …)
lyngo: 1 file not changed, the patch did not apply: app/Http/Controllers/HomeController.php. The blocks are at /tmp/lyngo-failed-….patch
```

- The reason in brackets comes from git.
- A file that failed keeps its content. Its blocks stay in the file that the last line names.
- The command ends with exit code 1. The hook mode always ends with exit code 0.
- With `--all`, the first line names the batch (`batch 2: the patch did not apply as a whole; …`), and the next batch goes on.

Run `lyngo localize` again to send the failed files again, or apply their blocks by hand.

## Reading the repository

A file you did not send is read from GitHub, from the project's branch: a component's definition, an enum, a model. Lyngo reads it and never edits it.

Your working tree can be ahead of GitHub. When a decision needs your copy of such a file (today: [enum labels](/frameworks/enum-labels/)), the answer lists those paths in `needs` and the CLI does not apply it. It sends the batch once more with your copies as read-only context, and applies the second answer. It sends only source files inside the repository (the extensions and folders above), at most 50, of 512 KB each at most.

## Flags

| flag | meaning |
|---|---|
| `--languages fr,de` | fill only these languages this time |
| `--no-translate` | wrap and add the keys only; leave the other languages' catalogs to your translators |
| `--dry` | print the patch instead of applying it |
| `--hook` | the Claude Code Stop hook mode (see below) |

## Localization without translation

Some teams wrap with Lyngo and translate with people. `--no-translate` does that for one run; the project setting **Translate when localizing** (Settings, Translation) does it every time, including for the Claude Code hook, which runs `localize` without flags. With the setting off, the report ends with `catalogs: not translated (keys only).` and the editor, `lyngo translate`, or your translators fill the catalogs.

## After

`git diff` shows the change. Commit when you are happy. With Claude Code, the Stop hook runs this command at the end of a task.

## In the Claude Code hook

`lyngo localize --hook` is the command the Stop hook runs. It prints one JSON object for Claude Code: a line for you, and the full report for the agent, which tells you what changed. A failure (not logged in, no project, a network error) comes back as a line with the fix instead of a hook error.

- **Where.** It runs in the project where the Claude Code session started (`$CLAUDE_PROJECT_DIR`), when that folder is in a git work tree. Otherwise it runs in the current folder.
- **What it sends.** Only the files whose content changed since its last run. It keeps their state in `.git/lyngo-hook.json`. With nothing new to send it prints nothing.
- **What you see.** For example `Lyngo: 8 strings localized in 3 files, 7 new keys; fr: 7 translated`. When the patch changed files without a wrapped string, it counts them: `Lyngo: 3 files changed (enum labels)`. When nothing needed a change: `Lyngo: checked 2 files, nothing to localize`.

Commit after `lyngo localize --all`. The plain `lyngo localize` sends every uncommitted source file, and the hook sends every file it has not seen yet, so an uncommitted `--all` result goes to the server again.

## The whole repository

`lyngo localize --all` takes every source file a scan would read, not only the changed ones: the project's frameworks, without vendor, build output, tests and configuration. The server picks the paths with the scan's own rules. The CLI sends them in jobs of up to 100 files, applies each patch before the next job, and prints a line per batch. The keys, the translation memory and the glossary keep the batches consistent. At the end the result sits in your working tree: review it with `git diff` and commit. No pull request. Run it once on a repository that was never localized; afterwards the hook and the plain `lyngo localize` cover what changes.
