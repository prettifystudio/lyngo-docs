---
title: "Other MCP clients"
description: "Cursor, Windsurf, a hosted agent: the same tools over HTTP."
---

Lyngo speaks MCP over HTTP. Two servers, one token:

| server | tools | for |
|---|---|---|
| `https://lyngo.app/mcp` | `status`, `lookup`, `check` | agents, while they write |
| `https://lyngo.app/mcp/admin` | all twenty | the CLI, and clients that cannot run one |

Send the token and the repository with every request:

```text
Authorization: Bearer lyn_…
X-Lyngo-Remote: git@github.com:acme/shop.git
```

A personal token comes from `lyngo login` (the file `~/.config/lyngo/token`). A project token comes from the project's Settings, Agents tab, and needs no remote header.

Cursor-style configuration:

```json
{ "mcpServers": { "lyngo": { "type": "http", "url": "https://lyngo.app/mcp", "headers": { "Authorization": "Bearer lyn_…", "X-Lyngo-Remote": "git@github.com:acme/shop.git" } } } }
```

The admin server's write tools (`scan`, `open_pr`, `revert`, `translations_pr`, `quality_check`, `glossary_set`, `glossary_delete`, `refuse`) refuse to run without `"confirm": true`, so an agent must ask you first. `localize` there takes 30 files a call and returns either the rewritten files or, with `"format": "patch"`, one unified diff. Prefer the CLI when you can run one: it keeps the files out of the model.

The full list is in [MCP tools](/reference/mcp-tools/).
