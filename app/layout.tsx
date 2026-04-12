import type { Metadata, Viewport } from "next";
import { Heebo } from "next/font/google";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
import "./globals.css";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["latin", "hebrew"],
});

export const metadata: Metadata = {
  title: "מונדיאל מאסטר",
  description: "נחש · תחרה · תנצח",
  appleWebApp: {
    capable: true,
    // black-translucent overlays the app content — requires safe-area-inset-top
    // padding on the body to prevent content from sliding under the status bar.
    statusBarStyle: "black-translucent",
    title: "מונדיאל",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#0D9488",
  width: "device-width",
  initialScale: 1,
  // viewport-fit=cover enables env(safe-area-inset-*) for the translucent status bar
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} h-full`}>
      {/* pt-[env(safe-area-inset-top)] prevents content from sliding under the
          iOS translucent status bar when the app is installed as a PWA */}
      <body className="min-h-full flex flex-col pt-[env(safe-area-inset-top)]">
        <ServiceWorkerRegistration />
        {children}
      </body>
    </html>
  );
}
