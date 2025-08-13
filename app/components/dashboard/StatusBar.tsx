"use client";
import { ProgressBar, Step } from "react-step-progress-bar";
import "react-step-progress-bar/styles.css";
import { Check, TriangleAlert } from "lucide-react";

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

  return (
    // <div className="max-w-full mb-2 md:mt-8 lg:mt-0">
    //   <h2 className="font-bold text-lg text-black mb-5 -mt-9 md:mt-0 md:mb-8 text-center">
    //     Status Proyek Saya
    //   </h2>
    //   <ProgressBar
    //     percent={percentMap[projectStatus] ?? 0}
    //     // filledBackground="linear-gradient(to right, #4ade80, #22c55e)" //normal
    //     // filledBackground="linear-gradient(to right, #1b6d74, #0d464b)" //color
    //     filledBackground={
    //       projectStatus === "REJECTED" || projectStatus === "UNPAID"
    //         ? "linear-gradient(to right, #1b6d74, #f59e0b)" // hijau → oranye
    //         : "linear-gradient(to right, #1b6d74, #0d464b)" // hijau kebiruan
    //     }
    //   >
    //     {steps.map((label, index) => (
    //       <Step key={index}>
    //         {({ accomplished }) => {
    //           const isCurrentAccomplished = index < currentStep;
    //           const isWarning =
    //             (projectStatus === "REJECTED" && index === 1) ||
    //             (projectStatus === "UNPAID" && index === 2);
    //           return (
    //             <div className="flex flex-col items-center md:flex-col mt-6">
    //               <div
    //                 className={`w-10 h-10 flex items-center justify-center rounded-full ${
    //                   isWarning
    //                     ? "bg-yellow-500 text-black"
    //                     : accomplished
    //                     ? "bg-[#1b6d74] text-white"
    //                     : "bg-gray-300 text-gray-700"
    //                 }`}
    //               >
    //                 {isWarning ? (
    //                   <TriangleAlert size={18} strokeWidth={3} />
    //                 ) : accomplished ? (
    //                   <Check size={18} strokeWidth={3} />
    //                 ) : (
    //                   index + 1
    //                 )}
    //               </div>
    //               <span className="mt-1 md:mt-2 text-xs md:text-sm text-center text-black w-24">
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
      <h2 className="font-bold text-lg text-black mb-5 -mt-9 md:mt-0 md:mb-8 text-center">
        Status Proyek Saya
      </h2>
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
                <div className="flex flex-col items-center mt-6 transition-all duration-300">
                  <div
                    className={`w-12 h-12 flex items-center justify-center rounded-full shadow-lg transform transition-all duration-300 ${
                      isWarning
                        ? "bg-yellow-400 text-black animate-pulse ring-4 ring-yellow-200"
                        : accomplished
                        ? "bg-teal-700 text-white shadow-lg"
                        : "bg-gray-300 text-gray-700"
                    } ${
                      isCurrent && !isWarning
                        ? "ring-4 ring-teal-300 scale-110"
                        : ""
                    }`}
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
                    className={`mt-2 text-xs md:text-sm text-center font-medium w-24 ${
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
  );
}
