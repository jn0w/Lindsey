import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Our Memories",
  description: "A place to store special moments",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="min-h-screen">
      <head>
        <link rel="preload" href="/hearts.gif" as="image" />
        <link rel="preload" href="/heart-icon.png" as="image" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
      >
        {/* Animated Gradient Background - sits behind hearts and content */}
        <div className="animated-gradient fixed inset-0 z-[-2]"></div>

        {/* Floating hearts background - sits behind content but above gradient */}
        <div className="hearts-container fixed inset-0 z-[-1] pointer-events-none">
          {[...Array(55)].map((_, i) => (
            <div
              key={i}
              className="heart"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}vh`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${8 + Math.random() * 10}s`,
              }}
            />
          ))}
        </div>
        {children}
      </body>
    </html>
  );
}
