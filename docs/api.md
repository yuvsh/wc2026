{\rtf1\ansi\ansicpg1252\cocoartf2869
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\froman\fcharset0 Times-Bold;\f1\froman\fcharset0 Times-Roman;\f2\fmodern\fcharset0 Courier;
\f3\froman\fcharset0 TimesNewRomanPSMT;\f4\fmodern\fcharset0 CourierNewPSMT;\f5\fmodern\fcharset0 Courier-Bold;
}
{\colortbl;\red255\green255\blue255;\red0\green0\blue0;\red109\green109\blue109;}
{\*\expandedcolortbl;;\cssrgb\c0\c0\c0;\cssrgb\c50196\c50196\c50196;}
{\*\listtable{\list\listtemplateid1\listhybrid{\listlevel\levelnfc23\levelnfcn23\leveljc0\leveljcn0\levelfollow0\levelstartat0\levelspace360\levelindent0{\*\levelmarker \{disc\}}{\leveltext\leveltemplateid1\'01\uc0\u8226 ;}{\levelnumbers;}\fi-360\li720\lin720 }{\listname ;}\listid1}
{\list\listtemplateid2\listhybrid{\listlevel\levelnfc0\levelnfcn0\leveljc0\leveljcn0\levelfollow0\levelstartat1\levelspace360\levelindent0{\*\levelmarker \{decimal\}}{\leveltext\leveltemplateid101\'01\'00;}{\levelnumbers\'01;}\fi-360\li720\lin720 }{\listlevel\levelnfc23\levelnfcn23\leveljc0\leveljcn0\levelfollow0\levelstartat0\levelspace360\levelindent0{\*\levelmarker \{circle\}}{\leveltext\leveltemplateid102\'01\uc0\u9702 ;}{\levelnumbers;}\fi-360\li1440\lin1440 }{\listname ;}\listid2}
{\list\listtemplateid3\listhybrid{\listlevel\levelnfc0\levelnfcn0\leveljc0\leveljcn0\levelfollow0\levelstartat1\levelspace360\levelindent0{\*\levelmarker \{decimal\}}{\leveltext\leveltemplateid201\'01\'00;}{\levelnumbers\'01;}\fi-360\li720\lin720 }{\listname ;}\listid3}
{\list\listtemplateid4\listhybrid{\listlevel\levelnfc0\levelnfcn0\leveljc0\leveljcn0\levelfollow0\levelstartat1\levelspace360\levelindent0{\*\levelmarker \{decimal\}}{\leveltext\leveltemplateid301\'01\'00;}{\levelnumbers\'01;}\fi-360\li720\lin720 }{\listlevel\levelnfc23\levelnfcn23\leveljc0\leveljcn0\levelfollow0\levelstartat0\levelspace360\levelindent0{\*\levelmarker \{circle\}}{\leveltext\leveltemplateid302\'01\uc0\u9702 ;}{\levelnumbers;}\fi-360\li1440\lin1440 }{\listname ;}\listid4}
{\list\listtemplateid5\listhybrid{\listlevel\levelnfc0\levelnfcn0\leveljc0\leveljcn0\levelfollow0\levelstartat1\levelspace360\levelindent0{\*\levelmarker \{decimal\}}{\leveltext\leveltemplateid401\'01\'00;}{\levelnumbers\'01;}\fi-360\li720\lin720 }{\listname ;}\listid5}
{\list\listtemplateid6\listhybrid{\listlevel\levelnfc0\levelnfcn0\leveljc0\leveljcn0\levelfollow0\levelstartat1\levelspace360\levelindent0{\*\levelmarker \{decimal\}}{\leveltext\leveltemplateid501\'01\'00;}{\levelnumbers\'01;}\fi-360\li720\lin720 }{\listname ;}\listid6}}
{\*\listoverridetable{\listoverride\listid1\listoverridecount0\ls1}{\listoverride\listid2\listoverridecount0\ls2}{\listoverride\listid3\listoverridecount0\ls3}{\listoverride\listid4\listoverridecount0\ls4}{\listoverride\listid5\listoverridecount0\ls5}{\listoverride\listid6\listoverridecount0\ls6}}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\deftab720
\pard\pardeftab720\sa321\partightenfactor0

\f0\b\fs48 \cf0 \expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Mundial Master Predictor\
\pard\pardeftab720\sa298\partightenfactor0

\fs36 \cf0 API Contract\
\pard\pardeftab720\sa240\partightenfactor0

\fs24 \cf0 Version 1.0 | Status: Draft | 2025
\f1\b0 \
\pard\pardeftab720\partightenfactor0
\cf3 \strokec3 \
\pard\pardeftab720\sa298\partightenfactor0

\f0\b\fs36 \cf0 \strokec2 1. Overview\
\pard\pardeftab720\sa240\partightenfactor0

\f1\b0\fs24 \cf0 This document defines every API endpoint the frontend consumes. The app uses two types of APIs:\
\pard\tx220\tx720\pardeftab720\li720\fi-720\partightenfactor0
\ls1\ilvl0
\f0\b \cf0 \kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	\uc0\u8226 	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Supabase REST API
\f1\b0  \'97 auto-generated from the database schema. Used for all CRUD operations via the Supabase JS client.\
\ls1\ilvl0
\f0\b \kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	\uc0\u8226 	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Supabase Edge Functions
\f1\b0  \'97 custom serverside logic that cannot be expressed as simple DB queries (lock enforcement, scoring, result ingestion).\
\pard\pardeftab720\sa240\partightenfactor0
\cf0 \strokec2 All requests require a valid Supabase JWT in the 
\f2\fs26 \strokec2 Authorization
\f1\fs24 \strokec2  header unless marked as 
\f0\b public
\f1\b0 . All timestamps are returned in 
\f0\b UTC ISO 8601
\f1\b0  format. The frontend converts to 
\f2\fs26 \strokec2 Asia/Jerusalem
\f1\fs24 \strokec2  for display. All responses follow the Supabase envelope format unless otherwise noted.\
\pard\pardeftab720\partightenfactor0
\cf3 \strokec3 \
\pard\pardeftab720\sa298\partightenfactor0

\f0\b\fs36 \cf0 \strokec2 2. Authentication\
\pard\pardeftab720\sa240\partightenfactor0

\f1\b0\fs24 \cf0 Authentication is handled entirely by Supabase Auth. The frontend uses the Supabase JS client \'97 no custom auth endpoints needed.\
\pard\pardeftab720\sa280\partightenfactor0

\f0\b\fs28 \cf0 2.1 Login\
\pard\pardeftab720\partightenfactor0

\f2\b0\fs26 \cf0 \strokec2 Provider: Google OAuth / Apple OAuth\
Client call: supabase.auth.signInWithOAuth(\{ provider: 'google' | 'apple' \})\
\pard\pardeftab720\sa240\partightenfactor0

\f0\b\fs24 \cf0 \strokec2 On success:
\f1\b0  Supabase returns a session with 
\f2\fs26 \strokec2 access_token
\f1\fs24 \strokec2  and 
\f2\fs26 \strokec2 refresh_token
\f1\fs24 \strokec2 . The JS client stores these automatically.\

\f0\b Side effect:
\f1\b0  Triggers 
\f2\fs26 \strokec2 on_auth_user_created
\f1\fs24 \strokec2  
\f3 \uc0\u8594 
\f1  creates row in 
\f2\fs26 \strokec2 public.users
\f1\fs24 \strokec2 .\
\pard\pardeftab720\sa280\partightenfactor0

\f0\b\fs28 \cf0 2.2 Logout\
\pard\pardeftab720\partightenfactor0

\f2\b0\fs26 \cf0 \strokec2 Client call: supabase.auth.signOut()\
\pard\pardeftab720\sa280\partightenfactor0

\f0\b\fs28 \cf0 \strokec2 2.3 Session Check (on app load)\
\pard\pardeftab720\partightenfactor0

\f2\b0\fs26 \cf0 \strokec2 Client call: supabase.auth.getSession()\
\pard\pardeftab720\sa240\partightenfactor0

\f1\fs24 \cf0 \strokec2 Used to determine whether to show the login screen or the dashboard.\
\pard\pardeftab720\partightenfactor0
\cf3 \strokec3 \
\pard\pardeftab720\sa298\partightenfactor0

\f0\b\fs36 \cf0 \strokec2 3. Users\
\pard\pardeftab720\sa280\partightenfactor0

\fs28 \cf0 3.1 Get Current User Profile\
\pard\pardeftab720\partightenfactor0

\f2\b0\fs26 \cf0 \strokec2 Client call: supabase.from('users').select('*, neighbourhoods(name)').eq('id', uid).single()\
\pard\pardeftab720\sa240\partightenfactor0

\f0\b\fs24 \cf0 \strokec2 Response:
\f1\b0 \
\pard\pardeftab720\partightenfactor0

\f2\fs26 \cf0 \strokec2 \{\
  "id": "uuid",\
  "display_name": "
\f4 \uc0\u1497 \u1493 \u1489 \u1500 
\f2  
\f4 \uc0\u1499 \u1492 \u1503 
\f2 ",\
  "avatar_url": "https://...",\
  "provider": "google",\
  "neighbourhood_id": "uuid | null",\
  "hood_locked": false,\
  "created_at": "2026-06-01T10:00:00Z",\
  "neighbourhoods": \{\
    "name": "
\f4 \uc0\u1502 \u1512 \u1499 \u1494 
\f2 "\
  \}\
\}\
\pard\pardeftab720\sa280\partightenfactor0

\f0\b\fs28 \cf0 \strokec2 3.2 Update Neighbourhood\
\pard\pardeftab720\partightenfactor0

\f2\b0\fs26 \cf0 \strokec2 Client call: supabase.from('users').update(\{ neighbourhood_id: '<uuid>' \}).eq('id', uid)\
\pard\pardeftab720\sa240\partightenfactor0

\f0\b\fs24 \cf0 \strokec2 Constraint:
\f1\b0  Only allowed when 
\f2\fs26 \strokec2 hood_locked = false
\f1\fs24 \strokec2 . Once the first match kicks off, the Edge Function 
\f2\fs26 \strokec2 lock-predictions
\f1\fs24 \strokec2  sets 
\f2\fs26 \strokec2 hood_locked = true
\f1\fs24 \strokec2  for all users.\

\f0\b Error if locked:
\f1\b0 \
\pard\pardeftab720\partightenfactor0

\f2\fs26 \cf0 \strokec2 \{ "code": "HOOD_LOCKED", "message": "Neighbourhood cannot be changed after the tournament has started." \}\
\pard\pardeftab720\sa280\partightenfactor0

\f0\b\fs28 \cf0 \strokec2 3.3 Update Display Name\
\pard\pardeftab720\partightenfactor0

\f2\b0\fs26 \cf0 \strokec2 Client call: supabase.from('users').update(\{ display_name: '<string>' \}).eq('id', uid)\
\pard\pardeftab720\partightenfactor0

\f1\fs24 \cf3 \strokec3 \
\pard\pardeftab720\sa298\partightenfactor0

\f0\b\fs36 \cf0 \strokec2 4. Neighbourhoods\
\pard\pardeftab720\sa280\partightenfactor0

\fs28 \cf0 4.1 List All Neighbourhoods\
\pard\pardeftab720\sa240\partightenfactor0

\fs24 \cf0 Public \'97 no auth required.
\f1\b0 \
\pard\pardeftab720\partightenfactor0

\f2\fs26 \cf0 \strokec2 Client call: supabase.from('neighbourhoods').select('*').order('display_order')\
\pard\pardeftab720\sa240\partightenfactor0

\f0\b\fs24 \cf0 \strokec2 Response:
\f1\b0 \
\pard\pardeftab720\partightenfactor0

\f2\fs26 \cf0 \strokec2 [\
  \{ "id": "uuid", "name": "
\f4 \uc0\u1502 \u1512 \u1499 \u1494 
\f2 ", "display_order": 1 \},\
  \{ "id": "uuid", "name": "
\f4 \uc0\u1510 \u1508 \u1493 \u1503 
\f2 ", "display_order": 2 \}\
]\
\pard\pardeftab720\partightenfactor0

\f1\fs24 \cf3 \strokec3 \
\pard\pardeftab720\sa298\partightenfactor0

\f0\b\fs36 \cf0 \strokec2 5. Leagues\
\pard\pardeftab720\sa280\partightenfactor0

\fs28 \cf0 5.1 Create League\
\pard\pardeftab720\partightenfactor0

\f2\b0\fs26 \cf0 \strokec2 Client call: supabase.from('leagues').insert(\{ name, invite_code, created_by: uid \})\
\pard\pardeftab720\sa240\partightenfactor0

\f0\b\fs24 \cf0 \strokec2 Invite code generation:
\f1\b0  Done client-side before insert.\
\pard\pardeftab720\partightenfactor0

\f2\fs26 \cf0 \strokec2 // Generate a random 6-character alphanumeric code\
function generateInviteCode(): string \{\
  return Math.random().toString(36).slice(2, 8).toUpperCase();\
\}\
\pard\pardeftab720\sa240\partightenfactor0

\f0\b\fs24 \cf0 \strokec2 Side effect:
\f1\b0  After insert, automatically add creator as a member:\
\pard\pardeftab720\partightenfactor0

\f2\fs26 \cf0 \strokec2 supabase.from('league_members').insert(\{ league_id, user_id: uid \})\
\pard\pardeftab720\sa240\partightenfactor0

\f0\b\fs24 \cf0 \strokec2 Error \'97 duplicate code:
\f1\b0 \
\pard\pardeftab720\partightenfactor0

\f2\fs26 \cf0 \strokec2 \{ "code": "23505", "message": "Invite code already exists." \}\
\pard\pardeftab720\sa240\partightenfactor0

\f1\fs24 \cf0 \strokec2 Retry with a new code if this occurs.\
\pard\pardeftab720\sa280\partightenfactor0

\f0\b\fs28 \cf0 5.2 Join League by Invite Code\
\pard\pardeftab720\partightenfactor0

\f2\b0\fs26 \cf0 \strokec2 Client call:\
  1. supabase.from('leagues').select('id').eq('invite_code', code).single()\
  2. supabase.from('league_members').insert(\{ league_id, user_id: uid \})\
\pard\pardeftab720\sa240\partightenfactor0

\f0\b\fs24 \cf0 \strokec2 Error \'97 invalid code:
\f1\b0 \
\pard\pardeftab720\partightenfactor0

\f2\fs26 \cf0 \strokec2 \{ "code": "PGRST116", "message": "No league found with this invite code." \}\
\pard\pardeftab720\sa240\partightenfactor0

\f0\b\fs24 \cf0 \strokec2 Error \'97 already a member:
\f1\b0 \
\pard\pardeftab720\partightenfactor0

\f2\fs26 \cf0 \strokec2 \{ "code": "23505", "message": "User is already a member of this league." \}\
\pard\pardeftab720\sa280\partightenfactor0

\f0\b\fs28 \cf0 \strokec2 5.3 Get User's Leagues\
\pard\pardeftab720\partightenfactor0

\f2\b0\fs26 \cf0 \strokec2 Client call:\
  supabase.from('league_members')\
    .select('league_id, total_points, leagues(id, name, invite_code)')\
    .eq('user_id', uid)\
\pard\pardeftab720\sa240\partightenfactor0

\f0\b\fs24 \cf0 \strokec2 Response:
\f1\b0 \
\pard\pardeftab720\partightenfactor0

\f2\fs26 \cf0 \strokec2 [\
  \{\
    "league_id": "uuid",\
    "total_points": 43,\
    "leagues": \{\
      "id": "uuid",\
      "name": "
\f4 \uc0\u1500 \u1497 \u1490 \u1514 
\f2  
\f4 \uc0\u1512 \u1489 \u1497 \u1489 \u1497 \u1501 
\f2 ",\
      "invite_code": "A4X9K2"\
    \}\
  \}\
]\
\pard\pardeftab720\partightenfactor0

\f1\fs24 \cf3 \strokec3 \
\pard\pardeftab720\sa298\partightenfactor0

\f0\b\fs36 \cf0 \strokec2 6. Leaderboard\
\pard\pardeftab720\sa280\partightenfactor0

\fs28 \cf0 6.1 Individual Leaderboard for a League\
\pard\pardeftab720\partightenfactor0

\f2\b0\fs26 \cf0 \strokec2 Client call:\
  supabase.from('league_members')\
    .select('total_points, users(id, display_name, avatar_url, neighbourhoods(name))')\
    .eq('league_id', leagueId)\
    .order('total_points', \{ ascending: false \})\
\pard\pardeftab720\sa240\partightenfactor0

\f0\b\fs24 \cf0 \strokec2 Response:
\f1\b0 \
\pard\pardeftab720\partightenfactor0

\f2\fs26 \cf0 \strokec2 [\
  \{\
    "total_points": 47,\
    "users": \{\
      "id": "uuid",\
      "display_name": "
\f4 \uc0\u1491 \u1504 \u1497 
\f2  
\f4 \uc0\u1499 \u1492 \u1503 
\f2 ",\
      "avatar_url": "https://...",\
      "neighbourhoods": \{ "name": "
\f4 \uc0\u1502 \u1512 \u1499 \u1494 
\f2 " \}\
    \}\
  \}\
]\
\pard\pardeftab720\sa280\partightenfactor0

\f0\b\fs28 \cf0 \strokec2 6.2 Neighbourhood Leaderboard for a League (Phase 2)\
\pard\pardeftab720\partightenfactor0

\f2\b0\fs26 \cf0 \strokec2 Client call:\
  supabase.from('neighbourhood_scores')\
    .select('*')\
    .eq('league_id', leagueId)\
    .order('total_points', \{ ascending: false \})\
\pard\pardeftab720\sa240\partightenfactor0

\f0\b\fs24 \cf0 \strokec2 Response:
\f1\b0 \
\pard\pardeftab720\partightenfactor0

\f2\fs26 \cf0 \strokec2 [\
  \{\
    "league_id": "uuid",\
    "neighbourhood_id": "uuid",\
    "neighbourhood_name": "
\f4 \uc0\u1502 \u1512 \u1499 \u1494 
\f2 ",\
    "total_points": 171,\
    "member_count": 7\
  \}\
]\
\pard\pardeftab720\partightenfactor0

\f1\fs24 \cf3 \strokec3 \
\pard\pardeftab720\sa298\partightenfactor0

\f0\b\fs36 \cf0 \strokec2 7. Matches\
\pard\pardeftab720\sa280\partightenfactor0

\fs28 \cf0 7.1 Get All Matches (Dashboard)\
\pard\pardeftab720\partightenfactor0

\f2\b0\fs26 \cf0 \strokec2 Client call:\
  supabase.from('matches')\
    .select('*')\
    .in('status', ['scheduled', 'live', 'finished'])\
    .order('kickoff_at', \{ ascending: true \})\
\pard\pardeftab720\sa240\partightenfactor0

\f0\b\fs24 \cf0 \strokec2 Response:
\f1\b0 \
\pard\pardeftab720\partightenfactor0

\f2\fs26 \cf0 \strokec2 [\
  \{\
    "id": "uuid",\
    "team_a": "
\f4 \uc0\u1510 \u1512 \u1508 \u1514 
\f2 ",\
    "team_b": "
\f4 \uc0\u1489 \u1512 \u1494 \u1497 \u1500 
\f2 ",\
    "team_a_code": "fr",\
    "team_b_code": "br",\
    "team_a_flag_url": "https://media.api-sports.io/flags/fr.svg",\
    "team_b_flag_url": "https://media.api-sports.io/flags/br.svg",\
    "kickoff_at": "2026-06-14T18:00:00Z",\
    "stage": "group",\
    "status": "scheduled",\
    "score_a": null,\
    "score_b": null\
  \}\
]\
\pard\pardeftab720\partightenfactor0

\f1\fs24 \cf3 \strokec3 \
\pard\pardeftab720\sa298\partightenfactor0

\f0\b\fs36 \cf0 \strokec2 8. Predictions\
\pard\pardeftab720\sa280\partightenfactor0

\fs28 \cf0 8.1 Get User's Predictions\
\pard\pardeftab720\partightenfactor0

\f2\b0\fs26 \cf0 \strokec2 Client call:\
  supabase.from('predictions')\
    .select('*')\
    .eq('user_id', uid)\
\pard\pardeftab720\sa280\partightenfactor0

\f0\b\fs28 \cf0 \strokec2 8.2 Submit or Update Prediction\
\pard\pardeftab720\partightenfactor0

\f2\b0\fs26 \cf0 \strokec2 Client call:\
  supabase.from('predictions')\
    .upsert(\{\
      user_id: uid,\
      match_id: matchId,\
      predicted_a: scoreA,\
      predicted_b: scoreB\
    \}, \{ onConflict: 'user_id,match_id' \})\
\pard\pardeftab720\sa240\partightenfactor0

\f0\b\fs24 \cf0 \strokec2 Constraint:
\f1\b0  RLS policy blocks updates where 
\f2\fs26 \strokec2 is_locked = true
\f1\fs24 \strokec2 . If a user tries to submit after lock:\

\f0\b Error:
\f1\b0 \
\pard\pardeftab720\partightenfactor0

\f2\fs26 \cf0 \strokec2 \{\
  "code": "PRED_LOCKED",\
  "message": "
\f4 \uc0\u1492 \u1502 \u1513 \u1495 \u1511 
\f2  
\f4 \uc0\u1504 \u1506 \u1493 \u1500 
\f2 . 
\f4 \uc0\u1500 \u1488 
\f2  
\f4 \uc0\u1504 \u1497 \u1514 \u1503 
\f2  
\f4 \uc0\u1500 \u1513 \u1504 \u1493 \u1514 
\f2  
\f4 \uc0\u1504 \u1497 \u1495 \u1493 \u1513 
\f2 ."\
\}\
\pard\pardeftab720\sa280\partightenfactor0

\f0\b\fs28 \cf0 \strokec2 8.3 Get Predictions for a Finished Match (all users in league)\
\pard\pardeftab720\sa240\partightenfactor0

\f1\b0\fs24 \cf0 Used for Match History \'97 shows what everyone predicted after the match is over.\
\pard\pardeftab720\partightenfactor0

\f2\fs26 \cf0 \strokec2 Client call:\
  supabase.from('predictions')\
    .select('predicted_a, predicted_b, points_awarded, users(display_name)')\
    .eq('match_id', matchId)\
\pard\pardeftab720\sa240\partightenfactor0

\f0\b\fs24 \cf0 \strokec2 Note:
\f1\b0  RLS only returns other users' predictions when the match 
\f2\fs26 \strokec2 is_locked = true
\f1\fs24 \strokec2  or 
\f2\fs26 \strokec2 status = 'finished'
\f1\fs24 \strokec2 .\
\pard\pardeftab720\partightenfactor0
\cf3 \strokec3 \
\pard\pardeftab720\sa298\partightenfactor0

\f0\b\fs36 \cf0 \strokec2 9. Golden Boot\
\pard\pardeftab720\sa280\partightenfactor0

\fs28 \cf0 9.1 Get All Players\
\pard\pardeftab720\sa240\partightenfactor0

\fs24 \cf0 Public \'97 no auth required.
\f1\b0 \
\pard\pardeftab720\partightenfactor0

\f2\fs26 \cf0 \strokec2 Client call:\
  supabase.from('players')\
    .select('*')\
    .order('display_order', \{ ascending: true \})\
\pard\pardeftab720\sa240\partightenfactor0

\f0\b\fs24 \cf0 \strokec2 Response:
\f1\b0 \
\pard\pardeftab720\partightenfactor0

\f2\fs26 \cf0 \strokec2 [\
  \{\
    "id": "uuid",\
    "name": "
\f4 \uc0\u1511 \u1497 \u1500 \u1497 \u1488 \u1503 
\f2  
\f4 \uc0\u1502 \u1489 \u1488 \u1508 \u1492 
\f2 ",\
    "country": "
\f4 \uc0\u1510 \u1512 \u1508 \u1514 
\f2 ",\
    "country_code": "fr",\
    "flag_url": "https://media.api-sports.io/flags/fr.svg",\
    "display_order": 1\
  \}\
]\
\pard\pardeftab720\sa280\partightenfactor0

\f0\b\fs28 \cf0 \strokec2 9.2 Submit Golden Boot Prediction\
\pard\pardeftab720\partightenfactor0

\f2\b0\fs26 \cf0 \strokec2 Client call:\
  supabase.from('golden_boot_predictions')\
    .upsert(\{\
      user_id: uid,\
      player_id: playerId\
    \}, \{ onConflict: 'user_id' \})\
\pard\pardeftab720\sa240\partightenfactor0

\f0\b\fs24 \cf0 \strokec2 Constraint:
\f1\b0  RLS blocks updates where 
\f2\fs26 \strokec2 is_locked = true
\f1\fs24 \strokec2 .\

\f0\b Error if locked:
\f1\b0 \
\pard\pardeftab720\partightenfactor0

\f2\fs26 \cf0 \strokec2 \{\
  "code": "GB_LOCKED",\
  "message": "
\f4 \uc0\u1492 \u1504 \u1497 \u1495 \u1493 \u1513 
\f2  
\f4 \uc0\u1504 \u1506 \u1493 \u1500 
\f2 . 
\f4 \uc0\u1500 \u1488 
\f2  
\f4 \uc0\u1504 \u1497 \u1514 \u1503 
\f2  
\f4 \uc0\u1500 \u1513 \u1504 \u1493 \u1514 
\f2  
\f4 \uc0\u1488 \u1514 
\f2  
\f4 \uc0\u1492 \u1489 \u1495 \u1497 \u1512 \u1492 
\f2 ."\
\}\
\pard\pardeftab720\sa280\partightenfactor0

\f0\b\fs28 \cf0 \strokec2 9.3 Get Current User's Golden Boot Prediction\
\pard\pardeftab720\partightenfactor0

\f2\b0\fs26 \cf0 \strokec2 Client call:\
  supabase.from('golden_boot_predictions')\
    .select('*, players(name, country_code)')\
    .eq('user_id', uid)\
    .single()\
\pard\pardeftab720\partightenfactor0

\f1\fs24 \cf3 \strokec3 \
\pard\pardeftab720\sa298\partightenfactor0

\f0\b\fs36 \cf0 \strokec2 10. Edge Functions\
\pard\pardeftab720\sa240\partightenfactor0

\f1\b0\fs24 \cf0 These are custom serverside functions that run on Supabase Edge. They are called by cron jobs \'97 
\f0\b not by the frontend directly
\f1\b0 .\
\pard\pardeftab720\sa280\partightenfactor0

\f0\b\fs28 \cf0 10.1 
\f5\fs30\fsmilli15210 \strokec2 poll-results
\f0\fs28 \strokec2 \
\pard\pardeftab720\sa240\partightenfactor0

\fs24 \cf0 Trigger:
\f1\b0  Cron \'97 every 10 minutes during active match windows. 
\f0\b Auth:
\f1\b0  Service role key (internal only).\

\f0\b What it does:
\f1\b0 \
\pard\tx220\tx720\pardeftab720\li720\fi-720\partightenfactor0
\ls2\ilvl0\cf0 \kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	1	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Calls API-Football 
\f2\fs26 /fixtures
\f1\fs24  endpoint for today's matches\
\ls2\ilvl0\kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	2	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 For each match returned with 
\f2\fs26 status = 'FT'
\f1\fs24 :\
\pard\tx940\tx1440\pardeftab720\li1440\fi-1440\partightenfactor0
\ls2\ilvl1\cf0 \kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	
\f3 \uc0\u9702 
\f1 	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 If our DB still has 
\f2\fs26 status = 'scheduled'
\f1\fs24  or 
\f2\fs26 'live'
\f1\fs24  
\f3 \uc0\u8594 
\f1  update 
\f2\fs26 score_a
\f1\fs24 , 
\f2\fs26 score_b
\f1\fs24 , 
\f2\fs26 status = 'finished'
\f1\fs24 , 
\f2\fs26 last_synced_at = now()
\f1\fs24 \
\ls2\ilvl1\kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	
\f3 \uc0\u9702 
\f1 	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 If already 
\f2\fs26 'finished'
\f1\fs24  
\f3 \uc0\u8594 
\f1  skip\
\pard\tx220\tx720\pardeftab720\li720\fi-720\partightenfactor0
\ls2\ilvl0\cf0 \kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	3	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 For postponed matches (
\f2\fs26 status = 'PST'
\f1\fs24 ): update 
\f2\fs26 status = 'postponed'
\f1\fs24 , update 
\f2\fs26 kickoff_at
\f1\fs24  to new date\
\ls2\ilvl0\kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	4	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 For cancelled matches (
\f2\fs26 status = 'CANC'
\f1\fs24 ): update 
\f2\fs26 status = 'cancelled'
\f1\fs24 \
\ls2\ilvl0\kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	5	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Calls 
\f2\fs26 run-scoring
\f1\fs24  for each newly finished match\
\pard\pardeftab720\sa240\partightenfactor0

\f0\b \cf0 \strokec2 Response:
\f1\b0 \
\pard\pardeftab720\partightenfactor0

\f2\fs26 \cf0 \strokec2 \{\
  "processed": 3,\
  "finished": 1,\
  "postponed": 1,\
  "cancelled": 0,\
  "skipped": 1\
\}\
\pard\pardeftab720\sa280\partightenfactor0

\f0\b\fs28 \cf0 \strokec2 10.2 
\f5\fs30\fsmilli15210 \strokec2 lock-predictions
\f0\fs28 \strokec2 \
\pard\pardeftab720\sa240\partightenfactor0

\fs24 \cf0 Trigger:
\f1\b0  Cron \'97 every 1 minute. 
\f0\b Auth:
\f1\b0  Service role key (internal only).\

\f0\b What it does:
\f1\b0 \
\pard\tx220\tx720\pardeftab720\li720\fi-720\partightenfactor0
\ls3\ilvl0\cf0 \kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	1	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Finds all matches where 
\f2\fs26 kickoff_at <= now() + 5 minutes
\f1\fs24  and 
\f2\fs26 status = 'scheduled'
\f1\fs24 \
\ls3\ilvl0\kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	2	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Sets 
\f2\fs26 is_locked = true
\f1\fs24  on all predictions for those matches\
\ls3\ilvl0\kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	3	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Sets 
\f2\fs26 is_locked = true
\f1\fs24  on 
\f2\fs26 golden_boot_predictions
\f1\fs24  if this is the first match of the tournament\
\ls3\ilvl0\kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	4	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Sets 
\f2\fs26 hood_locked = true
\f1\fs24  on all users if this is the first match of the tournament\
\pard\pardeftab720\sa240\partightenfactor0

\f0\b \cf0 \strokec2 Response:
\f1\b0 \
\pard\pardeftab720\partightenfactor0

\f2\fs26 \cf0 \strokec2 \{\
  "matches_locked": 2,\
  "predictions_locked": 34,\
  "golden_boot_locked": false,\
  "hood_locked": false\
\}\
\pard\pardeftab720\sa280\partightenfactor0

\f0\b\fs28 \cf0 \strokec2 10.3 
\f5\fs30\fsmilli15210 \strokec2 run-scoring
\f0\fs28 \strokec2 \
\pard\pardeftab720\sa240\partightenfactor0

\fs24 \cf0 Trigger:
\f1\b0  Called internally by 
\f2\fs26 \strokec2 poll-results
\f1\fs24 \strokec2  after a match finishes. Not on a cron schedule. 
\f0\b Auth:
\f1\b0  Service role key (internal only).\

\f0\b Input:
\f1\b0 \
\pard\pardeftab720\partightenfactor0

\f2\fs26 \cf0 \strokec2 \{ "match_id": "uuid" \}\
\pard\pardeftab720\sa240\partightenfactor0

\f0\b\fs24 \cf0 \strokec2 What it does:
\f1\b0 \
\pard\tx220\tx720\pardeftab720\li720\fi-720\partightenfactor0
\ls4\ilvl0\cf0 \kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	1	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Fetches all predictions for the match\
\ls4\ilvl0\kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	2	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 For each prediction:\
\pard\tx940\tx1440\pardeftab720\li1440\fi-1440\partightenfactor0
\ls4\ilvl1\cf0 \kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	
\f3 \uc0\u9702 
\f1 	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Exact score 
\f3 \uc0\u8594 
\f1  3 points\
\ls4\ilvl1\kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	
\f3 \uc0\u9702 
\f1 	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Correct result (90 min) 
\f3 \uc0\u8594 
\f1  1 point\
\ls4\ilvl1\kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	
\f3 \uc0\u9702 
\f1 	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Miss 
\f3 \uc0\u8594 
\f1  0 points\
\pard\tx220\tx720\pardeftab720\li720\fi-720\partightenfactor0
\ls4\ilvl0\cf0 \kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	3	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Updates 
\f2\fs26 predictions.points_awarded
\f1\fs24 \
\ls4\ilvl0\kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	4	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Updates 
\f2\fs26 league_members.total_points
\f1\fs24  for every league the user belongs to\
\pard\pardeftab720\sa240\partightenfactor0

\f0\b \cf0 \strokec2 Response:
\f1\b0 \
\pard\pardeftab720\partightenfactor0

\f2\fs26 \cf0 \strokec2 \{\
  "match_id": "uuid",\
  "predictions_scored": 12,\
  "total_points_awarded": 18\
\}\
\pard\pardeftab720\sa280\partightenfactor0

\f0\b\fs28 \cf0 \strokec2 10.4 
\f5\fs30\fsmilli15210 \strokec2 resolve-golden-boot
\f0\fs28 \strokec2 \
\pard\pardeftab720\sa240\partightenfactor0

\fs24 \cf0 Trigger:
\f1\b0  Called manually once at tournament end. 
\f0\b Auth:
\f1\b0  Service role key (internal only).\

\f0\b Input:
\f1\b0 \
\pard\pardeftab720\partightenfactor0

\f2\fs26 \cf0 \strokec2 \{ "winning_player_ids": ["uuid", "uuid"] \}\
\pard\pardeftab720\sa240\partightenfactor0

\f1\fs24 \cf0 \strokec2 Accepts an array to handle the case where two players share the Golden Boot.\
\pard\pardeftab720\sa240\partightenfactor0

\f0\b \cf0 What it does:
\f1\b0 \
\pard\tx220\tx720\pardeftab720\li720\fi-720\partightenfactor0
\ls5\ilvl0\cf0 \kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	1	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Finds all 
\f2\fs26 golden_boot_predictions
\f1\fs24  where 
\f2\fs26 player_id
\f1\fs24  is in 
\f2\fs26 winning_player_ids
\f1\fs24 \
\ls5\ilvl0\kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	2	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Sets 
\f2\fs26 points_awarded = 10
\f1\fs24  on each matching prediction\
\ls5\ilvl0\kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	3	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Updates 
\f2\fs26 league_members.total_points
\f1\fs24  for each winning user across all their leagues\
\pard\pardeftab720\sa240\partightenfactor0

\f0\b \cf0 \strokec2 Response:
\f1\b0 \
\pard\pardeftab720\partightenfactor0

\f2\fs26 \cf0 \strokec2 \{\
  "winners_found": 3,\
  "points_awarded": 30\
\}\
\pard\pardeftab720\sa280\partightenfactor0

\f0\b\fs28 \cf0 \strokec2 10.5 
\f5\fs30\fsmilli15210 \strokec2 sync-schedule
\f0\fs28 \strokec2 \
\pard\pardeftab720\sa240\partightenfactor0

\fs24 \cf0 Trigger:
\f1\b0  Cron \'97 every 60 minutes. 
\f0\b Auth:
\f1\b0  Service role key (internal only).\

\f0\b What it does:
\f1\b0 \
\pard\tx220\tx720\pardeftab720\li720\fi-720\partightenfactor0
\ls6\ilvl0\cf0 \kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	1	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Calls API-Football 
\f2\fs26 /fixtures?season=2026&league=1
\f1\fs24  (World Cup league ID)\
\ls6\ilvl0\kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	2	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Upserts all matches into the 
\f2\fs26 matches
\f1\fs24  table using 
\f2\fs26 api_football_id
\f1\fs24  as the conflict key\
\ls6\ilvl0\kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	3	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Skips matches already marked as 
\f2\fs26 finished
\f1\fs24  or 
\f2\fs26 cancelled
\f1\fs24 \
\pard\pardeftab720\sa240\partightenfactor0

\f0\b \cf0 \strokec2 Response:
\f1\b0 \
\pard\pardeftab720\partightenfactor0

\f2\fs26 \cf0 \strokec2 \{\
  "upserted": 104,\
  "skipped": 12\
\}\
\pard\pardeftab720\partightenfactor0

\f1\fs24 \cf3 \strokec3 \
\pard\pardeftab720\sa298\partightenfactor0

\f0\b\fs36 \cf0 \strokec2 11. Error Codes Reference\

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrt\brdrnil \trbrdrl\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth1716\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx2160
\clvertalc \clshdrawnil \clwWidth1433\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx4320
\clvertalc \clshdrawnil \clwWidth4371\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx6480
\clvertalc \clshdrawnil \clwWidth3796\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0

\fs24 \cf0 \strokec2 Code\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Source\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Meaning\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 User-facing message\cell \row

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrl\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth1716\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx2160
\clvertalc \clshdrawnil \clwWidth1433\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx4320
\clvertalc \clshdrawnil \clwWidth4371\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx6480
\clvertalc \clshdrawnil \clwWidth3796\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0

\f2\b0\fs26 \cf0 PRED_LOCKED
\f1\fs24 \cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 RLS / Edge Fn\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Prediction attempted after lock\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 "
\f3 \uc0\u1492 \u1502 \u1513 \u1495 \u1511 
\f1  
\f3 \uc0\u1504 \u1506 \u1493 \u1500 
\f1 . 
\f3 \uc0\u1500 \u1488 
\f1  
\f3 \uc0\u1504 \u1497 \u1514 \u1503 
\f1  
\f3 \uc0\u1500 \u1513 \u1504 \u1493 \u1514 
\f1  
\f3 \uc0\u1504 \u1497 \u1495 \u1493 \u1513 
\f1 ."\cell \row

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrl\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth1716\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx2160
\clvertalc \clshdrawnil \clwWidth1433\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx4320
\clvertalc \clshdrawnil \clwWidth4371\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx6480
\clvertalc \clshdrawnil \clwWidth3796\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0

\f2\fs26 \cf0 GB_LOCKED
\f1\fs24 \cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 RLS\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Golden Boot change attempted after lock\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 "
\f3 \uc0\u1492 \u1504 \u1497 \u1495 \u1493 \u1513 
\f1  
\f3 \uc0\u1504 \u1506 \u1493 \u1500 
\f1 . 
\f3 \uc0\u1500 \u1488 
\f1  
\f3 \uc0\u1504 \u1497 \u1514 \u1503 
\f1  
\f3 \uc0\u1500 \u1513 \u1504 \u1493 \u1514 
\f1  
\f3 \uc0\u1488 \u1514 
\f1  
\f3 \uc0\u1492 \u1489 \u1495 \u1497 \u1512 \u1492 
\f1 ."\cell \row

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrl\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth1716\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx2160
\clvertalc \clshdrawnil \clwWidth1433\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx4320
\clvertalc \clshdrawnil \clwWidth4371\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx6480
\clvertalc \clshdrawnil \clwWidth3796\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0

\f2\fs26 \cf0 HOOD_LOCKED
\f1\fs24 \cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 RLS\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Neighbourhood change after tournament start\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 "
\f3 \uc0\u1500 \u1488 
\f1  
\f3 \uc0\u1504 \u1497 \u1514 \u1503 
\f1  
\f3 \uc0\u1500 \u1513 \u1504 \u1493 \u1514 
\f1  
\f3 \uc0\u1513 \u1499 \u1493 \u1504 \u1492 
\f1  
\f3 \uc0\u1500 \u1488 \u1495 \u1512 
\f1  
\f3 \uc0\u1514 \u1495 \u1497 \u1500 \u1514 
\f1  
\f3 \uc0\u1492 \u1496 \u1493 \u1512 \u1504 \u1497 \u1512 
\f1 ."\cell \row

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrl\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth1716\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx2160
\clvertalc \clshdrawnil \clwWidth1433\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx4320
\clvertalc \clshdrawnil \clwWidth4371\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx6480
\clvertalc \clshdrawnil \clwWidth3796\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0

\f2\fs26 \cf0 23505
\f1\fs24 \cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Postgres\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Unique constraint violation (duplicate)\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Depends on context \'97 see Section 5\cell \row

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrl\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth1716\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx2160
\clvertalc \clshdrawnil \clwWidth1433\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx4320
\clvertalc \clshdrawnil \clwWidth4371\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx6480
\clvertalc \clshdrawnil \clwWidth3796\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0

\f2\fs26 \cf0 PGRST116
\f1\fs24 \cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Supabase\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Row not found (e.g. invalid invite code)\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 "
\f3 \uc0\u1511 \u1493 \u1491 
\f1  
\f3 \uc0\u1500 \u1488 
\f1  
\f3 \uc0\u1514 \u1511 \u1497 \u1503 
\f1 , 
\f3 \uc0\u1504 \u1505 \u1492 
\f1  
\f3 \uc0\u1513 \u1493 \u1489 
\f1 ."\cell \row

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrl\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth1716\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx2160
\clvertalc \clshdrawnil \clwWidth1433\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx4320
\clvertalc \clshdrawnil \clwWidth4371\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx6480
\clvertalc \clshdrawnil \clwWidth3796\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0

\f2\fs26 \cf0 PGRST301
\f1\fs24 \cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Supabase\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 JWT expired\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Redirect to login\cell \row

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrl\brdrnil \trbrdrt\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth1716\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx2160
\clvertalc \clshdrawnil \clwWidth1433\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx4320
\clvertalc \clshdrawnil \clwWidth4371\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx6480
\clvertalc \clshdrawnil \clwWidth3796\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0

\f2\fs26 \cf0 42501
\f1\fs24 \cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Postgres\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 RLS policy violation\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 "
\f3 \uc0\u1488 \u1497 \u1503 
\f1  
\f3 \uc0\u1492 \u1512 \u1513 \u1488 \u1492 
\f1  
\f3 \uc0\u1500 \u1489 \u1510 \u1506 
\f1  
\f3 \uc0\u1508 \u1506 \u1493 \u1500 \u1492 
\f1  
\f3 \uc0\u1494 \u1493 
\f1 ."\cell \lastrow\row
\pard\pardeftab720\partightenfactor0
\cf3 \strokec3 \
\pard\pardeftab720\sa298\partightenfactor0

\f0\b\fs36 \cf0 \strokec2 12. Realtime Subscriptions\
\pard\pardeftab720\sa240\partightenfactor0

\f1\b0\fs24 \cf0 The frontend uses Supabase Realtime for live updates \'97 no polling from the client.\
\pard\pardeftab720\sa280\partightenfactor0

\f0\b\fs28 \cf0 12.1 Leaderboard Updates\
\pard\pardeftab720\partightenfactor0

\f2\b0\fs26 \cf0 \strokec2 supabase\
  .channel('leaderboard')\
  .on('postgres_changes', \{\
    event: 'UPDATE',\
    schema: 'public',\
    table: 'league_members',\
    filter: `league_id=eq.$\{leagueId\}`\
  \}, (payload) => \{\
    // Re-render leaderboard with updated points\
  \})\
  .subscribe()\
\pard\pardeftab720\sa280\partightenfactor0

\f0\b\fs28 \cf0 \strokec2 12.2 Match Result & Points\
\pard\pardeftab720\partightenfactor0

\f2\b0\fs26 \cf0 \strokec2 supabase\
  .channel('predictions')\
  .on('postgres_changes', \{\
    event: 'UPDATE',\
    schema: 'public',\
    table: 'predictions',\
    filter: `user_id=eq.$\{uid\}`\
  \}, (payload) => \{\
    // Show points badge on match card\
  \})\
  .subscribe()\
\pard\pardeftab720\sa280\partightenfactor0

\f0\b\fs28 \cf0 \strokec2 12.3 Match Lock\
\pard\pardeftab720\partightenfactor0

\f2\b0\fs26 \cf0 \strokec2 supabase\
  .channel('matches')\
  .on('postgres_changes', \{\
    event: 'UPDATE',\
    schema: 'public',\
    table: 'matches'\
  \}, (payload) => \{\
    // Disable input on match card when status changes\
  \})\
  .subscribe()\
}