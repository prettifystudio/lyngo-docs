---
title: "lyngo translate"
description: "Fill every key a language lacks, from the primary catalog."
---

```sh
lyngo translate <code> [<code>…]
```

For a language you just added, or a catalog that fell behind. It reads the primary catalog, finds every key the target lacks or holds empty, translates them in chunks of 100 with the glossary and the translation memory, verifies, and writes the catalog. Each chunk is one job on the server; the CLI waits for it the same way as [lyngo localize](/commands/localize/#jobs-on-the-server).

```text
de: 67 translated, 35 from memory -> lang/de.json
```

Since CLI 0.2.18, each value the verifier flagged follows on its own line, with the key and the reason. The first 10 are shown, then `… and N more`:

```text
de: 66 translated, 35 from memory; 1 flagged for review -> lang/de.json
    "Export the report": untranslated word "report"
```

When nothing is missing: `de: complete, 102 keys.`

When the server sends warnings (for example machine text copied unchanged), they follow the result line: `warnings (N):`, the first 10, then `… and N more`. [Troubleshooting](/troubleshooting/#warnings-in-the-report) says what to do for each.

The language must be one of the project's. Add it with `lyngo init --languages` first.

`lyngo init` offers the same for every language without a catalog, after it sets the languages and applies the setup.
