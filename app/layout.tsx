import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tech Bridge Hub - منصة الوظائف التقنية",
  description: "أحدث الوظائف التقنية العالمية وعن بعد",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-slate-50 min-h-screen text-slate-900">{children}</body>
    </html>
  );
}
