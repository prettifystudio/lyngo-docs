---
title: "MCP tools"
description: "Every tool, where it lives, and what it needs."
---

`/mcp` serves the first three. `/mcp/admin` serves all seven.

| tool | what it does |
|---|---|
| `status` | languages, library, catalog folder, last scan, open pull requests, refused strings |
| `lookup` | per text: key exists, translations, near duplicates, refused |
| `check` | one file's user-facing strings and the file rewritten, in the project's key style (text or path keys) |
| `localize` | every changed file in one call, as a job (`async: true`) of up to 100 files, the rest in `deferred`; files and catalogs back, or a patch with `format: "patch"` (see below) |
| `select_files` | out of a list of repository paths (at most 20,000), the ones a scan would process; `lyngo localize --all` uses it |
| `translate` | keys into the catalogs, as a job (`async: true`) |
| `job_status` | the state of a `localize` or `translate` job |

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
| `async` | required, `true`: queue a job and answer at once |

The job's result holds `files` and `catalogs` (or `patch`), the `report`, `deferred` (the files left for the next call) and `next`. A job takes 100 files. The files of one enum go in the same call when they fit.

**`needs`.** Lyngo reads the files you did not send from the project's branch on GitHub. When a decision reads such a file, the answer lists its path in `needs` and its blob SHA in `needs_sha`. Your working tree can hold a newer copy. Do not write that answer. Call again with the same arguments plus those files in `context`, and write the second answer. A file whose blob (`git hash-object`) equals its `needs_sha` can stay out. When every file stays out, write the first answer.

## Jobs: async and job_status

`localize` and `translate` with `"async": true` answer at once with `{job, status}`. Call `job_status` with `{job}` every few seconds. It answers `queued`, `running`, `done` or `failed`. When done, `result` holds the answer of the call; apply it as described above. When failed, `error` says why. Jobs are kept for a day. A job runs within the worker's hour, so it is not cut by a proxy's time limit the way a long call is.

`translate` takes `keys` (required), `catalogs`, `languages` and `async` (required, `true`), and returns the catalogs and a report.

A call to `localize` or `translate` without `"async": true` (CLI 0.2.6 and older) answers with an error: `This lyngo CLI is too old. Update it: npm i -g @prettifystudio/lyngo-cli`.
