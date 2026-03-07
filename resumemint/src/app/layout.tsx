import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: "ResumeMint — Digital Resume Builder for Engineers",
  description: "Create stunning digital resumes with semester-wise academic tracking, skill visualization, project showcases, and one-click PDF export. Built for engineering students.",
  keywords: "resume builder, engineering student, digital resume, PDF resume, semester CGPA, portfolio",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased`}>
        <SessionProvider>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#0F1629",
                color: "#F1F5F9",
                border: "1px solid #1E293B",
                borderRadius: "12px",
                fontSize: "0.9rem",
              },
              success: { iconTheme: { primary: "#22C55E", secondary: "#0F1629" } },
              error: { iconTheme: { primary: "#EF4444", secondary: "#0F1629" } },
            }}
          />
        </SessionProvider>
      </body>
    </html>
  );
}
