import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Configure Inter for standard text
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-custom-sans",
  display: "swap",
});

// Configure JetBrains Mono for tech tags and terminal styling
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-custom-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Madari Anirudh | Software & AI Engineer",
  description: "Portfolio of Madari Anirudh, specializing in high-performance web systems, full-stack applications, and intelligent AI architectures.",
  keywords: ["Madari Anirudh", "Software Engineer", "Full-Stack Developer", "AI Engineer", "Next.js", "React", "Portfolio"],
  authors: [{ name: "Madari Anirudh" }],
  
  // Important: Uncomment this line and add your actual Vercel/Custom domain once deployed
   metadataBase: new URL("https://anirudh-portfolio-beta.vercel.app/"), 

  openGraph: {
    title: "Madari Anirudh | Software & AI Engineer",
    description: "Specializing in high-performance web systems, full-stack applications, and intelligent AI architectures.",
    url: "https://anirudh-portfolio-beta.vercel.app/", // Replace with your actual deployed URL
    siteName: "Madari Anirudh Portfolio",
    locale: "en_US",
    type: "website",
  },
  
  twitter: {
    card: "summary_large_image",
    title: "Madari Anirudh | Software & AI Engineer",
    description: "Specializing in high-performance web systems, full-stack applications, and intelligent AI architectures.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      {/* 
        The antialiased class makes text rendering noticeably sharper on dark backgrounds.
        We apply font-sans as the default for the entire body. 
      */}
      <body className="bg-slate-950 font-sans text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}