"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BACKEND } from "@/app/utils/constant";
import { getUser } from "@/app/lib/auth";
import Swal from "sweetalert2";
import DashboardPemodal from "./pemodal/DashboardPemodal";
import DashboardUser from "./DashboardUser";
import { DashboardPenerbit } from "./penerbit/DashboardPenerbit";
import { Project } from "@/app/interfaces/project/IProject";
import { User } from "@/app/interfaces/user/IUser";
import CircularProgressIndicator from "../CircularProgressIndicator";
import { InvestorData } from "@/app/interfaces/investor/IInvestorData";
import DashboardUndefinedRole from "./UndefinedRole";
import Center from "../Center";
import { AnimatedWrapper } from "../AnimatedWrapper";
import { InboxResponse } from "../notif/inbox-interface";

export const DashboardView: React.FC = () => {
  const user = getUser();

  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState<User | null>(null);

  const [projects, setProjects] = useState<Project[]>([]);
  const [investorData, setInvestorData] = useState<InvestorData | null>(null);

  const [hasPaidAdministration, setHasPaidAdministration] = useState(false);

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

      if (user?.role === "emiten") {
        const fetchInbox = async () => {
          try {
            const res = await axios(`${API_BACKEND}/api/v1/inbox/list`, {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            });
            const inboxes = res.data.data as InboxResponse[];
            const hasPaid = inboxes.some((data) => data.type === "transaction");
            setHasPaidAdministration(hasPaid);
          } catch (e) {
            setHasPaidAdministration(false);
          }
        };
        fetchInbox();
      }

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
    setLoading(false);
  }, []);

  return (
    <div>
      {loading ? (
        <Center vertical horizontal className="h-screen">
          <CircularProgressIndicator textDescription="Memuat Halaman" />
        </Center>
      ) : (
        <AnimatedWrapper>
          {user?.role === "emiten" ? (
            <DashboardPenerbit
              profile={profile}
              hasPaidAdministration={hasPaidAdministration}
            />
          ) : user?.role === "investor" ? (
            <DashboardPemodal profile={profile} data={investorData} />
          ) : user?.role === "user" ? (
            <DashboardUser user={user} />
          ) : (
            <DashboardUndefinedRole />
          )}
        </AnimatedWrapper>
      )}
    </div>
  );
};
