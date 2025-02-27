import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./context/ThemeContext";
import { MemeProvider } from "./context/MemeContext";
import { UserProvider } from "./context/AuthContext";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "MemeVerse",
  description: "The best memes from the internet",
  image: "https://memeverse.vercel.app/og.png",
};

export default function RootLayout({ children }) {
  return (
    <ThemeProvider>
      <MemeProvider>
        <UserProvider>
          <html lang="en">
            <body
              className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
              <Toaster richColors position="top-right" />
              {children}
            </body>
          </html>
        </UserProvider>
      </MemeProvider>
    </ThemeProvider>
  );
}
