import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Providers from "./providers";
import PageTransition from "./components/ui/PageTransition";

export const metadata: Metadata = {
  title: "知识分享博客",
  description: "记录每周学习的书籍、电影、音乐，分享感悟的个人博客",
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#111827' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
      </head>
      <body 
        className="min-h-screen flex flex-col bg-white text-gray-900 transition-colors duration-300"
        suppressHydrationWarning
      >
        <Providers>
          <Navbar />
          <main className="flex-grow">
            <PageTransition>
              {children}
            </PageTransition>
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
