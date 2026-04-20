# Mundial Master Predictor
## UI Copy — All Screen Texts
**Version 1.0 | Status: Draft | 2025**

> כל הטקסטים בממשק מרוכזים כאן. זהו המסמך הסמכותי לכל מחרוזת טקסט באפליקציה.
> יש לעדכן מסמך זה בכל שינוי טקסט לפני יישום בקוד.

---

## 1. מסך לוגין

| מזהה | טקסט | הערות |
| :--- | :--- | :--- |
| `login.app_name` | WC26 | שם האפליקציה (גדול, bold) |
| `login.credit` | created by Yuval Shahar | כיתוב קטן בתחתית המסך |
| `login.tagline` | נחש · תחרה · תנצח | טאגליין תחת הלוגו |
| `login.btn_google` | המשך עם Google | כפתור גוגל |
| `login.terms` | בהתחברות, אתה מסכים ל | טקסט תחתון |
| `login.terms_link` | תנאי השימוש | קישור |
| `login.and` | ו | מפריד |
| `login.privacy_link` | מדיניות הפרטיות | קישור |

---

## 2. מסך בחירת שכונה

| מזהה | טקסט | הערות |
| :--- | :--- | :--- |
| `hood.title` | באיזו שכונה אתה גר? | כותרת |
| `hood.subtitle` | תוכל לשנות זאת בפרופיל עד תחילת הטורניר | תת-כותרת |
| `hood.btn_continue` | המשך | כפתור — מושבת עד לבחירה |
| `hood.btn_skip` | דלג, אבחר מאוחר יותר | קישור דילוג |
| `hood.step_label` | שלב 2 מתוך 3 | accessibility label לנקודות |

> **שמות השכונות** — יש להחליף את הplaceholders למטה בשמות האמיתיים של רביבים לפני פיתוח:

| מזהה | טקסט placeholder | יש להחליף ב |
| :--- | :--- | :--- |
| `hood.name_1` | מרכז | ??? |
| `hood.name_2` | צפון | ??? |
| `hood.name_3` | דרום | ??? |
| `hood.name_4` | מזרח | ??? |
| `hood.name_5` | מערב | ??? |
| `hood.name_6` | שכונה ו' | ??? |

---

## 3. מסך אונבורדינג

| מזהה | טקסט | הערות |
| :--- | :--- | :--- |
| `onboard.greeting` | שלום, {name} 👋 | {name} = שם המשתמש |
| `onboard.create_title` | צור ליגה | כרטיס ראשי |
| `onboard.create_desc` | קבל קוד הזמנה ושתף עם החברים | תיאור תחת הכותרת |
| `onboard.divider` | או | מפריד |
| `onboard.join_placeholder` | הכנס קוד — A4X9K2 | placeholder בשדה הקלט |
| `onboard.join_btn` | הצטרף | כפתור הצטרפות |
| `onboard.join_error` | קוד לא תקין, נסה שוב | שגיאה בקוד שגוי |
| `onboard.my_leagues` | הליגות שלי | כותרת מפריד |
| `onboard.league_rank` | דירוג #{rank} | מטא-מידע בשורת ליגה |

### 3.1 מסך קוד הזמנה (אחרי יצירת ליגה)

| מזהה | טקסט | הערות |
| :--- | :--- | :--- |
| `invite.title` | הליגה שלך נוצרה! | כותרת |
| `invite.subtitle` | שתף את הקוד עם החברים | תת-כותרת |
| `invite.code_label` | קוד הזמנה | תווית מעל הקוד |
| `invite.btn_whatsapp` | שתף בוואטסאפ | כפתור ירוק |
| `invite.whatsapp_msg` | היי! הצטרף לליגת הניחושים שלי ל-World Cup 2026 🌍⚽ קוד כניסה: {code} | הודעת וואטסאפ |
| `invite.btn_copy` | העתק קוד | כפתור אפור |
| `invite.copied` | הועתק! | toast אחרי העתקה |
| `invite.btn_start` | התחל לנחש | כפתור תחתי |

---

## 4. לוח הניחושים (Dashboard)

| מזהה | טקסט | הערות |
| :--- | :--- | :--- |
| `dash.league_name` | {league_name} | שם הליגה הפעילה |
| `dash.rank` | דירוג | תווית בפיל |
| `dash.points` | {points} נק' | נקודות בפיל |
| `dash.golden_boot_banner` | חזה מי יהיה מלך השערים ← | באנר ירוק טיל |
| `dash.date_today` | היום · {day_name} {date} | תווית תאריך |
| `dash.timer_open` | ⏱ נועל בעוד {HH:MM:SS} | טיימר כשפתוח |
| `dash.timer_locked` | נעול | כשנעול |
| `dash.btn_save` | שמור ניחוש | כפתור שמירה |
| `dash.locked_error` | המשחק נעול. לא ניתן לשנות ניחוש | שגיאה אחרי נעילה |

---

## 5. תוצאות ונקודות

| מזהה | טקסט | הערות |
| :--- | :--- | :--- |
| `result.bingo` | ⚽ בינגו · 3 נקודות | badge זהב |
| `result.correct` | ✓ תוצאה נכונה · 1 נקודה | badge ירוק |
| `result.miss` | ✗ פספוס · 0 נקודות | badge אפור |
| `result.pending` | ממתין לתוצאה | לפני עדכון |
| `result.prediction_label` | ניחוש שלך: {score} | מתחת לתוצאה |

---

## 6. טבלת דירוג

| מזהה | טקסט | הערות |
| :--- | :--- | :--- |
| `lb.title` | דירוג | כותרת |
| `lb.tab_personal` | אישי | טאב |
| `lb.tab_hood` | שכונות | טאב — פאזה 2, מסומן "בקרוב" |
| `lb.coming_soon` | בקרוב | תווית על טאב שכונות |
| `lb.you` | אתה | שורת המשתמש הנוכחי |
| `lb.empty` | הליגה עדיין ריקה — שתף את הקוד! | empty state |
| `lb.no_leagues` | עדיין לא בליגה? צור אחת ← | empty state — אין ליגות |

### 6.1 דף ניחושי משתמש (drilldown)

| מזהה | טקסט | הערות |
| :--- | :--- | :--- |
| `lb.member_back` | חזרה | aria-label כפתור חזרה |
| `lb.member_back_arrow` | ← | חץ חזרה (RTL) |
| `lb.member_empty` | עוד לא ניחש כלום | empty state — אין ניחושים לתצוגה |
| `lb.member_live_badge` | LIVE | badge אדום על ניחוש של משחק חי |
| `lb.member_fallback_name` | שחקן | fallback אם שם המשתמש לא נמסר ב-URL |
| `lb.member_aria` | הצג ניחושים של {name} | aria-label על שורת ליגה לחיצה |

---

## 7. היסטוריה

| מזהה | טקסט | הערות |
| :--- | :--- | :--- |
| `hist.title` | היסטוריה | כותרת |
| `hist.filter_all` | הכל | פילטר |
| `hist.filter_bingo` | בינגו | פילטר |
| `hist.filter_correct` | תוצאה נכונה | פילטר |
| `hist.filter_miss` | פספוס | פילטר |
| `hist.stat_matches` | משחקים | תווית סטטיסטיקה |
| `hist.stat_points` | נקודות | תווית סטטיסטיקה |
| `hist.stat_bingo` | בינגו | תווית סטטיסטיקה |
| `hist.stat_correct` | נכון | תווית סטטיסטיקה |
| `hist.stat_miss` | פספוס | תווית סטטיסטיקה |
| `hist.empty` | אין משחקים עדיין | empty state |

---

## 8. מלך השערים

| מזהה | טקסט | הערות |
| :--- | :--- | :--- |
| `gb.title` | מלך השערים ⚽ | כותרת |
| `gb.deadline_label` | נועל לפני המשחק הראשון | תווית טיימר |
| `gb.search_placeholder` | חפש שחקן... | placeholder |
| `gb.btn_confirm` | אשר בחירה | כפתור זהב |
| `gb.preview_label` | הבחירה שלך: | תווית בbar תחתון |
| `gb.locked_title` | הניחוש נעול | כשנעול |
| `gb.locked_sub` | ניחשת: {player_name} | כשנעול |
| `gb.back` | חזרה לניחושים | קישור חזרה |

---

## 9. פרופיל

| מזהה | טקסט | הערות |
| :--- | :--- | :--- |
| `profile.title` | פרופיל | כותרת |
| `profile.provider` | מחובר עם {Google/Apple} | תת-כותרת |
| `profile.stat_rank` | דירוג בליגה | תווית |
| `profile.stat_points` | נקודות | תווית |
| `profile.stat_bingo` | בינגו | תווית |
| `profile.section_settings` | הגדרות | כותרת סקשן |
| `profile.display_name` | שם תצוגה | שורת הגדרה |
| `profile.neighbourhood` | שכונה | שורת הגדרה |
| `profile.dark_mode` | מצב כהה | שורת הגדרה |
| `profile.section_leagues` | ליגות | כותרת סקשן |
| `profile.add_league` | + הצטרף או צור ליגה חדשה | קישור |
| `profile.section_other` | אחר | כותרת סקשן |
| `profile.version` | גרסה | תווית |
| `profile.btn_logout` | התנתק | כפתור אדום |
| `profile.league_global_label` | כולם בשכונה | תווית מתחת לשם הליגה הגלובלית |
| `profile.league_delete` | מחק ליגה | כפתור מחיקה — מוצג רק ליוצר הליגה |
| `profile.league_delete_confirm` | בטוח? | שאלת אישור מחיקה |
| `profile.league_delete_yes` | כן, מחק | אישור מחיקה |
| `profile.league_delete_cancel` | ביטול | ביטול מחיקה |

---

## 10. ניווט תחתון (Tab Bar)

| מזהה | טקסט |
| :--- | :--- |
| `nav.predictions` | ניחושים |
| `nav.leaderboard` | טבלה |
| `nav.tournament` | טורניר |
| `nav.history` | היסטוריה |
| `nav.profile` | פרופיל |

---

## 11. מסך טורניר

| מזהה | טקסט | הערות |
| :--- | :--- | :--- |
| `tournament.title` | טורניר | כותרת |
| `tournament.tab_groups` | בתים | טאב |
| `tournament.tab_bracket` | נוקאאוט | טאב |
| `tournament.col_played` | מ' | עמודה — משחקים |
| `tournament.col_won` | נ' | עמודה — ניצחונות |
| `tournament.col_drawn` | ת' | עמודה — תיקו |
| `tournament.col_lost` | ה' | עמודה — הפסדים |
| `tournament.col_points` | נק' | עמודה — נקודות |
| `tournament.pending` | ממתין | מגרש שטרם נקבע |
| `tournament.round_r32` | שלב 32 — Round of 32 | כותרת שלב |
| `tournament.round_r16` | שמינית גמר — Round of 16 | כותרת שלב |
| `tournament.round_qf` | רבע גמר — Quarter-final | כותרת שלב |
| `tournament.round_sf` | חצי גמר — Semi-final | כותרת שלב |
| `tournament.round_final` | גמר — Final | כותרת שלב |

---

## 12. הודעות שגיאה ומערכת

| מזהה | טקסט | הערות |
| :--- | :--- | :--- |
| `error.match_locked` | המשחק נעול. לא ניתן לשנות ניחוש | נעילת משחק |
| `error.invalid_code` | קוד לא תקין, נסה שוב | הצטרפות לליגה |
| `error.network` | בעיית חיבור, נסה שוב | שגיאת רשת |
| `error.generic` | משהו השתבש, נסה שוב | שגיאה כללית |
| `toast.saved` | הניחוש נשמר | toast אחרי שמירה |
| `toast.copied` | הועתק! | toast אחרי העתקה |
| `toast.joined` | הצטרפת לליגה! | toast אחרי הצטרפות |
| `empty.no_matches` | אין משחקים היום | dashboard ריק |
| `empty.no_history` | אין משחקים עדיין | היסטוריה ריקה |
| `empty.no_leagues` | עוד לא הצטרפת לליגה | onboarding |
