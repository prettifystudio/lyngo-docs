---
title: "Catalogs and translation"
description: "Keys, formats, plural forms, glossary, refused strings, translation memory, and the verifier."
---

## Keys

The source text is the key. `"Save changes": "Enregistrer les modifications"`. A key that exists is reused; `lookup` tells an agent so before it writes. Dot keys (`auth.failed`) are references to framework files and are left alone.

## Formats

Catalogs are written back in their own format: indentation, key order, trailing newline. JSON for most libraries, PHP arrays for Laravel's framework files.

## Translation

New values come, in order, from:

1. **Translation memory**: the same source text already translated in this workspace, human values first.
2. **The translator**, with the project's context (what the app is), the glossary terms present in the batch, the UI element the string sits in (a column header is a noun phrase, a button an imperative), the placeholders' meaning, and the sibling values in other languages when they exist.
3. **The verifier**, which checks every value: placeholders present and not invented, plural forms for the language, script, truncation, register (one form of address throughout), glossary terms used, and spelling. What it cannot fix it flags.

## Plural forms

Every language gets the categories it uses: French and Portuguese `one` and `other`; Russian, Polish and Czech `one`, `few`, `many`, `other`; Arabic six; Japanese, Chinese and Turkish one. In Arabic the dual never carries the digit as well.

## Glossary

Terms that must be translated one fixed way, and terms that are never translated (product names). Account terms apply to every project; project terms override them. The translator follows them, the verifier checks them, and Lyngo drafts them from your strings when a project starts.

## Refused strings

Texts your team took out of localization. Lyngo learns them when a Lyngo pull request is trimmed before merge or reverted, and you can set them by hand in the web app or with the `refuse` tool. Scans, `localize` and `lookup` all honour them. "Allow again" removes one.

## Translation memory

Every value Lyngo or a translator writes is kept per workspace, with its origin (machine, verified, human). A project's second language is cheaper than its first, and a sibling project reuses the wording.

## Flagged for review

A flag means the value was written but the verifier is not sure: read it. Common flags: a placeholder moved to the wrong place, a form of address that differs from the rest of the catalog, a phrase cut at the end.
