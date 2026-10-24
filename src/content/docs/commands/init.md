---
title: "lyngo init"
description: "Connect a repository: project, GitHub, i18n setup, languages, agent hook."
---

```sh
lyngo init [--languages fr,de] [--primary en] [--workspace <name>] [--yes] [--github]
```

Run it inside the repository. It is safe to run again: on a connected repository it prints the state and changes nothing.

## What it does, in order

1. **Workspace.** Prints the workspace the project will belong to. With `--workspace <name>` it picks another one you are a member of.
2. **Project.** Finds the project for the git remote (`origin`). If none exists and you own the workspace, it creates one. Members who are not owners are set up on existing projects and sent to the owner for new ones.
3. **GitHub.** If the Lyngo app cannot read the repository, it prints the GitHub page for the app: pick the account, add the repository under Repository access, save. In a terminal it offers to open the page and waits up to ten minutes. Without a terminal (an agent, a script) it prints "WAITING FOR THE PERSON" and stops with exit code 3; run `lyngo init` again once the repository is added. `--wait` makes it wait anyway, `--github` opens the page. Owners get the GitHub link; members are sent to the source-control page in Lyngo.
4. **Detection.** Reads the branch on GitHub and names the framework, the i18n library, the call and the catalog folder. Push first for an exact result.
5. **Languages.** `--languages` names the target languages; without it, `init` asks. The source language stays the project's primary, English for a new project, unless `--primary` says otherwise.
6. **Scaffolding.** When the project has no i18n setup, `init` applies it to the working tree as a patch: the library in `package.json`, the entry point wiring, the catalog folder, and for Laravel the middleware and the Inertia props. It prints the one install command (`npm install` or `composer require`) and never runs it. When the setup exists, it prints "Scaffolding: nothing to add."
7. **Missing catalogs.** A language added today has no catalog in the repository. `init` names those languages and offers to fill them from the primary catalog, the same as [lyngo translate](/commands/translate/). `--yes` fills them without asking.
8. **Agent.** When Claude Code is installed, `init` registers the Lyngo MCP server for this repository in local scope and adds a Stop hook that runs `lyngo localize`. Both go to `.claude/settings.local.json`, which git ignores. Without Claude Code it says so and you run `lyngo localize` yourself.

## Flags

| flag | meaning |
|---|---|
| `--languages fr,de` | the target languages |
| `--primary en` | the source language (default: the project's, or English) |
| `--workspace <name>` | the workspace to use, by name or id |
| `--yes` | no questions: keep the current languages, fill missing catalogs |
| `--github` | open the GitHub install page without asking |

## Plans

Creating a project counts against the plan. On the free plan with one project already, `init` prints the message and the billing link and stops.
