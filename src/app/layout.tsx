import type { Metadata } from "next";
import { Comfortaa, Fira_Sans, Source_Code_Pro } from "next/font/google";
import "./globals.css";

const comfortaa = Comfortaa({
  variable: "--font-comfortaa",
  subsets: ["latin"],
});

const firaSans = Fira_Sans({
  variable: "--font-fira-sans",
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-source-code-pro",
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Himanshu Yadav - Platform, SRE & AI Infrastructure Engineer",
  description: "Senior Lead Platform, SRE & AI Infrastructure Engineer with 8+ years of experience scaling high-traffic systems, agentic platforms, and event-driven backbones.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${comfortaa.variable} ${firaSans.variable} ${sourceCodePro.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#0c0c0c] text-[#e1e1e1] font-main select-none">{children}</body>
    </html>
  );
}
