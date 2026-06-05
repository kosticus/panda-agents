---
name: Don't run build commands
description: User prefers to run builds themselves — just describe changes and let them build
type: feedback
---

Don't run build/dev-server commands. Just tell the user what changed and let them build.

**Why:** Token efficiency is paramount. The user explicitly asked not to run builds.

**How to apply:** After making code changes, summarize what changed and say "give it a build" or similar. Don't run `npm run dev`, `npx tsc`, vite, etc.
