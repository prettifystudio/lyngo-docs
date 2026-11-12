---
title: "lyngo init"
description: "Connect a repository: project, GitHub, i18n setup, languages, agent hook."
---

```sh
lyngo init [--languages fr,de] [--primary en] [--workspace <name>] [--yes] [--github] [--wait] [--no-wait] [--no-install]
```

Run it inside the repository. It is safe to run again: on a connected repository it prints the state and changes nothing.

## What it does, in order

1. **Workspace.** Prints the workspace the project will belong to. With `--workspace <name>` it picks another one you are a member of.
2. **Project.** Finds the project for the git remote (`origin`). If none exists and you own the workspace, it creates one. Members who are not owners are set up on existing projects and sent to the owner for new ones.
3. **GitHub.** If the Lyngo GitHub App cannot read the repository, `init` prints the GitHub page for the app and waits: pick the account, add the repository under Repository access, save. When GitHub reports the repository, `init` continues by itself. In a terminal it asks before it opens the page, and waits up to 10 minutes. Without a terminal (an agent, a script) it opens the page and waits up to 9 minutes. When the wait ends first, it stops; run `lyngo init` again once the repository is added. Owners get the GitHub link; members are sent to the source-control page in Lyngo.
4. **Detection.** Reads the branch on GitHub and names the framework, the i18n library, the call and the catalog folder. Push first for an exact result.
5. **Agent.** When Claude Code is installed, `init` registers the Lyngo MCP server for this repository in local scope and adds a Stop hook that runs `lyngo localize --hook`. The hook goes to `.claude/settings.local.json`; when git does not ignore that file, `init` adds it to `.git/info/exclude`. The MCP server goes to Claude Code's local scope, outside the repository. Without Claude Code it says so and you run `lyngo localize` yourself. This step comes before the languages, so a run that stops at the language question still leaves the hook in place.
6. **Languages.** `--languages` names the target languages; without it, `init` asks. The source language stays the project's primary, English for a new project, unless `--primary` says otherwise.
7. **Scaffolding.** When the project has no i18n setup, `init` applies it to the working tree as a patch: the library in `package.json`, the entry point wiring, the catalog folder, and for Laravel the locale wiring (see [The setup patch](/frameworks/laravel/#the-setup-patch)). With react-intl, the wiring is `intl-setup.ts` and an `IntlProvider` at the app root (see [react-intl](/frameworks/javascript/#react-intl)). It prints the files it changed and the steps it could not do safely. For Laravel, it asks you to confirm the locale detection order. Change it in `app/Http/Middleware/SetLocale.php`. When it cannot put the language switcher in a layout, it names the file to add it to. When the setup exists, it prints "Scaffolding: nothing to add."
8. **Install.** When the patch edits `package.json`, the server names the install command from the lockfile: `pnpm install`, `yarn install`, `bun install`, or `npm install` when there is no other lockfile. `init` runs it, and only when the command is exactly `npm install`, `pnpm install`, `yarn install` or `bun install`; any other command is printed, never run. With `--no-install` it prints the command instead. After the install, restart your dev server so Vite picks up the new packages. When the package manager is missing or the install fails, `init` prints the command to run and ends with exit code 1.
9. **Missing catalogs.** A language added today has no catalog in the repository. `init` names those languages and offers to fill them from the primary catalog, the same as [lyngo translate](/commands/translate/). `--yes` fills them without asking.

## Without a person: CI and --no-wait

When the `CI` variable is set (any value but `false`), or with `--no-wait`, `init` does not wait at the GitHub step. It prints the link and `WAITING FOR THE PERSON: open the link above, add the repository to the Lyngo GitHub App, then run lyngo init again.`, and stops with exit code 3. The next `lyngo init` continues from there. In CI, `--wait` or `--github` makes it wait anyway.

## The Stop hook in a running session

A hook that `init` adds while a Claude Code session runs may not run in that session. If the hook does not run when a task ends, restart the session.

## Flags

| flag | meaning |
|---|---|
| `--languages fr,de` | the target languages |
| `--primary en` | the source language (default: the project's, or English) |
| `--workspace <name>` | the workspace to use, by name or id |
| `--yes` | no questions: keep the current languages, fill missing catalogs |
| `--github` | open the GitHub install page without asking; in CI, wait for it |
| `--wait` | in CI, wait for the GitHub App instead of stopping with exit code 3 |
| `--no-wait` | stop with exit code 3 at the GitHub step instead of waiting |
| `--no-install` | print the package install command instead of running it |

## Connection problems

Since CLI 0.2.8, every command tries a request again after a dropped connection or a proxy error (HTTP 502, 503, 504, 520 to 524): 3 more times, after 2, 5 and 10 seconds. It prints `lyngo: connection problem (ECONNRESET), trying again in 2 s (1/4).` Other errors stop at once.

## Plans

Creating a project counts against the plan. On the free plan with one project already, `init` prints the message and the billing link and stops.
