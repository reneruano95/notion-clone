import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/lib/providers/next-theme-provider";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AppStoreProvider } from "@/lib/providers/store-provider";
import { SupabaseUserProvider } from "@/lib/providers/supabase-user-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NoteBook App",
  description:
    "All in one collaboration tool for your notes and tasks in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AppStoreProvider>
            <SupabaseUserProvider>
              {children}
              <Toaster theme="dark" richColors duration={3000} />
            </SupabaseUserProvider>
          </AppStoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
