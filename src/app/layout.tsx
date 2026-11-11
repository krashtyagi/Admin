import type { Metadata } from "next";
import "./globals.css";
import MainProvider from "@/providers/main-provider/main-provider";
import TopLoader from "./toploader";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Trivllo Admin Portal | Management Dashboard",
  description: "Official Administrative Dashboard for Trivllo Platform.",
  manifest: "/manifest.json",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className="h-full antialiased font-sans"
    >
      <body className="min-h-full flex flex-col font-sans">
        <MainProvider>
          <TopLoader />
          {children}
          <Toaster richColors closeButton position="top-right" />
        </MainProvider>
      </body>
    </html>
  );
}
