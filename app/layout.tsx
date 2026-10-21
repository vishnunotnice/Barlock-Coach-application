import type { Metadata } from "next";
import "./globals.css";
import "./reference.css";

export const metadata: Metadata = {
  title: "Become a BarLock Coach",
  description: "Apply to coach with BarLock.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
