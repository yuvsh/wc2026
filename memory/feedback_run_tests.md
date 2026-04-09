---
name: Run tests before every push
description: Always run npm test before git push
type: feedback
---

Always run `npm test` before every `git push`.

**Why:** User requested this after tests were set up in the project.

**How to apply:** In every task, after build passes and before `git push`, run `npm test` and fix any failures first.
