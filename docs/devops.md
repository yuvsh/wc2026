{\rtf1\ansi\ansicpg1252\cocoartf2869
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\froman\fcharset0 Times-Bold;\f1\froman\fcharset0 Times-Roman;\f2\fmodern\fcharset0 Courier;
\f3\fmodern\fcharset0 Courier-Bold;}
{\colortbl;\red255\green255\blue255;\red0\green0\blue0;\red109\green109\blue109;}
{\*\expandedcolortbl;;\cssrgb\c0\c0\c0;\cssrgb\c50196\c50196\c50196;}
{\*\listtable{\list\listtemplateid1\listhybrid{\listlevel\levelnfc23\levelnfcn23\leveljc0\leveljcn0\levelfollow0\levelstartat0\levelspace360\levelindent0{\*\levelmarker \{disc\}}{\leveltext\leveltemplateid1\'01\uc0\u8226 ;}{\levelnumbers;}\fi-360\li720\lin720 }{\listname ;}\listid1}
{\list\listtemplateid2\listhybrid{\listlevel\levelnfc23\levelnfcn23\leveljc0\leveljcn0\levelfollow0\levelstartat0\levelspace360\levelindent0{\*\levelmarker \{disc\}}{\leveltext\leveltemplateid101\'01\uc0\u8226 ;}{\levelnumbers;}\fi-360\li720\lin720 }{\listname ;}\listid2}
{\list\listtemplateid3\listhybrid{\listlevel\levelnfc23\levelnfcn23\leveljc0\leveljcn0\levelfollow0\levelstartat0\levelspace360\levelindent0{\*\levelmarker \{disc\}}{\leveltext\leveltemplateid201\'01\uc0\u8226 ;}{\levelnumbers;}\fi-360\li720\lin720 }{\listname ;}\listid3}
{\list\listtemplateid4\listhybrid{\listlevel\levelnfc23\levelnfcn23\leveljc0\leveljcn0\levelfollow0\levelstartat0\levelspace360\levelindent0{\*\levelmarker \{disc\}}{\leveltext\leveltemplateid301\'01\uc0\u8226 ;}{\levelnumbers;}\fi-360\li720\lin720 }{\listname ;}\listid4}
{\list\listtemplateid5\listhybrid{\listlevel\levelnfc0\levelnfcn0\leveljc0\leveljcn0\levelfollow0\levelstartat1\levelspace360\levelindent0{\*\levelmarker \{decimal\}}{\leveltext\leveltemplateid401\'01\'00;}{\levelnumbers\'01;}\fi-360\li720\lin720 }{\listname ;}\listid5}
{\list\listtemplateid6\listhybrid{\listlevel\levelnfc0\levelnfcn0\leveljc0\leveljcn0\levelfollow0\levelstartat1\levelspace360\levelindent0{\*\levelmarker \{decimal\}}{\leveltext\leveltemplateid501\'01\'00;}{\levelnumbers\'01;}\fi-360\li720\lin720 }{\listname ;}\listid6}
{\list\listtemplateid7\listhybrid{\listlevel\levelnfc23\levelnfcn23\leveljc0\leveljcn0\levelfollow0\levelstartat0\levelspace360\levelindent0{\*\levelmarker \{disc\}}{\leveltext\leveltemplateid601\'01\uc0\u8226 ;}{\levelnumbers;}\fi-360\li720\lin720 }{\listname ;}\listid7}
{\list\listtemplateid8\listhybrid{\listlevel\levelnfc23\levelnfcn23\leveljc0\leveljcn0\levelfollow0\levelstartat0\levelspace360\levelindent0{\*\levelmarker \{disc\}}{\leveltext\leveltemplateid701\'01\uc0\u8226 ;}{\levelnumbers;}\fi-360\li720\lin720 }{\listname ;}\listid8}}
{\*\listoverridetable{\listoverride\listid1\listoverridecount0\ls1}{\listoverride\listid2\listoverridecount0\ls2}{\listoverride\listid3\listoverridecount0\ls3}{\listoverride\listid4\listoverridecount0\ls4}{\listoverride\listid5\listoverridecount0\ls5}{\listoverride\listid6\listoverridecount0\ls6}{\listoverride\listid7\listoverridecount0\ls7}{\listoverride\listid8\listoverridecount0\ls8}}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\deftab720
\pard\pardeftab720\sa321\partightenfactor0

\f0\b\fs48 \cf0 \expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Mundial Master Predictor\
\pard\pardeftab720\sa298\partightenfactor0

\fs36 \cf0 DevOps Specification\
\pard\pardeftab720\sa240\partightenfactor0

\fs24 \cf0 Version 1.0 | Status: Draft | 2025
\f1\b0 \
\pard\pardeftab720\partightenfactor0
\cf3 \strokec3 \
\pard\pardeftab720\sa298\partightenfactor0

\f0\b\fs36 \cf0 \strokec2 1. Overview\
\pard\pardeftab720\sa240\partightenfactor0

\f1\b0\fs24 \cf0 This document defines the DevOps processes for the project: environments, branching strategy, CI/CD pipeline, secrets management, database migrations, rollback strategy, and cron jobs.\
\pard\pardeftab720\sa240\partightenfactor0

\f0\b \cf0 Relevant stack:
\f1\b0  Next.js \'b7 Supabase \'b7 Vercel \'b7 GitHub Actions\
\pard\pardeftab720\partightenfactor0
\cf3 \strokec3 \
\pard\pardeftab720\sa298\partightenfactor0

\f0\b\fs36 \cf0 \strokec2 2. Environments\

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrt\brdrnil \trbrdrl\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth1355\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx2160
\clvertalc \clshdrawnil \clwWidth1765\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx4320
\clvertalc \clshdrawnil \clwWidth2964\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx6480
\clvertalc \clshdrawnil \clwWidth1092\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0

\fs24 \cf0 \strokec2 Environment\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Purpose\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 URL\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Branch\cell \row

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrl\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth1355\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx2160
\clvertalc \clshdrawnil \clwWidth1765\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx4320
\clvertalc \clshdrawnil \clwWidth2964\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx6480
\clvertalc \clshdrawnil \clwWidth1092\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Production
\f1\b0 \cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Real users\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0

\f2\fs26 \cf0 mundial.app
\f1\fs24 \cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0

\f2\fs26 \cf0 main
\f1\fs24 \cell \row

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrl\brdrnil \trbrdrt\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth1355\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx2160
\clvertalc \clshdrawnil \clwWidth1765\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx4320
\clvertalc \clshdrawnil \clwWidth2964\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx6480
\clvertalc \clshdrawnil \clwWidth1092\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0

\f0\b \cf0 Staging
\f1\b0 \cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Pre-release testing\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0

\f2\fs26 \cf0 staging.mundial.app
\f1\fs24 \cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0

\f2\fs26 \cf0 staging
\f1\fs24 \cell \lastrow\row
\pard\pardeftab720\sa280\partightenfactor0

\f0\b\fs28 \cf0 \strokec2 2.1 Production\
\pard\tx220\tx720\pardeftab720\li720\fi-720\partightenfactor0
\ls1\ilvl0
\f1\b0\fs24 \cf0 \kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	\uc0\u8226 	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Vercel project connected to 
\f2\fs26 main
\f1\fs24  branch\
\ls1\ilvl0\kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	\uc0\u8226 	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Dedicated Supabase project \'97 
\f2\fs26 mundial-prod
\f1\fs24 \
\ls1\ilvl0\kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	\uc0\u8226 	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Dedicated API-Football key for production\
\ls1\ilvl0\kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	\uc0\u8226 	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Auto-deploy on every push to 
\f2\fs26 main
\f1\fs24 \
\pard\pardeftab720\sa280\partightenfactor0

\f0\b\fs28 \cf0 \strokec2 2.2 Staging\
\pard\tx220\tx720\pardeftab720\li720\fi-720\partightenfactor0
\ls2\ilvl0
\f1\b0\fs24 \cf0 \kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	\uc0\u8226 	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Vercel preview environment connected to 
\f2\fs26 staging
\f1\fs24  branch\
\ls2\ilvl0\kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	\uc0\u8226 	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Dedicated Supabase project \'97 
\f2\fs26 mundial-staging
\f1\fs24 \
\ls2\ilvl0\kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	\uc0\u8226 	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Dedicated API-Football key for staging\
\ls2\ilvl0\kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	\uc0\u8226 	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Data can be synthetic \'97 no requirement for real data\
\ls2\ilvl0\kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	\uc0\u8226 	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Auto-deploy on every push to 
\f2\fs26 staging
\f1\fs24 \
\pard\pardeftab720\sa280\partightenfactor0

\f0\b\fs28 \cf0 \strokec2 2.3 Environment Variables\
\pard\pardeftab720\sa240\partightenfactor0

\f1\b0\fs24 \cf0 Each environment holds the following variables in the Vercel dashboard (never in code):\
\pard\pardeftab720\partightenfactor0

\f2\fs26 \cf0 \strokec2 NEXT_PUBLIC_SUPABASE_URL\
NEXT_PUBLIC_SUPABASE_ANON_KEY\
SUPABASE_SERVICE_ROLE_KEY\
API_FOOTBALL_KEY\
NEXT_PUBLIC_APP_ENV          # 'production' | 'staging'\
\pard\pardeftab720\sa240\partightenfactor0

\f0\b\fs24 \cf0 Important:
\f1\b0 \strokec2  
\f2\fs26 \strokec2 SUPABASE_SERVICE_ROLE_KEY
\f1\fs24 \strokec2  and 
\f2\fs26 \strokec2 API_FOOTBALL_KEY
\f1\fs24 \strokec2  are secrets \'97 they must never appear in code or Git.\
\pard\pardeftab720\partightenfactor0
\cf3 \strokec3 \
\pard\pardeftab720\sa298\partightenfactor0

\f0\b\fs36 \cf0 \strokec2 3. Branching Strategy\
\pard\pardeftab720\sa280\partightenfactor0

\fs28 \cf0 3.1 Branch Structure\
\pard\pardeftab720\partightenfactor0

\f2\b0\fs26 \cf0 \strokec2 main                               <- production (protected, no direct push)\
staging                            <- staging environment (protected, no direct push)\
feature/\{ticket-id\}-\{short-desc\}   <- feature development\
fix/\{ticket-id\}-\{short-desc\}       <- bug fixes\
hotfix/\{ticket-id\}-\{short-desc\}    <- urgent production fixes\
chore/\{short-desc\}                 <- dependency updates, tooling\
\pard\pardeftab720\sa280\partightenfactor0

\f0\b\fs28 \cf0 \strokec2 3.2 Rules\
\pard\tx220\tx720\pardeftab720\li720\fi-720\partightenfactor0
\ls3\ilvl0
\f3\fs26 \cf0 \kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	\uc0\u8226 	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 main
\f0\fs24  is protected
\f1\b0  \'97 no direct push. All changes via PR only.\
\ls3\ilvl0
\f3\b\fs26 \kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	\uc0\u8226 	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 staging
\f0\fs24  is protected
\f1\b0  \'97 no direct push. All changes via PR only.\
\pard\tx220\tx720\pardeftab720\li720\fi-720\partightenfactor0
\ls3\ilvl0
\f0\b \cf0 \kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	\uc0\u8226 	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Feature branches
\f1\b0  \'97 branched from 
\f2\fs26 staging
\f1\fs24 , deleted after merge.\
\ls3\ilvl0
\f0\b \kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	\uc0\u8226 	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Hotfix
\f1\b0  \'97 branched from 
\f2\fs26 main
\f1\fs24 , merged to 
\f2\fs26 main
\f1\fs24  then back-merged to 
\f2\fs26 staging
\f1\fs24 .\
\pard\pardeftab720\sa280\partightenfactor0

\f0\b\fs28 \cf0 \strokec2 3.3 Full Flow\
\pard\pardeftab720\partightenfactor0

\f2\b0\fs26 \cf0 \strokec2 feature/branch\
      |\
      |  PR -> staging (code review + CI must pass)\
      v\
   staging  ------------------------------------------------> staging.mundial.app\
      |\
      |  PR -> main (QA sign-off required)\
      v\
    main  ---------------------------------------------------> mundial.app\
\pard\pardeftab720\sa280\partightenfactor0

\f0\b\fs28 \cf0 \strokec2 3.4 Naming Convention\

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrt\brdrnil \trbrdrl\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth719\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx4320
\clvertalc \clshdrawnil \clwWidth4525\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0

\fs24 \cf0 \strokec2 Type\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Example\cell \row

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrl\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth719\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx4320
\clvertalc \clshdrawnil \clwWidth4525\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0

\f1\b0 \cf0 Feature\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0

\f2\fs26 \cf0 feature/42-golden-boot-screen
\f1\fs24 \cell \row

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrl\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth719\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx4320
\clvertalc \clshdrawnil \clwWidth4525\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Bug fix\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0

\f2\fs26 \cf0 fix/57-lock-timer-rtl
\f1\fs24 \cell \row

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrl\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth719\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx4320
\clvertalc \clshdrawnil \clwWidth4525\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Hotfix\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0

\f2\fs26 \cf0 hotfix/61-scoring-edge-case
\f1\fs24 \cell \row

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrl\brdrnil \trbrdrt\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth719\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx4320
\clvertalc \clshdrawnil \clwWidth4525\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Chore\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0

\f2\fs26 \cf0 chore/update-flag-icons
\f1\fs24 \cell \lastrow\row
\pard\pardeftab720\partightenfactor0
\cf3 \strokec3 \
\pard\pardeftab720\sa298\partightenfactor0

\f0\b\fs36 \cf0 \strokec2 4. CI/CD Pipeline (GitHub Actions)\
\pard\pardeftab720\sa280\partightenfactor0

\fs28 \cf0 4.1 Trigger Summary\

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrt\brdrnil \trbrdrl\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth1866\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx4320
\clvertalc \clshdrawnil \clwWidth6076\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0

\fs24 \cf0 \strokec2 Event\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Pipeline\cell \row

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrl\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth1866\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx4320
\clvertalc \clshdrawnil \clwWidth6076\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0

\f1\b0 \cf0 PR to 
\f2\fs26 staging
\f1\fs24 \cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0

\f2\fs26 \cf0 ci.yml
\f1\fs24  \'97 lint + type-check + build + tests\cell \row

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrl\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth1866\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx4320
\clvertalc \clshdrawnil \clwWidth6076\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Push to 
\f2\fs26 staging
\f1\fs24 \cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0

\f2\fs26 \cf0 deploy-staging.yml
\f1\fs24  \'97 DB migration + Vercel deploy\cell \row

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrl\brdrnil \trbrdrt\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth1866\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx4320
\clvertalc \clshdrawnil \clwWidth6076\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Push to 
\f2\fs26 main
\f1\fs24 \cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0

\f2\fs26 \cf0 deploy-prod.yml
\f1\fs24  \'97 DB migration + Vercel deploy\cell \lastrow\row
\pard\pardeftab720\sa280\partightenfactor0

\f0\b\fs28 \cf0 \strokec2 4.2 CI Pipeline \'97 
\f3\fs30\fsmilli15210 \strokec2 ci.yml
\f0\fs28 \strokec2 \
\pard\pardeftab720\sa240\partightenfactor0

\f1\b0\fs24 \cf0 Runs on every PR before merge. PR cannot be merged if CI fails.\
\pard\pardeftab720\partightenfactor0

\f2\fs26 \cf0 \strokec2 name: CI\
\
on:\
  pull_request:\
    branches: [staging, main]\
\
jobs:\
  ci:\
    runs-on: ubuntu-latest\
    steps:\
      - uses: actions/checkout@v4\
\
      - uses: actions/setup-node@v4\
        with:\
          node-version: 20\
          cache: npm\
\
      - name: Install dependencies\
        run: npm ci\
\
      - name: Lint\
        run: npm run lint\
\
      - name: Type check\
        run: npm run type-check\
\
      - name: Build\
        run: npm run build\
        env:\
          NEXT_PUBLIC_SUPABASE_URL: $\{\{ secrets.STAGING_SUPABASE_URL \}\}\
          NEXT_PUBLIC_SUPABASE_ANON_KEY: $\{\{ secrets.STAGING_SUPABASE_ANON_KEY \}\}\
\
      - name: Tests\
        run: npm test\
\pard\pardeftab720\sa280\partightenfactor0

\f0\b\fs28 \cf0 \strokec2 4.3 Deploy to Staging \'97 
\f3\fs30\fsmilli15210 \strokec2 deploy-staging.yml
\f0\fs28 \strokec2 \
\pard\pardeftab720\partightenfactor0

\f2\b0\fs26 \cf0 \strokec2 name: Deploy Staging\
\
on:\
  push:\
    branches: [staging]\
\
jobs:\
  migrate:\
    runs-on: ubuntu-latest\
    steps:\
      - uses: actions/checkout@v4\
\
      - name: Run DB migrations\
        run: npx supabase db push\
        env:\
          SUPABASE_ACCESS_TOKEN: $\{\{ secrets.SUPABASE_ACCESS_TOKEN \}\}\
          SUPABASE_PROJECT_ID: $\{\{ secrets.STAGING_SUPABASE_PROJECT_ID \}\}\
\
  deploy:\
    needs: migrate\
    runs-on: ubuntu-latest\
    steps:\
      - uses: actions/checkout@v4\
\
      - name: Deploy to Vercel (Staging)\
        run: npx vercel --prod --token=$\{\{ secrets.VERCEL_TOKEN \}\}\
        env:\
          VERCEL_ORG_ID: $\{\{ secrets.VERCEL_ORG_ID \}\}\
          VERCEL_PROJECT_ID: $\{\{ secrets.VERCEL_STAGING_PROJECT_ID \}\}\
\pard\pardeftab720\sa280\partightenfactor0

\f0\b\fs28 \cf0 \strokec2 4.4 Deploy to Production \'97 
\f3\fs30\fsmilli15210 \strokec2 deploy-prod.yml
\f0\fs28 \strokec2 \
\pard\pardeftab720\sa240\partightenfactor0

\f1\b0\fs24 \cf0 Identical to staging but points to production secrets.\
\pard\pardeftab720\partightenfactor0

\f2\fs26 \cf0 \strokec2 name: Deploy Production\
\
on:\
  push:\
    branches: [main]\
\
jobs:\
  migrate:\
    runs-on: ubuntu-latest\
    steps:\
      - uses: actions/checkout@v4\
\
      - name: Run DB migrations\
        run: npx supabase db push\
        env:\
          SUPABASE_ACCESS_TOKEN: $\{\{ secrets.SUPABASE_ACCESS_TOKEN \}\}\
          SUPABASE_PROJECT_ID: $\{\{ secrets.PROD_SUPABASE_PROJECT_ID \}\}\
\
  deploy:\
    needs: migrate\
    runs-on: ubuntu-latest\
    steps:\
      - uses: actions/checkout@v4\
\
      - name: Deploy to Vercel (Production)\
        run: npx vercel --prod --token=$\{\{ secrets.VERCEL_TOKEN \}\}\
        env:\
          VERCEL_ORG_ID: $\{\{ secrets.VERCEL_ORG_ID \}\}\
          VERCEL_PROJECT_ID: $\{\{ secrets.VERCEL_PROD_PROJECT_ID \}\}\
\pard\pardeftab720\partightenfactor0

\f1\fs24 \cf3 \strokec3 \
\pard\pardeftab720\sa298\partightenfactor0

\f0\b\fs36 \cf0 \strokec2 5. Database Migrations\
\pard\pardeftab720\sa280\partightenfactor0

\fs28 \cf0 5.1 Tool\
\pard\pardeftab720\sa240\partightenfactor0

\fs24 \cf0 Supabase CLI
\f1\b0  \'97 manages migrations as numbered SQL files under 
\f2\fs26 \strokec2 /supabase/migrations/
\f1\fs24 \strokec2 .\
\pard\pardeftab720\sa280\partightenfactor0

\f0\b\fs28 \cf0 5.2 File Naming Convention\
\pard\pardeftab720\partightenfactor0

\f2\b0\fs26 \cf0 \strokec2 supabase/migrations/\
  20250611000001_initial_schema.sql\
  20250611000002_add_neighbourhood.sql\
  20250615000001_add_flag_fields.sql\
\pard\pardeftab720\sa240\partightenfactor0

\f1\fs24 \cf0 \strokec2 Format: 
\f2\fs26 \strokec2 YYYYMMDDHHMMSS_description.sql
\f1\fs24 \strokec2 \
\pard\pardeftab720\sa280\partightenfactor0

\f0\b\fs28 \cf0 5.3 Rules\
\pard\tx220\tx720\pardeftab720\li720\fi-720\partightenfactor0
\ls4\ilvl0
\fs24 \cf0 \kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	\uc0\u8226 	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Never edit a migration that has already reached production
\f1\b0  \'97 create a new migration instead.\
\pard\tx220\tx720\pardeftab720\li720\fi-720\partightenfactor0
\ls4\ilvl0\cf0 \kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	\uc0\u8226 	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Every migration must be 
\f0\b idempotent
\f1\b0  \'97 use 
\f2\fs26 IF NOT EXISTS
\f1\fs24 , 
\f2\fs26 ON CONFLICT DO NOTHING
\f1\fs24 .\
\ls4\ilvl0\kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	\uc0\u8226 	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Migrations run automatically on every deploy \'97 see the 
\f2\fs26 migrate
\f1\fs24  job in each pipeline.\
\ls4\ilvl0\kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	\uc0\u8226 	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Every migration must be 
\f0\b backward-compatible
\f1\b0  with the previous version of the application code.\
\ls4\ilvl0\kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	\uc0\u8226 	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Always test migrations on staging before they reach production.\
\pard\pardeftab720\partightenfactor0
\cf3 \strokec3 \
\pard\pardeftab720\sa298\partightenfactor0

\f0\b\fs36 \cf0 \strokec2 6. Secrets Management\
\pard\pardeftab720\sa240\partightenfactor0

\f1\b0\fs24 \cf0 All secrets are managed in 
\f0\b GitHub Actions Secrets
\f1\b0  and 
\f0\b Vercel Environment Variables
\f1\b0 .\

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrt\brdrnil \trbrdrl\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth4212\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx2880
\clvertalc \clshdrawnil \clwWidth1588\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx5760
\clvertalc \clshdrawnil \clwWidth1355\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0

\f0\b \cf0 \strokec2 Secret\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Location\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Environment\cell \row

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrl\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth4212\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx2880
\clvertalc \clshdrawnil \clwWidth1588\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx5760
\clvertalc \clshdrawnil \clwWidth1355\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0

\f2\b0\fs26 \cf0 SUPABASE_ACCESS_TOKEN
\f1\fs24 \cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 GitHub\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Both\cell \row

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrl\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth4212\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx2880
\clvertalc \clshdrawnil \clwWidth1588\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx5760
\clvertalc \clshdrawnil \clwWidth1355\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0

\f2\fs26 \cf0 STAGING_SUPABASE_URL
\f1\fs24 \cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 GitHub + Vercel\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Staging\cell \row

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrl\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth4212\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx2880
\clvertalc \clshdrawnil \clwWidth1588\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx5760
\clvertalc \clshdrawnil \clwWidth1355\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0

\f2\fs26 \cf0 STAGING_SUPABASE_ANON_KEY
\f1\fs24 \cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 GitHub + Vercel\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Staging\cell \row

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrl\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth4212\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx2880
\clvertalc \clshdrawnil \clwWidth1588\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx5760
\clvertalc \clshdrawnil \clwWidth1355\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0

\f2\fs26 \cf0 STAGING_SUPABASE_PROJECT_ID
\f1\fs24 \cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 GitHub\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Staging\cell \row

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrl\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth4212\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx2880
\clvertalc \clshdrawnil \clwWidth1588\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx5760
\clvertalc \clshdrawnil \clwWidth1355\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0

\f2\fs26 \cf0 PROD_SUPABASE_URL
\f1\fs24 \cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 GitHub + Vercel\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Production\cell \row

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrl\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth4212\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx2880
\clvertalc \clshdrawnil \clwWidth1588\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx5760
\clvertalc \clshdrawnil \clwWidth1355\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0

\f2\fs26 \cf0 PROD_SUPABASE_ANON_KEY
\f1\fs24 \cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 GitHub + Vercel\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Production\cell \row

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrl\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth4212\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx2880
\clvertalc \clshdrawnil \clwWidth1588\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx5760
\clvertalc \clshdrawnil \clwWidth1355\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0

\f2\fs26 \cf0 PROD_SUPABASE_PROJECT_ID
\f1\fs24 \cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 GitHub\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Production\cell \row

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrl\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth4212\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx2880
\clvertalc \clshdrawnil \clwWidth1588\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx5760
\clvertalc \clshdrawnil \clwWidth1355\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0

\f2\fs26 \cf0 SUPABASE_SERVICE_ROLE_KEY
\f1\fs24 \cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Vercel only\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Both\cell \row

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrl\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth4212\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx2880
\clvertalc \clshdrawnil \clwWidth1588\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx5760
\clvertalc \clshdrawnil \clwWidth1355\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0

\f2\fs26 \cf0 API_FOOTBALL_KEY
\f1\fs24 \cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Vercel only\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Both\cell \row

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrl\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth4212\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx2880
\clvertalc \clshdrawnil \clwWidth1588\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx5760
\clvertalc \clshdrawnil \clwWidth1355\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0

\f2\fs26 \cf0 VERCEL_TOKEN
\f1\fs24 \cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 GitHub\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Both\cell \row

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrl\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth4212\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx2880
\clvertalc \clshdrawnil \clwWidth1588\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx5760
\clvertalc \clshdrawnil \clwWidth1355\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0

\f2\fs26 \cf0 VERCEL_ORG_ID
\f1\fs24 \cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 GitHub\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Both\cell \row

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrl\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth4212\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx2880
\clvertalc \clshdrawnil \clwWidth1588\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx5760
\clvertalc \clshdrawnil \clwWidth1355\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0

\f2\fs26 \cf0 VERCEL_STAGING_PROJECT_ID
\f1\fs24 \cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 GitHub\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Staging\cell \row

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrl\brdrnil \trbrdrt\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth4212\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx2880
\clvertalc \clshdrawnil \clwWidth1588\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx5760
\clvertalc \clshdrawnil \clwWidth1355\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0

\f2\fs26 \cf0 VERCEL_PROD_PROJECT_ID
\f1\fs24 \cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 GitHub\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Production\cell \lastrow\row
\pard\pardeftab720\sa240\partightenfactor0

\f0\b \cf0 \strokec2 Rule:
\f1\b0  No secret ever enters a 
\f2\fs26 \strokec2 .env
\f1\fs24 \strokec2  file committed to Git. The 
\f2\fs26 \strokec2 .env.local
\f1\fs24 \strokec2  file is local only and must be listed in 
\f2\fs26 \strokec2 .gitignore
\f1\fs24 \strokec2 .\
\pard\pardeftab720\partightenfactor0
\cf3 \strokec3 \
\pard\pardeftab720\sa298\partightenfactor0

\f0\b\fs36 \cf0 \strokec2 7. Monitoring & Alerting\
\pard\pardeftab720\sa240\partightenfactor0

\f1\b0\fs24 \cf0 Out of scope for MVP. Can be added in Phase 2 \'97 Sentry for error tracking, Better Uptime for uptime monitoring.\
\pard\pardeftab720\partightenfactor0
\cf3 \strokec3 \
\pard\pardeftab720\sa298\partightenfactor0

\f0\b\fs36 \cf0 \strokec2 8. Rollback Strategy\
\pard\pardeftab720\sa280\partightenfactor0

\fs28 \cf0 8.1 Vercel Rollback\
\pard\pardeftab720\sa240\partightenfactor0

\f1\b0\fs24 \cf0 Vercel retains all deployments. In case of an issue:\
\pard\tx220\tx720\pardeftab720\li720\fi-720\partightenfactor0
\ls5\ilvl0\cf0 \kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	1	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Go to the Vercel dashboard\
\ls5\ilvl0\kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	2	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Select the previous deployment\
\ls5\ilvl0\kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	3	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Click "Promote to Production"\
\ls5\ilvl0\kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	4	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Rollback time: 
\f0\b under 2 minutes
\f1\b0 \
\pard\pardeftab720\sa280\partightenfactor0

\f0\b\fs28 \cf0 \strokec2 8.2 Database Rollback\
\pard\pardeftab720\sa240\partightenfactor0

\f1\b0\fs24 \cf0 There is no automatic DB rollback. In a critical case:\
\pard\tx220\tx720\pardeftab720\li720\fi-720\partightenfactor0
\ls6\ilvl0\cf0 \kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	1	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Write a new migration that reverts the change\
\ls6\ilvl0\kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	2	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Run it manually via Supabase CLI\
\ls6\ilvl0\kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	3	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Re-deploy the previous version from Vercel\
\pard\pardeftab720\sa240\partightenfactor0
\cf0 This is why every migration must be backward-compatible with the previous version of the application code.\strokec2 \
\pard\pardeftab720\partightenfactor0
\cf3 \strokec3 \
\pard\pardeftab720\sa298\partightenfactor0

\f0\b\fs36 \cf0 \strokec2 9. Cron Jobs (Edge Functions)\
\pard\pardeftab720\sa240\partightenfactor0

\f1\b0\fs24 \cf0 Supabase Edge Functions run on a schedule:\

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrt\brdrnil \trbrdrl\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth2496\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx2880
\clvertalc \clshdrawnil \clwWidth3566\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx5760
\clvertalc \clshdrawnil \clwWidth3748\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0

\f0\b \cf0 \strokec2 Function\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Schedule\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Purpose\cell \row

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrl\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth2496\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx2880
\clvertalc \clshdrawnil \clwWidth3566\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx5760
\clvertalc \clshdrawnil \clwWidth3748\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0

\f2\b0\fs26 \cf0 poll-results
\f1\fs24 \cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Every 10 min during match windows\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Fetches results from API-Football\cell \row

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrl\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth2496\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx2880
\clvertalc \clshdrawnil \clwWidth3566\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx5760
\clvertalc \clshdrawnil \clwWidth3748\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0

\f2\fs26 \cf0 lock-predictions
\f1\fs24 \cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Every 1 min\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Locks predictions 5 min before kickoff\cell \row

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrl\brdrnil \trbrdrt\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth2496\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx2880
\clvertalc \clshdrawnil \clwWidth3566\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx5760
\clvertalc \clshdrawnil \clwWidth3748\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0

\f2\fs26 \cf0 sync-schedule
\f1\fs24 \cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Every 60 min\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Syncs upcoming match schedule\cell \lastrow\row
\pard\pardeftab720\sa280\partightenfactor0

\f0\b\fs28 \cf0 \strokec2 9.1 Cron Setup in Supabase\
\pard\pardeftab720\partightenfactor0

\f2\b0\fs26 \cf0 \strokec2 -- Supabase dashboard -> Edge Functions -> Schedule\
select cron.schedule(\
  'poll-results',\
  '*/10 * * * *',\
  $$ select net.http_post(\
    url := 'https://\{project\}.supabase.co/functions/v1/poll-results',\
    headers := '\{"Authorization": "Bearer \{service_role_key\}"\}'\
  ) $$\
);\
\pard\pardeftab720\sa280\partightenfactor0

\f0\b\fs28 \cf0 \strokec2 9.2 Cron Job Monitoring\
\pard\tx220\tx720\pardeftab720\li720\fi-720\partightenfactor0
\ls7\ilvl0
\f1\b0\fs24 \cf0 \kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	\uc0\u8226 	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Each Edge Function returns status 200 / 500\
\ls7\ilvl0\kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	\uc0\u8226 	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Run history is visible manually in the Supabase Dashboard\
\pard\pardeftab720\partightenfactor0
\cf3 \strokec3 \
\pard\pardeftab720\sa298\partightenfactor0

\f0\b\fs36 \cf0 \strokec2 10. Pre-Tournament Checklist\
\pard\pardeftab720\sa240\partightenfactor0

\f1\b0\fs24 \cf0 Before the first match of the tournament (June 11, 2026):\
\pard\tx220\tx720\pardeftab720\li720\fi-720\partightenfactor0
\ls8\ilvl0\cf0 \kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	\uc0\u8226 	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 [ ] API-Football key in production is valid and has sufficient quota\
\ls8\ilvl0\kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	\uc0\u8226 	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 [ ] All migrations have run successfully in production\
\ls8\ilvl0\kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	\uc0\u8226 	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 [ ] Cron jobs are active and have been tested on staging\
\ls8\ilvl0\kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	\uc0\u8226 	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 [ ] Supabase logs reviewed \'97 no open errors\
\ls8\ilvl0\kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	\uc0\u8226 	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 [ ] 
\f2\fs26 main
\f1\fs24  branch is in sync with 
\f2\fs26 staging
\f1\fs24 \
\ls8\ilvl0\kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	\uc0\u8226 	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 [ ] Environment variables are set in both environments\
\ls8\ilvl0\kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	\uc0\u8226 	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 [ ] Golden Boot lock time is set correctly (first kickoff in Israel time \'97 Asia/Jerusalem)\
\ls8\ilvl0\kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	\uc0\u8226 	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 [ ] Supabase daily backups are enabled\
\ls8\ilvl0\kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	\uc0\u8226 	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 [ ] Load test performed on staging with synthetic data\
}