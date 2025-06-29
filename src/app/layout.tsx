import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ErrorBoundary } from "@/components/ui/error-boundary";

export const metadata: Metadata = {
  title: "Family Memories - Preserve Your Precious Moments",
  description: "A secure platform to store, organize, and share your family photos and memories with loved ones.",
  keywords: "family photos, memories, photo storage, family vault, photo sharing",
  authors: [{ name: "Family Memories Team" }],
  openGraph: {
    title: "Family Memories - Preserve Your Precious Moments",
    description: "A secure platform to store, organize, and share your family photos and memories with loved ones.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}