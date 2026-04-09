# Mundial Master Predictor
## MVP Product Requirements Document
**Version 1.1 | Status: Draft | 2025**

---

## 1. Executive Summary

A social, lightweight, and fast-to-market Progressive Web App (PWA) that enables football fans to compete in private leagues by predicting World Cup match scores and the tournament's top scorer. The app drives engagement through a simple scoring system, private group competition, and a viral invite mechanic.

---

## 2. Product Objectives

- **Engagement:** Drive daily user returns throughout the tournament via prediction deadlines and real-time leaderboards.
- **Virality:** Leverage private leagues and shareable invite codes for organic, word-of-mouth growth.
- **Speed to Market:** Minimalist feature set to guarantee launch before the opening whistle.

---

## 3. Success Metrics

Measurement window: full tournament duration.

| Metric | MVP Target | Notes |
| :--- | :--- | :--- |
| DAU / MAU Ratio | ≥ 40% | Measures daily stickiness during tournament |
| Avg. Predictions per User | ≥ 3 per match day | Indicates active engagement |
| League Fill Rate | Avg. ≥ 5 members per league | Validates social/virality loop |
| Invite Conversion Rate | ≥ 30% of shared codes joined | Measures viral growth |
| D7 Retention | ≥ 35% | Users returning one week after signup |

---

## 4. Core Features (In-Scope)

### 4.1 Authentication
- **One-Click Login:** Social auth via Google or Apple (Supabase).
- **Profile:** Display name and avatar URL pulled automatically from social provider.

### 4.2 Social Leagues
- **Create League:** User generates a unique 6-character invite code; no member cap.
- **Join League:** Enter an invite code to join a private group.
- **Share League:** Dedicated share button generates a pre-filled WhatsApp message and a copy-to-clipboard link containing the invite code.
- **Leaderboard:** Real-time ranking within each league, showing total points and Up/Down trend indicators.

### 4.3 Match Predictions
- **Score Input:** Predict the exact score for Team A vs Team B (e.g., 2 – 1).
- **Hard Lock:** Predictions lock automatically 5 minutes before kick-off (enforced server-side).
- **Matches View:** Scrollable list of upcoming matches with countdown timers to lock deadline.
- **Post-Match:** Points earned per match are visible in Match History.

### 4.4 Knockout Stage Scoring Rule

> **RULE:** Predictions are scored on the 90-minute result only. A match decided by extra time or penalties is treated as a **DRAW** for prediction purposes. This applies to all knockout-stage matches.

### 4.5 Golden Boot (Top Scorer) Bonus
- **Prediction:** User selects a player from a pre-defined list of the Top 40 tournament stars.
- **No "Other" Option:** Free-text input is excluded from MVP to eliminate validation complexity.
- **Lock Condition:** Must be submitted before the first match of the tournament kicks off.
- **Bonus Payout:** 10 points awarded automatically upon official top scorer confirmation from the data API at tournament end.

### 4.6 Notifications
- **Prediction Locked:** In-app notification when a match's prediction window closes.
- **Results Are In:** In-app notification when match result and points have been calculated.

> *Push notifications (OS-level) are out of scope for MVP.*

### 4.7 Automated Result Ingestion

There is no admin role in the MVP. All match results and point calculations are handled automatically:

- Match results are fetched from a third-party football data API (e.g., API-Football, SportMonks) on a polling schedule.
- Point calculation triggers automatically once a final result is confirmed by the data source.
- Golden Boot winner is determined automatically from the API's official top scorer data at tournament end; 10-point bonus distributes without manual intervention.
- Postponement and cancellation status are also pulled from the API and handled per Section 6.2.

> **NOTE:** The choice of football data API is a critical pre-development decision. The API must support: live match status, final scores, top scorer standings, and match schedule updates.

---

## 5. Scoring Logic

| Outcome | Criteria | Points |
| :--- | :--- | :---: |
| **Exact Score (Bingo ⚽)** | Correctly predicted both scores (e.g., Result 2-1, Predicted 2-1) | **3** |
| **Correct Result** | Correct winner or draw predicted, but wrong score | **1** |
| **Miss** | Incorrect winner/draw prediction | **0** |
| **Golden Boot** | Correctly predicted the tournament's top scorer | **10** |

---

## 6. Business Rules & Edge Cases

### 6.1 Prediction Lock
- Lock is enforced server-side, 5 minutes before the official kick-off time.
- Any prediction attempt after lock returns an error: *"This match is locked. Predictions are no longer accepted."*
- Users who have not submitted a prediction before lock receive 0 points for that match.

### 6.2 Postponed or Cancelled Matches

> **RULE:** If a match is postponed, the original predictions carry over to the rescheduled date. The lock timer resets to 5 minutes before the new kick-off. If a match is permanently cancelled, all predictions for that match are voided and no points are awarded.

### 6.3 Knockout Stage – Extra Time & Penalties

> **RULE:** All predictions and scoring are based on the 90-minute result only. A match that goes to extra time or penalties is scored as a **Draw** for prediction purposes, regardless of which team ultimately advances.

### 6.4 Golden Boot – Tie at Tournament End
- If two or more players share the Golden Boot title officially, any user who predicted either player is awarded the 10-point bonus.

---

## 7. Screens & User Flow

### Screen 1 – Login
- Minimalist splash screen with Google and Apple social auth buttons.
- No email/password login in MVP.

### Screen 2 – Onboarding Hub (Empty State)
- First-time users with no league see a dedicated onboarding prompt.
- Two clear CTAs: "Create a League" and "Join a League."
- Brief one-line value prop: *"Predict scores. Beat your mates. Win bragging rights."*

### Screen 3 – Main Dashboard (Prediction Center)
- **Top Card:** Personal rank and total points within active league.
- **Match List:** Upcoming match cards with score input fields and countdown timers to lock.
- **Sticky Banner:** "Predict the Golden Boot →" (visible until first match kicks off).

### Screen 4 – Leaderboard
- Full ranking of all league members: position, display name, avatar, total points.
- Up/Down trend arrows showing movement since last match day.

### Screen 5 – Match History
- Archive of all past matches with final result, user's prediction, and points earned.

### Screen 6 – Golden Boot Prediction
- Searchable/scrollable list of Top 40 players.
- Locks once the first match kicks off; locked state displays user's selection read-only.

---

## 8. Out of Scope for MVP

- In-app chat or comments.
- Live match score updates or push notifications for goals.
- Monetization, ads, or premium tiers.
- Player statistics, deep analytics, or match previews.
- Free-text ("Other") option in Golden Boot prediction.
- OS-level push notifications.

---

## 9. Open Questions

| # | Question |
| :--- | :--- |
| **Q1** | What is the source of match schedule data and kick-off times? Define owner and update cadence before development begins. |
| **Q2** | Which football data API will be used? Must confirm provider, SLA, and data refresh rate before development begins. Recommended candidates: API-Football, SportMonks, Football-Data.org. |

---

## 10. Phase 2 — Neighbourhood Feature

### Overview
The app serves a single village community. Phase 2 adds a neighbourhood layer so users can represent their street/neighbourhood and compete collectively within each league.

### Features

**User Profile**
- During onboarding (or from profile settings), user selects their neighbourhood from a predefined list.
- One neighbourhood per user; can be changed before the tournament starts, locked once it begins.

**Neighbourhood Leaderboard**
- Each league displays a secondary leaderboard grouped by neighbourhood.
- Neighbourhood score = sum of total points of all members from that neighbourhood within the league.
- Displayed alongside the individual leaderboard as a separate tab or section.

**Neighbourhood Standings**
- Ranking shows: position, neighbourhood name, total points, number of members contributing.
- Up/Down trend indicators same as individual leaderboard.

### Out of Scope for Phase 2
- Neighbourhood chat or dedicated group pages.
- Cross-league neighbourhood rankings.
- Admin management of neighbourhood list (list is predefined and fixed).
