import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MCU Watchpath — Track Your Marvel Journey to Secret Wars",
  description:
    "Personal watch-tracker for every Marvel movie and show leading up to Avengers: Doomsday and Secret Wars. Track your progress, see what's essential, and get ready for the multiverse.",
  keywords: [
    "MCU",
    "Marvel",
    "Avengers",
    "Secret Wars",
    "Doomsday",
    "watch tracker",
    "watchlist",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
