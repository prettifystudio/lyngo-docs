---
title: "Lyngo"
description: "Localization for your repository, from the terminal. Your agent builds the feature; Lyngo localizes it."
---

Lyngo localizes a web application from the terminal. The CLI wraps every string a person reads with your framework's i18n call, reuses the keys your project already has, translates the catalogs, and verifies them. The GitHub App opens a pull request for anything pushed without the CLI.

Three commands:

```sh
npm i -g @prettifystudio/lyngo-cli
lyngo login
lyngo init
```

Then build as usual. `lyngo localize` runs when your agent finishes a task, or you run it before you commit.

- [Get started](/get-started/): from an account to the first localized change, in ten minutes.
- [How it works](/how-it-works/): what the CLI sends, what comes back, what never leaves your machine.
- [Commands](/commands/login/): every command, every flag, the output line by line.
- [Agents](/agents/claude-code/): Claude Code, other MCP clients, and no agent at all.

Every page here is also Markdown: add `.md` to its address. The whole manual is one file at [/llms-full.txt](/llms-full.txt), and the index at [/llms.txt](/llms.txt).
