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
import { motion } from "framer-motion";

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

  const percentMap: Record<string, number> = {
    PENDING: (1 / (steps.length - 1)) * 100,
    APPROVED: ((currentStep + 1) / (steps.length - 1)) * 100,
    UNPAID: (currentStep / (steps.length - 1)) * 100,
    PAID: ((currentStep + 0.9) / (steps.length - 1)) * 100,
    PUBLISH: 100,
    REJECTED: (currentStep / (steps.length - 1)) * 100,
  };

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
    <div className="relative max-w-full mb-2 md:mt-8 lg:mt-0">
      <div className="md:px-9 md:p-0">
        <motion.div
          key={projectStatus} // supaya animasi rerun saat status berubah
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <ProgressBar
            percent={percentMap[projectStatus] ?? 0}
            filledBackground={
              projectStatus === "REJECTED" || projectStatus === "UNPAID"
                ? "linear-gradient(to right, #facc15, #f97316)" // kuning → oranye
                : "linear-gradient(to right, #14b8a6, #0f766e)" // toska → hijau kebiruan
            }
            height={12} // progress bar lebih tebal
          >
            {steps.map((label, index) => (
              <Step key={index}>
                {({ accomplished }) => {
                  const isCurrent = index === currentStep;
                  const isWarning =
                    (projectStatus === "REJECTED" && index === 1) ||
                    (projectStatus === "UNPAID" && index === 2);

                  return (
                    // <div className="flex flex-col items-center mt-6 transition-all duration-300">
                    //   <div
                    //     className={`w-12 h-12 flex items-center justify-center rounded-full shadow-lg transform transition-all duration-300 ${
                    //       isWarning
                    //         ? "bg-yellow-400 text-black animate-pulse ring-4 ring-yellow-200"
                    //         : accomplished
                    //         ? "bg-teal-700 text-white shadow-lg"
                    //         : "bg-gray-300 text-gray-700"
                    //     } ${
                    //       isCurrent && !isWarning
                    //         ? "ring-4 ring-white scale-110" //ring-teal-300
                    //         : ""
                    //     }`}
                    //   >
                    //     {isWarning ? (
                    //       <TriangleAlert size={20} strokeWidth={3} />
                    //     ) : accomplished ? (
                    //       <Check size={20} strokeWidth={3} />
                    //     ) : (
                    //       index + 1
                    //     )}
                    //   </div>
                    //   <span
                    //     className={`mt-2 text-xs md:text-sm text-center font-medium w-40 ${
                    //       isCurrent
                    //         ? "text-teal-700 font-bold"
                    //         : "text-gray-700"
                    //     }`}
                    //   >
                    //     {label}
                    //   </span>
                    // </div>

                    <motion.div
                      className="flex flex-col items-center mt-6"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{
                        scale: isCurrent ? 1.2 : 1,
                        opacity: 1,
                      }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                      <div
                        className={`w-12 h-12 flex items-center justify-center rounded-full shadow-lg transition-colors duration-300 ${
                          isCurrent && !isWarning
                            ? "ring-4 ring-white scale-110" //ring-teal-300
                            : ""
                        }
                ${
                  isWarning
                    ? "bg-yellow-400 text-black ring-4 ring-yellow-200"
                    : accomplished
                    ? "bg-teal-700 text-white"
                    : "bg-gray-300 text-gray-700"
                }
              `}
                      >
                        {isWarning ? (
                          <TriangleAlert size={20} strokeWidth={3} />
                        ) : accomplished ? (
                          <Check size={20} strokeWidth={3} />
                        ) : (
                          index + 1
                        )}
                      </div>
                      <span
                        className={`mt-2 text-xs md:text-sm text-center font-medium w-40 ${
                          isCurrent
                            ? "text-teal-700 font-bold"
                            : "text-gray-700"
                        }`}
                      >
                        {label}
                      </span>
                    </motion.div>
                  );
                }}
              </Step>
            ))}
          </ProgressBar>

          <div className="absolute -top-6 left-[18%] transform -translate-x-1/2">
            <span className="text-sm font-semibold text-gray-600">
              Menunggu Review
            </span>
          </div>

          <div className="absolute -top-6 left-[48%] transform -translate-x-1/2">
            <span className="text-sm font-semibold text-gray-600">
              Proyek Disetujui
            </span>
          </div>

          <div className="absolute -top-6 left-[81%] transform -translate-x-1/2">
            <span className="text-sm font-semibold text-gray-600">
              Analisa Proyek Valid
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
