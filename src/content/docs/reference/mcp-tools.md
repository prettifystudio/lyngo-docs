---
title: "MCP tools"
description: "Every tool, where it lives, and what it needs."
---

`/mcp` serves the first three. `/mcp/admin` serves all. Tools marked **confirm** refuse without `"confirm": true`.

| tool | what it does |
|---|---|
| `status` | languages, library, catalog folder, last scan, open pull requests, refused strings |
| `lookup` | per text: key exists, translations, near duplicates, refused |
| `check` | one file's user-facing strings and the file rewritten |
| `localize` | every changed file in one call; files and catalogs back, or a patch with `format: "patch"`; 30 files a call, the rest in `deferred` |
| `translate` | keys into the catalogs |
| `verify` | one language's catalog audited |
| `scan` **confirm** | start a scan on GitHub, `incremental` or `full` |
| `scan_results` | a scan's state and results |
| `cancel_scan` | stop the running scan |
| `open_pr` **confirm** | open the pull request of a finished scan |
| `pull_requests` | Lyngo's pull requests, filter by status |
| `revert` **confirm** | revert a merged Lyngo pull request |
| `glossary` | the terms, filter by language |
| `glossary_set` **confirm** | add or change a project term |
| `glossary_delete` **confirm** | delete a project term |
| `refuse` **confirm** | take texts out of localization |
| `allow` | let refused texts be localized again |
| `set_translation` | manual values in the editor's working copy |
| `translations_pr` **confirm** | one pull request with every pending editor change |
| `quality_check` **confirm** | the quality check on every shipped catalog |

Every tool acts as the person behind the token, with the same permissions and plan limits as in the web app.
