---
title: "Claude Code"
description: "The plugin: a hook that localizes at the end of a task, and three tools while the agent writes."
---

`lyngo init` sets this up when Claude Code is installed. Nothing else is needed.

## What the agent gets

- **A Stop hook** that runs `lyngo localize --hook` when a task ends. You see one line, such as `Lyngo: 8 strings localized in 3 files, 7 new keys; fr: 7 translated`. The agent gets the full report and tells you in a sentence or two what Lyngo changed. When nothing changed since the last run, the hook says nothing, and it never sends the same file content twice. The files never pass through the model.
- **Three MCP tools** at `https://lyngo.app/mcp`, for the moment the agent writes text:
  - `status`: languages, library, catalog folder, refused strings.
  - `lookup`: for each text, whether a key exists, its translations, near duplicates, and whether the team refused it. The agent reuses a key instead of inventing one.
  - `check`: one file's user-facing strings.
- **A skill** that tells the agent when to use each, and what is never copy: logs, exceptions, HTTP clients, prompts, commit messages, cache keys.

Both are registered in `.claude/settings.local.json`, local to this repository and not committed. The MCP server is added in local scope; `claude mcp list` shows it as `lyngo`.

## The plugin

The marketplace entry lives at `github.com/prettifystudio/lyngo-claude-plugin`:

```sh
claude plugin marketplace add prettifystudio/lyngo-claude-plugin
claude plugin install lyngo@lyngo
```

It carries the skill `lyngo-i18n` and the commands `/lyngo:init`, `/lyngo:localize`, `/lyngo:status` and `/lyngo:login`. The CLI itself comes from npm; `lyngo init` prints these two lines when Claude Code has no lyngo plugin yet.

Without the plugin, say it in words: "run lyngo init", "run lyngo localize". The agent runs the command and shows its output.

## What it costs

The same feature built twice by Claude Code on fresh clones of the same repository: alone, the agent localized by hand for $1.79 and 14,441 output tokens; with the CLI at the end, $1.44 and 8,967 output tokens, with the same checks passed. Measured on 2026-10-10 on a settings page with five languages. The gap grows with the number of strings and languages.
