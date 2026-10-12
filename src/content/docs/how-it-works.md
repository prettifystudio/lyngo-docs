---
title: "How it works"
description: "What the CLI sends, what comes back, and what never leaves your machine."
---

## The two paths

**The CLI** works on your working tree. `lyngo localize` reads the files you changed and your catalog files from disk, sends them to Lyngo, receives a patch, and applies it with `git apply`. Nothing is committed. You review the diff.

**The GitHub App** works on pushes. It reads the project's branch, runs the same engine, and opens a pull request for anything the CLI did not cover. It never pushes to your branch.

Both run the same engine with the same memory: keys, glossary, refused strings, translation memory. A string is treated the same way whoever sends it.

## What is sent

`lyngo localize` sends:

- the source files changed in the working tree (`git status`), limited to views, components and PHP, and never `vendor`, `node_modules`, tests, config, storage or public folders;
- the catalog files of the project's languages, as they are on disk;
- the git remote, so the server knows which project you mean.

`lyngo init` sends `package.json`, `composer.json` and the files the server names when it builds the setup patch. Detection itself reads the branch on GitHub through the App.

Nothing else is read. There is no daemon, no file watcher, no telemetry.

## What comes back

A patch, and a report. The patch holds the rewritten files and the updated catalogs, as a unified diff against what you sent. The report says what was wrapped per file, which keys were added and which reused, and per language how many values were translated, how many came from translation memory, and which ones the verifier flagged for review.

The agent, when there is one, sees only the report: ten lines. The files never pass through the model. That is why the CLI path costs less than letting the agent localize by hand; the number is on the [landing page](https://lyngo.app).

## What the engine decides

1. **Copy or code.** Every string literal is judged: a label a person reads, or a token the program compares, resolves or sends somewhere. A translated code value breaks an app, so the engine fails closed: it would rather leave a label in English than wrap a token. Text handed to a machine (logs, exceptions, HTTP clients, prompts, commit messages, cache keys) is never copy.
2. **The key.** The source text is the key. A key that exists is reused; a near duplicate (a different case or trailing punctuation) is pointed to the existing one.
3. **The call.** The framework's own call, in the right scope: `__()` in Blade and PHP, `t()` from `useTranslation()` in React, `$t()` in Vue templates, `$_()` in Svelte, `i18next.t()` or `i18n.global.t` at module scope where a hook cannot run.
4. **The catalogs.** Every language gets the new keys. Values come from translation memory first, then the translator with the project's glossary, then the verifier: placeholders, plural forms per language, script, truncation, register.

## What is kept

Refused strings (texts your team took out of localization, learned from a reverted pull request or set by hand), the glossary, and the translation memory of the workspace. They apply to the CLI, the App and the agent alike.
