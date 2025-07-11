import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "@/lib/react-query-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rick & Morty | Challenge",
  description: "Compara personajes y episodios de Rick & Morty. Explora, selecciona y descubre episodios compartidos entre tus personajes favoritos.",
  keywords: ["Rick and Morty", "Comparación", "Personajes", "Episodios", "App", "React", "Next.js", "Rick Sanchez", "Morty Smith"],
  authors: [{ name: "Rick & Morty App" }],
  creator: "Rick & Morty App",
  publisher: "Rick & Morty App",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://rickandmorty-comparison.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Rick & Morty | Challenge",
    description: "Compara personajes y episodios de Rick & Morty. Explora, selecciona y descubre episodios compartidos entre tus personajes favoritos.",
    url: "https://rickandmorty-comparison.vercel.app",
    siteName: "Rick & Morty Comparison App",
    images: [
      {
        url: "/portal.png",
        width: 800,
        height: 600,
        alt: "Rick and Morty Portal",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rick & Morty | Challenge",
    description: "Compara personajes y episodios de Rick & Morty. Explora, selecciona y descubre episodios compartidos.",
    images: ["/portal.png"],
    creator: "@rickandmortyapp",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#101820] min-h-screen`}
      >
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
