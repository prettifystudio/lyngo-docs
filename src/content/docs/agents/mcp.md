---
title: "Other MCP clients"
description: "Cursor, Windsurf, a hosted agent: the same tools over HTTP."
---

Lyngo speaks MCP over HTTP. Two servers, one token:

| server | tools | for |
|---|---|---|
| `https://lyngo.app/mcp` | `status`, `lookup`, `check` | agents, while they write |
| `https://lyngo.app/mcp/admin` | all seven: the three above and `localize`, `translate`, `job_status`, `select_files` | the CLI, and clients that cannot run one |

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

`localize` there needs `"async": true`: it queues a job of up to 100 files and answers with a job id; `job_status` gives the result, either the rewritten files or, with `"format": "patch"`, one unified diff. An answer with `needs` asks for working-tree files as read-only `context`; see [MCP tools](/reference/mcp-tools/#localize). Prefer the CLI when you can run one: it keeps the files out of the model.

The full list is in [MCP tools](/reference/mcp-tools/).
