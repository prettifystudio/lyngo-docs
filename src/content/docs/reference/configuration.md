---
title: "Configuration"
description: "Environment variables and files the CLI uses."
---

## Files

| path | holds |
|---|---|
| `~/.config/lyngo/token` | the personal token from `lyngo login`, mode 600 |
| `.claude/settings.local.json` | the Stop hook, written by `lyngo init`; git ignores it |
| `~/.claude.json` | the `lyngo` MCP server in local scope for this repository |

## Environment

| variable | meaning | default |
|---|---|---|
| `LYNGO_TOKEN` | a token used instead of the file | |
| `LYNGO_HOST` | the Lyngo host | `https://lyngo.app` |
| `LYNGO_URL` | the MCP endpoint the CLI calls | `$LYNGO_HOST/mcp/admin` |
| `LYNGO_NO_BROWSER` | `1`: print addresses, never open them | |

## Limits

- 60 calls a minute per token.
- 30 files per `localize` call; the CLI loops.
- 100 keys per `translate` chunk; the CLI loops.
- Login codes expire after 15 minutes and work once.
