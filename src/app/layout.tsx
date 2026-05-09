import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Money Flow",
  description: "Personal finance tracker — debt first",
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
