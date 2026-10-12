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
| `GET /cli/projects/status?remote=` | token | whether GitHub covers the repository, and the project when it exists |
| `POST /cli/projects/{id}/detect` | token | the i18n setup, read from the branch on GitHub |
| `PATCH /cli/projects/{id}` | token | `{languages, primary_language}` |
| `POST /cli/projects/{id}/scaffold` | token | `{tree, files}` → `{patch, install_command, notes}`; `409 {needs: [paths]}` asks for more files |
| `POST /mcp/admin` | token | JSON-RPC `tools/call` for every tool |

Rate limits answer `429`. A refused token answers `401`. A project the token cannot see answers `404`.
