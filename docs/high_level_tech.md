{\rtf1\ansi\ansicpg1252\cocoartf2869
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\froman\fcharset0 Times-Bold;\f1\froman\fcharset0 Times-Roman;\f2\fnil\fcharset0 Menlo-Regular;
\f3\fmodern\fcharset0 Courier;\f4\froman\fcharset0 TimesNewRomanPSMT;\f5\fmodern\fcharset0 Courier-Bold;
\f6\froman\fcharset0 Times-Italic;}
{\colortbl;\red255\green255\blue255;\red0\green0\blue0;\red109\green109\blue109;}
{\*\expandedcolortbl;;\cssrgb\c0\c0\c0;\cssrgb\c50196\c50196\c50196;}
{\*\listtable{\list\listtemplateid1\listhybrid{\listlevel\levelnfc23\levelnfcn23\leveljc0\leveljcn0\levelfollow0\levelstartat0\levelspace360\levelindent0{\*\levelmarker \{disc\}}{\leveltext\leveltemplateid1\'01\uc0\u8226 ;}{\levelnumbers;}\fi-360\li720\lin720 }{\listname ;}\listid1}
{\list\listtemplateid2\listhybrid{\listlevel\levelnfc0\levelnfcn0\leveljc0\leveljcn0\levelfollow0\levelstartat1\levelspace360\levelindent0{\*\levelmarker \{decimal\}}{\leveltext\leveltemplateid101\'01\'00;}{\levelnumbers\'01;}\fi-360\li720\lin720 }{\listname ;}\listid2}
{\list\listtemplateid3\listhybrid{\listlevel\levelnfc0\levelnfcn0\leveljc0\leveljcn0\levelfollow0\levelstartat1\levelspace360\levelindent0{\*\levelmarker \{decimal\}}{\leveltext\leveltemplateid201\'01\'00;}{\levelnumbers\'01;}\fi-360\li720\lin720 }{\listname ;}\listid3}
{\list\listtemplateid4\listhybrid{\listlevel\levelnfc23\levelnfcn23\leveljc0\leveljcn0\levelfollow0\levelstartat0\levelspace360\levelindent0{\*\levelmarker \{disc\}}{\leveltext\leveltemplateid301\'01\uc0\u8226 ;}{\levelnumbers;}\fi-360\li720\lin720 }{\listname ;}\listid4}
{\list\listtemplateid5\listhybrid{\listlevel\levelnfc23\levelnfcn23\leveljc0\leveljcn0\levelfollow0\levelstartat0\levelspace360\levelindent0{\*\levelmarker \{disc\}}{\leveltext\leveltemplateid401\'01\uc0\u8226 ;}{\levelnumbers;}\fi-360\li720\lin720 }{\listname ;}\listid5}}
{\*\listoverridetable{\listoverride\listid1\listoverridecount0\ls1}{\listoverride\listid2\listoverridecount0\ls2}{\listoverride\listid3\listoverridecount0\ls3}{\listoverride\listid4\listoverridecount0\ls4}{\listoverride\listid5\listoverridecount0\ls5}}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\deftab720
\pard\pardeftab720\sa321\partightenfactor0

\f0\b\fs48 \cf0 \expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Mundial Master Predictor\
\pard\pardeftab720\sa298\partightenfactor0

\fs36 \cf0 High Level Technical Design\
\pard\pardeftab720\sa240\partightenfactor0

\fs24 \cf0 Version 1.0 | Status: Draft | 2025
\f1\b0 \
\pard\pardeftab720\partightenfactor0
\cf3 \strokec3 \
\pard\pardeftab720\sa298\partightenfactor0

\f0\b\fs36 \cf0 \strokec2 1. Stack Summary\

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrt\brdrnil \trbrdrl\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth1459\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx2880
\clvertalc \clshdrawnil \clwWidth2466\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx5760
\clvertalc \clshdrawnil \clwWidth4636\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0

\fs24 \cf0 Layer\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Technology\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Notes\cell \row

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrl\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth1459\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx2880
\clvertalc \clshdrawnil \clwWidth2466\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx5760
\clvertalc \clshdrawnil \clwWidth4636\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0

\f1\b0 \cf0 Frontend\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Next.js + Tailwind CSS\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 PWA-ready, React-based, Vercel-native\cell \row

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrl\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth1459\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx2880
\clvertalc \clshdrawnil \clwWidth2466\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx5760
\clvertalc \clshdrawnil \clwWidth4636\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Auth\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Supabase Auth\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Google / Apple OAuth built-in\cell \row

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrl\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth1459\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx2880
\clvertalc \clshdrawnil \clwWidth2466\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx5760
\clvertalc \clshdrawnil \clwWidth4636\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Database\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Supabase (Postgres)\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Real-time, Row Level Security, 500MB free tier\cell \row

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrl\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth1459\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx2880
\clvertalc \clshdrawnil \clwWidth2466\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx5760
\clvertalc \clshdrawnil \clwWidth4636\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Backend Logic\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Supabase Edge Functions\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Lock enforcement, scoring, cron jobs\cell \row

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrl\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth1459\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx2880
\clvertalc \clshdrawnil \clwWidth2466\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx5760
\clvertalc \clshdrawnil \clwWidth4636\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Football Data\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 API-Football\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 100 req/day free tier, covers full World Cup\cell \row

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrl\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth1459\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx2880
\clvertalc \clshdrawnil \clwWidth2466\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx5760
\clvertalc \clshdrawnil \clwWidth4636\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Hosting\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Vercel\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Free tier, CDN, instant deploys\cell \row

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrl\brdrnil \trbrdrt\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth1459\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx2880
\clvertalc \clshdrawnil \clwWidth2466\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx5760
\clvertalc \clshdrawnil \clwWidth4636\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Notifications\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Supabase Realtime\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 In-app only, no extra service needed\cell \lastrow\row
\pard\pardeftab720\sa240\partightenfactor0

\f0\b \cf0 Total monthly cost at MVP scale: $0
\f1\b0 \
\pard\pardeftab720\partightenfactor0
\cf3 \strokec3 \
\pard\pardeftab720\sa298\partightenfactor0

\f0\b\fs36 \cf0 \strokec2 2. Architecture Overview\
\pard\pardeftab720\partightenfactor0

\f2\b0\fs26 \cf0 \uc0\u9484 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9488 
\f3 \

\f2 \uc0\u9474 
\f3            Client Layer                          
\f2 \uc0\u9474 
\f3 \

\f2 \uc0\u9474 
\f3      Next.js PWA \'97 deployed on Vercel CDN        
\f2 \uc0\u9474 
\f3 \

\f2 \uc0\u9492 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9516 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9516 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9496 
\f3 \
             
\f2 \uc0\u9474 
\f3                         
\f2 \uc0\u9474 
\f3 \
             
\f2 \uc0\u9660 
\f3                         
\f2 \uc0\u9660 
\f3 \

\f2 \uc0\u9484 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9488 
\f3 \

\f2 \uc0\u9474 
\f3                   Supabase                       
\f2 \uc0\u9474 
\f3 \

\f2 \uc0\u9474 
\f3    Auth \'b7 Postgres DB \'b7 Realtime \'b7 Edge Fns      
\f2 \uc0\u9474 
\f3 \

\f2 \uc0\u9474 
\f3                                                  
\f2 \uc0\u9474 
\f3 \

\f2 \uc0\u9474 
\f3   
\f2 \uc0\u9484 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9488 
\f3   
\f2 \uc0\u9484 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9488 
\f3   
\f2 \uc0\u9484 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9488 
\f3  
\f2 \uc0\u9474 
\f3 \

\f2 \uc0\u9474 
\f3   
\f2 \uc0\u9474 
\f3    Auth   
\f2 \uc0\u9474 
\f3   
\f2 \uc0\u9474 
\f3  Postgres   
\f2 \uc0\u9474 
\f3   
\f2 \uc0\u9474 
\f3   Realtime   
\f2 \uc0\u9474 
\f3  
\f2 \uc0\u9474 
\f3 \

\f2 \uc0\u9474 
\f3   
\f2 \uc0\u9474 
\f3  Google / 
\f2 \uc0\u9474 
\f3   
\f2 \uc0\u9474 
\f3  All data   
\f2 \uc0\u9474 
\f3   
\f2 \uc0\u9474 
\f3  Leaderboard 
\f2 \uc0\u9474 
\f3  
\f2 \uc0\u9474 
\f3 \

\f2 \uc0\u9474 
\f3   
\f2 \uc0\u9474 
\f3   Apple   
\f2 \uc0\u9474 
\f3   
\f2 \uc0\u9474 
\f3   + RLS     
\f2 \uc0\u9474 
\f3   
\f2 \uc0\u9474 
\f3   updates    
\f2 \uc0\u9474 
\f3  
\f2 \uc0\u9474 
\f3 \

\f2 \uc0\u9474 
\f3   
\f2 \uc0\u9492 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9496 
\f3   
\f2 \uc0\u9492 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9496 
\f3   
\f2 \uc0\u9492 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9496 
\f3  
\f2 \uc0\u9474 
\f3 \

\f2 \uc0\u9474 
\f3                                                  
\f2 \uc0\u9474 
\f3 \

\f2 \uc0\u9474 
\f3   
\f2 \uc0\u9484 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9488 
\f3    
\f2 \uc0\u9474 
\f3 \

\f2 \uc0\u9474 
\f3   
\f2 \uc0\u9474 
\f3          Edge Functions (cron)            
\f2 \uc0\u9474 
\f3    
\f2 \uc0\u9474 
\f3 \

\f2 \uc0\u9474 
\f3   
\f2 \uc0\u9474 
\f3   Poll API \'b7 write results \'b7 run scoring  
\f2 \uc0\u9474 
\f3    
\f2 \uc0\u9474 
\f3 \

\f2 \uc0\u9474 
\f3   
\f2 \uc0\u9492 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9516 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9496 
\f3    
\f2 \uc0\u9474 
\f3 \

\f2 \uc0\u9492 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9474 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9496 
\f3 \
                      
\f2 \uc0\u9474 
\f3 \
                      
\f2 \uc0\u9660 
\f3 \
             
\f2 \uc0\u9484 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9488 
\f3 \
             
\f2 \uc0\u9474 
\f3  Football Data   
\f2 \uc0\u9474 
\f3 \
             
\f2 \uc0\u9474 
\f3     API-Football 
\f2 \uc0\u9474 
\f3 \
             
\f2 \uc0\u9492 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9472 \u9496 
\f3 \
\pard\pardeftab720\partightenfactor0

\f1\fs24 \cf3 \strokec3 \
\pard\pardeftab720\sa298\partightenfactor0

\f0\b\fs36 \cf0 \strokec2 3. Data Model\
\pard\pardeftab720\sa280\partightenfactor0

\fs28 \cf0 3.1 Entity Relationship Summary\

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrt\brdrnil \trbrdrl\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth3588\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx4320
\clvertalc \clshdrawnil \clwWidth5245\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0

\fs24 \cf0 Entity\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Description\cell \row

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrl\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth3588\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx4320
\clvertalc \clshdrawnil \clwWidth5245\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0

\f3\b0\fs26 \cf0 users
\f1\fs24 \cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Authenticated users via Google / Apple\cell \row

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrl\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth3588\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx4320
\clvertalc \clshdrawnil \clwWidth5245\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0

\f3\fs26 \cf0 leagues
\f1\fs24 \cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Private groups identified by a 6-char invite code\cell \row

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrl\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth3588\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx4320
\clvertalc \clshdrawnil \clwWidth5245\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0

\f3\fs26 \cf0 league_members
\f1\fs24 \cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Join table \'97 user 
\f4 \uc0\u8596 
\f1  league, holds 
\f3\fs26 total_points
\f1\fs24 \cell \row

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrl\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth3588\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx4320
\clvertalc \clshdrawnil \clwWidth5245\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0

\f3\fs26 \cf0 matches
\f1\fs24 \cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 World Cup fixtures from football API\cell \row

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrl\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth3588\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx4320
\clvertalc \clshdrawnil \clwWidth5245\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0

\f3\fs26 \cf0 predictions
\f1\fs24 \cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 User score predictions per match\cell \row

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrl\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth3588\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx4320
\clvertalc \clshdrawnil \clwWidth5245\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0

\f3\fs26 \cf0 players
\f1\fs24 \cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Pre-seeded list of Top 40 Golden Boot candidates\cell \row

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrl\brdrnil \trbrdrt\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth3588\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx4320
\clvertalc \clshdrawnil \clwWidth5245\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0

\f3\fs26 \cf0 golden_boot_predictions
\f1\fs24 \cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 One per user, locked before tournament start\cell \lastrow\row
\pard\pardeftab720\sa280\partightenfactor0

\f0\b\fs28 \cf0 3.2 Key Tables\
\pard\pardeftab720\partightenfactor0

\f3\b0\fs26 \cf0 users\
  id              uuid PK\
  display_name    text\
  avatar_url      text\
  provider        text         -- 'google' | 'apple'\
  created_at      timestamptz\
\
leagues\
  id              uuid PK\
  name            text\
  invite_code     text UNIQUE  -- 6-char, auto-generated\
  created_by      uuid FK 
\f2 \uc0\u8594 
\f3  users\
  created_at      timestamptz\
\
league_members\
  id              uuid PK\
  league_id       uuid FK 
\f2 \uc0\u8594 
\f3  leagues\
  user_id         uuid FK 
\f2 \uc0\u8594 
\f3  users\
  total_points    int DEFAULT 0\
  joined_at       timestamptz\
\
matches\
  id              uuid PK\
  team_a          text\
  team_b          text\
  team_a_code     text         -- ISO 3166-1 alpha-2, e.g. 'fr' (for flag-icons)\
  team_b_code     text         -- ISO 3166-1 alpha-2, e.g. 'br'\
  team_a_flag_url text         -- API-Football SVG flag URL (for large display)\
  team_b_flag_url text         -- API-Football SVG flag URL (for large display)\
  kickoff_at      timestamptz\
  stage           text         -- 'group' | 'r16' | 'qf' | 'sf' | 'final'\
  status          text         -- 'scheduled' | 'live' | 'finished' | 'postponed' | 'cancelled'\
  score_a         int          -- null until finished\
  score_b         int          -- null until finished\
\
predictions\
  id              uuid PK\
  user_id         uuid FK 
\f2 \uc0\u8594 
\f3  users\
  match_id        uuid FK 
\f2 \uc0\u8594 
\f3  matches\
  predicted_a     int\
  predicted_b     int\
  points_awarded  int          -- null until match finished\
  is_locked       boolean DEFAULT false\
  created_at      timestamptz\
\
players\
  id              uuid PK\
  name            text\
  country         text\
  country_code    text         -- ISO 3166-1 alpha-2, e.g. 'fr' (for flag-icons)\
  flag_url        text         -- API-Football SVG flag URL (for large display)\
  club            text\
\
golden_boot_predictions\
  id              uuid PK\
  user_id         uuid FK 
\f2 \uc0\u8594 
\f3  users UNIQUE  -- one prediction per user\
  player_id       uuid FK 
\f2 \uc0\u8594 
\f3  players\
  points_awarded  int DEFAULT 0\
  created_at      timestamptz\
\pard\pardeftab720\sa280\partightenfactor0

\f0\b\fs28 \cf0 3.3 Design Decisions\
\pard\tx220\tx720\pardeftab720\li720\fi-720\partightenfactor0
\ls1\ilvl0
\f3\b0\fs26 \cf0 \kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	\uc0\u8226 	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 league_members.total_points
\f1\fs24  is 
\f0\b denormalized
\f1\b0  \'97 updated on every scoring run for fast leaderboard queries without aggregation at read time.\
\ls1\ilvl0
\f3\fs26 \kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	\uc0\u8226 	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 predictions.is_locked
\f1\fs24  is 
\f0\b set server-side
\f1\b0  by an Edge Function at T-5min before kickoff, regardless of client state.\
\ls1\ilvl0
\f3\fs26 \kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	\uc0\u8226 	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 matches.status
\f1\fs24  is the 
\f0\b single source of truth
\f1\b0  for the entire match lifecycle and drives all automation.\
\ls1\ilvl0
\f3\fs26 \kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	\uc0\u8226 	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 golden_boot_predictions
\f1\fs24  has a 
\f0\b unique constraint on 
\f5\fs26 user_id
\f1\b0\fs24  \'97 enforces one prediction per user at DB level.\
\ls1\ilvl0
\f3\fs26 \kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	\uc0\u8226 	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 team_a_code
\f1\fs24  / 
\f3\fs26 team_b_code
\f1\fs24  store the ISO 3166-1 alpha-2 country code (e.g. 
\f3\fs26 fr
\f1\fs24 , 
\f3\fs26 br
\f1\fs24 ) \'97 used directly as the 
\f3\fs26 flag-icons
\f1\fs24  CSS class. Populated from API-Football response at ingestion time.\
\ls1\ilvl0
\f3\fs26 \kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	\uc0\u8226 	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 team_a_flag_url
\f1\fs24  / 
\f3\fs26 team_b_flag_url
\f1\fs24  store the API-Football SVG URL \'97 used for large flag display (48px+). Populated at ingestion time, no extra API call needed.\
\pard\pardeftab720\partightenfactor0
\cf3 \strokec3 \
\pard\pardeftab720\sa298\partightenfactor0

\f0\b\fs36 \cf0 \strokec2 4. Core Logic\
\pard\pardeftab720\sa280\partightenfactor0

\fs28 \cf0 4.1 Prediction Lock (Edge Function \'97 cron)\
\pard\pardeftab720\sa240\partightenfactor0

\f1\b0\fs24 \cf0 Runs every minute. Finds all matches where 
\f3\fs26 kickoff_at <= now() + 5min
\f1\fs24  and 
\f3\fs26 status = 'scheduled'
\f1\fs24 . Sets 
\f3\fs26 predictions.is_locked = true
\f1\fs24  for all predictions on those matches.\
Any prediction attempt on a locked match returns:\
\pard\pardeftab720\sa240\partightenfactor0

\f6\i \cf0 "This match is locked. Predictions are no longer accepted."
\f1\i0 \
\pard\pardeftab720\sa280\partightenfactor0

\f0\b\fs28 \cf0 4.2 Result Ingestion (Edge Function \'97 cron)\
\pard\pardeftab720\sa240\partightenfactor0

\f1\b0\fs24 \cf0 Runs on a polling schedule (configurable frequency \'97 see Section 6 for API quota strategy).\
Flow:\
\pard\tx220\tx720\pardeftab720\li720\fi-720\partightenfactor0
\ls2\ilvl0\cf0 \kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	1	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Fetch finished matches from API-Football\
\ls2\ilvl0\kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	2	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Write 
\f3\fs26 score_a
\f1\fs24 , 
\f3\fs26 score_b
\f1\fs24 , set 
\f3\fs26 status = 'finished'
\f1\fs24  on the 
\f3\fs26 matches
\f1\fs24  row\
\ls2\ilvl0\kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	3	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Trigger scoring calculation (see 4.3)\
\ls2\ilvl0\kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	4	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 For postponed matches: update 
\f3\fs26 kickoff_at
\f1\fs24  to new date, reset lock timers\
\ls2\ilvl0\kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	5	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 For cancelled matches: set 
\f3\fs26 status = 'cancelled'
\f1\fs24 , void all predictions (no points awarded)\
\pard\pardeftab720\sa280\partightenfactor0

\f0\b\fs28 \cf0 4.3 Scoring Logic (Edge Function)\
\pard\pardeftab720\sa240\partightenfactor0

\f1\b0\fs24 \cf0 Triggered after result ingestion for each finished match.\
\pard\pardeftab720\partightenfactor0

\f3\fs26 \cf0 for each prediction on this match:\
  if predicted_a == score_a AND predicted_b == score_b:\
    points = 3  (Exact Score / Bingo)\
  else if winner(predicted) == winner(actual):\
    points = 1  (Correct Result)\
  else:\
    points = 0  (Miss)\
\
  update predictions set points_awarded = points\
  update league_members set total_points = total_points + points\
    where user_id = prediction.user_id\
\pard\pardeftab720\sa240\partightenfactor0

\f0\b\fs24 \cf0 Knockout stage rule:
\f1\b0  
\f3\fs26 winner()
\f1\fs24  uses the 90-minute result only. If 
\f3\fs26 score_a == score_b
\f1\fs24 , result is a draw \'97 regardless of extra time or penalties outcome.\
\pard\pardeftab720\sa280\partightenfactor0

\f0\b\fs28 \cf0 4.4 Golden Boot Resolution (Edge Function \'97 triggered at tournament end)\
\pard\tx220\tx720\pardeftab720\li720\fi-720\partightenfactor0
\ls3\ilvl0
\f1\b0\fs24 \cf0 \kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	1	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Fetch official top scorer(s) from API-Football\
\ls3\ilvl0\kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	2	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Find all 
\f3\fs26 golden_boot_predictions
\f1\fs24  where 
\f3\fs26 player_id
\f1\fs24  matches any official winner\
\ls3\ilvl0\kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	3	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Award 10 points, update 
\f3\fs26 league_members.total_points
\f1\fs24  for each matching user\
\ls3\ilvl0\kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	4	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Handles ties: if multiple players share the Golden Boot, all users who predicted any of them receive the bonus\
\pard\pardeftab720\partightenfactor0
\cf3 \strokec3 \
\pard\pardeftab720\sa298\partightenfactor0

\f0\b\fs36 \cf0 \strokec2 5. Security \'97 Row Level Security (RLS)\
\pard\pardeftab720\sa240\partightenfactor0

\f1\b0\fs24 \cf0 All tables have RLS enabled. Key policies:\

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrt\brdrnil \trbrdrl\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth3588\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx4320
\clvertalc \clshdrawnil \clwWidth8128\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0

\f0\b \cf0 Table\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Policy\cell \row

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrl\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth3588\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx4320
\clvertalc \clshdrawnil \clwWidth8128\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0

\f3\b0\fs26 \cf0 leagues
\f1\fs24 \cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Read: members only. Write: authenticated users.\cell \row

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrl\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth3588\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx4320
\clvertalc \clshdrawnil \clwWidth8128\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0

\f3\fs26 \cf0 league_members
\f1\fs24 \cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Read: members of the same league only.\cell \row

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrl\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth3588\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx4320
\clvertalc \clshdrawnil \clwWidth8128\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0

\f3\fs26 \cf0 predictions
\f1\fs24 \cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Read: own predictions always. Others' predictions visible only after match is locked.\cell \row

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrl\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth3588\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx4320
\clvertalc \clshdrawnil \clwWidth8128\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0

\f3\fs26 \cf0 golden_boot_predictions
\f1\fs24 \cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Read: own only (until tournament ends, then all).\cell \row

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrl\brdrnil \trbrdrt\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth3588\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx4320
\clvertalc \clshdrawnil \clwWidth8128\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0

\f3\fs26 \cf0 matches
\f1\fs24  / 
\f3\fs26 players
\f1\fs24 \cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Public read. Write: service role only (Edge Functions).\cell \lastrow\row
\pard\pardeftab720\partightenfactor0
\cf3 \strokec3 \
\pard\pardeftab720\sa298\partightenfactor0

\f0\b\fs36 \cf0 \strokec2 6. API Quota Strategy (API-Football Free Tier)\
\pard\pardeftab720\sa240\partightenfactor0

\f1\b0\fs24 \cf0 Free tier limit: 
\f0\b 100 requests/day
\f1\b0 .\
World Cup 2026 has 104 matches over 39 days. Maximum matches on any single day is 
\f0\b 4
\f1\b0  (common in group stage and Round of 32).\
\pard\pardeftab720\sa240\partightenfactor0

\f0\b \cf0 Worst case with 5-minute polling:
\f1\b0  4 matches x 2h active window x 12 polls/hour = 96 requests + ~4 schedule syncs = 
\f0\b ~100 requests -- exactly at the limit, no buffer.
\f1\b0 \

\f0\b Chosen strategy: poll every 10 minutes during active windows.
\f1\b0 \

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrt\brdrnil \trbrdrl\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth3615\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx2880
\clvertalc \clshdrawnil \clwWidth1306\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx5760
\clvertalc \clshdrawnil \clwWidth3467\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0

\f0\b \cf0 Window\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Interval\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Peak day usage\cell \row

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrl\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth3615\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx2880
\clvertalc \clshdrawnil \clwWidth1306\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx5760
\clvertalc \clshdrawnil \clwWidth3467\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0

\f1\b0 \cf0 Active match window (kickoff to FT)\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Every 10 min\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 4 matches x 12 polls = 
\f0\b 48 requests
\f1\b0 \cell \row

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrl\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth3615\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx2880
\clvertalc \clshdrawnil \clwWidth1306\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx5760
\clvertalc \clshdrawnil \clwWidth3467\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Outside active windows\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Every 60 min\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 ~4 requests\cell \row

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrl\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth3615\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx2880
\clvertalc \clshdrawnil \clwWidth1306\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx5760
\clvertalc \clshdrawnil \clwWidth3467\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 No-match days\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Once/day\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 1 request\cell \row

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrl\brdrnil \trbrdrt\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth3615\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx2880
\clvertalc \clshdrawnil \clwWidth1306\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx5760
\clvertalc \clshdrawnil \clwWidth3467\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0

\f0\b \cf0 Peak day total
\f1\b0 \cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 \cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0

\f0\b \cf0 ~52 requests -- 48% of quota used
\f1\b0 \cell \lastrow\row
\pard\pardeftab720\sa240\partightenfactor0
\cf0 This gives comfortable headroom for retries, edge cases, and postponement checks while keeping results delay to a maximum of 10 minutes after final whistle -- fully acceptable for a prediction game.\
Additional rules:\
\pard\tx220\tx720\pardeftab720\li720\fi-720\partightenfactor0
\ls4\ilvl0\cf0 \kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	\uc0\u8226 	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Cache last API response in Postgres -- skip scoring if 
\f3\fs26 status
\f1\fs24  unchanged since last poll\
\ls4\ilvl0\kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	\uc0\u8226 	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Active window defined as: kickoff time to kickoff + 2h (group stage) or kickoff + 2.5h (knockout)\
\ls4\ilvl0\kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	\uc0\u8226 	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 On postponement detection: immediately re-sync schedule (1 extra request), then resume normal cadence\
\pard\pardeftab720\partightenfactor0
\cf3 \strokec3 \
\pard\pardeftab720\sa298\partightenfactor0

\f0\b\fs36 \cf0 \strokec2 7. Key Constraints & Risks\

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrt\brdrnil \trbrdrl\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth2292\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx2880
\clvertalc \clshdrawnil \clwWidth5093\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx5760
\clvertalc \clshdrawnil \clwWidth6898\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0

\fs24 \cf0 Item\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Risk\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Mitigation\cell \row

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrl\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth2292\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx2880
\clvertalc \clshdrawnil \clwWidth5093\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx5760
\clvertalc \clshdrawnil \clwWidth6898\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0

\f1\b0 \cf0 API-Football free quota\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 100 req/day limit\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 10-min polling keeps peak usage at ~52 req/day (see Section 6)\cell \row

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrl\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth2292\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx2880
\clvertalc \clshdrawnil \clwWidth5093\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx5760
\clvertalc \clshdrawnil \clwWidth6898\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Supabase free tier\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 500MB DB, 500K Edge Function invocations/month\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Sufficient for MVP scale; monitor usage\cell \row

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrl\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth2292\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx2880
\clvertalc \clshdrawnil \clwWidth5093\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx5760
\clvertalc \clshdrawnil \clwWidth6898\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Clock drift on lock\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Client clocks may differ from server\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Lock enforced server-side only -- client UI is indicative\cell \row

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrl\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth2292\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx2880
\clvertalc \clshdrawnil \clwWidth5093\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx5760
\clvertalc \clshdrawnil \clwWidth6898\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Timezone display\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Fixed to Israel time (Asia/Jerusalem)\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Store all times in UTC; display in Asia/Jerusalem timezone for all users\cell \row

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrl\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth2292\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx2880
\clvertalc \clshdrawnil \clwWidth5093\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx5760
\clvertalc \clshdrawnil \clwWidth6898\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Realtime fan-out\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Leaderboard updates on peak moments\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Supabase Realtime handles this; no action needed at MVP scale\cell \row

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrl\brdrnil \trbrdrt\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth2292\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx2880
\clvertalc \clshdrawnil \clwWidth5093\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx5760
\clvertalc \clshdrawnil \clwWidth6898\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Results delay\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Up to 10 min after FT\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Acceptable for a prediction game -- not a live scores app\cell \lastrow\row
\pard\pardeftab720\partightenfactor0
\cf3 \strokec3 \
\pard\pardeftab720\sa298\partightenfactor0

\f0\b\fs36 \cf0 \strokec2 8. Open Technical Questions\

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrt\brdrnil \trbrdrl\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth280\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx4320
\clvertalc \clshdrawnil \clwWidth6965\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0

\fs24 \cf0 #\cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Question\cell \row

\itap1\trowd \taflags0 \trgaph108\trleft-108 \trbrdrl\brdrnil \trbrdrt\brdrnil \trbrdrr\brdrnil 
\clvertalc \clshdrawnil \clwWidth280\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx4320
\clvertalc \clshdrawnil \clwWidth6965\clftsWidth3 \clmart10 \clmarl10 \clmarb10 \clmarr10 \clbrdrt\brdrnil \clbrdrl\brdrnil \clbrdrb\brdrnil \clbrdrr\brdrnil \clpadt20 \clpadl20 \clpadb20 \clpadr20 \gaph\cellx8640
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 T1
\f1\b0 \cell 
\pard\intbl\itap1\pardeftab720\partightenfactor0
\cf0 Confirm API-Football plan and API key setup before development starts\cell \lastrow\row
\pard\pardeftab720\partightenfactor0
\cf3 \strokec3 \
\pard\pardeftab720\sa298\partightenfactor0

\f0\b\fs36 \cf0 \strokec2 9. Phase 2 -- Neighbourhood Feature (Data Model)\
\pard\pardeftab720\sa280\partightenfactor0

\fs28 \cf0 New Table\
\pard\pardeftab720\partightenfactor0

\f3\b0\fs26 \cf0 neighbourhoods\
  id            uuid PK\
  name          text        -- e.g. 'Shikun Dalet', 'Merkaz'\
  display_order int         -- for consistent UI ordering\
\pard\pardeftab720\sa280\partightenfactor0

\f0\b\fs28 \cf0 Schema Changes\
\pard\pardeftab720\partightenfactor0

\f3\b0\fs26 \cf0 -- Add to users table\
neighbourhood_id  uuid FK -> neighbourhoods   -- null until user selects\
is_locked         boolean DEFAULT false        -- locked once tournament starts\
\
-- New view / materialised score per league\
neighbourhood_scores (view)\
  league_id         uuid\
  neighbourhood_id  uuid\
  neighbourhood_name text\
  total_points      int    -- sum of league_members.total_points for members of this neighbourhood\
  member_count      int\
\pard\pardeftab720\sa280\partightenfactor0

\f0\b\fs28 \cf0 Design Notes\
\pard\tx220\tx720\pardeftab720\li720\fi-720\partightenfactor0
\ls5\ilvl0
\f3\b0\fs26 \cf0 \kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	\uc0\u8226 	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 neighbourhood_id
\f1\fs24  on 
\f3\fs26 users
\f1\fs24  is nullable -- user may not have selected one yet.\
\pard\tx220\tx720\pardeftab720\li720\fi-720\partightenfactor0
\ls5\ilvl0\cf0 \kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	\uc0\u8226 	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Neighbourhood score is derived from existing 
\f3\fs26 league_members.total_points
\f1\fs24  -- no new scoring logic needed.\
\ls5\ilvl0\kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	\uc0\u8226 	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Neighbourhood list is predefined and seeded at deploy time; no admin UI required.\
\ls5\ilvl0\kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	\uc0\u8226 	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Lock neighbourhood selection when 
\f3\fs26 matches
\f1\fs24  table has any row with 
\f3\fs26 status != 'scheduled'
\f1\fs24  (tournament has started).\
}