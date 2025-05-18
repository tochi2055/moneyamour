import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { FirebaseAuthProvider } from "@/contexts/firebase-auth-context";
import { SettingsProvider } from "@/contexts/settings-context";
import { SidebarProvider } from "@/components/sidebar/sidebar-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MoneyAmour - Financial Dashboard",
  description: "A comprehensive financial dashboard for managing your finances",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <FirebaseAuthProvider>
            <SidebarProvider>
              <SettingsProvider>{children}</SettingsProvider>
            </SidebarProvider>
          </FirebaseAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
