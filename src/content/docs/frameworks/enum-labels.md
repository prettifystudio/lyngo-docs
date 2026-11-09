---
title: "Enum labels"
description: "What Lyngo edits beyond strings: enums that show their raw value to people."
---

Some text a person reads is not a string literal. A backed enum whose display method returns its raw value (`getText(): string { return $this->value; }`) shows `disconnected` on the French page too. Lyngo fixes this in one change, beside the strings it wraps.

## Which enums

A backed enum (`enum Status: string` or `: int`) with cases, whose display method (`getText()`, `label()`, `getDisplayName()`, `displayName()` or `text()`) returns `$this->value`. An enum whose display method returns its own labels is left as it is.

## What changes

1. **The enum** gets `getLabel()`, with one `__()` per case. The label is made from the case's value: `ready_to_connect` gives `__('Ready to connect')`. An enum that already has a `getLabel()` keeps it, and the places below call it.
2. **Blade and Livewire views** that echo the value (`{{ $server->status->getText() }}`, `->value`, or the enum itself) call `getLabel()` instead.
3. **Sentences** that show the value call `getLabel()`: the replacements of a `__()` call, mail lines (`MailMessage` `line()`, `subject()`, `greeting()`, `salutation()`), flash messages (`session()->flash()`, `->with()`, `->withErrors()`) and `ValidationException::withMessages()`. A sentence in an API controller, a job, a console command, a `toSlack()`, `toDatabase()` or `toBroadcast()` method, or a database write keeps the raw value.
4. **JSON resources** get a `<field>_label` field beside the value, only together with a page read that the same change rewrites. The read becomes `x.status_label ?? x.status`, the TypeScript type gets `status_label?: string`, and a PHPDoc array shape of `toArray()` that lists the field gets `status_label: string` (`string|null` when the value can be null). A field that no page reads is never added: a test that compares a payload exactly would fail.
5. **Filament.** When Filament shows the enum, the enum also implements `Filament\Support\Contracts\HasLabel` (Filament 3 and 4), so Filament shows the labels by itself.
6. **inertia-table** (`EnumColumn`). When no page reads the field from the table's rows, the column gets `->value(fn ($row) => data_get($row, 'status')?->getLabel())`: the label goes in the row and keeps the enum's badge color. When a page reads the field and the package's own renderer shows the cells, the column becomes the badge form: the row keeps the raw value and a badge shows the label. Otherwise the column is left as written and reported.

## What never changes

`getText()` and the raw value. Pages compare the raw value (`status === 'ready'`), and API clients read it. A read that compares or passes the value on is never rewritten; only a read that shows it as text is.

## All or nothing

One enum's edits ship together or not at all. A view or a resource that calls `getLabel()` ships only with the `getLabel()` it calls, and a page read only with the type it reads. When one part cannot ship, the parts that depend on it stay as they were. `lyngo localize` sends the files of one enum in the same job when they fit.

On the CLI path, Lyngo edits only the files you sent and reads the rest from GitHub. When it needs your working tree's copy of such a file (an enum that an earlier run gave `getLabel()`, not pushed yet), the answer asks for it in `needs`, and the CLI sends it as read-only context. See [Reading the repository](/commands/localize/#reading-the-repository).

A scan of a push reads the whole repository: there, an enum gains `getLabel()` only when something in the change shows its label. A CLI call is one part of a change, so the enum gains `getLabel()` even when the files that show it come in a later call.

## What is reported

Every part left out is named in the report with the reason, for example `Enum labels, left as written: app/Http/Resources/ServerResource.php:24 status (ServerStatus): the file is not in this change`. The edits made are listed too (`Enum labels: ServerStatus: getLabel() added, 2 resources, 3 reads`). When a resource gains a `_label` field and the repository keeps hand-written OpenAPI docs, the report names them: Lyngo does not edit API docs. [Troubleshooting](/troubleshooting/#warnings-in-the-report) says what to do for each line.
