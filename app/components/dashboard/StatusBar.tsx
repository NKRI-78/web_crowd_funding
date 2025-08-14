"use client";
import { ProgressBar, Step } from "react-step-progress-bar";
import "react-step-progress-bar/styles.css";
import {
  Check,
  TriangleAlert,
  Clock,
  X,
  CreditCard,
  DollarSign,
  Upload,
  BanknoteX,
  FileCheck,
} from "lucide-react";
import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { API_BACKEND } from "@/app/utils/constant";
import { useRouter } from "next/navigation";
import { formatPriceOrEmpty } from "@/app/lib/price";

interface StepStatusProps {
  currentStep: number;
  steps: string[];
  projectStatus: string;
}

export default function StepStatus({
  currentStep,
  steps,
  projectStatus,
}: StepStatusProps) {
  // const steps = ["Diproses", "Disetujui", "Pembayaran", "Dipublish"];

  // const percentMap: Record<string, number> = {
  //   PENDING: (1 / (steps.length - 1)) * 100,
  //   APPROVED: ((currentStep + 1) / (steps.length - 1)) * 100,
  //   UNPAID: (currentStep / (steps.length - 1)) * 100,
  //   PAID: ((currentStep + 0.9) / (steps.length - 1)) * 100,
  //   PUBLISH: 100,
  //   REJECTED: (currentStep / (steps.length - 1)) * 100,
  // };

  const percent = (currentStep / (steps.length - 1)) * 100;

  const statusMap: Record<number, string> = {
    0: "PENDING",
    1: "APPROVED",
    2: "REJECTED",
    // 3: "UNPAID",
    3: "PAID",
    4: "PUBLISH",
  };

  const userCookie = Cookies.get("user");
  const user = userCookie ? JSON.parse(userCookie) : null;
  const router = useRouter();

  const [selectedStatus, setSelectedStatus] = useState("PENDING");
  const [emitenProjects, setEmitenProjects] = useState<any[]>([]);

  const statusIcons: Record<string, JSX.Element> = {
    PENDING: <Clock size={20} strokeWidth={3} />,
    APPROVED: <FileCheck size={20} strokeWidth={3} />,
    REJECTED: <X size={20} strokeWidth={3} />,
    UNPAID: <BanknoteX size={20} strokeWidth={3} />,
    PAID: <DollarSign size={20} strokeWidth={3} />,
    PUBLISH: <Upload size={20} strokeWidth={3} />,
  };

  const fetchProjectsByStatus = async (status: string) => {
    console.log(status, "status");
    try {
      const res = await axios.get(
        `${API_BACKEND}/api/v1/project-by-emiten/list?status=${status}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log("Data proyek:", res.data);
      setEmitenProjects(res.data.data ?? []);
    } catch (err) {
      console.error("Gagal ambil data:", err);
    }
  };

  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});

  const fetchAllStatusCounts = async () => {
    try {
      const counts: Record<string, number> = {};

      // Loop semua status
      for (const status of Object.values(statusMap)) {
        const res = await axios.get(
          `${API_BACKEND}/api/v1/project-by-emiten/list?status=${status}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        counts[status] = res.data.data?.length ?? 0; // simpan jumlahnya
      }

      setStatusCounts(counts);
    } catch (err) {
      console.error("Gagal ambil jumlah proyek:", err);
    }
  };

  useEffect(() => {
    fetchAllStatusCounts();
  }, []);

  return (
    // <div className="max-w-full mb-2 md:mt-8 lg:mt-0">
    //   <h2 className="font-bold text-lg text-black mb-5 -mt-9 md:mt-0 md:mb-8 text-start">
    //     Proyek Saya
    //   </h2>
    //   <ProgressBar
    //     percent={percentMap[projectStatus] ?? 0}
    //     filledBackground={
    //       projectStatus === "REJECTED" || projectStatus === "UNPAID"
    //         ? "linear-gradient(to right, #facc15, #f97316)" // kuning → oranye
    //         : "linear-gradient(to right, #14b8a6, #0f766e)" // toska → hijau kebiruan
    //     }
    //     height={12} // progress bar lebih tebal
    //   >
    //     {steps.map((label, index) => (
    //       <Step key={index}>
    //         {({ accomplished }) => {
    //           const isCurrent = index === currentStep;
    //           const isWarning =
    //             (projectStatus === "REJECTED" && index === 1) ||
    //             (projectStatus === "UNPAID" && index === 2);

    //           return (
    //             <div className="flex flex-col items-center mt-6 transition-all duration-300">
    //               <div
    //                 className={`w-12 h-12 flex items-center justify-center rounded-full shadow-lg transform transition-all duration-300 ${
    //                   isWarning
    //                     ? "bg-yellow-400 text-black animate-pulse ring-4 ring-yellow-200"
    //                     : accomplished
    //                     ? "bg-teal-700 text-white shadow-lg"
    //                     : "bg-gray-300 text-gray-700"
    //                 } ${
    //                   isCurrent && !isWarning
    //                     ? "ring-4 ring-teal-300 scale-110"
    //                     : ""
    //                 }`}
    //               >
    //                 {isWarning ? (
    //                   <TriangleAlert size={20} strokeWidth={3} />
    //                 ) : accomplished ? (
    //                   <Check size={20} strokeWidth={3} />
    //                 ) : (
    //                   index + 1
    //                 )}
    //               </div>
    //               <span
    //                 className={`mt-2 text-xs md:text-sm text-center font-medium w-24 ${
    //                   isCurrent ? "text-teal-700 font-bold" : "text-gray-700"
    //                 }`}
    //               >
    //                 {label}
    //               </span>
    //             </div>
    //           );
    //         }}
    //       </Step>
    //     ))}
    //   </ProgressBar>
    // </div>

    <div className="max-w-full mb-2 md:mt-8 lg:mt-0">
      <div className="md:px-9 md:p-0">
        <ProgressBar
          percent={percent}
          filledBackground={"linear-gradient(to right, #14b8a6, #0f766e)"}
          height={12}
        >
          {steps.map((label, index) => (
            <Step key={index}>
              {({ accomplished }) => {
                const isCurrent = statusMap[index] === selectedStatus;

                return (
                  <div
                    className="flex flex-col items-center mt-6 cursor-pointer"
                    onClick={() => {
                      const status = statusMap[index];
                      setSelectedStatus(status);
                      fetchProjectsByStatus(status);
                    }}
                  >
                    <div
                      className={`w-12 h-12 flex items-center justify-center rounded-full shadow-lg transform transition-all duration-300 ${
                        accomplished
                          ? "bg-teal-700 text-white shadow-xl"
                          : "bg-gray-300 text-gray-700"
                      } ${isCurrent ? "ring-4 ring-white scale-110" : ""}`}
                    >
                      {/* {accomplished ? (
                        <Check size={20} strokeWidth={3} />
                      ) : (
                        index + 1
                      )} */}
                      {statusIcons[statusMap[index]]}

                      {statusCounts[statusMap[index]] !== 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          {statusCounts[statusMap[index]] ?? 0}
                        </span>
                      )}
                    </div>
                    <span
                      className={`mt-2 text-xs md:text-sm text-center font-medium w-40 ${
                        isCurrent ? "text-teal-700 font-bold" : "text-gray-700"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                );
              }}
            </Step>
          ))}
        </ProgressBar>
      </div>

      {/* List Project */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-20">
        {emitenProjects.length !== 0 ? (
          emitenProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => router.push(`/sukuk/${project.id}`)}
              className="rounded-xl cursor-pointer overflow-hidden shadow border text-black"
            >
              <div className="relative h-40">
                <img
                  src={
                    project.medias.length !== 0
                      ? project.medias[0].path
                      : "/images/img.jpg"
                  }
                  alt={project.title}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = "/images/img.jpg";
                  }}
                />
              </div>
              <div className="p-4 bg-gray-100 h-full">
                <p className="font-semibold text-sm text-start mb-2">
                  {project.title}
                </p>
                <ul className="text-xs my-4 space-y-1">
                  <li className="flex justify-between font-bold">
                    <span>Dana Terkumpul</span>
                    <span>{project.goal}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Jenis Obligasi</span>
                    <span className="capitalize">{project.type_of_bond}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Nilai Nominal</span>
                    <span>
                      {formatPriceOrEmpty(
                        project.nominal_value,
                        "id-ID",
                        "IDR"
                      )}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span>Jangka Waktu</span>
                    <span>{project.time_periode}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Tingkat Bunga</span>
                    <span>{project.interest_rate}</span>
                  </li>
                </ul>
              </div>
            </div>
          ))
        ) : (
          <h6 className="text-black text-left w-full">Tidak ada data</h6>
        )}
      </div>
    </div>
  );
}
