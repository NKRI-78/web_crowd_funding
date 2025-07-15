"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { ProjectCard } from "../project/Project";
import { IProjectData } from "@/app/interface/IProject";
import { getAllProject } from "@/actions/GetAllProject";

type Project = {
  image: string;
  alt: string;
  status: "Proyek Berakhir" | "Proyek Berjalan";
  statusColor: "purple" | "green";
  title: string;
  danaTerkumpul: string;
  kebutuhanModal: string;
  minimalInvestasi: string;
  jangkaWaktu: string;
  proyeksiROI: string;
};

const projects: Project[] = [
  {
    image: "/images/mitra.jpg",
    alt: "Mitra10 Garut",
    status: "Proyek Berakhir",
    statusColor: "purple",
    title:
      "PROYEK PENGADAAN MATERIAL DAN INSTALASI PERALATAN MITRA10 GARUT TAHUN 2024",
    danaTerkumpul: "Rp 500.000.000",
    kebutuhanModal: "Rp 500.000.000",
    minimalInvestasi: "Rp 1.000.000",
    jangkaWaktu: "2 Bulan",
    proyeksiROI: "4% (24% p.a)",
  },
  {
    image: "/images/tower.jpg",
    alt: "Tower Bersama Group",
    status: "Proyek Berjalan",
    statusColor: "green",
    title:
      "Jasa Pemeliharaan Perangkat Penunjang Infrastruktur Telekomunikasi Tower Bersama Group (TBG)",
    danaTerkumpul: "Rp 850.000.000",
    kebutuhanModal: "Rp 850.000.000",
    minimalInvestasi: "Rp 1.000.000",
    jangkaWaktu: "6 Bulan",
    proyeksiROI: "9.5% (19.01% p.a)",
  },
  {
    image: "/images/pln.jpg",
    alt: "PLN Balikpapan",
    status: "Proyek Berakhir",
    statusColor: "purple",
    title:
      "Pembangunan Extention Bay Trafo Gardu Induk Balikpapan PT PLN Indonesia",
    danaTerkumpul: "Rp 300.000.000",
    kebutuhanModal: "Rp 300.000.000",
    minimalInvestasi: "Rp 1.000.000",
    jangkaWaktu: "2 Bulan",
    proyeksiROI: "18% p.a",
  },
  {
    image: "/images/resto.jpg",
    alt: "Renovasi Resto M-Lounge",
    status: "Proyek Berakhir",
    statusColor: "purple",
    title: "Renovasi Interior Resto M-Lounge",
    danaTerkumpul: "Rp 400.000.000",
    kebutuhanModal: "Rp 400.000.000",
    minimalInvestasi: "Rp 1.000.000",
    jangkaWaktu: "12 Bulan",
    proyeksiROI: "18% p.a",
  },
  {
    image: "/images/cv.jpg",
    alt: "Pulsa Data Telekomunikasi",
    status: "Proyek Berakhir",
    statusColor: "purple",
    title: "Pembelian Pulsa Data Operator Telekomunikasi",
    danaTerkumpul: "Rp 200.000.000",
    kebutuhanModal: "Rp 200.000.000",
    minimalInvestasi: "Rp 1.000.000",
    jangkaWaktu: "2 Bulan",
    proyeksiROI: "22% p.a",
  },
];
const BussinesList: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [project, seProject] = useState<IProjectData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTopVideos = async () => {
      setLoading(true);
      const res = await getAllProject();
      seProject(res?.data ?? []);
      setLoading(false);
    };

    fetchTopVideos();
  }, []);

  return (
    <div>
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
            <button
              onClick={closeModal}
              className="absolute top-4 left-4 text-gray-500 hover:text-black"
            >
              <X size={20} />
            </button>
            <div className="text-center text-black font-bold text-lg mb-4">
              Urutkan
            </div>
            <div className="flex flex-col gap-3">
              <button className="bg-gray-100 text-black py-2 rounded-md">
                Nama A - Z
              </button>
              <button className="bg-gray-100 text-black py-2 rounded-md">
                Nama Z - A
              </button>
              <button className="bg-gray-100 text-black py-2 rounded-md">
                Nilai Rendah ke Tinggi
              </button>
              <button className="bg-gray-100 text-black py-2 rounded-md">
                Nilai Tinggi ke Rendah
              </button>
              <button
                onClick={closeModal}
                className="text-sm text-gray-500 mt-2 underline"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="bg-white relative text-black py-12 px-6 text-center md:px-16 pt-32 scroll-mt-32">
        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4 text-left">
          <div className="relative w-full md:w-1/4">
            <input
              type="text"
              placeholder="Cari Bisnis..."
              className="w-full py-3 pl-5 pr-10 text-sm rounded-full bg-[#F6F6FF] focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
              🔍
            </div>
          </div>

          <button
            onClick={openModal}
            className="flex items-center gap-2 text-black border px-4 py-2 rounded-full hover:bg-gray-100 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 13.414V19a1 1 0 01-1.447.894l-4-2A1 1 0 019 17v-3.586L3.293 6.707A1 1 0 013 6V4z"
              />
            </svg>
            <span className="text-sm font-medium">Filter</span>
          </button>
        </div>

        {/* Project Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-14">
          {project.map((project: IProjectData, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default BussinesList;
