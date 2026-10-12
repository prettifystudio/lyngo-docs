---
title: "Without an agent"
description: "The CLI is for people too."
---

Nothing in Lyngo needs an agent. The path is the same:

```sh
lyngo login
lyngo init
# edit views, controllers, components
lyngo localize
git diff
git commit
```

Teams mix both: one person builds with Claude Code and the hook localizes; another edits a Blade view by hand and runs `lyngo localize` before committing. The engine, the keys and the glossary are the same, so the result is the same.

Anything pushed without the CLI still gets a pull request from the GitHub App.
