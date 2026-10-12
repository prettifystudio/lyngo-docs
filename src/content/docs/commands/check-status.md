---
title: "lyngo check and lyngo status"
description: "One file's user-facing strings, and the project as Lyngo knows it."
---

## lyngo check

```sh
lyngo check resources/js/pages/Orders.vue
```

Prints the strings a person reads in that file, as the engine sees them, without changing anything. Use it to see what `localize` would wrap, or to learn which strings the engine treats as code values.

## lyngo status

```sh
lyngo status
```

```text
shop: vue / vue-i18n / $t(), catalogs in lang
languages: en -> fr, de, ar
refused (never localize): "Acme", "CSV"
```

The framework, the library, the call, the catalog folder, the languages, and the strings your team refused to localize.
