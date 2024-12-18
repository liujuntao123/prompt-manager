'use client'

import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/app/components/layout/Navbar';
import { Toaster } from "@/components/ui/toaster"
import { usePathname } from 'next/navigation';
import { SessionProvider } from 'next-auth/react'

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <SessionProvider>
      <html lang="en">
        <body className={inter.className}>
          {!isHomePage && <Navbar />}
          {children}
          <Toaster />
        </body>
      </html>
    </SessionProvider>
  );
}
