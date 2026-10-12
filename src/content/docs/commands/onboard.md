---
title: "lyngo onboard"
description: "The guided setup an agent follows, from lyngo.app/start."
---

```sh
lyngo onboard --run=<id> [--languages fr,de]
```

The command behind [lyngo.app/start](https://lyngo.app/start). The page gives you one prompt to paste into your coding agent; the prompt runs this command with the page's run id. From there the CLI does what it can and stops with one instruction whenever a person must act. Run it again to continue; it picks up where it stopped.

The seven steps, as the page shows them:

| step | what happens | stops when |
|---|---|---|
| CLI running | checks for git, a GitHub remote and `laravel/framework` | the folder is not a Laravel repository |
| Logged in | uses the saved token, or starts a login code | the person must enter the code in the browser |
| GitHub connected | finds or creates the project | the Lyngo GitHub app must be installed on the repository |
| Project and i18n setup | detection, then the setup patch | |
| Languages chosen | the project's languages, or `--languages` | the person must choose; the agent runs again with `--languages fr,de` |
| Agent hook installed | the MCP server and the Stop hook for Claude Code | |
| First change localized | `lyngo localize` on the working tree | there is nothing changed yet; make one visible change and run again |

Every step is reported to the page under the run id, so the person sees it tick in the browser, and a run that stops says where.

The prompt the page gives is short: run the command in the root of the Laravel project, follow its printed instructions one step at a time, stop and ask when it says so, never install packages or write translations by hand, show the last report.
