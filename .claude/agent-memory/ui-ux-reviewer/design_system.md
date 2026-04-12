---
name: Project Design System
description: Color palette, spacing, typography, and component patterns for the WC2026 Hebrew RTL PWA
type: project
---

## Color Palette (observed)
- Primary teal: `#0D9488`
- Gold/bingo: `#EF9F27`, background `#FAEEDA`
- Dark text: `#111827`
- Medium text: `#6B7280`
- Muted text: `#9CA3AF`
- Divider: `#E5E7EB`, inner divider `#F3F4F6`
- Page background: `#F8FAFC`
- Card background: `white`
- Surface alt: `#F9FAFB`
- Success green: `#22C55E`, background `#DCFCE7`
- Error red: `#DC2626`, background `#FEE2E2`
- Teal muted bg: `#F0FDFA`

## Typography Scale (observed)
- Page title / display name: `text-[17px] font-bold`
- Body / row value: `text-[15px]`
- Section header: `text-[13px] font-medium text-[#6B7280]`
- Label / sub-label: `text-[12px] text-[#9CA3AF]`
- Stat value: `text-[22px] font-bold`
- Badge / micro: `text-[11px]`

## Component Patterns
- Cards: `bg-white rounded-xl border border-[#E5E7EB] overflow-hidden`
- Section label above card: `text-[13px] font-medium text-[#6B7280] mb-2 text-right`
- Row divider pattern: `border-b border-[#F3F4F6] last:border-b-0`
- Primary button: `bg-[#0D9488] text-white rounded-xl font-bold min-h-[44px]`
- Destructive button: `bg-[#FEE2E2] text-[#DC2626] rounded-xl font-bold`
- Toast: `fixed top-4 left-1/2 -translate-x-1/2 bg-[#111827] text-white rounded-xl z-50 shadow-lg`
- Stat card: `bg-[#F9FAFB] rounded-xl` with centered value + label
- COPY constant object pattern used in every component for all UI strings (no hardcoded strings in JSX)

## Layout
- App shell: `bg-[#F8FAFC]`, `main` with bottom padding for tab bar
- Bottom tab bar: fixed, 56px height + safe-area-inset-bottom
- All profile/settings content: `mx-4` horizontal margin
- `dir="rtl"` applied at page root level (not layout level)

**Why:** Keeps design knowledge available across conversations without re-reading the entire codebase.
**How to apply:** Use these values when reviewing new components for consistency, or flagging deviations.
