import "./globals.css";
import "reactjs-tiptap-editor/style.css";

import ClientLayout from "@components/client/Client";

export const metadata = {
  title: "Beranda | CapBridge",
  description: "CapBridge",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
