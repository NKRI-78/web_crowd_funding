import "./globals.css";
import "reactjs-tiptap-editor/style.css";

import ClientLayout from "@components/client/Client";
import { FileViewerProvider } from "./hooks/useFileViewerModal";

export const metadata = {
  title: "Beranda | FuLusme",
  description: "FuLusme",
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
        <FileViewerProvider>
          <ClientLayout>{children}</ClientLayout>
        </FileViewerProvider>
      </body>
    </html>
  );
}
