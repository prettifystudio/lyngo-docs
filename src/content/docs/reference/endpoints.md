---
title: "CLI endpoints"
description: "The HTTP contract behind the CLI, for anyone writing their own client."
---

Base: `https://lyngo.app`. JSON in and out. Authenticated calls carry `Authorization: Bearer <token>` and, for a personal token, `X-Lyngo-Remote: <git remote url>`.

| method and path | auth | does |
|---|---|---|
| `POST /cli/device` | none | starts a login: `{device_code, user_code, verification_url, interval, expires_in}` |
| `POST /cli/token` | none | `{device_code}` → `{token}` once confirmed; `authorization_pending`, `slow_down` or `expired` before |
| `GET /cli/me` | token | the account, the token prefix, the workspaces |
| `DELETE /cli/token` | token | revoke this token |
| `POST /cli/projects` | token | `{remote, branch, workspace?}` → the project, or `{needs_github_app, connect_url}` |
| `GET /cli/projects/status?remote=` | token | whether GitHub covers the repository, and the project when it exists; while the App has no access, the server asks GitHub directly |
| `POST /cli/projects/{id}/detect` | token | the i18n setup, read from the branch on GitHub |
| `PATCH /cli/projects/{id}` | token | `{languages, primary_language}` |
| `POST /cli/projects/{id}/scaffold` | token | `{tree, files}` → `{patch, install_command, notes}`; `409 {needs: [paths]}` asks for more files |
| `POST /mcp/admin` | token | JSON-RPC `tools/call` for every tool; `localize` and `translate` with `async: true` answer `{job, status}`, then `job_status` gives the result (see [MCP tools](/reference/mcp-tools/#jobs-async-and-job_status)) |

Rate limits answer `429`. A refused token answers `401`. A project the token cannot see answers `404`.

## Versions

Since CLI 0.2.12, every call carries `User-Agent: lyngo-cli/<version> (node <node version>; <platform>)`. For such a call, the answers of `/cli/*` and `/mcp/admin` carry these headers:

| header | value |
|---|---|
| `X-Lyngo-Cli-Latest` | the newest CLI on npm, for example `0.2.13` |
| `X-Lyngo-Cli-Minimum` | the oldest CLI Lyngo accepts; not sent when Lyngo accepts every version |
| `X-Lyngo-Server` | the short commit of the server build that answered, for example `468e436`; not sent when the server does not know its commit. CLI 0.2.15 prints it in `lyngo status` and in the summary line of `lyngo localize` |

A CLI below the minimum gets `426`, on `/cli/*` and on `/mcp/admin` alike, as plain JSON (not a JSON-RPC error, like the `401` and `404` of `/mcp/admin`):

```json
{"error": "cli_too_old", "message": "This lyngo CLI (0.2.12) is too old; Lyngo needs 0.2.13 or newer. Update it: npm i -g @prettifystudio/lyngo-cli"}
```

A call without that User-Agent never gets the headers or the `426`. See [Updates](/get-started/#updates).
