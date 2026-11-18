import localFont from "next/font/local";

/* Material Symbols Outlined (FILL 0–1), self-hosted via next/font so the
   student app's icons never depend on Google's CDN. */
export const materialSymbols = localFont({
  src: "./fonts/material-symbols-outlined.woff2",
  variable: "--font-material-symbols",
  display: "block",
  weight: "400",
  style: "normal",
});
