---
title: "Laravel: Blade, Livewire, PHP"
description: "What Lyngo wraps in a Laravel application, and how."
---

## Blade

Text in templates becomes `{{ __('Text') }}`; attributes that people read (`placeholder`, `title`, `alt`, `aria-label`) become `{{ __('…') }}` inside the quotes. Mixed runs of text and expressions become one key with placeholders. `@lang` and existing `__()` calls are left alone and their keys are counted as existing.

## PHP

String literals in controllers, requests, notifications, mail and Livewire classes that a person reads: validation messages, flash messages (`->with('success', 'Saved.')`), notification lines, exception messages shown to users. They become `__('…')`. Validation attribute names and rule strings, array keys, config keys, column names, route names, queue and event names, log messages and anything sent to an HTTP client or a model prompt are never touched.

Count-dependent sentences become one `trans_choice()` key in pipe syntax, with the forms every target language needs (Arabic gets six, Russian three, Japanese one).

## Livewire

Component classes count as PHP; their views as Blade. `wire:confirm` text is wrapped.

## Catalogs

`lang/en.json` and `lang/<code>.json`, key = source text. When a language is added, the framework's own files come with it: `auth`, `validation`, `passwords`, `pagination`, from Laravel-Lang.

## The setup patch

When a project has no i18n yet, `lyngo init` adds the `SetLocale` middleware, the locale in the Inertia shared props when Inertia is present, and the language switcher wiring. Everything is in the patch; nothing happens that you cannot read.
