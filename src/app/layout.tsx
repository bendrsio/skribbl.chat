import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Skribbl.chat",
  description: "Real-time chat room with drawing features",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/fonts/AOTFShinGoProRegular.otf"
          as="font"
          type="font/otf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/AOTFShinGoProBold.otf"
          as="font"
          type="font/otf"
          crossOrigin="anonymous"
        />
        <script src="https://cdn.socket.io/4.8.1/socket.io.min.js"></script>
      </head>
      <body className={`font-sans antialiased`}>{children}</body>
    </html>
  );
}
