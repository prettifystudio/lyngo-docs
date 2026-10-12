---
title: "lyngo translate"
description: "Fill every key a language lacks, from the primary catalog."
---

```sh
lyngo translate <code> [<code>…]
```

For a language you just added, or a catalog that fell behind. It reads the primary catalog, finds every key the target lacks or holds empty, translates them in chunks of 100 with the glossary and the translation memory, verifies, and writes the catalog.

```text
de: 67 translated, 35 from memory -> lang/de.json
```

When nothing is missing: `de: complete, 102 keys.`

The language must be one of the project's. Add it with `lyngo init --languages` first.

`lyngo init` offers the same for every language without a catalog, right after it sets the languages.
