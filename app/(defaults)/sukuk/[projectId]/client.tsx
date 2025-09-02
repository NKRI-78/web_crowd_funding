"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

import type { Swiper as SwiperType } from "swiper";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Cookies from "js-cookie";
import axios from "axios";
import defaultImage from "/public/images/default-image.png";
import { API_BACKEND } from "@/app/utils/constant";
import Custom404 from "@/app/not-found";
import ProgressBar from "../components/ProgressBar";
import { formatRupiah } from "@/app/lib/utils";
import { getUser } from "@/app/lib/auth";

type Project = {
  id: string;
  title: string;
  goal: string;
  medias: {
    id: number;
    path: string;
  }[];
  location: {
    id: number;
    name: string;
    url: string;
    lat: string;
    lng: string;
  };
  doc: {
    id: string;
    path: string;
  };
  capital: string;
  roi: string;
  loan_term: string;
  kode_efek: string;
  min_invest: string;
  unit_price: string;
  unit_total: string;
  number_of_unit: string;
  periode: string;
  type_of_bond: string;
  nominal_value: string;
  time_periode: string;
  interest_rate: string;
  jumlah_unit: string;
  type_of_project: string;
  interest_payment_schedule: string;
  principal_payment_schedule: string;
  use_of_funds: string;
  collateral_guarantee: string;
  desc_job: string;
  is_apbn: boolean;
  is_approved: boolean;
  company: {
    name: string;
    jenis_usaha: string;
  };
  created_at: string;
  updated_at: string;
};

type Props = {
  id: string;
};

const SukukClient = ({ id }: Props) => {
  const [showLocationModal, setShowLocationModal] = useState(false);

  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [hydrated, setHydrated] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const userCookie = getUser();
    if (userCookie) {
      try {
        setRole(userCookie.role);
      } catch (err) {
        console.error("Failed to parse user cookie", err);
      }
    }
  }, []);

  //* fetch project detail by id
  useEffect(() => {
    if (id) {
      const fetchProject = async () => {
        try {
          const response = await axios.get(
            `${API_BACKEND}/api/v1/project/detail/${id}`
          );
          setProject(response.data.data);
        } catch (error: any) {
          console.error("Gagal ambil data project:", error);

          // Cek jika error 404
          if (error.response?.status === 400) {
            setIsNotFound(true);
          }
        } finally {
          setLoading(false);
        }
      };

      fetchProject();
    }
  }, []);

  useEffect(() => {
    setHydrated(true);
    const userCookie = Cookies.get("user");
    const user = userCookie ? JSON.parse(userCookie) : null;
    setUserData(user);
  }, []);

  return isNotFound ? (
    <>
      <Custom404 />
    </>
  ) : (
    <section className="py-28 px-4 md:px-12">
      {showLocationModal && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
          onClick={() => {
            setShowLocationModal(false);
          }}
        >
          <div className="bg-white w-full max-w-xl rounded-xl p-6 relative shadow-xl">
            <button
              onClick={() => setShowLocationModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-700"
            >
              <X />
            </button>

            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-black">
              📍 Lokasi
            </h2>

            <p className="text-sm text-black mb-4">{project?.location.url}</p>

            <div className="bg-gray-100 rounded-lg px-4 py-2 flex justify-between items-center text-sm mb-4">
              <input
                type="text"
                value={`${project?.location.url}`}
                readOnly
                className="bg-transparent w-full outline-none text-black"
              />
              <button
                onClick={() =>
                  navigator.clipboard.writeText(`${project?.location.url}`)
                }
                className="ml-2 px-2 py-1 text-sm bg-[#13733b] hover:bg-[#2a1a6a] text-white rounded"
              >
                Salin
              </button>
            </div>
            <a
              href={`${project?.location.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center text-sm w-full bg-[#13733b] hover:bg-[#2a1a6a] text-white py-2 rounded-lg font-semibold"
            >
              Go To Maps
            </a>
          </div>
        </div>
      )}

      <div className="w-full flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 lg:mx-2">
          <div className="relative rounded-xl overflow-hidden">
            <Swiper
              modules={[Navigation, Thumbs]}
              navigation
              spaceBetween={10}
              thumbs={{ swiper: thumbsSwiper }}
              slidesPerView={1}
              className="rounded-xl"
            >
              {project?.medias.map((item, idx) => (
                <SwiperSlide key={idx}>
                  <div className="relative">
                    <img
                      src={
                        item.path && item.path.startsWith("https")
                          ? item.path
                          : defaultImage.src
                      }
                      alt={`Slide ${idx + 1}`}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="mt-4 flex justify-center">
            <div className="w-full">
              <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={Math.min(project?.medias.length ?? 0, 5)} // tampil max 5
                centeredSlides={false} // biar mulai dari kiri
                watchSlidesProgress
                allowTouchMove={(project?.medias.length ?? 0) > 5} // disable scroll kalau <= 5
                className="cursor-pointer max-w-fit"
              >
                {project?.medias.map((item, idx) => (
                  <SwiperSlide
                    key={idx}
                    className={`${
                      (project?.medias.length ?? 0) == 1 ? "!w-20" : "!w-30"
                    }`}
                  >
                    <img
                      src={item.path}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-20 object-cover rounded-md border-2 border-transparent hover:border-blue-500 transition"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-lg text-black font-semibold mb-2">
              Tentang Bisnis
            </h2>
            <p className="text-sm mb-4">{project?.desc_job}</p>
          </div>
        </div>
        <div className="w-full lg:w-1/2 lg:mx-2">
          <div className="bg-gray-100 rounded-xl p-3 shadow-md">
            <div className="bg-white rounded-lg p-2">
              <h3 className="text-xl text-black font-bold">{project?.title}</h3>
              <div className="my-2">
                <div className="flex flex-wrap justify-between">
                  <p className="text-xs text-[#677AB9]">Perusahaan</p>
                  <p className="text-sm">{project?.company.name}</p>
                </div>
                <div className="flex flex-wrap justify-between">
                  <p className="text-xs text-[#677AB9]">Kode Efek</p>
                  <p className="text-sm">{project?.kode_efek}</p>
                </div>
                <div className="flex flex-wrap justify-between">
                  <p className="text-xs text-[#677AB9]">Jenis Akad</p>
                  <p className="text-sm">{project?.type_of_project}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-2 rounded-lg space-y-1 mt-3">
              <ProgressBar percentage={50} bgColor="#f3f4f6" />

              <div className="flex flex-wrap justify-between">
                <p className="text-xs font-bold text-[#677AB9]">
                  Dana Terkumpul
                </p>
                <p className="text-xs font-bold">{formatRupiah("a")}</p>
              </div>
            </div>

            <div className="bg-white p-2 rounded-lg mt-3">
              <div className="flex flex-wrap my-2 justify-between">
                <p className="text-xs text-[#677AB9]"> Kategori Bisnis</p>
                <p className="text-xs">{project?.company?.jenis_usaha}</p>
              </div>
              <div className="flex flex-wrap my-2 justify-between">
                <p className="text-xs text-[#677AB9]">Minimal Investasi:</p>
                <p className="text-xs">{formatRupiah(project?.min_invest)}</p>
              </div>
              <div className="flex flex-wrap my-2 justify-between">
                <p className="text-xs text-[#677AB9]">Harga Unit:</p>
                <p className="text-xs">{formatRupiah(project?.unit_price)}</p>
              </div>
              <div className="flex flex-wrap my-2 justify-between">
                <p className="text-xs text-[#677AB9]"> Jumlah Unit </p>
                <p className="text-xs">{formatRupiah(project?.jumlah_unit)}</p>
              </div>
              <div className="flex flex-wrap my-2 justify-between">
                <p className="text-xs text-[#677AB9]"> Total Unit (Rp) </p>
                <p className="text-xs"> {formatRupiah(project?.capital)} </p>
              </div>
              <div className="flex flex-wrap my-2 justify-between">
                <p className="text-xs text-[#677AB9]">Tenor:</p>
                <p className="text-xs">{project?.loan_term}</p>
              </div>
              <div className="flex flex-wrap my-2 justify-between">
                <p className="text-xs text-[#677AB9]">ROI (Proyeksi):</p>
                <p className="text-xs">{project?.roi}%</p>
              </div>
            </div>

            <div className="flex flex-wrap justify-evenly gap-4 mt-3 text-sm">
              <button
                className="bg-white text-xs text-black border px-4 py-2 rounded-md"
                onClick={() => {
                  navigator.clipboard
                    .writeText(window.location.href)
                    .then(() => {
                      alert("Link berhasil disalin!");
                      setTimeout(() => {
                        console.log("Alert selesai");
                      }, 2000);
                    })
                    .catch(() => {
                      alert("Gagal menyalin link");
                    });
                }}
              >
                Bagikan
              </button>
              <button
                className="bg-white text-xs text-black border px-4 py-2 rounded-md"
                onClick={() => {}}
              >
                Prospektus
              </button>
              <button
                onClick={() => setShowLocationModal(true)}
                className="bg-white text-xs text-black border px-4 py-2 rounded-md"
              >
                Lokasi
              </button>
            </div>

            {role !== "emiten" ? (
              hydrated && userData !== null ? (
                <button className="w-full bg-[#10565c] hover:bg-[#104348] text-white font-semibold py-2 rounded-md mt-4 cursor-pointer">
                  Beli Efek
                </button>
              ) : (
                <button className="w-full bg-gray-300 text-white font-semibold py-2 rounded-md mt-4 cursor-not-allowed">
                  Beli Efek
                </button>
              )
            ) : (
              <></>
            )}

            <p className="text-xs text-center mt-4">
              Butuh Pertanyaan?{" "}
              <a href="#" className="text-blue-600 font-semibold">
                Hubungi Kami
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SukukClient;
