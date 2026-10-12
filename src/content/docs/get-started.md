---
title: "Get started"
description: "From an account to the first localized change, in ten minutes."
---

## 1. Make an account

Sign up at [lyngo.app](https://lyngo.app). You do this once. Everything after it happens in the terminal.

## 2. Install the CLI

You need Node 20 or later.

```sh
npm i -g @prettifystudio/lyngo-cli
lyngo --version
```

## 3. Log in

```sh
lyngo login
```

The terminal prints a code and opens the browser:

```text
Open https://lyngo.app/cli/activate and enter DJFD-VMFD
Logged in as you@company.com. Token lyn_… saved to ~/.config/lyngo/token.
```

Enter the code on the page and confirm. The token is saved on this machine, readable only by you. See [lyngo login](/commands/login/).

## 4. Set up the repository

Run it inside your repository. The repository must be on GitHub.

```sh
cd your-app
lyngo init --languages fr,de
```

What happens, in order:

```text
Workspace: Acme
Connect GitHub so Lyngo can read acme/shop. Open https://lyngo.app/source-control and install the Lyngo app on that repository.
Waiting for GitHub (up to 10 minutes)...
GitHub is connected.
Created shop in workspace Acme.
Detected: vue, vue-i18n, catalogs in lang
Languages: en -> fr, de
Scaffolding: nothing to add.
No catalog yet for de: lang/de.json is missing, and en.json holds 102 keys that need translating.
Translate it now? [Y/n] y
de: 67 translated, 35 from memory -> lang/de.json
Claude Code: the lyngo MCP server is registered for this repository, and the Stop hook is in .claude/settings.local.json.
Done. Build as usual; lyngo localize runs when your agent finishes, or run it yourself before committing.
```

- **GitHub**: if the Lyngo app does not cover the repository yet, `init` sends you to the page that installs it and waits. On GitHub, that is the Lyngo app, Configure, Repository access, add the repository.
- **Detection** reads the branch on GitHub. Push first for an exact result.
- **Scaffolding**: when the project has no i18n setup, `init` adds it to your working tree as a patch: the library in `package.json`, the entry point wiring, the catalog folder. It prints the one install command to run. It never runs installers.
- **Languages**: `--languages` names the target languages. The source stays English unless you pass `--primary`.
- **Agent**: when Claude Code is installed, `init` registers the Lyngo MCP server for this repository and adds a hook that runs `lyngo localize` at the end of every task. Both live in `.claude/settings.local.json`, which is not committed.

See [lyngo init](/commands/init/).

## 5. Localize a change

Edit a view, or let your agent build a feature. Then:

```sh
lyngo localize
```

```text
lyngo: 1 string localized in 1 file; 1 new key, 10 reused.
  resources/js/Pages/Organizations/Index.vue: "Showing the latest records first. Use the filters to narrow the list."
  fr: 1 translated, 0 from memory
  de: 1 translated, 0 from memory
```

The string is wrapped in your framework's call, the key is in the primary catalog, and every language has its translation. Review the diff with `git diff` and commit. With Claude Code, the hook runs this for you.

See [lyngo localize](/commands/localize/).

## 6. Push

Push as usual. The GitHub App scans every push to the project's branch. When it finds strings the CLI did not cover, it opens one pull request with the rewrites, the keys and the catalogs. Merge it or close it. See [Pull requests](/pull-requests/).

## Next

- [How it works](/how-it-works/), if you want to know what is sent where.
- [Claude Code](/agents/claude-code/), for the hook and the three tools the agent gets.
- [Troubleshooting](/troubleshooting/), for every message the CLI can print.
