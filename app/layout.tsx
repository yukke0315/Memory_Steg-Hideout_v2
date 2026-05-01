import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Memory Steg-Hideout",
  description: "Secret memory gallery",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${inter.className} bg-zinc-900 text-zinc-100 antialiased min-h-screen flex flex-col`}>
        
        {/* 全画面共通のヘッダー */}
        <header className="w-full p-6 flex justify-between items-center border-b border-zinc-800">
          <h1 className="text-l font-bold tracking-widest">
            Memory <span className="text-zinc-500">Steg-Hideout#2</span>
          </h1>
          
          <nav className="flex gap-6 text-sm font-medium text-zinc-400">
            <button className="hover:text-zinc-100 transition-colors">Create Hideout</button>
            <button className="hover:text-zinc-100 transition-colors">Step Into Hideout</button>
          </nav>
        </header>

        {/* 各ページの中身がここに */}
        <main className="flex-1 overflow-hidden">
          {children}
        </main>

      </body>
    </html>
  );
}