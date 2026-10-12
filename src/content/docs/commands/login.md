---
title: "lyngo login"
description: "Sign in once. The token stays on this machine."
---

```sh
lyngo login
```

```text
Open https://lyngo.app/cli/activate and enter DJFD-VMFD
Logged in as you@company.com. Token lyn_… saved to ~/.config/lyngo/token.
```

1. The CLI asks the server for a one-time code and opens the browser on the activation page. Without a browser, open the address yourself.
2. Log in to Lyngo if you are not, enter the code, confirm. The page shows which computer asked, when, and from where.
3. The CLI polls until you confirm. The code expires after 15 minutes. Each code works once.

The token is a personal token: it belongs to you, not to a project. Every call names the repository through its git remote, and Lyngo picks the project you can see for it. The file `~/.config/lyngo/token` is readable only by your user.

## Related commands

```sh
lyngo whoami     # the account, the token prefix and the current workspace
lyngo logout     # revoke the token on the server and delete the file
```

`logout` deletes the file even when the server cannot be reached.

## Where tokens show up

In the web app under Settings, CLI: every personal token, when it was last used, and a Revoke button. A revoked token stops working at the next call.

## Environment

- `LYNGO_TOKEN`: use this token instead of the file. For CI and headless runs.
- `LYNGO_HOST`: another Lyngo host (default `https://lyngo.app`).
- `LYNGO_NO_BROWSER=1`: print the address, do not open it.
