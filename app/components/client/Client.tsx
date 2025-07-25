"use client";

import { store } from "@redux/store";
import { Provider } from "react-redux";
import { usePathname } from "next/navigation";

import ModalLogout from "@components/modal/logout/Logout";
import Footer from "@components/footer/Footer";
import Navbar from "@components/navbar/Navbar";

import localFont from "next/font/local";

const geistSans = localFont({
  src: "../../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "../../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <Provider store={store}>
      <div
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {pathname === "/auth/login" || pathname === "/auth/register" ? (
          <div className="w-full flex items-center justify-center h-screen">
            {children}
          </div>
        ) : (
          <main className="min-h-screen text-white relative overflow-hidden flex flex-col">
            <Navbar />
            <div className="flex flex-1">
              <div className="flex-grow">{children}</div>
            </div>
            {pathname === "/form-pemodal" || pathname === "/form-penerbit" ? "" : <Footer />}
          </main>
        )}
        <ModalLogout />
      </div>
    </Provider>
  );
}
