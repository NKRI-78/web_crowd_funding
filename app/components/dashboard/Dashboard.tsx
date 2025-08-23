"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import CardStats from "../card-stats/CardStats";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import Cookies from "js-cookie";
import useRole from "@/app/hooks/useRole";
import { EmitenProjectModel } from "./PenerbitInterface";
import { ProjectCard } from "../project/Project";
import ProgressBar from "@/app/(defaults)/sukuk/components/ProgressBar";
import { formatPriceOrEmpty } from "@/app/lib/price";
import { useRouter } from "next/navigation";
import StepStatus from "./StatusBar";
import { API_BACKEND } from "@/app/utils/constant";
import { IProjectData } from "@/app/interface/IProject";
import { getAllProject } from "@/actions/GetAllProject";
import { FileClock } from "lucide-react";
import FormButton from "../inputFormPenerbit/_component/FormButton";
import { Stepper, Step } from "react-form-stepper";

ChartJS.register(ArcElement, Tooltip, Legend);

const data = {
  labels: ["Saham", "Obligasi"],
  datasets: [
    {
      data: [0, 100],
      backgroundColor: ["#2cd4d9", "#ffac33"],
      borderWidth: 0,
    },
  ],
};

const options = {
  cutout: "70%",
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          return `${context.label}: ${context.parsed}%`;
        },
      },
    },
  },
};

interface ProfileData {
  fullname: string;
  avatar: string;
  last_education: string;
  gender: string;
  status_marital: string;
  address_detail: string;
  occupation: string;
  selfie: string;
  position: string;
  verify_emiten: boolean;
  company: {
    projects: Project[];
  };
}

interface Project {
  id: number;
  name: string;
  status: string;
}

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [emitenProjects, setEmitenProjects] = useState<EmitenProjectModel[]>(
    []
  );
  const role = useRole();
  const userCookie = Cookies.get("user");
  const user = userCookie ? JSON.parse(userCookie) : null;
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [steps, setSteps] = useState<string[]>([]);
  const [projectStatus, setProjectStatus] = useState<string>("");
  const [project, seProject] = useState<IProjectData[]>([]);

  useEffect(() => {
    const fetchTopVideos = async () => {
      setIsLoading(true);
      const res = await getAllProject();
      seProject(res?.data ?? []);
      setIsLoading(false);
    };

    fetchTopVideos();
  }, []);

  useEffect(() => {
    try {
      if (user.token) {
        setToken(user.token);
      }
    } catch (err) {
      console.error("Failed to parse user cookie", err);
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    axios
      .get(`${API_BACKEND}/api/v1/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setProfile(res.data.data);
        console.log(
          "res.data.data.company.projects ? " + res.data.data.company.projects
        );
        if (res.data.data.company.projects) {
          setEmitenProjects(res.data["data"].company.projects);
        } else {
          setEmitenProjects([]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch profile", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [token]);

  // useEffect(() => {
  //   if (user.token) {
  //     axios
  //       .get(`${API_BACKEND}/api/v1/project-by-emiten/list`, {
  //         headers: {
  //           Authorization: `Bearer ${user.token}`,
  //         },
  //       })
  //       .then((res) => {
  //         setEmitenProjects(res.data["data"]);
  //       })
  //       .catch((err) => {
  //         console.error("Failed to fetch profile", err);
  //       })
  //       .finally(() => {
  //         setIsLoading(false);
  //       });
  //   }
  // }, [role, token]);

  console.log(emitenProjects, "emiten project");

  const statusSteps: Record<string, number> = {
    UNVERIFIED: 0,
    VERIFIED: 1,
    PENDING: 1,
    UNPAID: 2,
    PAID: 2,
    APPROVED: 2,
    REJECTED: 3,
    PUBLISH: 3,
  };

  const baseSteps = [
    "Data Diproses",
    "Review Proyek",
    "Pembayaran Administrasi",
    "Keputusan Proyek",
  ];

  // const statusLabels: Record<string, string> = {
  //   PENDING: "Data Diproses",
  //   APPROVED: "Review Project",
  //   REJECTED: "Ditolak",
  //   UNPAID: "Belum Dibayar",
  //   PAID: "Pembayaran Administrasi",
  //   PUBLISH: "Project Tayang",
  // };

  useEffect(() => {
    const statusProject = profile?.company?.projects
      ? profile?.company?.projects?.[0]?.status
      : profile?.verify_emiten
      ? "VERIFIED"
      : "UNVERIFIED";
    // const statusProject = "APPROVED" as string; //default progres bar
    setCurrentStep(statusSteps[statusProject]);

    // const stepsArray = Object.entries(statusSteps)
    //   .sort((a, b) => a[1] - b[1])
    //   .map(([status]) => statusLabels[status] ?? status);

    // setSteps(stepsArray);

    // if (statusProject) {
    //   const updatedSteps = [...baseSteps];

    //   if (statusProject === "REJECTED") {
    //     updatedSteps[1] = "Ditolak";
    //   } else if (statusProject === "APPROVED") {
    //     updatedSteps[1] = "Disetujui";
    //   }

    //   if (statusProject === "UNPAID") {
    //     updatedSteps[2] = "Belum Dibayar";
    //   } else if (statusProject === "PAID" || statusProject === "PUBLISH") {
    //     updatedSteps[2] = "Sudah Dibayar";
    //   }

    //   setSteps(updatedSteps);
    //   setCurrentStep(statusSteps[statusProject]);
    // }
  }, [profile]);

  return (
    <section className="py-28 px-4 md:px-12">
      {isLoading ? (
        <div className="flex items-center justify-center h-[60vh] md:mt-8">
          <div role="status">
            <svg
              aria-hidden="true"
              className="w-12 h-12 text-gray-200 animate-spin dark:text-gray-400 fill-[#10565C]"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <div>
            <h2 className="text-black text-2xl font-bold">Dashboard</h2>
          </div>
          <div className="flex flex-col gap-y-4 mt-4">
            {!profile?.company?.projects && (
              <div className="shadow-md rounded-2xl bg-white w-full p-10 md:py-12 flex flex-col items-center text-center">
                {!profile?.verify_emiten ? (
                  <div className="flex flex-col items-center max-w-md">
                    <div className="text-teal-700 mb-4">
                      <FileClock className="w-16 h-16" />
                    </div>
                    <h2 className="font-bold text-xl md:text-2xl text-black mb-2">
                      Akun Anda Sedang Direview
                    </h2>
                    <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                      Tim kami sedang memproses data akun Anda. Mohon tunggu
                      hingga selesai. Setelah itu, Anda dapat mulai mengajukan
                      proyek.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center max-w-md">
                    <h2 className="font-bold text-xl md:text-2xl text-black mb-2">
                      Akun Berhasil Diverifikasi
                    </h2>
                    <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-4">
                      Selamat! Akun Anda telah berhasil diverifikasi. Sekarang
                      Anda sudah bisa mulai membuat project pertama Anda.
                    </p>

                    <FormButton
                      onClick={() => {
                        router.push("dashboard/create-project");
                      }}
                    >
                      {" "}
                      Create Project{" "}
                    </FormButton>
                  </div>
                )}
              </div>
            )}

            {user.role === "emiten" && (
              <div className="shadow-md rounded-2xl bg-white w-full p-10 md:py-12">
                <h2 className="font-bold text-lg text-black mb-5 -mt-9 md:-mt-6 md:mb-4 text-start">
                  Status Proyek
                </h2>
                <div className="text-black">
                  <Stepper
                    activeStep={currentStep}
                    connectorStateColors
                    styleConfig={{
                      size: "40px", // diameter lingkaran step
                      circleFontSize: "16px", // font angka di dalam lingkaran
                      borderRadius: "50%", // bentuk lingkaran (bisa "0" buat kotak)
                      fontWeight: 500, // ketebalan label

                      activeBgColor: "#10B981",
                      activeTextColor: "#fff",
                      completedBgColor: "#10B981",
                      completedTextColor: "#fff",
                      inactiveBgColor: "#E5E7EB",
                      inactiveTextColor: "#9CA3AF",
                      labelFontSize: "14px",

                      // label colors
                      activeLabelColor: "#000",
                      completedLabelColor: "#000",
                      inactiveLabelColor: "#000",
                    }}
                    connectorStyleConfig={{
                      size: 3,
                      activeColor: "#10B981", // garis menuju step aktif
                      completedColor: "#10B981", // garis completed → hijau
                      disabledColor: "#E5E7EB", // garis belum jalan
                      style: "",
                    }}
                    steps={[
                      { label: "Data Diproses" },
                      { label: "Review Proyek" },
                      { label: "Pembayaran Administrasi" },
                      { label: "Persetujuan Project" },
                    ]}
                  />
                </div>
              </div>
            )}

            {user.role === "emiten" && emitenProjects.length > 0 && (
              <div>
                <div className="my-2">
                  <h2 className="font-bold text-lg text-black">Proyek Saya</h2>
                </div>

                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {emitenProjects.map((project) => {
                    return (
                      <div
                        key={project.id}
                        onClick={() => {
                          router.push(`/sukuk/${project.id}`);
                        }}
                        className="rounded-xl cursor-pointer overflow-hidden shadow border"
                      >
                        <div className="relative h-40">
                          <img
                            src={
                              project.medias && project.medias.length !== 0
                                ? project.medias[0].path
                                : "/images/img.jpg"
                            }
                            alt={project.title}
                            className="object-cover w-full h-full"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null; // mencegah infinite loop
                              target.src = "/images/img.jpg";
                            }}
                          />

                          <div className="absolute inset-0 bg-opacity-60" />
                        </div>

                        <div className="p-4 bg-gray-100 h-full">
                          <p className="font-semibold text-sm text-start mb-2">
                            {project.title}
                          </p>
                          <ul className="text-xs my-4 space-y-1">
                            <li className="flex justify-between font-bold">
                              <span className="text-black">Dana Terkumpul</span>
                              <span className="text-black">{project.goal}</span>
                            </li>
                            <li>
                              <ProgressBar percentage={0} />
                            </li>
                            <li className="flex justify-between">
                              <span className="text-black">Jenis Obligasi</span>
                              <span className="text-black capitalize">
                                {project.jenis_projek}
                              </span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-black">Nilai Nominal</span>
                              <span className="text-black">
                                {project.jumlah_minimal
                                  ? formatPriceOrEmpty(
                                      project.jumlah_minimal,
                                      "id-ID",
                                      "IDR"
                                    )
                                  : project.jumlah_minimal}
                              </span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-black">Jangka Waktu</span>
                              <span className="text-black">
                                {project.jangka_waktu}
                              </span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-black">Tingkat Bunga</span>
                              <span className="text-black">
                                {project.tingkat_bunga}
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {user.role === "investor" && (
              <div>
                <h3 className="text-start text-black text-2xl mb-4 mt-1 font-bold">
                  Proyek Sedang Berjalan
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {project.map((project: IProjectData, index) => (
                    <ProjectCard key={index} project={project} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default Dashboard;
