import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MommyAI - Visual Whiteboard Workspace",
  description: "AI-powered, free-form canvas for organizing ideas and content",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
