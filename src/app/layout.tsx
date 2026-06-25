import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { brand, defaultDescription } from "@/shared/brand";
import { absoluteUrl } from "@/shared/utils";
import { Analytics } from "@/client/components/analytics";
import { Providers } from "@/client/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  metadataBase: new URL(brand.url),
  title: {
    default: "Mediazy - Premium Online Tools",
    template: "%s | Mediazy"
  },
  description: defaultDescription,
  authors: [{ name: "Aurex Technologies" }],
  creator: "Aurex Technologies",
  publisher: "Aurex Technologies",
  openGraph: {
    title: "Mediazy",
    description: defaultDescription,
    url: absoluteUrl(),
    siteName: "Mediazy",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Mediazy",
    description: defaultDescription
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>
          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
