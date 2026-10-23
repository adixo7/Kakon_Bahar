---
name: Workspace startup installs
description: Shared pnpm workspace installs can conflict when multiple artifact workflows start simultaneously.
---

Each artifact service's development command runs `pnpm install --frozen-lockfile` from the shared workspace root. Starting several services together can cause package proxy rate limits and concurrent filesystem rename collisions; the storefront does not require the API server or mockup sandbox to render.

**Why:** Concurrent startup produced HTTP 429 fetch failures and `ENOTEMPTY` errors, while starting only the storefront completed the install and served the app.

**How to apply:** For local preview of Kakon Bahar, start only the storefront workflow. Start another service separately only when the task actually needs it.
