---
title: "lyngo check, lookup and status"
description: "One file's user-facing strings, the keys the project has for a text, and the project as Lyngo knows it."
---

## lyngo check

```sh
lyngo check resources/js/pages/Orders.vue
```

Prints the strings a person reads in that file, as the engine sees them, without changing anything. Use it to see what `localize` would wrap, or to learn which strings the engine treats as code values.

## lyngo lookup

```sh
lyngo lookup "Save" "Delete account"
```

```text
"Save": key exists; translated: fr, de
"Delete account": no key; similar keys: "Delete account."
```

For each text: whether a key exists for it, keys that differ only by case or punctuation, whether your team refused it, and the languages that have it. These are the answers of the MCP tool `lookup`. An agent uses the command when the MCP server is not loaded in its session yet (since CLI 0.2.22).

## lyngo status

```sh
lyngo status
```

```text
shop: vue / vue-i18n / $t(), catalogs in lang
languages: en -> fr, de, ar
refused (never localize): "Acme", "CSV"
server: 468e436
```

The framework, the library, the call, the catalog folder, the languages, and the strings your team refused to localize.

Since CLI 0.2.15, the last line is the commit of the Lyngo server that answered. Include it when you report a problem.
