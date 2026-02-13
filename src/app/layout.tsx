import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GLB Viewer",
  description:
    "A simple and fast GLB viewer that lets you test 3D models both on and off the body. The app includes default body models, making it easy to preview how your assets look in real scenarios. Perfect for quick checks, prototyping, and visual testing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
