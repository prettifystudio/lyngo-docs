---
title: "Pull requests"
description: "What the GitHub App does on a push, what a Lyngo pull request contains, and how to revert one."
---

## On every push

The GitHub App scans every push to the project's branch. An incremental scan reads only the commits since the last one. When it finds hardcoded strings or missing keys, it opens one pull request on a branch of its own: the rewritten files, the keys, every language's catalog. Nothing lands until someone merges.

A push whose last commit message contains `[skip lyngo]` is not scanned.

## Reviewing

Read the code diff first: every wrapped string shows as a one-line change. Then the catalogs. The description lists what was found, what the verifier flagged, and anything you must do by hand.

If a string should not have been wrapped, delete that hunk before merging. Lyngo learns the refusal from the merge diff and never proposes that string again.

## Revert

A merged Lyngo pull request has a Revert button in the web app. Lyngo opens a new pull request that puts the files back as they were at the merge, catalog keys one by one, and lists conflicts with later commits. Trim it on GitHub to keep part of the change. What the revert takes back out is refused from then on.

## YOLO mode

A per-project setting that skips the pull request and pushes to the project's branch directly. For throwaway branches and demos.

## The CLI and the App together

When the CLI localized a change before the push, the scan finds nothing to do and opens nothing. The App is the net, not a second pass.
