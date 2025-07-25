"use client";

import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { AppDispatch, RootState } from "@redux/store";
import { useDispatch, useSelector } from "react-redux";
import { loadSession, logout } from "@redux/slices/authSlice";
import Link from "next/link";
import RoleModal from "@components/modal/role/Role";
import Modal from "@/app/helper/Modal";
import RegisterV2 from "../auth/register/RegisterV2";
import RegisterOtp from "../auth/register/RegisterOtp";
import RegisterSelectRole from "../auth/register/RegisterSelectRole";
import Cookies from "js-cookie";

const Navbar: React.FC = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const pathname = usePathname();

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

  const user =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;
  // const userData = user ? JSON.parse(user) : null;
  const [userData, setUserData] = useState<any>(null);
  const [hydrated, setHydrated] = useState(false);

  const [step, setStep] = useState<"register" | "otp" | "role" | null>(null);

  const closeModal = () => setStep(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    dispatch(loadSession());
  }, []);

  useEffect(() => {
    setHydrated(true);
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserData(parsedUser);
      } catch (err) {
        console.error("Gagal parsing user dari localStorage", err);
      }
    }
  }, []);

  return (
    <>
      {pathname != "/verification" &&
        auth.data?.role != "admin" &&
        auth.isAuthenticated &&
        !auth.data?.verify && (
          <div className="fixed top-0 left-0 w-full z-50 bg-yellow-400 text-black text-center text-sm py-2 px-4 font-medium">
            Akun Anda belum terverifikasi.{" "}
            <Link href="/verification" className="underline font-semibold">
              Verifikasi sekarang
            </Link>
          </div>
        )}

      <nav
        className={`fixed ${
          pathname != "/verification" &&
          auth.data?.role != "admin" &&
          auth.isAuthenticated &&
          !auth.data?.verify
            ? "top-8"
            : "top-0"
        } left-0 w-full z-50 transition-all duration-300 ${
          isSticky ? "bg-white text-[#322783] shadow-md" : "bg-[#4821C1]"
        }`}
      >
        <div className="flex justify-between items-center px-10 py-6 text-sm font-semibold">
          <div
            className={`text-xl font-bold ${
              isSticky ? "text-[#321B87]" : "text-white"
            }`}
          >
            CapBridge
          </div>

          <div className="md:hidden">
            <button onClick={toggleMenu}>
              {menuOpen ? (
                <X size={24} />
              ) : (
                <Menu
                  size={24}
                  className={isSticky ? "text-[#322783]" : "text-white"}
                />
              )}
            </button>
          </div>

          <div
            className={`fixed top-0 right-0 h-full w-64 bg-[#4821C1] z-40 p-6 
                    transform transition-transform duration-300 
                    ${menuOpen ? "translate-x-0" : "translate-x-full"} 
                    md:hidden`}
          >
            <ul className="flex flex-col gap-6 text-white text-base font-semibold pt-16">
              <li className={pathname == "/" ? "text-[#4CD137]" : "text-white"}>
                <Link href="/">Beranda</Link>
              </li>
              <li
                className={
                  pathname == "/business-list" ? "text-[#4CD137]" : "text-white"
                }
              >
                <Link href="/business-list">Daftar Bisnis</Link>
              </li>
              <li
                className={
                  pathname == "/about-us" ? "text-[#4CD137]" : "text-white"
                }
              >
                <Link href="/about-us">Tentang Kami</Link>
              </li>
              <li>
                <Link className="text-white" href="#">
                  Pasar Sekunder
                </Link>
              </li>
              {/* <li>
                <Link className="text-white" href="#">
                  Penerbit
                </Link>
              </li> */}
              <li
                className={
                  pathname == "/form-pemodal" ? "text-[#4CD137]" : "text-white"
                }
              >
                <Link href="/form-pemodal">Form Pemodal</Link>
              </li>
              {hydrated && userData !== null ? (
                <>
                  <li>Halo, {userData.email}</li>
                  <li>
                    <button
                      onClick={() => {
                        localStorage.removeItem("user"); // atau juga token kalau ada
                        window.location.href = "/auth/login"; // redirect
                      }}
                      className="px-5 py-2 rounded-full bg-red-500 text-white"
                    >
                      Keluar
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <a href="/auth/login">
                    <button className="mt-2 md:mt-0 px-5 py-2 rounded-full bg-[#4CD137] text-white">
                      Masuk
                    </button>
                  </a>
                </li>
              )}
              <div className="flex justify-between px-4">
                <button
                  onClick={() => setStep("register")}
                  className="text-white"
                >
                  Daftar
                </button>
              </div>
            </ul>
          </div>

          {menuOpen && (
            <div
              onClick={toggleMenu}
              className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
            />
          )}

          <ul className="hidden md:flex gap-6 items-center">
            <li className={pathname == "/" ? "text-[#4CD137]" : ""}>
              <Link href="/">Beranda</Link>
            </li>
            <li
              className={pathname == "/business-list" ? "text-[#4CD137]" : ""}
            >
              <Link href="/business-list">Daftar Bisnis</Link>
            </li>
            <li className={pathname == "/about-us" ? "text-[#4CD137]" : ""}>
              <Link href="/about-us">Tentang Kami</Link>
            </li>
            {hydrated && userData !== null ? (
              <>
                {/* <li
                  className={
                    pathname == "/form-penerbit"
                      ? "text-[#4CD137]"
                      : "text-white"
                  }
                >
                  <Link href="/form-penerbit">Penerbit</Link>
                </li>
                <li
                  className={
                    pathname == "/form-pemodal"
                      ? "text-[#4CD137]"
                      : "text-white"
                  }
                >
                  <Link href="/form-pemodal">Form Pemodal</Link>
                </li> */}
                {userData.role === "investor / pemodal" && (
                  <li
                    className={
                      pathname == "/dashboard" ? "text-[#4CD137]" : "text-white"
                    }
                  >
                    <Link href="/dashboard  ">Dashboard</Link>
                  </li>
                )}
                <li>Halo, {userData.email}</li>
                <li>
                  <button
                    // onClick={() => dispatch(logout())}
                    onClick={() => {
                      localStorage.removeItem("user");
                      localStorage.removeItem("formPemodal");
                      Cookies.remove("user");
                      window.location.href = "/auth/login";
                    }}
                    className="px-5 py-2 rounded-full bg-red-500 text-white"
                  >
                    Keluar
                  </button>
                </li>
              </>
            ) : (
              <li>
                <a href="/auth/login">
                  <button
                    className={`px-5 py-2 rounded-full ${
                      isSticky
                        ? "bg-[#4CD137] text-white"
                        : "bg-[#4CD137] text-white"
                    }`}
                  >
                    Masuk
                  </button>
                </a>
              </li>
            )}
            {hydrated && userData !== null ? (
              <></>
            ) : (
              <button
                className="text-white"
                onClick={() => setStep("register")}
              >
                Daftar
              </button>
            )}
          </ul>
        </div>
      </nav>
      <Modal isOpen={step === "register"} onClose={closeModal} title="Daftar">
        <RegisterV2 onNext={() => setStep("otp")} onClose={closeModal} />
      </Modal>

      <Modal
        isOpen={step === "otp"}
        onClose={closeModal}
        title="Verifikasi OTP"
      >
        <RegisterOtp onNext={() => setStep("role")} onClose={closeModal} />
      </Modal>
      <Modal
        isOpen={step === "role"}
        onClose={closeModal}
        title="Verifikasi OTP"
      >
        <RegisterSelectRole onClose={closeModal} />
      </Modal>
      {/* <RoleModal open={showModal} onClose={() => setShowModal(false)} /> */}
    </>
  );
};

export default Navbar;
