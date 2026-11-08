import { Rubik, Unbounded } from "next/font/google";
import "./globals.css";

const unbounded = Unbounded({
  subsets: ["latin"],
  weight: ["600", "700", "900"],
  variable: "--fuente-titulos",
  display: "swap",
});

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--fuente-texto",
  display: "swap",
});

export const metadata = {
  title: "Cromoverso",
};

export const viewport = {
  themeColor: "#1a1033",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${unbounded.variable} ${rubik.variable}`}>
      <body>{children}</body>
    </html>
  );
}
