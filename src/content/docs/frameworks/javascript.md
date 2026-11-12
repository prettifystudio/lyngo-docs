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
- A name that a program reads is never wrapped: the name in `route()`, a form field name, an event name in `emit()` or `dispatch()`, an Echo channel, a `classList` class, a DOM lookup, a key in `get()` or `has()`. A safety net checks the result: when Lyngo would write a translation call in a name position (`route(t('…'))`, `emit(t('…'))`), it refuses that call and leaves the text as written. A list `key` prop is not a machine use: a text that is also the `key` of a list item stays copy.
- The values of one property across a list of objects, and the values of one lookup map, are decided together by where they are read. A value that is compared, switched on or used as a lookup key is code for every entry. A value that is rendered is copy for every entry: in `[{ short: 'Mon', name: 'Monday' }]`, `Monday` is copy when the page shows `name`.
- Vue template expressions see only component-scope names and `$t`; the engine never emits `window`, `document` or an import there.
- Inertia entry files are shared by the server render; the setup registers the plugin through `withApp` or an existing `setup()` and never calls `createApp` or `mount`.
- Text inside `<code>`, `<kbd>`, `<samp>`, `<var>` and `<pre>` is code. It is never copy.
- Raw HTML of your own (`{@html}` in Svelte, `v-html` in Vue, `dangerouslySetInnerHTML` in React) stays as written. Lyngo reads no text from it and never writes into it.
- A prompt sent to an AI model is machine text. It stays as written, with its data. Lyngo knows the openai and Anthropic JS clients, the Vercel AI SDK, LangChain, `@google/genai`, `fetch` and `axios` bodies to an AI endpoint, and role messages (`system`, `user`, `assistant`, `developer`, `tool`). A prompt that goes into code Lyngo cannot read is left as written when it reads as a prompt, and named in the report (`ai_prompt`). Text on a page stays copy. Text on the page that the user sends as their own message (a `user` role message, for example the starter questions of an AI chat) is copy too. System and developer messages, instructions and prompt templates stay as written. See [AI prompts](/frameworks/laravel/#ai-prompts).

## Sentences with markup

One sentence is one key. The elements inside a sentence stay inside its key as numbered chunks: links, `<strong>` and `<em>`, spans, buttons, and components such as a `TextLink`. A link or a button that holds an icon keeps the icon around its words. Text split by `<br/>` is one key too.

```jsx
<p>If you need more, click <button onClick={regenerate}>Regenerate codes</button> above.</p>
```

The key is `If you need more, click <el0>Regenerate codes</el0> above.` (react-intl). The button keeps its `onClick`. Each library renders the sentence its own way:

| library | the element in the value | the sentence renders through |
|---|---|---|
| react-intl | `<el0>…</el0>` | chunks in `intl.formatMessage()` |
| react-i18next | `<0>…</0>` | a `Trans` component |
| vue-i18n | `{el0}` | an `<i18n-t>` component, one slot per element |
| svelte-i18n | `{el0}` | an `{#each}` loop over the translation, split at its element markers |

In Vue and Svelte, the words inside an element are a key of their own. The translation and the values always render as text. Your elements render as written, where the translation puts them. A translation cannot add markup. Lyngo never writes into `{@html}`, `v-html`, `dangerouslySetInnerHTML` or `innerHTML`.

A limit: in Vue and Svelte, a sentence that starts with a span, followed by a link or a button, stays two keys. vue-i18n and svelte-i18n translate the words of an element apart. React makes it one key.

## Sentences with a condition

A condition can pick a part of a sentence: ``Showing {from} to {to} {total && ` of ${total}`} results``. One key with the English part inside a value breaks every other language. So Lyngo makes one whole sentence per branch, `Showing {{0}} to {{1}} of {{2}} results` and `Showing {{0}} to {{1}} results` (the placeholders follow your library), and writes the condition around two calls. `cond && <text>` and `cond ? <text> : ''` work this way. A condition between two plain words in a sentence works this way too: `{open ? 'Hide' : 'View'} recovery codes` becomes `Hide recovery codes` and `View recovery codes`. A condition between two plain texts with no sentence around it (`active ? 'Active' : 'Inactive'`) keeps a key per text.

A condition inside a template literal or an attribute works the same way. Each branch gives one whole sentence, chains of conditions too:

```jsx
aria-label={mood === 'idle' ? t('A fox cub, waiting') : t('A fox cub, writing')}
```

The two sides of one condition are decided together: in `Start {long ? 'long break' : 'break'}`, both sides are copy, so the keys are `Start long break` and `Start break`. A count before a unit of time is a plural: `${minutes} minute break` becomes one plural key with `count`.

- The same applies when the sentence is already an i18n call with the condition in its values: the call becomes two calls, one per branch. A condition between two plain words keeps its place in the values of such a call.
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

A sentence with several counts is one key. Each count in it is a plural value with its noun.

## Catalogs

The library's own format and folder, detected per project: `lang/<code>.json` for Laravel apps, `resources/js/i18n/locales/<code>.json` or `public/locales` where that is what the project uses. Formatting and key order are kept.
