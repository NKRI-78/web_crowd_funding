"use client";

import clsx from "clsx";

import {
  LayoutDashboard,
  Briefcase,
  LineChart,
  LogOut,
  ChartPie,
  ArrowLeftRight,
} from "lucide-react";

import React, { useEffect, useState } from "react";
import DashboardSidebar from "./DashboardSidebar";
import { getUser } from "@/app/lib/auth";
import { User } from "@/app/interfaces/user/IUser";
import axios from "axios";
import { API_BACKEND } from "@/app/utils/constant";
import Swal from "sweetalert2";
import { DashboardMenu } from "./IDashboardMenu";
import { DashboardContent } from "./DashboardContent";
import { InvestorData } from "@/app/interfaces/investor/IInvestorData";
import { Project } from "@/app/interfaces/project/IProject";
import DashboardPortfolio from "./DashboardPortfolio";
import DashboardTransaction from "./DashboardTransaction";
import DashboardExploreProject from "./DashboardExploreProject";
import CircularProgressIndicator from "../CircularProgressIndicator";
import Center from "../Center";

const pemodalMenuItems: DashboardMenu[] = [
  { title: "Dashboard", icon: LayoutDashboard },
  { title: "Portfolio", icon: ChartPie },
  { title: "Transaksi", icon: ArrowLeftRight },
  { title: "Semua Proyek", icon: Briefcase },
  { title: "Logout", icon: LogOut },
];

export default function DashboardLayout() {
  const user = getUser();

  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedMenuIndex, setSelectedMenuIndex] = useState<number>(0);

  const [loading, setLoading] = useState(true);
  const [clientRole, setClientRole] = useState<string | null>(null);
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

  //* set client role
  useEffect(() => {
    if (user) {
      setClientRole(user.role === "emiten" ? "Penerbit" : "Pemodal");
    } else {
      setClientRole("Dashboard");
    }
  }, [user]);

  //* render content
  const renderContent = (): React.ReactNode => {
    switch (selectedMenuIndex) {
      case 0:
        return (
          <DashboardContent
            userAuthData={user}
            investorData={investorData}
            userProfile={profile}
            projects={projects}
          />
        );
      case 1:
        return <DashboardPortfolio investorData={investorData} />;
      case 2:
        return <DashboardTransaction />;
      case 3:
        return <DashboardExploreProject projects={projects} />;
      default:
        return (
          <DashboardContent
            userAuthData={user}
            investorData={investorData}
            userProfile={profile}
            projects={projects}
          />
        );
    }
  };

  return (
    <div className="flex">
      {/* SIDE BAR */}
      <DashboardSidebar
        headerTitle={clientRole ?? "Dashboard"}
        menuItems={pemodalMenuItems}
        expand={isExpanded}
        toggleExpand={(expand) => {
          setIsExpanded(expand);
        }}
        setActive={(currentIndex) => currentIndex === selectedMenuIndex}
        menuOnChanged={(currentIndex) => {
          setSelectedMenuIndex(currentIndex);
        }}
        className={`pt-28`}
      />

      {/* ISI KONTEN */}
      <div
        className={clsx(
          "min-h-screen w-full px-4 pt-28 transition-all duration-300",
          isExpanded ? "md:ml-60" : "md:ml-20"
        )}
      >
        {loading ? (
          <Center fullParent horizontal vertical>
            <CircularProgressIndicator />
          </Center>
        ) : (
          renderContent()
        )}
      </div>
    </div>
  );
}
