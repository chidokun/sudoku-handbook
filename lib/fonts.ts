import { Be_Vietnam_Pro, Bricolage_Grotesque, Caveat } from "next/font/google";

export const body = Be_Vietnam_Pro({
  variable: "--font-body",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});

export const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin", "vietnamese"],
  axes: ["opsz", "wdth"],
});

export const hand = Caveat({
  variable: "--font-hand",
  subsets: ["latin"],
  weight: ["600"],
});
