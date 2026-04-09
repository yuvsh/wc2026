# Mundial Master Predictor
## DevOps Specification
**Version 1.0 | Status: Draft | 2025**

---

## 1. Overview

This document defines the DevOps processes for the project: environments, branching strategy, CI/CD pipeline, secrets management, database migrations, rollback strategy, and cron jobs.

**Relevant stack:** Next.js · Supabase · Vercel · GitHub Actions

---

## 2. Environments

| Environment | Purpose | URL | Branch |
| :--- | :--- | :--- | :--- |
| **Production** | Real users | `mundial.app` | `main` |
| **Staging** | Pre-release testing | `staging.mundial.app` | `staging` |

### 2.1 Production
- Vercel project connected to `main` branch
- Dedicated Supabase project — `mundial-prod`
- Dedicated API-Football key for production
- Auto-deploy on every push to `main`

### 2.2 Staging
- Vercel preview environment connected to `staging` branch
- Dedicated Supabase project — `mundial-staging`
- Dedicated API-Football key for staging
- Data can be synthetic — no requirement for real data
- Auto-deploy on every push to `staging`

### 2.3 Environment Variables

Each environment holds the following variables in the Vercel dashboard (never in code):

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
API_FOOTBALL_KEY
NEXT_PUBLIC_APP_ENV          # 'production' | 'staging'
```

> **Important:** `SUPABASE_SERVICE_ROLE_KEY` and `API_FOOTBALL_KEY` are secrets — they must never appear in code or Git.

---

## 3. Branching Strategy

### 3.1 Branch Structure

```
main                               <- production (protected, no direct push)
staging                            <- staging environment (protected, no direct push)
feature/{ticket-id}-{short-desc}   <- feature development
fix/{ticket-id}-{short-desc}       <- bug fixes
hotfix/{ticket-id}-{short-desc}    <- urgent production fixes
chore/{short-desc}                 <- dependency updates, tooling
```

### 3.2 Rules

- **`main` is protected** — no direct push. All changes via PR only.
- **`staging` is protected** — no direct push. All changes via PR only.
- **Feature branches** — branched from `staging`, deleted after merge.
- **Hotfix** — branched from `main`, merged to `main` then back-merged to `staging`.

### 3.3 Full Flow

```
feature/branch
      |
      |  PR -> staging (code review + CI must pass)
      v
   staging  ------------------------------------------------> staging.mundial.app
      |
      |  PR -> main (QA sign-off required)
      v
    main  ---------------------------------------------------> mundial.app
```

### 3.4 Naming Convention

| Type | Example |
| :--- | :--- |
| Feature | `feature/42-golden-boot-screen` |
| Bug fix | `fix/57-lock-timer-rtl` |
| Hotfix | `hotfix/61-scoring-edge-case` |
| Chore | `chore/update-flag-icons` |

---

## 4. CI/CD Pipeline (GitHub Actions)

### 4.1 Trigger Summary

| Event | Pipeline |
| :--- | :--- |
| PR to `staging` | `ci.yml` — lint + type-check + build + tests |
| Push to `staging` | `deploy-staging.yml` — DB migration + Vercel deploy |
| Push to `main` | `deploy-prod.yml` — DB migration + Vercel deploy |

### 4.2 CI Pipeline — `ci.yml`

Runs on every PR before merge. PR cannot be merged if CI fails.

```yaml
name: CI

on:
  pull_request:
    branches: [staging, main]

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npm run type-check

      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.STAGING_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.STAGING_SUPABASE_ANON_KEY }}

      - name: Tests
        run: npm test
```

### 4.3 Deploy to Staging — `deploy-staging.yml`

```yaml
name: Deploy Staging

on:
  push:
    branches: [staging]

jobs:
  migrate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run DB migrations
        run: npx supabase db push
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
          SUPABASE_PROJECT_ID: ${{ secrets.STAGING_SUPABASE_PROJECT_ID }}

  deploy:
    needs: migrate
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Vercel (Staging)
        run: npx vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_STAGING_PROJECT_ID }}
```

### 4.4 Deploy to Production — `deploy-prod.yml`

Identical to staging but points to production secrets.

```yaml
name: Deploy Production

on:
  push:
    branches: [main]

jobs:
  migrate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run DB migrations
        run: npx supabase db push
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
          SUPABASE_PROJECT_ID: ${{ secrets.PROD_SUPABASE_PROJECT_ID }}

  deploy:
    needs: migrate
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Vercel (Production)
        run: npx vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROD_PROJECT_ID }}
```

---

## 5. Database Migrations

### 5.1 Tool
**Supabase CLI** — manages migrations as numbered SQL files under `/supabase/migrations/`.

### 5.2 File Naming Convention

```
supabase/migrations/
  20250611000001_initial_schema.sql
  20250611000002_add_neighbourhood.sql
  20250615000001_add_flag_fields.sql
```

Format: `YYYYMMDDHHMMSS_description.sql`

### 5.3 Rules

- **Never edit a migration that has already reached production** — create a new migration instead.
- Every migration must be **idempotent** — use `IF NOT EXISTS`, `ON CONFLICT DO NOTHING`.
- Migrations run automatically on every deploy — see the `migrate` job in each pipeline.
- Every migration must be **backward-compatible** with the previous version of the application code.
- Always test migrations on staging before they reach production.

---

## 6. Secrets Management

All secrets are managed in **GitHub Actions Secrets** and **Vercel Environment Variables**.

| Secret | Location | Environment |
| :--- | :--- | :--- |
| `SUPABASE_ACCESS_TOKEN` | GitHub | Both |
| `STAGING_SUPABASE_URL` | GitHub + Vercel | Staging |
| `STAGING_SUPABASE_ANON_KEY` | GitHub + Vercel | Staging |
| `STAGING_SUPABASE_PROJECT_ID` | GitHub | Staging |
| `PROD_SUPABASE_URL` | GitHub + Vercel | Production |
| `PROD_SUPABASE_ANON_KEY` | GitHub + Vercel | Production |
| `PROD_SUPABASE_PROJECT_ID` | GitHub | Production |
| `SUPABASE_SERVICE_ROLE_KEY` | Vercel only | Both |
| `API_FOOTBALL_KEY` | Vercel only | Both |
| `VERCEL_TOKEN` | GitHub | Both |
| `VERCEL_ORG_ID` | GitHub | Both |
| `VERCEL_STAGING_PROJECT_ID` | GitHub | Staging |
| `VERCEL_PROD_PROJECT_ID` | GitHub | Production |

> **Rule:** No secret ever enters a `.env` file committed to Git. The `.env.local` file is local only and must be listed in `.gitignore`.

---

## 7. Monitoring & Alerting

Out of scope for MVP. Can be added in Phase 2 — Sentry for error tracking, Better Uptime for uptime monitoring.

---

## 8. Rollback Strategy

### 8.1 Vercel Rollback
Vercel retains all deployments. In case of an issue:
1. Go to the Vercel dashboard
2. Select the previous deployment
3. Click "Promote to Production"
4. Rollback time: **under 2 minutes**

### 8.2 Database Rollback
There is no automatic DB rollback. In a critical case:
1. Write a new migration that reverts the change
2. Run it manually via Supabase CLI
3. Re-deploy the previous version from Vercel

> This is why every migration must be backward-compatible with the previous version of the application code.

---

## 9. Cron Jobs (Edge Functions)

Supabase Edge Functions run on a schedule:

| Function | Schedule | Purpose |
| :--- | :--- | :--- |
| `poll-results` | Every 10 min during match windows | Fetches results from API-Football |
| `lock-predictions` | Every 1 min | Locks predictions 5 min before kickoff |
| `sync-schedule` | Every 60 min | Syncs upcoming match schedule |

### 9.1 Cron Setup in Supabase

```sql
-- Supabase dashboard -> Edge Functions -> Schedule
select cron.schedule(
  'poll-results',
  '*/10 * * * *',
  $$ select net.http_post(
    url := 'https://{project}.supabase.co/functions/v1/poll-results',
    headers := '{"Authorization": "Bearer {service_role_key}"}'
  ) $$
);
```

### 9.2 Cron Job Monitoring
- Each Edge Function returns status 200 / 500
- Run history is visible manually in the Supabase Dashboard

---

## 10. Pre-Tournament Checklist

Before the first match of the tournament (June 11, 2026):

- [ ] API-Football key in production is valid and has sufficient quota
- [ ] All migrations have run successfully in production
- [ ] Cron jobs are active and have been tested on staging
- [ ] Supabase logs reviewed — no open errors
- [ ] `main` branch is in sync with `staging`
- [ ] Environment variables are set in both environments
- [ ] Golden Boot lock time is set correctly (first kickoff in Israel time — Asia/Jerusalem)
- [ ] Supabase daily backups are enabled
- [ ] Load test performed on staging with synthetic data
