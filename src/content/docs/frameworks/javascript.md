---
title: "React, Vue, Svelte, Inertia"
description: "What Lyngo wraps in the JavaScript front-end, and which call it uses."
---

Replacements are made on the syntax tree, never with regular expressions, so JSX, Vue templates and Svelte markup keep their structure.

| framework | library | in components | at module scope |
|---|---|---|---|
| React | react-i18next | `const { t } = useTranslation();` then `t('…')` | `i18next.t('…')` with the import |
| Vue, `<script setup>` | vue-i18n | `const { t } = useI18n();` then `t('…')`, `$t('…')` in templates | `i18n.global.t('…')` |
| Vue, Options API | vue-i18n | `this.$t('…')` in methods, `$t('…')` in templates | `i18n.global.t('…')` |
| Svelte | svelte-i18n | `$_('…')` | lazy getters |

The rules that keep an app from breaking:

- A string compared, switched on, used as a prop that only takes fixed literals (`side="top"`, `variant`, `type="submit"`), a DOM id, an ARIA target, a selector, a tag name, a path, a CSS class or a key name is a code value and stays.
- Vue template expressions see only component-scope names and `$t`; the engine never emits `window`, `document` or an import there.
- Inertia entry files are shared by the server render; the setup registers the plugin through `withApp` or an existing `setup()` and never calls `createApp` or `mount`.
- Text split by `<br/>` or inline elements becomes one key with element placeholders.

## Plurals

i18next gets `_one` and `_other` keys and the categories each language uses; vue-i18n gets `one | other` pipes; svelte-i18n gets ICU `{count, plural, …}`. Values are written with every category the target language has.

## Catalogs

The library's own format and folder, detected per project: `lang/<code>.json` for Laravel apps, `resources/js/i18n/locales/<code>.json` or `public/locales` where that is what the project uses. Formatting and key order are kept.
