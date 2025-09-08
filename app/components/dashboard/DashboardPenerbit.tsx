import React, { useEffect, useState } from "react";
import { Building, UserSearch } from "lucide-react";
import { Stepper } from "react-form-stepper";
import { PanelContent } from "./PanelContent";
import { PanelContainer } from "./PanelContainer";
import { ProjectCard } from "./PenerbitProjectCard";
import { User } from "@/app/interfaces/user/IUser";
import GridView from "../GridView";

interface Props {
  profile: User | null;
}

export const DashboardPenerbit: React.FC<Props> = ({ profile }) => {
  const projects = profile?.company.projects ?? [];

  const [currentStep, setCurrentStep] = useState(0);

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

  //* set timeline project by status
  useEffect(() => {
    const statusProject = profile?.company?.projects
      ? profile?.company?.projects?.[0]?.status
      : profile?.verify_emiten
      ? "VERIFIED"
      : "UNVERIFIED";

    setCurrentStep(statusSteps[statusProject]);
  }, [profile]);

  return (
    <div className="space-y-4">
      {!profile?.company?.projects && (
        <PanelContainer clasName="flex flex-col items-center text-center">
          {
            // cek apakah user telah register company
            // dengan mengecek apakah properti nama perusahaan sudah ada valuenya apa belum
            profile?.company.name ? (
              // ketika emiten sudah berhasil ter-verifikasi
              profile?.verify_emiten ? (
                <PanelContent
                  title="Akun Berhasil Diverifikasi"
                  message="Selamat! Akun Anda telah berhasil diverifikasi. Sekarang Anda sudah bisa mulai membuat project pertama Anda."
                  buttonTitle="Buat Proyek"
                  actionButton={() => {}}
                />
              ) : (
                <PanelContent
                  icon={<UserSearch className="w-16 h-16" />}
                  title="Akun Anda Sedang Direview"
                  message="Tim kami sedang memproses data akun Anda. Mohon tunggu hingga selesai. Setelah itu, Anda dapat mulai mengajukan proyek."
                />
              )
            ) : (
              <PanelContent
                icon={<Building className="w-16 h-16" />}
                title="Lengkapi Data Perusahaan Anda"
                message="Untuk menayangkan proyek, Anda perlu menyelesaikan proses registrasi data perusahaan terlebih dahulu. Silakan lengkapi segera untuk melanjutkan."
                buttonTitle="Registrasi Perusahaan"
                actionButton={() => {}}
              />
            )
          }
        </PanelContainer>
      )}

      <PanelContainer>
        <h2 className="font-bold text-lg text-black">Status Proyek</h2>

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
      </PanelContainer>

      {profile!.company.projects?.length > 0 && (
        <PanelContainer>
          <h2 className="font-bold text-lg text-black mb-5">Proyek Saya</h2>

          {projects && (
            <GridView
              items={projects}
              gapClass="gap-4"
              breakpointCols={{ sm: 1, md: 2, lg: 4 }}
              itemKey={(p) => p.id}
              renderItem={(p, i) => {
                return <ProjectCard project={p} />;
              }}
            />
          )}
        </PanelContainer>
      )}
    </div>
  );
};
