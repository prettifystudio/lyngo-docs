---
title: "Configuration"
description: "Environment variables and files the CLI uses."
---

## Files

| path | holds |
|---|---|
| `~/.config/lyngo/token` | the personal token from `lyngo login`, mode 600 |
| `~/.config/lyngo/update-notice.json` | the last [update line](/get-started/#updates) the CLI printed and when, so it prints it at most once a day |
| `.claude/settings.local.json` | the Stop hook, written by `lyngo init`; git ignores it |
| `.git/lyngo-hook.json` | the files the Stop hook sent, by content, so it sends only what changed since its last run |
| `~/.claude.json` | the `lyngo` MCP server in local scope for this repository |

## Environment

| variable | meaning | default |
|---|---|---|
| `LYNGO_TOKEN` | a token used instead of the file | |
| `LYNGO_HOST` | the Lyngo host | `https://lyngo.app` |
| `LYNGO_URL` | the MCP endpoint the CLI calls | `$LYNGO_HOST/mcp/admin` |
| `LYNGO_NO_BROWSER` | `1`: print addresses, never open them | |
| `LYNGO_JOB_TIMEOUT` | seconds to wait for one `localize` or `translate` job | `3900` (65 minutes) |
| `CI` | set (any value but `false`): `lyngo init` stops at the GitHub step with exit code 3 instead of waiting | |

## Limits

- 60 calls a minute per token.
- 100 files per `localize` job; the CLI loops.
- 50 read-only context files per `localize` call, 512 KB each.
- 100 keys per `translate` chunk; the CLI loops.
- Login codes expire after 15 minutes and work once.
