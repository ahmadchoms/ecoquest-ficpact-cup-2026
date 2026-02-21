import "./globals.css";
import { Syne, DM_Sans } from "next/font/google";

const syne = Syne({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-display",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-body",
});

export const metadata = {
  title: "EcoQuest - Platform Edukasi Lingkungan Indonesia",
  description:
    "Platform gamifikasi edukasi lingkungan untuk Indonesia. Belajar, mainkan misi, dan buat dampak nyata untuk planet kita.",
  keywords: [
    "edukasi",
    "lingkungan",
    "gamifikasi",
    "sustainability",
    "indonesia",
  ],
  authors: [{ name: "EcoQuest Team" }],
  creator: "EcoQuest",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://ecoquest.id",
    title: "EcoQuest - Platform Edukasi Lingkungan Indonesia",
    description: "Platform gamifikasi edukasi lingkungan untuk Indonesia",
    images: [
      {
        url: "https://ecoquest.id/og-image.png",
        width: 1200,
        height: 630,
        alt: "EcoQuest",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EcoQuest",
    description: "Platform gamifikasi edukasi lingkungan untuk Indonesia",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={`${syne.variable} ${dmSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
