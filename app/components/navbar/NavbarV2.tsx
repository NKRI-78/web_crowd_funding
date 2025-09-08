"use client";

import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BellRing, Menu, X } from "lucide-react";
import { AppDispatch, RootState } from "@redux/store";
import { useDispatch, useSelector } from "react-redux";
import { loadSession } from "@redux/slices/authSlice";
import Link from "next/link";
import Modal from "@/app/helper/Modal";
import RegisterV2 from "../auth/register/RegisterV2";
import RegisterOtp from "../auth/register/RegisterOtp";
import RegisterSelectRole from "../auth/register/RegisterSelectRole";
import Cookies from "js-cookie";
import axios from "axios";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { User } from "@/app/interfaces/user/IUser";
import {
  FORM_INDEX_CACHE_KEY,
  FORM_PENERBIT_1_CACHE_KEY,
  FORM_PENERBIT_2_CACHE_KEY,
  FORM_PIC_CACHE_KEY,
} from "@/app/(defaults)/form-penerbit/form-cache-key";
import { getUser } from "@/app/lib/auth";

const NavbarV2: React.FC = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const badgeCount = useSelector((state: RootState) => state.badge.badgeCount);

  //* floating inbox hooks
  const [isInboxTooltipOpen, setIsInboxTooltipOpen] = useState(false);

  const pathname = usePathname();

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

  const user =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;
  // const userData = user ? JSON.parse(user) : null;
  const [userData, setUserData] = useState<any>(null);
  const [hydrated, setHydrated] = useState(false);

  const [step, setStep] = useState<
    "register" | "otp" | "role" | "login" | null
  >(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const userCookie = Cookies.get("user");

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
    const userCookie = getUser();

    try {
      if (userCookie?.token) {
        setToken(userCookie.token);
      }
      setUserData(userCookie);
    } catch (err) {
      console.error("Failed to parse user cookie", err);
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    axios
      .get("https://api-capbridge.langitdigital78.com/api/v1/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setProfile(res.data.data);
      })
      .catch((err) => {
        console.error("Failed to fetch profile", err);
      });
  }, [token, pathname]);

  //* remove cookie & cache data
  const removeData = () => {
    //* penerbit
    localStorage.removeItem(FORM_INDEX_CACHE_KEY);
    localStorage.removeItem(FORM_PIC_CACHE_KEY);
    localStorage.removeItem(FORM_PENERBIT_1_CACHE_KEY);
    localStorage.removeItem(FORM_PENERBIT_2_CACHE_KEY);

    //* pemodal
    localStorage.removeItem("formPemodal");

    //* user
    Cookies.remove("user");
    localStorage.removeItem("user");
  };

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
          isSticky ? "bg-white text-[#10565C] shadow-md" : "bg-[#10565C]"
        }`}
      >
        <div className="flex justify-between items-center px-10 py-6 text-sm font-semibold">
          <Link href={"/"}>
            <div className="flex items-center gap-2">
              <img
                src={"/images/logo-fulusme.png"}
                alt="FuLusme Logo"
                className="h-8 w-8 object-contain transition-all duration-300"
              />

              <span
                className={`text-xl font-bold ${
                  isSticky ? "text-[#10565C]" : "text-white"
                }`}
              >
                FuLusme
              </span>
            </div>
          </Link>

          {hydrated && userData !== null ? (
            <>
              <div className="flex items-center gap-4">
                <div className="hidden md:block">
                  <p
                    className={`
                      ${
                        isSticky && pathname === ""
                          ? "text-[#16EDFF]"
                          : isSticky
                          ? "text-[#10565C]"
                          : pathname == ""
                          ? "text-[#16EDFF]"
                          : "text-white"
                      }
                    `}
                  >
                    {" "}
                    Halo, {profile?.fullname}
                  </p>
                </div>

                {userData && userData.role === "user" && step !== "role" && (
                  <>
                    {/* Desktop */}
                    <div className="hidden md:block">
                      <button
                        onClick={() => setStep("role")}
                        className="px-3 py-1 rounded-lg bg-red-500 text-white text-sm font-semibold animate-pulse"
                      >
                        Anda Belum Memilih Peran
                      </button>
                    </div>

                    {/* Mobile */}
                  </>
                )}
                <Tippy content="Inbox" animation="scale">
                  <Link href="/inbox" className="relative inline-block">
                    <BellRing
                      size={18}
                      className={
                        isSticky && pathname === "/inbox"
                          ? "text-[#16EDFF]"
                          : isSticky
                          ? "text-[#10565C]"
                          : pathname == "/inbox"
                          ? "text-[#16EDFF]"
                          : "text-white"
                      }
                    />
                    {badgeCount > 0 && (
                      <span className="absolute -top-2 -right-1 bg-red-500 text-white text-[10px] min-w-[14px] h-[14px] rounded-full flex items-center justify-center">
                        {badgeCount}
                      </span>
                    )}
                  </Link>
                </Tippy>

                {/* <BroadcastIcon active color={!isSticky ? "white" : "#10565C"} /> */}

                <button onClick={toggleMenu} className="relative">
                  {userData?.role === "user" && step !== "role" && (
                    <>
                      {/* Ping hanya untuk mobile */}
                      <span className="absolute -top-1 -right-1 inline-flex h-3 w-3 animate-ping rounded-full bg-red-400 opacity-85 md:hidden"></span>
                      <span className="absolute -top-1 -right-1 inline-flex h-3 w-3 rounded-full bg-red-500 md:hidden"></span>
                    </>
                  )}

                  {menuOpen ? (
                    <X size={24} />
                  ) : (
                    <Menu
                      size={24}
                      className={isSticky ? "text-[#10565C]" : "text-white"}
                    />
                  )}
                </button>
              </div>

              {/* navbar mobile */}
              <div
                className={`fixed top-0 right-0 h-full w-64 bg-[#10565C] z-40 p-6 
                    transform transition-transform duration-300 
                    ${menuOpen ? "translate-x-0" : "translate-x-full"} 
                    `}
              >
                <Link href={"/"}>
                  {" "}
                  <div className={`text-xl text-center font-bold text-white`}>
                    FuLusme
                  </div>
                </Link>

                <ul className="flex flex-col gap-6 text-white text-base font-semibold pt-16">
                  {userData && userData.role === "user" && step !== "role" && (
                    <div className="block md:hidden">
                      <button
                        onClick={() => setStep("role")}
                        className="px-3 py-1 rounded-md bg-red-500 text-white text-sm font-semibold animate-pulse"
                      >
                        Anda Belum Memilih Peran
                      </button>
                    </div>
                  )}
                  <li
                    className={
                      pathname == "/" ? "text-[#16EDFF]" : "text-white"
                    }
                    onClick={toggleMenu}
                  >
                    <Link href="/">Beranda</Link>
                  </li>
                  {hydrated && userData !== null ? (
                    <>
                      <li
                        className={
                          pathname == "/dashboard"
                            ? "text-[#16EDFF]"
                            : "text-white"
                        }
                        onClick={toggleMenu}
                      >
                        <Link href="/dashboard">Dashboard</Link>
                      </li>
                      <li
                        className={
                          pathname == "/transaction"
                            ? "text-[#16EDFF]"
                            : "text-white"
                        }
                        onClick={toggleMenu}
                      >
                        <Link href="/transaction">Transaksi</Link>
                      </li>
                      <li
                        className={
                          pathname == "/terms-conditions"
                            ? "text-[#16EDFF]"
                            : "text-white"
                        }
                        onClick={toggleMenu}
                      >
                        <Link href="/terms-conditions">
                          Syarat dan Ketentuan
                        </Link>
                      </li>
                      <li className="md:hidden">
                        <p
                          className={
                            pathname == "" ? "text-[#16EDFF]" : "text-white"
                          }
                        >
                          {" "}
                          Halo, {profile?.fullname}
                        </p>
                      </li>
                    </>
                  ) : (
                    <>
                      <li
                        className={
                          pathname == "/business-list" ? "text-[#16EDFF]" : ""
                        }
                      >
                        <Link href="/business-list">Daftar Bisnis</Link>
                      </li>
                      <li
                        className={
                          pathname == "/about-us" ? "text-[#16EDFF]" : ""
                        }
                      >
                        <Link href="/about-us">Tentang Kami</Link>
                      </li>
                      <li
                        className={
                          pathname == "/terms-conditions"
                            ? "text-[#16EDFF]"
                            : "text-white"
                        }
                      >
                        <Link href="/terms-conditions">
                          Syarat dan Ketentuan
                        </Link>
                      </li>
                    </>
                  )}
                  {hydrated && userData !== null ? (
                    <>
                      <li>
                        <button
                          onClick={() => {
                            removeData();
                            window.location.href = "/auth/login";
                          }}
                          className="px-5 py-2 rounded-lg bg-red-500 text-white"
                        >
                          Keluar
                        </button>
                      </li>
                    </>
                  ) : (
                    <li>
                      <a href="/auth/login">
                        <button className="mt-2 md:mt-0 px-5 py-2 rounded-lg bg-[#4CD137] text-white">
                          Masuk
                        </button>
                      </a>
                    </li>
                  )}
                  {userData === null && (
                    <div className="flex justify-between px-4">
                      <button
                        onClick={() => setStep("register")}
                        className="text-white"
                      >
                        Daftar
                      </button>
                    </div>
                  )}
                </ul>
              </div>

              {menuOpen && (
                <div
                  onClick={toggleMenu}
                  className="fixed inset-0 bg-black bg-opacity-40 z-30"
                />
              )}
            </>
          ) : (
            <>
              <div className="md:hidden flex items-center gap-4">
                <Tippy content="Inbox" animation="scale">
                  <Link href="/inbox" className="relative inline-block">
                    <BellRing
                      size={18}
                      className={
                        isSticky && pathname === "/inbox"
                          ? "text-[#16EDFF]"
                          : isSticky
                          ? "text-[#10565C]"
                          : pathname == "/inbox"
                          ? "text-[#16EDFF]"
                          : "text-white"
                      }
                    />
                    {badgeCount > 0 && (
                      <span className="absolute -top-2 -right-1 bg-red-500 text-white text-[10px] min-w-[14px] h-[14px] rounded-full flex items-center justify-center">
                        {badgeCount}
                      </span>
                    )}
                  </Link>
                </Tippy>
                <button onClick={toggleMenu}>
                  {menuOpen ? (
                    <X size={24} />
                  ) : (
                    <Menu
                      size={24}
                      className={isSticky ? "text-[#10565C]" : "text-white"}
                    />
                  )}
                </button>
              </div>

              {/* navbar mobile */}
              <div
                className={`fixed top-0 right-0 h-full w-64 bg-[#10565C] z-40 p-6 
                    transform transition-transform duration-300 
                    ${menuOpen ? "translate-x-0" : "translate-x-full"} 
                    md:hidden`}
              >
                <Link href={"/"}>
                  <div className={`text-xl text-center font-bold text-white`}>
                    FuLusme
                  </div>
                </Link>
                <ul className="flex flex-col gap-6 text-white text-base font-semibold pt-16">
                  <li
                    className={
                      pathname == "/" ? "text-[#16EDFF]" : "text-white"
                    }
                    onClick={toggleMenu}
                  >
                    <Link href="/">Beranda</Link>
                  </li>
                  {hydrated && userData !== null ? (
                    <>
                      <li
                        className={
                          pathname == "/dashboard"
                            ? "text-[#16EDFF]"
                            : "text-white"
                        }
                        onClick={toggleMenu}
                      >
                        <Link href="/dashboard">Dashboard</Link>
                      </li>
                      <li
                        className={
                          pathname == "/transaction"
                            ? "text-[#16EDFF]"
                            : "text-white"
                        }
                        onClick={toggleMenu}
                      >
                        <Link href="/transaction">Transaksi</Link>
                      </li>
                      <li
                        className={
                          pathname == "/terms-conditions"
                            ? "text-[#16EDFF]"
                            : "text-white"
                        }
                        onClick={toggleMenu}
                      >
                        <Link href="/terms-conditions">
                          Syarat dan Ketentuan
                        </Link>
                      </li>
                      <li>
                        <p
                          className={
                            pathname == "" ? "text-[#16EDFF]" : "text-white"
                          }
                        >
                          {" "}
                          Halo, {profile?.fullname}
                        </p>
                      </li>
                    </>
                  ) : (
                    <>
                      <li
                        className={
                          pathname == "/business-list" ? "text-[#16EDFF]" : ""
                        }
                        onClick={toggleMenu}
                      >
                        <Link href="/business-list">Daftar Bisnis</Link>
                      </li>
                      <li
                        className={
                          pathname == "/about-us" ? "text-[#16EDFF]" : ""
                        }
                        onClick={toggleMenu}
                      >
                        <Link href="/about-us">Tentang Kami</Link>
                      </li>
                      <li
                        className={
                          pathname == "/terms-conditions"
                            ? "text-[#16EDFF]"
                            : "text-white"
                        }
                        onClick={toggleMenu}
                      >
                        <Link href="/terms-conditions">
                          Syarat dan Ketentuan
                        </Link>
                      </li>
                    </>
                  )}
                  {hydrated && userData !== null ? (
                    <>
                      <li>
                        <button
                          onClick={() => {
                            removeData();
                            window.location.href = "/auth/login";
                          }}
                          className="px-5 py-2 rounded-lg bg-red-500 text-white"
                        >
                          Keluar
                        </button>
                      </li>
                    </>
                  ) : (
                    <li>
                      <a href="/auth/login">
                        <button
                          className={`px-5 py-2 rounded-lg ${
                            isSticky
                              ? "bg-white text-[#10565C]"
                              : "bg-white text-[#10565C]"
                          }`}
                        >
                          Masuk
                        </button>
                      </a>
                    </li>
                  )}
                  {userData === null && (
                    <div className="flex justify-between px-0">
                      <button
                        onClick={() => setStep("register")}
                        className={`px-5 py-2 rounded-lg ring-2 ${
                          isSticky
                            ? "text-white ring-white"
                            : "text-white ring-white"
                        }`}
                      >
                        Daftar
                      </button>
                    </div>
                  )}
                </ul>
              </div>

              {menuOpen && (
                <div
                  onClick={toggleMenu}
                  className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
                />
              )}

              {/* navbar md keatas */}
              <ul className="hidden md:flex gap-4 items-center">
                <li className={pathname == "/" ? "text-[#16EDFF]" : ""}>
                  <Link href="/">Beranda</Link>
                </li>

                {hydrated && userData !== null && userCookie !== undefined ? (
                  <>
                    <li
                      className={
                        isSticky && pathname === "/dashboard"
                          ? "text-[#16EDFF]"
                          : isSticky
                          ? "text-[#10565C]"
                          : pathname === "/dashboard"
                          ? "text-[#16EDFF]"
                          : "text-white"
                      }
                    >
                      <Link href="/dashboard">Dashboard</Link>
                    </li>
                    <li
                      className={
                        isSticky && pathname === "/transaction"
                          ? "text-[#16EDFF]"
                          : isSticky
                          ? "text-[#10565C]"
                          : pathname == "/transaction"
                          ? "text-[#16EDFF]"
                          : "text-white"
                      }
                    >
                      <Link href="/transaction">Transaksi</Link>
                    </li>

                    <li>
                      <Tippy content="Inbox" animation="scale">
                        <Link href={"/inbox"}>
                          <BellRing
                            size={18}
                            className={
                              isSticky && pathname === "/inbox"
                                ? "text-[#16EDFF]"
                                : isSticky
                                ? "text-[#10565C]"
                                : pathname == "/inbox"
                                ? "text-[#16EDFF]"
                                : "text-white"
                            }
                          />
                        </Link>
                      </Tippy>
                    </li>
                    <li>
                      <p
                        className={
                          isSticky && pathname === ""
                            ? "text-[#16EDFF]"
                            : isSticky
                            ? "text-[#10565C]"
                            : pathname == ""
                            ? "text-[#16EDFF]"
                            : "text-white"
                        }
                      >
                        {" "}
                        Halo, {profile?.fullname}
                      </p>
                    </li>

                    <li>
                      <button
                        onClick={() => {
                          removeData();
                          window.location.href = "/auth/login";
                        }}
                        className="px-5 py-2 rounded-lg bg-red-500 text-white"
                      >
                        Keluar
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li
                      className={
                        pathname == "/business-list" ? "text-[#16EDFF]" : ""
                      }
                    >
                      <Link href="/business-list">Daftar Bisnis</Link>
                    </li>
                    <li
                      className={
                        pathname == "/about-us" ? "text-[#16EDFF]" : ""
                      }
                    >
                      <Link href="/about-us">Tentang Kami</Link>
                    </li>
                    <li
                      className={
                        isSticky && pathname === "/terms-conditions"
                          ? "text-[#16EDFF]"
                          : isSticky
                          ? "text-[#10565C]"
                          : pathname == "/terms-conditions"
                          ? "text-[#16EDFF]"
                          : "text-white"
                      }
                    >
                      <Link href="/terms-conditions">Syarat dan Ketentuan</Link>
                    </li>
                    <li>
                      <>
                        <Link href={"/auth/login"}>
                          <button
                            className={`px-5 py-2 rounded-lg ${
                              isSticky
                                ? "bg-[#10565C] text-white"
                                : "bg-white text-[#10565C]"
                            }`}
                            onClick={() => {
                              setIsInboxTooltipOpen((isOpen) => !isOpen);
                            }}
                          >
                            Masuk
                          </button>
                        </Link>
                      </>
                    </li>
                  </>
                )}
                {hydrated && userData !== null && userCookie !== undefined ? (
                  <></>
                ) : (
                  <button
                    className={`px-5 py-2 rounded-lg ring-2 ${
                      isSticky
                        ? "text-[#10565C] ring-[#10565C]"
                        : "text-white ring-white"
                    }`}
                    onClick={() => setStep("register")}
                  >
                    Daftar
                  </button>
                )}
              </ul>
            </>
          )}
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
    </>
  );
};

export default NavbarV2;
