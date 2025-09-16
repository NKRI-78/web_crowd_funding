"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BACKEND } from "@/app/utils/constant";
import { getUser } from "@/app/lib/auth";
import Swal from "sweetalert2";
import DashboardPemodal from "./DashboardPemodal";
import DashboardUser from "./DashboardUser";
import { DashboardPenerbit } from "./DashboardPenerbit";
import { Project } from "@/app/interfaces/project/IProject";
import { User } from "@/app/interfaces/user/IUser";
import CircularProgressIndicator from "../CircularProgressIndicator";
import { InvestorData } from "@/app/interfaces/investor/IInvestorData";

export const Dashboard: React.FC = () => {
  const user = getUser();

  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState<User | null>(null);

  const [projects, setProjects] = useState<Project[]>([]);
  const [investorData, setInvestorData] = useState<InvestorData | null>(null);

  //* fetch data
  useEffect(() => {
    setLoading(true);

    if (user) {
      const fetchProfile = async () => {
        try {
          const res = await axios.get(`${API_BACKEND}/api/v1/profile`, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });

          const profileData = res.data.data;
          setProfile(profileData);
          setLoading(false);
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Gagal Mendapatkan Profil",
            text: "Terjadi kesalahan saat mengambil data profil Anda. Silakan coba lagi.",
            confirmButtonText: "Coba Lagi 🔄",
            allowOutsideClick: false,
          }).then((result) => {
            if (result.isConfirmed) {
              fetchProfile();
            }
          });
        }
      };
      fetchProfile();

      if (user?.role === "investor") {
        const fetchProjects = async () => {
          try {
            const res = await axios.get(`${API_BACKEND}/api/v1/project/list`, {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            });

            const projects = (res.data.data ?? []) as Project[];
            setProjects(projects);
          } catch (error) {
            setProjects([]);
          }
        };
        const fetchInvestorData = async () => {
          try {
            const res = await axios.get(
              `${API_BACKEND}/api/v1/dashboard/investor`,
              {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
              }
            );

            const data = res.data.data;
            setInvestorData(data);
          } catch (error) {
            setInvestorData(null);
          }
        };
        fetchProjects();
        fetchInvestorData();
      }
    }
  }, []);

  return (
    <div className="py-28 px-4 md:px-12">
      {loading ? (
        <div className="w-full h-[70vh] flex flex-col items-center justify-center">
          <CircularProgressIndicator textDescription="Memuat Halaman" />
        </div>
      ) : (
        <div>
          <h2 className="text-black text-2xl font-bold">Dashboard</h2>

          <div className="mt-6">
            {user?.role === "emiten" ? (
              <DashboardPenerbit profile={profile} />
            ) : user?.role === "investor" ? (
              <DashboardPemodal
                profile={profile}
                projects={projects}
                data={investorData}
              />
            ) : user?.role === "user" ? (
              <DashboardUser user={user} />
            ) : (
              <></>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
