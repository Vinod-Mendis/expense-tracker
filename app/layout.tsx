import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/sidebar/AppSidebar";
import TopBar from "@/components/sidebar/TopBar";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Expense Tracker",
  description: "Personal finance tracker",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        <SidebarProvider>
          <TooltipProvider>
            <AppSidebar />
            <div className="flex flex-col flex-1 min-h-screen">
              <TopBar />
              <main className="flex-1 bg-gray-50 dark:bg-zinc-950">
                {children}
              </main>
            </div>
          </TooltipProvider>
        </SidebarProvider>
      </body>
    </html>
  );
}
