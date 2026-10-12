---
title: "lyngo localize"
description: "Localize and translate what changed in the working tree."
---

```sh
lyngo localize [--languages fr,de] [--no-translate] [--dry]
```

Reads the files you changed, sends them with the catalogs, applies the patch, prints the report. Nothing is committed.

```text
lyngo: 12 strings localized in 3 files; 9 new keys, 3 reused.
  resources/js/pages/settings/Reminders.vue: "Payment reminders", "Days before due date", "Channel", …
  app/Http/Controllers/Settings/ReminderController.php: "Your reminder settings have been saved."
  fr: 9 translated, 0 from memory
  de: 9 translated, 0 from memory
  ar: 8 translated, 1 from memory; 1 flagged for review: "Reminder message"
```

## The report, line by line

- **strings localized**: literals that were wrapped in your framework's call.
- **new keys**: added to the primary catalog. **reused**: already there; the translation existed too.
- **per file**: the strings wrapped there, the first six.
- **per language**: `translated` by the translator, `from memory` from the workspace's translation memory, `flagged for review` by the verifier (a placeholder moved, a plural form missing, a register mismatch, a cut phrase). A flagged value is still written; read it before you commit.

When nothing needs to change: `lyngo: nothing changed in the working tree.` or `Nothing to change: every string a person reads already goes through an i18n call.`

## Which files

Changed files from `git status`, tracked or not, with these extensions: `.blade.php`, `.php`, `.tsx`, `.jsx`, `.ts`, `.js`, `.vue`, `.svelte`. Never under `vendor`, `node_modules`, `tests`, `database`, `storage`, `bootstrap`, `public`, `config` or `.git`.

The server takes 30 files per call. With more, the CLI makes several calls and carries the catalogs forward. You see one report.

## Flags

| flag | meaning |
|---|---|
| `--languages fr,de` | fill only these languages this time |
| `--no-translate` | wrap and add the keys only; leave the other languages' catalogs to your translators |
| `--dry` | print the patch instead of applying it |

## Localization without translation

Some teams wrap with Lyngo and translate with people. `--no-translate` does that for one run; the project setting **Translate when localizing** (Settings, Translation) does it every time, including for the Claude Code hook, which runs `localize` without flags. With the setting off, the report ends with `catalogs: not translated (keys only).` and the editor, `lyngo translate`, or your translators fill the catalogs.

## After

`git diff` shows the change. Commit when you are happy. With Claude Code, the plugin's Stop hook runs this command at the end of a task and the agent shows you the report.
