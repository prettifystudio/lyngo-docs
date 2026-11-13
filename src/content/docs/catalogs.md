---
title: "Catalogs and translation"
description: "Keys, formats, plural forms, glossary, refused strings, translation memory, and the verifier."
---

## Keys

Your convention wins. Lyngo reads your primary catalog and follows the style it finds.

**Text keys.** The source text is the key: `"Save changes": "Enregistrer les modifications"`. The default for a project without catalogs.

**Path keys.** When most of your keys are paths (`pages.invoices.title`), new keys are paths too. The group is the one the file already uses most, else the file's path: `Pages/Invoices/Create.jsx` gives `pages.invoices-create`. The leaf is a slug of the text: `pages.invoices-create.shipping_date`. The catalog is written nested, inside your groups, with every existing value and the order kept. On the Laravel side the same rule writes `lang/en/errors.php` for a view under `views/errors`.

A key that exists is reused in both styles; `lookup` tells an agent so before it writes. A dot key the code already calls (`auth.failed`) is a reference: it is never invented, and a reference no catalog holds is listed on the scan page.

The style is read from the catalog. To force it, set **Key style** in the project settings: Auto, Text keys or Path keys.

## Formats

Catalogs are written back in their own format: indentation, key order, trailing newline. JSON for most libraries, PHP arrays for Laravel's framework files.

## Translation

New values come, in order, from:

1. **Translation memory**: the same source text already translated in this workspace, human values first.
2. **The translator**, with the project's context (what the app is), the [project brief](#project-brief), the glossary terms present in the batch, the UI element the string sits in (a column header is a noun phrase, a button an imperative, a label shown while an action runs an action in progress: German `Wird synchronisiert`), the placeholders' meaning (a plural count is a number, so it comes before its noun: `3 sessions de travail`), the project's [form of address](#form-of-address), and the sibling values in other languages when they exist.
3. **The verifier**, which checks every value: placeholders present and not invented, plural forms for the language, script, truncation, register (one form of address throughout), glossary terms used, words of the source language left in the value, spelling, code words kept as written (`access_denied`), parts of the source kept (a parenthetical, a quoted part), a plural count before its noun, a running label kept in progress, and two terms of the source that became one word. Strings from the same file go to the translator together, so sibling labels share one form. The AI review reads every value. Spanish values get their opening `¡` and `¿`. In German, a source word that stays as written after an article gets the capital of a noun: `einen Token`. What it cannot fix it flags.

A loanword or a name that the primary language uses as written stays as written in the primary catalog: `Café` stays `Café` in `en.json`.

## Form of address

Each project uses one form of address per language: `tu` or `vous` in French, `du` or `Sie` in German, `tú` or `usted` in Spanish. Lyngo takes the form that most values of the existing catalog use. A catalog with no such values gets the form of the first batch that Lyngo translates. Later runs keep that form. The verifier fixes a new value in the other form. A value already in the catalog in the other form is named in the report. Spanish `su` and `sus` also mean its, his, her and their. When the source means one of these, the verifier does not flag `su` as the formal form. The same applies to Portuguese `seu` and `sua`, and Italian `suo` and `sua`. Fixed phrases that do not speak to the reader are not the formal form either: Spanish `puede que`, `en su lugar`, `a su vez` and `en su caso`, and the same phrases in Portuguese and Italian.

## Keys a language lacks

Laravel reads `lang/<code>.json` with no fallback to the primary file: a key the French file lacks shows as the key itself. So when `localize` translates, each target catalog also gets the primary's keys it lacks, translated from the primary's text. A call translates a limited number of keys per language, the call's own keys first; the report names the rest: `de: 40 keys not translated yet (…): run lyngo translate de`.

## Machine text

A catalog value that a program reads (a shell command, a path or a URL alone, a date format) is copied unchanged into every language, never sent to the translator, and named in the report. Lyngo never makes a new key of such a text: the code keeps it as written.

## Plural forms

Every language gets the categories it uses: French and Portuguese `one` and `other`; Russian, Polish and Czech `one`, `few`, `many`, `other`; Arabic six; Japanese, Chinese and Turkish one. In Arabic the dual never carries the digit as well.

## Project brief

A few sentences about the app: what it is, who uses it, and its terms that many languages would translate with one word (for example `assignment: coursework imported from Canvas, not a task`). Lyngo builds it once, with one AI call, from the README, `composer.json` and `package.json`, the routes, the model names and a sample of the primary catalog. It never reads `.env` or key files. The translator and the AI review read it with every request. `lyngo init` prints its first sentence. Edit it in the project settings, under Translation & AI. Lyngo never overwrites a brief that a person saved; "Rebuild" fills the field again for you to review.

## Glossary

Terms that must be translated one fixed way, and terms that are never translated (product names). Account terms apply to every project; project terms override them. The translator follows them, the verifier checks them, and Lyngo drafts them from your strings when a project starts.

## Refused strings

Texts your team took out of localization. Lyngo learns them when a Lyngo pull request is trimmed before merge or reverted, and you can set them by hand in the web app. Scans, `localize` and `lookup` all honour them. "Allow again" removes one.

## Translation memory

Every value Lyngo or a translator writes is kept per workspace, with its origin (machine, verified, human). A project's second language is cheaper than its first, and a sibling project reuses the wording. Each value keeps the verifier's verdict: correct, or flagged with the reason. A value that comes from memory keeps its flag.

## Flagged for review

A flag means the value was written but the verifier is not sure: read it. Common flags: a placeholder moved to the wrong place, a form of address that differs from the rest of the catalog, a phrase cut at the end, a short label that ends on a dangling word (`Back` as `Retour à`).

The review can name a word that is correct. When a second translation keeps that word, Lyngo takes it and drops the flag. Since CLI 0.2.18, `lyngo localize` and `lyngo translate` show each flagged value with its reason (see [The report, line by line](/commands/localize/#the-report-line-by-line)).
