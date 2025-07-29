"use client";

import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BellRing, Menu, X } from "lucide-react";
import { AppDispatch, RootState } from "@redux/store";
import { useDispatch, useSelector } from "react-redux";
import { loadSession } from "@redux/slices/authSlice";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import {
  useFloating,
  offset,
  useDismiss,
  useInteractions,
  useTransitionStyles,
} from "@floating-ui/react";
import Modal from "@/app/helper/Modal";
import RegisterV2 from "../auth/register/RegisterV2";
import RegisterOtp from "../auth/register/RegisterOtp";
import RegisterSelectRole from "../auth/register/RegisterSelectRole";
import Cookies from "js-cookie";
import axios from "axios";
import { produce } from "immer";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

interface ProfileData {
  fullname: string;
  avatar: string;
  last_education: string;
  gender: string;
  status_marital: string;
  address_detail: string;
  occupation: string;
}

const Navbar: React.FC = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  //* floating inbox hooks
  const [isInboxTooltipOpen, setIsInboxTooltipOpen] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    open: isInboxTooltipOpen,
    onOpenChange: setIsInboxTooltipOpen,
    middleware: [offset(10)],
    placement: "bottom-end",
  });
  const dismiss = useDismiss(context);
  const { isMounted, styles } = useTransitionStyles(context, {
    initial: {
      opacity: 0,
      transform: "scale(0.8)",
    },
    duration: 300,
  });
  const { getReferenceProps, getFloatingProps } = useInteractions([dismiss]);

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
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [token, setToken] = useState<string | null>(null);

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

  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (!userCookie) return;

    try {
      const user = JSON.parse(userCookie);
      if (user?.token) {
        setToken(user.token);
      }
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

          {hydrated && userData !== null ? (
            <>
              <div className="flex items-center gap-4">
                <div className="hidden md:block">
                  <p
                    className={`
                      ${
                        isSticky && pathname === ""
                          ? "text-[#4CD137]"
                          : isSticky
                          ? "text-[#322783]"
                          : pathname == ""
                          ? "text-[#4CD137]"
                          : "text-white"
                      }
                    `}
                  >
                    {" "}
                    Halo, {profile?.fullname}
                    {/* {userData.email} */}
                  </p>
                </div>
                <Tippy content="Inbox" animation="scale">
                  <Link href={"/inbox"}>
                    <BellRing
                      size={18}
                      className={
                        isSticky && pathname === "/inbox"
                          ? "text-[#4CD137]"
                          : isSticky
                          ? "text-[#322783]"
                          : pathname == "/inbox"
                          ? "text-[#4CD137]"
                          : "text-white"
                      }
                    />
                  </Link>
                </Tippy>
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

              {/* navbar mobile */}
              <div
                className={`fixed top-0 right-0 h-full w-64 bg-[#4821C1] z-40 p-6 
                    transform transition-transform duration-300 
                    ${menuOpen ? "translate-x-0" : "translate-x-full"} 
                    `}
              >
                <ul className="flex flex-col gap-6 text-white text-base font-semibold pt-16">
                  <li
                    className={
                      pathname == "/" ? "text-[#4CD137]" : "text-white"
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
                            ? "text-[#4CD137]"
                            : "text-white"
                        }
                        onClick={toggleMenu}
                      >
                        <Link href="/dashboard">Dashboard</Link>
                      </li>
                      <li
                        className={
                          pathname == "/transaction"
                            ? "text-[#4CD137]"
                            : "text-white"
                        }
                        onClick={toggleMenu}
                      >
                        <Link href="/transaction">Transaksi</Link>
                      </li>
                      <li
                        className={
                          pathname == "/terms-conditions"
                            ? "text-[#4CD137]"
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
                            pathname == "" ? "text-[#4CD137]" : "text-white"
                          }
                        >
                          {" "}
                          Halo, {profile?.fullname}
                          {/* {userData.email} */}
                        </p>
                      </li>
                    </>
                  ) : (
                    <>
                      <li
                        className={
                          pathname == "/business-list" ? "text-[#4CD137]" : ""
                        }
                      >
                        <Link href="/business-list">Daftar Bisnis</Link>
                      </li>
                      <li
                        className={
                          pathname == "/about-us" ? "text-[#4CD137]" : ""
                        }
                      >
                        <Link href="/about-us">Tentang Kami</Link>
                      </li>
                      <li
                        className={
                          pathname == "/terms-conditions"
                            ? "text-[#4CD137]"
                            : "text-white"
                        }
                      >
                        <Link href="/terms-conditions">
                          Syarat dan Ketentuan
                        </Link>
                      </li>
                      {/* <li>
                    <>
                      <Link href={"/auth/login"}>
                        <button
                          className={`px-5 py-2 rounded-full ${
                            isSticky
                              ? "bg-[#4CD137] text-white"
                              : "bg-[#4CD137] text-white"
                          }`}
                          onClick={() => {
                            setIsInboxTooltipOpen((isOpen) => !isOpen);
                          }}
                        >
                          Masuk
                        </button>
                      </Link>
                    </>
                  </li> */}
                    </>
                  )}
                  {hydrated && userData !== null ? (
                    <>
                      {/* <UserMenu
                    email={userData.email}
                    handleMenuOpen={setMenuOpen}
                  /> */}
                      <li>
                        <button
                          onClick={() => {
                            localStorage.removeItem("user");
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
                        <button className="mt-2 md:mt-0 px-5 py-2 rounded-full bg-[#4CD137] text-white">
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
                  <Link href={"/inbox"}>
                    <BellRing
                      size={18}
                      className={
                        isSticky && pathname === "/inbox"
                          ? "text-[#4CD137]"
                          : isSticky
                          ? "text-[#322783]"
                          : pathname == "/inbox"
                          ? "text-[#4CD137]"
                          : "text-white"
                      }
                    />
                  </Link>
                </Tippy>
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

              {/* navbar mobile */}
              <div
                className={`fixed top-0 right-0 h-full w-64 bg-[#4821C1] z-40 p-6 
                    transform transition-transform duration-300 
                    ${menuOpen ? "translate-x-0" : "translate-x-full"} 
                    md:hidden`}
              >
                <ul className="flex flex-col gap-6 text-white text-base font-semibold pt-16">
                  <li
                    className={
                      pathname == "/" ? "text-[#4CD137]" : "text-white"
                    }
                  >
                    <Link href="/">Beranda</Link>
                  </li>
                  {hydrated && userData !== null ? (
                    <>
                      <li
                        className={
                          pathname == "/dashboard"
                            ? "text-[#4CD137]"
                            : "text-white"
                        }
                        onClick={toggleMenu}
                      >
                        <Link href="/dashboard">Dashboard</Link>
                      </li>
                      <li
                        className={
                          pathname == "/transaction"
                            ? "text-[#4CD137]"
                            : "text-white"
                        }
                        onClick={toggleMenu}
                      >
                        <Link href="/transaction">Transaksi</Link>
                      </li>
                      <li
                        className={
                          pathname == "/terms-conditions"
                            ? "text-[#4CD137]"
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
                            pathname == "" ? "text-[#4CD137]" : "text-white"
                          }
                        >
                          {" "}
                          Halo, {profile?.fullname}
                          {/* {userData.email} */}
                        </p>
                      </li>
                    </>
                  ) : (
                    <>
                      <li
                        className={
                          pathname == "/business-list" ? "text-[#4CD137]" : ""
                        }
                        onClick={toggleMenu}
                      >
                        <Link href="/business-list">Daftar Bisnis</Link>
                      </li>
                      <li
                        className={
                          pathname == "/about-us" ? "text-[#4CD137]" : ""
                        }
                        onClick={toggleMenu}
                      >
                        <Link href="/about-us">Tentang Kami</Link>
                      </li>
                      <li
                        className={
                          pathname == "/terms-conditions"
                            ? "text-[#4CD137]"
                            : "text-white"
                        }
                        onClick={toggleMenu}
                      >
                        <Link href="/terms-conditions">
                          Syarat dan Ketentuan
                        </Link>
                      </li>
                      {/* <li>
                    <>
                      <Link href={"/auth/login"}>
                        <button
                          className={`px-5 py-2 rounded-full ${
                            isSticky
                              ? "bg-[#4CD137] text-white"
                              : "bg-[#4CD137] text-white"
                          }`}
                          onClick={() => {
                            setIsInboxTooltipOpen((isOpen) => !isOpen);
                          }}
                        >
                          Masuk
                        </button>
                      </Link>
                    </>
                  </li> */}
                    </>
                  )}
                  {hydrated && userData !== null ? (
                    <>
                      {/* <UserMenu
                    email={userData.email}
                    handleMenuOpen={setMenuOpen}
                  /> */}
                      <li>
                        <button
                          onClick={() => {
                            localStorage.removeItem("user");
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
                        <button className="mt-2 md:mt-0 px-5 py-2 rounded-full bg-[#4CD137] text-white">
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
                  className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
                />
              )}

              {/* navbar md keatas */}
              <ul className="hidden md:flex gap-6 items-center">
                <li className={pathname == "/" ? "text-[#4CD137]" : ""}>
                  <Link href="/">Beranda</Link>
                </li>

                {hydrated && userData !== null ? (
                  <>
                    <li
                      className={
                        isSticky && pathname === "/dashboard"
                          ? "text-[#4CD137]"
                          : isSticky
                          ? "text-[#322783]"
                          : pathname === "/dashboard"
                          ? "text-[#4CD137]"
                          : "text-white"
                      }
                    >
                      <Link href="/dashboard">Dashboard</Link>
                    </li>
                    <li
                      className={
                        isSticky && pathname === "/transaction"
                          ? "text-[#4CD137]"
                          : isSticky
                          ? "text-[#322783]"
                          : pathname == "/transaction"
                          ? "text-[#4CD137]"
                          : "text-white"
                      }
                    >
                      <Link href="/transaction">Transaksi</Link>
                    </li>

                    <li>
                      <Tippy content="Inbox" animation="scale">
                        <Link
                          href={"/inbox"}
                          // onClick={() => {
                          //   setIsInboxTooltipOpen((isOpen) => !isOpen);
                          // }}
                        >
                          <BellRing
                            size={18}
                            className={
                              isSticky && pathname === "/inbox"
                                ? "text-[#4CD137]"
                                : isSticky
                                ? "text-[#322783]"
                                : pathname == "/inbox"
                                ? "text-[#4CD137]"
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
                            ? "text-[#4CD137]"
                            : isSticky
                            ? "text-[#322783]"
                            : pathname == ""
                            ? "text-[#4CD137]"
                            : "text-white"
                        }
                      >
                        {" "}
                        Halo, {profile?.fullname}
                        {/* {userData.email} */}
                      </p>
                    </li>
                    {/* <li
                  ref={refs.setReference}
                  {...getReferenceProps()}
                  onMouseEnter={() => {
                    setIsInboxTooltipOpen(true);
                  }}
                  onClick={() => {
                    setIsInboxTooltipOpen(true);
                  }}
                  className="bg-[#33206b] flex gap-4 items-center px-4 py-2 rounded-full hover:bg-[#211547] cursor-pointer"
                >
                  <p className="text-white"> Halo, {userData.email}</p>
                  <BellRing size={18} className="text-white" />
                </li> */}

                    {/* {isMounted && (
                  <div
                    ref={refs.setFloating}
                    style={{ ...floatingStyles, zIndex: 50 }}
                    {...getFloatingProps()}
                  >
                    <div
                      style={styles}
                      className="p-2 flex flex-col bg-white border gap-y-2 rounded-md shadow-lg"
                    >
                      <Link
                        href={"/dashboard"}
                        className="px-10 py-2 bg-gray-100 text-black justify-center flex rounded-sm cursor-pointer hover:bg-gray-200"
                        onClick={() => {
                          setIsInboxTooltipOpen((isOpen) => !isOpen);
                        }}
                      >
                        Dashboard
                      </Link>
                      {userData.role === "emiten" && (
                        <>
                          <Link
                            href={"/inbox"}
                            onClick={() => {
                              setIsInboxTooltipOpen((isOpen) => !isOpen);
                            }}
                            className="px-10 py-2 bg-gray-100 text-black justify-center flex rounded-sm cursor-pointer hover:bg-gray-200"
                          >
                            Inbox
                          </Link>
                          <Link
                            href={"/transaction"}
                            onClick={() => {
                              setIsInboxTooltipOpen((isOpen) => !isOpen);
                            }}
                            className="px-10 py-2 bg-gray-100 text-black justify-center flex rounded-sm cursor-pointer hover:bg-gray-200"
                          >
                            Transaksi
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                )} */}
                    <li>
                      <button
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
                  <>
                    <li
                      className={
                        pathname == "/business-list" ? "text-[#4CD137]" : ""
                      }
                    >
                      <Link href="/business-list">Daftar Bisnis</Link>
                    </li>
                    <li
                      className={
                        pathname == "/about-us" ? "text-[#4CD137]" : ""
                      }
                    >
                      <Link href="/about-us">Tentang Kami</Link>
                    </li>
                    <li
                      className={
                        isSticky && pathname === "/terms-conditions"
                          ? "text-[#4CD137]"
                          : isSticky
                          ? "text-[#322783]"
                          : pathname == "/terms-conditions"
                          ? "text-[#4CD137]"
                          : "text-white"
                      }
                    >
                      <Link href="/terms-conditions">Syarat dan Ketentuan</Link>
                    </li>
                    <li>
                      <>
                        <Link href={"/auth/login"}>
                          <button
                            className={`px-5 py-2 rounded-full ${
                              isSticky
                                ? "bg-[#4CD137] text-white"
                                : "bg-[#4CD137] text-white"
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
                {hydrated && userData !== null ? (
                  <></>
                ) : (
                  <button
                    className={`${isSticky ? "text-[#322783]" : "text-white"}`}
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
      {/* <RoleModal open={showModal} onClose={() => setShowModal(false)} /> */}
    </>
  );
};

const UserMenu = ({
  email,
  handleMenuOpen,
}: {
  email: string;
  handleMenuOpen: (isOpen: boolean) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <ul className="list-none text-sm text-white">
      <li>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between py-2 rounded hover:bg-violet-700 transition-colors"
        >
          <p className=" text-white truncate">{email}</p>
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {isExpanded && (
          <ul className="mt-1 ml-6 space-y-1 text-sm text-white">
            <li>
              <Link
                href="/inbox"
                className="block px-3 py-1 rounded hover:bg-violet-700 transition-colors"
                onClick={() => {
                  handleMenuOpen(false);
                }}
              >
                Inbox
              </Link>
            </li>
            <li>
              <Link
                href="/transaction"
                onClick={() => {
                  handleMenuOpen(false);
                }}
                className="block px-3 py-1 rounded hover:bg-violet-700 transition-colors"
              >
                Transaksi
              </Link>
            </li>
          </ul>
        )}
      </li>
    </ul>
  );
};

export default Navbar;
