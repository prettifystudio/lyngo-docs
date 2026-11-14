---
title: "Claude Code"
description: "The plugin: a hook that localizes at the end of a task, and three tools while the agent writes."
---

`lyngo init` sets this up when Claude Code is installed. Nothing else is needed.

## What the agent gets

- **A Stop hook** that runs `lyngo localize --hook` when a task ends. You see one line, such as `Lyngo: 8 strings localized in 3 files, 7 new keys; fr: 7 translated`. When the patch changed files without a wrapped string, the line counts them: `Lyngo: 3 files changed (enum labels)`. The agent gets the full report and tells you in a sentence or two what Lyngo changed. When nothing changed since the last run, the hook says nothing, and it never sends the same file content twice (it keeps its state in `.git/lyngo-hook.json`). It runs in the project where the session started (`$CLAUDE_PROJECT_DIR`), even when the agent works in another folder. When a newer CLI is available, the line ends with the [update line](/get-started/#updates), at most once a day. The files never pass through the model.
- **Three MCP tools** at `https://lyngo.app/mcp`, for the moment the agent writes text:
  - `status`: languages, library, catalog folder, refused strings.
  - `lookup`: for each text, whether a key exists, its translations, near duplicates, and whether the team refused it. The agent reuses a key instead of inventing one.
  - `check`: one file's user-facing strings.
- **A skill** that tells the agent when to use each, and what is never copy: logs, exceptions, HTTP clients, prompts, commit messages, cache keys.

Since CLI 0.2.22, the hook comes with the [plugin](#the-plugin). Claude Code loads plugin hooks when a session starts, so a session that has the plugin runs the hook from the first stop after `lyngo init`. You do not restart. The hook runs at every stop in every repository, and acts only in a repository that `lyngo init` connected (`lyngo.project = true` in the repository's git config). In other repositories it runs one git command and prints nothing. On Windows, Claude Code runs it in Git Bash, which comes with Git for Windows.

Without the plugin, `lyngo init` puts the hook in `.claude/settings.local.json`, local to this repository and not committed. When you run `init` from an open Claude Code session, it then tells you to restart: exit, then run `claude --continue` in the repository to keep the conversation. A repository that already has this hook keeps it, and the plugin's hook leaves the stop to it: the hook runs once per stop.

The MCP server is added in Claude Code's local scope; `claude mcp list` shows it as `lyngo`. Claude Code loads it when the next session starts. Until then, the agent gets the same answers from `lyngo status`, `lyngo lookup` and `lyngo check`. The MCP server is no reason to restart.

After `lyngo localize --all`, commit before the next task: the hook sends every file it has not seen yet, the `--all` result too.

## The plugin

The marketplace entry lives at `github.com/prettifystudio/lyngo-claude-plugin`:

```sh
claude plugin marketplace add prettifystudio/lyngo-claude-plugin
claude plugin install lyngo@lyngo
```

It carries the Stop hook, the skill `lyngo-i18n` and the commands `/lyngo:init`, `/lyngo:localize`, `/lyngo:status` and `/lyngo:login`. `/lyngo:init` tells the agent to ask you about the locale detection order before it edits `app/Http/Middleware/SetLocale.php`. The CLI itself comes from npm; `lyngo init` prints these two lines when Claude Code has no lyngo plugin yet.

Without the plugin, say it in words: "run lyngo init", "run lyngo localize". The agent runs the command and shows its output.

## What it costs

The same feature built twice by Claude Code on fresh clones of the same repository: alone, the agent localized by hand for $1.79 and 14,441 output tokens; with the CLI at the end, $1.44 and 8,967 output tokens, with the same checks passed. Measured on 2026-10-10 on a settings page with five languages. The gap grows with the number of strings and languages.
