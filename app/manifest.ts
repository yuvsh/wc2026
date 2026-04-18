import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "מונדיאל מאסטר",
    short_name: "מונדיאל",
    description: "נחש · תחרה · תנצח",
    scope: "/",
    start_url: "/dashboard",
    display: "standalone",
    orientation: "portrait",
    background_color: "#F9FAFB",
    theme_color: "#0D9488",
    lang: "he",
    dir: "rtl",
    icons: [
      {
        src: "/icons/wc26_app_icon.jpeg",
        sizes: "512x512",
        type: "image/jpeg",
        purpose: "maskable",
      },
    ],
  };
}
