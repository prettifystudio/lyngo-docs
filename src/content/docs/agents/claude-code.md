---
title: "Claude Code"
description: "The plugin: a hook that localizes at the end of a task, and three tools while the agent writes."
---

`lyngo init` sets this up when Claude Code is installed. Nothing else is needed.

## What the agent gets

- **A Stop hook** that runs `lyngo localize` when a task ends. The agent sees the ten-line report and shows it to you. The files never pass through the model.
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

It carries the skill `lyngo-i18n`, the command `/lyngo:localize`, and the hook. The CLI itself comes from npm.

## What it costs

The same feature built twice by Claude Code on fresh clones of the same repository: alone, the agent localized by hand for $1.79 and 14,441 output tokens; with the CLI at the end, $1.44 and 8,967 output tokens, with the same checks passed. Measured on 2026-10-10 on a settings page with five languages. The gap grows with the number of strings and languages.
