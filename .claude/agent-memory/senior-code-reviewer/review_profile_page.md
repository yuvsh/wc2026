---
name: Profile Page Patterns
description: Recurring patterns and gotchas discovered during Task 9 profile page review — apply to all future screen reviews
type: project
---

# Patterns from Profile Page Review

**Why:** Several issues found in `app/(app)/profile/page.tsx` are likely to recur across other screens in this codebase.

**How to apply:** Flag all of the following as blockers in future reviews.

## Patterns to watch

- `createClient()` is called at the component top level (not inside a `useMemo`/`useRef`), creating a new Supabase client on every render. Check all client components for this pattern.
- `supabase.auth.getUser()` result is destructured without checking the `error` field — specifically `{ data: { user } }` without `error` check. This is a recurring omission.
- Sequential Supabase fetches (neighbourhood fetch, rank fetch) happen inside `useEffect` after an initial `Promise.all`. These are N+1 patterns that could be collapsed into a single DB query or RPC.
- `console.error` is used for server-side logging in a client component — errors are visible in the browser console including in production builds. This leaks internal Supabase error details to end users.
- The `League` interface uses a union type on `leagues` field (`| []`) to paper over Supabase's inconsistent return shape for joined relations. This is a code smell indicating the join shape isn't properly typed — watch for `as SomeType[]` casts as a signal.
- RTL arrow chevrons (`›`) are hardcoded as Unicode characters directly in JSX rather than in COPY. These are UI strings and should live in the constants object.
- `window.location.href` used for navigation instead of Next.js `router.push()` — causes a full page reload and loses client state.
- `setSaving(false)` is called before the error branch returns — if `!user` guard fires after `setSaving(true)`, the saving state is never reset. Pattern: always reset loading/saving state in a `finally` block.
