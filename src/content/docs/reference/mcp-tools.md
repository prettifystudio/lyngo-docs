---
title: "MCP tools"
description: "Every tool, where it lives, and what it needs."
---

`/mcp` serves the first three. `/mcp/admin` serves all 22. Tools marked **confirm** refuse without `"confirm": true`.

| tool | what it does |
|---|---|
| `status` | languages, library, catalog folder, last scan, open pull requests, refused strings |
| `lookup` | per text: key exists, translations, near duplicates, refused |
| `check` | one file's user-facing strings and the file rewritten, in the project's key style (text or path keys) |
| `localize` | every changed file in one call; files and catalogs back, or a patch with `format: "patch"`; 30 files a call, the rest in `deferred`; with `async: true`, a job of up to 100 files (see below) |
| `select_files` | out of a list of repository paths (at most 20,000), the ones a scan would process; `lyngo localize --all` uses it |
| `translate` | keys into the catalogs; with `async: true`, a job |
| `job_status` | the state of a `localize` or `translate` job |
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

## localize

| argument | meaning |
|---|---|
| `files` | required: every changed source file, `{path, content}` |
| `catalogs` | the catalog files from the working tree, `lang/*.json` and Laravel's `lang/<code>/*.php`; read from the repository when absent |
| `context` | read-only files from the working tree, usually the paths a previous answer listed in `needs`; never edited, localized or returned; at most 50 files of 512 KB each; they do not count toward the file limit |
| `translate` | translate the new keys (default: the project's "Translate when localizing" setting) |
| `languages` | the target languages to fill (default: the project's) |
| `format` | `files` (default) or `patch` |
| `async` | `true`: queue a job and answer at once |

The answer holds `files` and `catalogs` (or `patch`), the `report`, `deferred` (the files left for the next call) and `next`. A call without `async` takes 30 files; a job takes 100. The files of one enum go in the same call when they fit.

**`needs`.** Lyngo reads the files you did not send from the project's branch on GitHub. When a decision needs your working tree's copy of such a file (today: [enum labels](/frameworks/enum-labels/)), the answer lists those paths in `needs`. Do not write that answer. Call again with the same arguments plus those files in `context`, and write the second answer.

## Jobs: async and job_status

`localize` and `translate` with `"async": true` answer at once with `{job, status}`. Call `job_status` with `{job}` every few seconds. It answers `queued`, `running`, `done` or `failed`. When done, `result` holds exactly what the call returns without `async`; apply it the same way. When failed, `error` says why. Jobs are kept for a day. A job runs within the worker's hour, so it is not cut by a proxy's time limit the way a long call is.

`translate` takes `keys` (required), `catalogs`, `languages` and `async`, and returns the catalogs and a report.
