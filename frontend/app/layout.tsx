import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 비서",
  description: "AI 기반 개인 비서 서비스",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-gray-50 text-gray-900 antialiased">{children}</body>
    </html>
  );
}
