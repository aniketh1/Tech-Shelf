import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theam-provider";
import { Toaster } from '@/components/ui/toaster';
import { ClerkProvider } from "@clerk/nextjs"
import 'react-quill-new/dist/quill.snow.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: "Tech Shelf - Your Gateway to Technology Insights",
    template: "%s | Tech Shelf"
  },
  description: "Discover the latest technology trends, in-depth articles, and expert insights on Tech Shelf. Your trusted source for tech news, tutorials, and innovation.",
  keywords: ["technology", "tech news", "tech articles", "innovation", "digital transformation", "tech tutorials", "tech insights"],
  authors: [{ name: "Tech Shelf Team" }],
  creator: "Tech Shelf",
  publisher: "Tech Shelf",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://techshelf.com",
    siteName: "Tech Shelf",
    title: "Tech Shelf - Your Gateway to Technology Insights",
    description: "Discover the latest technology trends, in-depth articles, and expert insights on Tech Shelf. Your trusted source for tech news, tutorials, and innovation.",
    images: [
      {
        url: "/images/tech-shelf-og.jpg",
        width: 1200,
        height: 630,
        alt: "Tech Shelf - Technology Insights Platform"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Tech Shelf - Your Gateway to Technology Insights",
    description: "Discover the latest technology trends, in-depth articles, and expert insights on Tech Shelf.",
    images: ["/images/tech-shelf-og.jpg"],
    creator: "@techshelf"
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
    google: "your-google-site-verification-code",
  }
}
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </html>

    </ClerkProvider>
  );
}
