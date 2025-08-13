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
      })
      .catch((err) => {
        console.error("Failed to fetch profile", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [token]);

  useEffect(() => {
    if (user.token) {
      axios
        .get(`${API_BACKEND}/api/v1/project-by-emiten/list`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          setEmitenProjects(res.data["data"]);
        })
        .catch((err) => {
          console.error("Failed to fetch profile", err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [role, token]);

  const statusSteps: Record<string, number> = {
    PENDING: 0,
    APPROVED: 1,
    REJECTED: 1,
    UNPAID: 2,
    PAID: 2,
    PUBLISH: 3,
  };

  const baseSteps = ["Diproses", "Disetujui", "Pembayaran", "Dipublish"];

  useEffect(() => {
    const statusProject = profile?.company?.projects?.[0]?.status;
    // const statusProject = "PUBLISH" as string;
    setProjectStatus(statusProject as string);

    if (statusProject) {
      let updatedSteps = [...baseSteps];

      if (statusProject === "REJECTED") {
        updatedSteps[1] = "Ditolak";
      } else if (statusProject === "APPROVED") {
        updatedSteps[1] = "Disetujui";
      }

      if (statusProject === "UNPAID") {
        updatedSteps[2] = "Belum Dibayar";
      } else if (statusProject === "PAID" || statusProject === "PUBLISH") {
        updatedSteps[2] = "Sudah Dibayar";
      }

      setSteps(updatedSteps);
      setCurrentStep(statusSteps[statusProject]);
    }
    // setSteps(baseSteps);
    // setCurrentStep(2);
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
            <div
              className={`grid grid-cols-1 ${
                user.role === "emiten"
                  ? "md:grid-cols-2"
                  : "md:grid-cols-1 lg:grid-cols-2"
              } gap-5`}
            >
              {/* Profile Card */}
              {profile && (
                <div className="shadow-md rounded-2xl p-6 bg-white flex flex-col md:flex-row gap-6 items-center w-full">
                  <img
                    src={
                      user.role === "emiten"
                        ? profile.selfie || "/images/default-image.png" // jika emiten, pakai selfie
                        : profile.avatar !== "-"
                        ? profile.avatar
                        : "/images/default-image.png"
                    }
                    alt="Avatar"
                    className="w-24 h-24 rounded-full object-cover border-2 border-slate-200"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">
                      {profile.fullname}
                    </h3>
                    <p className="text-slate-500 text-sm mt-1">
                      {user.role === "emiten"
                        ? profile.position
                        : profile.occupation}
                    </p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-slate-600">
                      <div className="text-xs md:text-sm">
                        <span className="font-bold">Pendidikan :</span>{" "}
                        {profile.last_education}
                      </div>
                      <div className="text-xs md:text-sm">
                        <span className="font-bold">Status :</span>{" "}
                        {profile.status_marital}
                      </div>
                      <div className="text-xs md:text-sm">
                        <span className="font-bold">Jenis Kelamin :</span>{" "}
                        {profile.gender === "L"
                          ? "Laki-laki"
                          : profile.gender === "P"
                          ? "Perempuan"
                          : "-"}
                      </div>
                      <div className="text-xs md:text-sm">
                        <span className="font-bold">Alamat :</span>{" "}
                        {profile.address_detail}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {user.role === "emiten" && (
                <div className="shadow-md rounded-2xl p-10 md:px-3 md:py-4 bg-white w-full">
                  <div className="md:px-9">
                    <StepStatus
                      currentStep={currentStep}
                      steps={steps}
                      projectStatus={projectStatus}
                    />
                  </div>
                </div>
              )}
            </div>

            {user.role === "emiten" && (
              <>
                {/* <div className="my-2">
                  <h2 className="font-bold text-lg text-black">
                    Status Proyek Saya
                  </h2>
                  <div className="shadow-md rounded-2xl p-10 bg-white w-full md:w-1/2 mt-2">
                    <StepStatus currentStep={currentStep} steps={steps} />
                  </div>
                </div> */}

                <div className="my-2">
                  <h2 className="font-bold text-lg text-black">Proyek Saya</h2>
                </div>

                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {emitenProjects.length !== 0 ? (
                    emitenProjects.map((project) => {
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
                                project.medias.length !== 0
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

                            <div
                              className={`absolute inset-0  bg-opacity-60`}
                            />
                          </div>
                          <div className="p-4 bg-gray-100 h-full">
                            <p className="font-semibold text-sm text-start mb-2">
                              {project.title}
                            </p>
                            <ul className="text-xs my-4 space-y-1">
                              <li className="flex justify-between font-bold">
                                <span className="text-black">
                                  Dana Terkumpul
                                </span>
                                <span className="text-black">
                                  {project.goal}
                                </span>
                              </li>
                              <li>
                                <ProgressBar percentage={0} />
                              </li>
                              <li className="flex justify-between">
                                <span className="text-black">
                                  Jenis Obligasi
                                </span>
                                <span className="text-black capitalize">
                                  {project.type_of_bond}
                                </span>
                              </li>
                              <li className="flex justify-between">
                                <span className="text-black">
                                  Nilai Nominal
                                </span>
                                <span className="text-black">
                                  {formatPriceOrEmpty(
                                    project.nominal_value,
                                    "id-ID",
                                    "IDR"
                                  )}
                                </span>
                              </li>
                              <li className="flex justify-between">
                                <span className="text-black">Jangka Waktu</span>
                                <span className="text-black">
                                  {project.time_periode}
                                </span>
                              </li>
                              <li className="flex justify-between">
                                <span className="text-black">
                                  Tingkat Bunga
                                </span>
                                <span className="text-black">
                                  {project.interest_rate}
                                </span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <h6 className="text-black text-left w-full">
                      Tidak ada data
                    </h6>
                  )}
                </div>
              </>
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

            {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <CardStats
            title="Cash In-hand"
            desc="Dana yang tersedia untuk ditarik atau di investasikan"
          />
          <CardStats
            title="Dana Reward"
            desc="Dana promosi yang hanya dapat diinvestasikan"
          />
          <CardStats
            title="Dana Interim"
            desc="Dana hasil dividen interim atau komisi referral"
          />
          <CardStats
            title="Dana Dapat Diinvestasikan"
            desc="Cash In-hand + Dana Reward + Dana Interim"
          />
        </div>

        <div className="flex gap-x-4">
          <div className="shadow-lg p-6 basis-6/12 h-fit bg-white rounded-2xl">
            <h6 className="text-slate-600 font-semibold mb-6">
              Alokasi pembelian berdasarkan efek
            </h6>
            <div style={{ width: 350, height: 300, margin: "0 auto" }}>
              <Doughnut data={data} options={options} />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                marginTop: 20,
              }}
            >
              <div style={{ textAlign: "center" }}>
                <strong className="text-slate-600">Saham</strong>
                <br />
                <div
                  style={{
                    height: 5,
                    width: 30,
                    backgroundColor: "#2cd4d9",
                    margin: "4px auto",
                  }}
                ></div>
                <span style={{ color: "#a0aec0" }}>0.00%</span>
              </div>
              <div style={{ textAlign: "center" }}>
                <strong className="text-slate-600">Obligasi</strong>
                <br />
                <div
                  style={{
                    height: 5,
                    width: 30,
                    backgroundColor: "#ffac33",
                    margin: "4px auto",
                  }}
                ></div>
                <span style={{ color: "#a0aec0" }}>100.00%</span>
              </div>
            </div>
          </div>
        </div> */}
          </div>
        </>
      )}
    </section>
  );
};

export default Dashboard;
