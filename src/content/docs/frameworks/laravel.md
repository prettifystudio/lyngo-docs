---
title: "Laravel: Blade, Livewire, PHP"
description: "What Lyngo wraps in a Laravel application, and how."
---

## Blade

Text in templates becomes `{{ __('Text') }}`; attributes that people read (`placeholder`, `title`, `alt`, `aria-label`) become `{{ __('…') }}` inside the quotes. Mixed runs of text and expressions become one key with placeholders. `@lang` and existing `__()` calls are left alone and their keys are counted as existing.

A sentence with inline tags (`<a>`, `<strong>`, `<em>` and the like) becomes one key. The tags become `<el0>…</el0>` placeholders:

```blade
{{ \App\Support\Lyngo::rich(__('By signing up you agree to our <el0>terms</el0>.'), ['<a href="/terms">']) }}
```

Code in a sentence is a value. The content of `<code>`, `<kbd>`, `<samp>`, `<var>` and `<pre>` becomes a named placeholder. The translation cannot change it:

```blade
{{ \App\Support\Lyngo::rich(__('Run :code to start the server.'), ['code' => '<code>npm run dev</code>']) }}
```

An element that holds only code is never copy. This applies to Blade views and Livewire views.

The helper `app/Support/Lyngo.php` escapes the whole translation, then puts back only the view's own tags and named values. A translation cannot add markup. `lyngo init` adds the helper; the first view that calls it adds it too when it is missing. When the project has an older helper that Lyngo wrote, Lyngo replaces it. Lyngo never replaces an `app/Support/Lyngo.php` of your own. The verifier checks the `<elN>` placeholders like the other placeholders.

A sentence stays whole around these parts:

- **An email address or a URL** becomes a placeholder (`:email`, `:url`), not a split point. `Need help? Email us at support@example.com.` becomes `{{ __('Need help? Email us at :email.', ['email' => 'support@example.com']) }}`.
- **A `__()` call of your own** inside the sentence goes into the one key. `Read the <a href="/docs">documentation</a>, or <a href="/contact">{{ __('Contact us') }}</a>.` becomes one rich key: `Read the <el0>documentation</el0>, or <el1>Contact us</el1>.` A dot key such as `auth.failed` stays as written.
- **A locale conditional** joins its sentence. See [Locale conditionals](#locale-conditionals).

A text next to a raw `{!! !!}` echo is kept whole, as written, and named in the report: Lyngo never puts a raw echo in a translated sentence. A view whose output a program reads (a script run over SSH or by a process, a file written to disk that no page or mail renders) is never localized or edited.

## PHP

String literals in controllers, requests, notifications, mail and Livewire classes that a person reads: validation messages, flash messages (`->with('success', 'Saved.')`), notification lines, the data of `view('x', [...])` and the messages of `ValidationException::withMessages()`. They become `__('…')`. Validation attribute names and rule strings, array keys, config keys, column names, route names, queue and event names, log messages, exception messages and anything sent to an HTTP client or a model prompt are never touched. See [AI prompts](#ai-prompts).

A literal that a database write stores (`create`, `update`, `insert`, `fill`, `new Model([...])`, an attribute set and then saved) is never copy: a translated value would be stored in the language of the person who triggered the write. When Lyngo cannot prove what the write goes to, it leaves the literal as written and names it in the report (`Left as written, may be stored`).

Count-dependent sentences become one `trans_choice()` key in pipe syntax, with the forms every target language needs (Arabic gets six, Russian three, Japanese one).

A sentence built around `Str::plural()` or `str()->plural()` becomes one key for the whole sentence, in PHP, Blade and mail lines:

```php
'You have '.$n.' new '.Str::plural('task', $n).'.'
```

becomes `trans_choice('You have :count new task.|You have :count new tasks.', $n)`. A sentence with two different counts becomes one `__()` key. Each plural in it is a `trans_choice()` value.

## Mail

### Markdown mail views

A Markdown mail view (`<x-mail::message>`, `@component('mail::message')`) is Markdown, not HTML. Each block is one key: a heading, a paragraph, a list item, a table cell, the text of a button, a panel, the subcopy, the salutation. Each block renders through the helper:

```blade
{{ \App\Support\Lyngo::markdown(__('Run :code, then [see pricing](:url).'), ['code' => '`npm run dev`', 'url' => 'https://example.com/pricing']) }}
```

- **Inline code** becomes a value (`:code`). The translation cannot change it.
- **A link** keeps its text in the key. Its address becomes a value: `[see pricing](:url)`.
- **A code block** and the layout (`#`, list markers, table pipes, indentation, component tags) stay as written.
- **A translation cannot add** HTML, links, images or code blocks. The helper escapes the translation and keeps only the view's own links, bold and emphasis.

The verifier checks that the link markers (`[…](:url)`) are in every translation.

### MailMessage lines

In a Notification or a Mailable, the text of `line()`, `lines()`, `lineIf()`, `linesIf()`, `greeting()`, `salutation()` and the text of `action()` follow the same rule:

```php
->line(\App\Support\Lyngo::markdown(__('Run :code, then [see pricing](:url).'), ['code' => '`npm run dev`', 'url' => 'https://example.com/pricing'], inline: true))
```

- **`subject()`** becomes a plain `__()`.
- **A plural line** becomes `trans_choice()` inside the helper.
- **A locale conditional** in a line becomes one key. See [Locale conditionals](#locale-conditionals).
- **The data of `->markdown('view', [...])`** becomes a plain `__()`.
- **`toSlack()`** is never localized. Slack messages stay in the source language.

## AI prompts

A prompt sent to an AI model is machine text. Lyngo keeps it as written, with its data, in PHP and Blade. React, Vue and Svelte follow the same rule (see [React, Vue, Svelte](/frameworks/javascript/)). Lyngo knows these clients:

- openai-php, Prism, the Laravel AI SDK (the instructions of its agents), the Anthropic and Gemini PHP clients, NeuronAI, LarAgent;
- `Http` posts to an AI endpoint;
- role messages (`system`, `user`, `assistant`, `developer`, `tool`);
- prompts built in variables, heredocs, `sprintf()` and class constants.

A Blade view that the app renders into a prompt is never localized.

When the prompt goes into code that Lyngo cannot read (for example, the app's own wrapper), Lyngo looks at the text. A text that reads as a prompt ("You are a … assistant", "Respond only with JSON") is left as written and named in the report (`ai_prompt`). Text on a page stays copy, also when it starts with "You are": `You are signed in as :name` is copy.

## Locale conditionals

A condition on the locale that picks a text becomes one `__()` key:

```php
app()->getLocale() === 'fr' ? 'Bonjour' : 'Hello'
```

becomes `__('Hello')`. The key is the text of the primary language. The other branches are your own translations: `Bonjour` goes to `lang/fr.json` as the value of `Hello`. `App::isLocale('fr')`, chains of conditions and `match (app()->getLocale())` work the same way, in PHP, Livewire classes and Blade echoes. React, Vue and Svelte follow the same rule.

In Blade, a locale conditional next to other text or values joins the sentence:

```blade
<span>{{ app()->getLocale() === 'fr' ? 'Bonjour' : 'Hello' }}, {{ $user->name }}</span>
```

becomes `{{ __('Hello, :name', ['name' => $user->name]) }}`, and `lang/fr.json` gets `"Hello, :name": "Bonjour, :name"`.

A condition that cannot become one key stays as written and is named in the report (`mixed-language source`).

## Livewire

Component classes count as PHP; their views as Blade. `wire:confirm` text is wrapped. `lyngo localize --all` takes the component classes too. A `$messages` property becomes a `messages()` method, because a property default cannot call `__()`.

## Enum values

A backed enum that shows its raw value to people gets a translated `getLabel()`, and the places that show the value use the label. See [Enum labels](/frameworks/enum-labels/).

## Catalogs

`lang/en.json` and `lang/<code>.json`, key = source text. When a language is added, the framework's own files come with it: `auth`, `validation`, `passwords`, `pagination`, from Laravel-Lang. `lyngo localize` adds them too: `lang/<code>/auth.php`, `pagination.php`, `passwords.php` and `validation.php`, where they are missing. The report names them.

## The setup patch

When a project has no i18n yet, `lyngo init` adds the locale wiring. Every piece is a real edit in the patch; nothing happens that you cannot read. When the app has a locale middleware of its own (`app/Http/Middleware/SetLocale.php`, or a middleware named after the locale in `bootstrap/app.php` or `app/Http/Kernel.php`), Lyngo adds none of it.

- **`SetLocale`**, a new middleware in `app/Http/Middleware`. Its `handle()` declares the `Response` return type. Lyngo registers it in the `web` group in `bootstrap/app.php`. For an app that kept `app/Http/Kernel.php`, it goes in the `web` group there, after `StartSession` and before `HandleInertiaRequests`.
- **Detection sources.** `SetLocale` holds three sources: the user's saved locale, the session, and the browser's `Accept-Language`. They ship commented out on purpose, so that your team picks the sources and their order. Until you enable one, the app renders in `config('app.locale')`. The switcher stores the choice in the session: enable the session source to make the switcher work. `SetLocale` writes the session only when one of its sources found a locale, so it never writes the default locale over a choice that the app stored.
- **`available_locales`** in `config/app.php`: the languages the middleware and the route accept.
- **Inertia shared props**: `locale` and `locales` in `HandleInertiaRequests::share()`, so the page knows the language the server chose.
- **The switcher** (Inertia): a `LanguageSwitcher` component for your framework. Lyngo puts it in the app's header when it finds a header it can edit safely. Its `aria-label` is translated too.
- **The route** `GET /locale/{locale}`, named `locale.switch`. It accepts only the languages in `available_locales`, stores the choice in the session, and goes back to the page it came from (or to `/`). It is a closure in `routes/web.php`. When the app has no `routes/web.php` and its routes are controller attributes (spatie/laravel-route-attributes), it is a new `LocaleController` with `#[Get('/locale/{locale}', name: 'locale.switch')]`, in the folder `config/route-attributes.php` registers with the `web` middleware.
- **Your own switch route.** When the app has a locale switch route (a route with a locale parameter whose action stores the locale), Lyngo adds no second route. The switcher links to your route, and `SetLocale` reads the session key that your route writes.
- **The route's authentication.** When Lyngo places the switcher, the route takes the authentication of the pages that show it: when every one of those pages is behind `auth` (or `auth:<guard>`), the route gets the same middleware. When one of them is public, the route stays public. When Lyngo cannot find out, the route stays public and `init` prints a note with the reason.
- **`<html lang>` and `dir`** in the root view follow the active locale.

A piece that Lyngo cannot edit safely is printed as a step for you, for example `Add the SetLocale middleware to the web group in app/Http/Kernel.php yourself, after StartSession and before HandleInertiaRequests.`
