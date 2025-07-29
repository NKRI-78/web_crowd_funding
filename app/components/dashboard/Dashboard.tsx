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
  }, [token]);

  useEffect(() => {
    if (role === 2 && user.token) {
      axios
        .get(
          "https://api-capbridge.langitdigital78.com/api/v1/project-by-emiten/list",
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        )
        .then((res) => {
          console.log(res.data["data"]);
          setEmitenProjects(res.data["data"]);
        })
        .catch((err) => {
          console.error("Failed to fetch profile", err);
        });
    }
  }, [role, token]);

  return (
    <section className="py-28 px-4 md:px-12">
      <div>
        <h2 className="text-black text-2xl font-bold">Dashboard</h2>
      </div>
      <div className="flex flex-col gap-y-4 mt-4">
        {/* Profile Card */}
        {profile && (
          <div className="shadow-md rounded-2xl p-6 bg-white flex gap-6 items-center w-full md:w-1/2">
            <img
              src={
                profile.avatar !== "-"
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
                {profile.occupation}
              </p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm text-slate-600">
                <div>
                  <strong>Pendidikan :</strong> {profile.last_education}
                </div>
                <div>
                  <strong>Status :</strong> {profile.status_marital}
                </div>
                <div>
                  <strong>Jenis Kelamin :</strong>{" "}
                  {profile.gender === "L"
                    ? "Laki-laki"
                    : profile.gender === "P"
                    ? "Perempuan"
                    : "-"}
                </div>
                <div>
                  <strong>Alamat :</strong> {profile.address_detail}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* {role === "2" && ( */}
        <>
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

                      <div className={`absolute inset-0  bg-opacity-60`} />
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
                            {project.type_of_bond}
                          </span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-black">Nilai Nominal</span>
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
                          <span className="text-black">Tingkat Bunga</span>
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
              <h6 className="text-black text-left w-full">Tidak ada data</h6>
            )}
          </div>
        </>
        {/* )} */}

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
    </section>
  );
};

export default Dashboard;
