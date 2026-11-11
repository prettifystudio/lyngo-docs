---
title: "React, Vue, Svelte, Inertia"
description: "What Lyngo wraps in the JavaScript front-end, and which call it uses."
---

Replacements are made on the syntax tree, never with regular expressions, so JSX, Vue templates and Svelte markup keep their structure.

| framework | library | in components | at module scope |
|---|---|---|---|
| React | react-i18next | `const { t } = useTranslation();` then `t('…')` | `i18next.t('…')` with the import |
| React | react-intl | `const intl = useIntl();` then `intl.formatMessage({ id: '…' }, values)` | the `intl` instance from `intl-setup.ts`, in lazy getters |
| Vue, `<script setup>` | vue-i18n | `const { t } = useI18n();` then `t('…')`, `$t('…')` in templates | `i18n.global.t('…')` |
| Vue, Options API | vue-i18n | `this.$t('…')` in methods, `$t('…')` in templates | `i18n.global.t('…')` |
| Svelte | svelte-i18n | `$_('…')` | lazy getters |

The rules that keep an app from breaking:

- A string compared, switched on, used as a prop that only takes fixed literals (`side="top"`, `variant`, `type="submit"`), a DOM id, an ARIA target, a selector, a tag name, a path, a CSS class or a key name is a code value and stays.
- Vue template expressions see only component-scope names and `$t`; the engine never emits `window`, `document` or an import there.
- Inertia entry files are shared by the server render; the setup registers the plugin through `withApp` or an existing `setup()` and never calls `createApp` or `mount`.
- Text split by `<br/>` or inline elements becomes one key with element placeholders.

## Sentences with a condition

A condition can pick a part of a sentence: ``Showing {from} to {to} {total && ` of ${total}`} results``. One key with the English part inside a value breaks every other language. So Lyngo makes one whole sentence per branch, `Showing {{0}} to {{1}} of {{2}} results` and `Showing {{0}} to {{1}} results` (the placeholders follow your library), and writes the condition around two calls. `cond && <text>` and `cond ? <text> : ''` work this way. A condition between two plain texts (`active ? 'Active' : 'Inactive'`) keeps its own value.

- The same applies when the sentence is already an i18n call with the condition in its values: the call becomes two calls, one per branch.
- A sentence with two such conditions is left as written and named in the report. Lyngo never makes one sentence per combination. A call it cannot split (a key that is not the text, the part used twice, a plural) is left as written and named too.
- The keys a rewritten call stops using stay in the catalogs, because another file may still call them. The report names them; delete them when no file calls them.

The same rules apply in React, Vue and Svelte.

## react-intl

Lyngo supports react-intl in Inertia React apps.

- Each component gets `const intl = useIntl();` and calls `intl.formatMessage({ id: '…' }, values)`.
- Text with inline elements becomes one message with `<el0>…</el0>` chunks.
- Catalog values are ICU: `{name}` for a value, `{count, plural, one {…} other {…}}` for a plural.
- `lyngo init` adds `intl-setup.ts` and wires an `IntlProvider` at the app root through the Inertia entry (`withApp`). `intl-setup.ts` also exports a shared `intl` instance. Copy at module scope, such as `Page.layout = { title }` or a nav array, uses that instance in lazy getters.
- A page-level `IntlProvider` with a fixed locale and inline messages is adopted: its messages move to the catalogs.
- Text that no hook and no instance can reach is left as written and named in the report (`intl_left_as_written`).

## Plurals

i18next gets `_one` and `_other` keys and the categories each language uses; vue-i18n gets `one | other` pipes; svelte-i18n and react-intl get ICU `{count, plural, …}`. Values are written with every category the target language has.

## Catalogs

The library's own format and folder, detected per project: `lang/<code>.json` for Laravel apps, `resources/js/i18n/locales/<code>.json` or `public/locales` where that is what the project uses. Formatting and key order are kept.
