import React, { useEffect, useState } from "react";
import { Building, UserSearch } from "lucide-react";
import FormButton from "../inputFormPemodalPerusahaan/component/FormButton";
import { Stepper } from "react-form-stepper";
import { Project, ProjectStatus, UserProfile } from "./IUserProfile";

interface Props {
  profile: UserProfile | null;
}

export const DashboardPenerbit: React.FC<Props> = ({ profile }) => {
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
        <Container clasName="flex flex-col items-center text-center">
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
        </Container>
      )}

      <Container>
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
      </Container>

      {profile!.company.projects?.length > 0 && (
        <Container>
          <h2 className="font-bold text-lg text-black mb-5">Proyek Saya</h2>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {profile?.company.projects.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </div>
        </Container>
      )}
    </div>
  );
};

//* container
const Container: React.FC<{
  children?: React.ReactNode;
  clasName?: string;
}> = ({ children, clasName }) => {
  return (
    <div className="w-full bg-white shadow-md rounded-2xl p-8">
      <div className={clasName}>{children}</div>
    </div>
  );
};

//* panel content
const PanelContent: React.FC<{
  title: string;
  message: string;
  icon?: React.ReactNode;
  buttonTitle?: string;
  actionButton?: () => void;
}> = ({ title, message, icon, buttonTitle, actionButton }) => {
  return (
    <div className="flex flex-col items-center max-w-md">
      {icon && <div className="text-teal-700 mb-4">{icon}</div>}
      <h2 className="font-bold text-xl md:text-2xl text-black mb-2">{title}</h2>
      <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-4">
        {message}
      </p>

      {buttonTitle && (
        <FormButton onClick={actionButton}>{buttonTitle}</FormButton>
      )}
    </div>
  );
};

//* project card
const ProjectCard: React.FC<Project> = ({
  media,
  title,
  deskripsi,
  status,
}) => {
  return (
    <div className="cursor-pointer transition-all duration-200 active:scale-[0.99] active:shadow-lg">
      <div className="rounded-xl overflow-hidden shadow border">
        <div className="relative h-40">
          <img
            src={
              media && media.length !== 0 ? media[0].path : "/images/img.jpg"
            }
            alt={title}
            className="object-cover w-full h-full"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null; // mencegah infinite loop
              target.src = "/images/img.jpg";
            }}
          />

          <div className="absolute inset-0 bg-[#10565C]/40" />

          {status === "PUBLISH" ? (
            <StatusContainer title="Sedang Tayang" bgColor="bg-red-500" />
          ) : (
            <StatusContainer title="Sedang Direview" bgColor="bg-gray-700" />
          )}
        </div>

        <div className="p-4 bg-[#10565C]  h-full">
          <p className="font-semibold text-white text-sm text-start mb-2">
            {title}
          </p>
          <p className="text-white text-xs text-start line-clamp-5">
            {deskripsi}
          </p>
        </div>
      </div>
    </div>
  );
};

//* status container
const StatusContainer: React.FC<{ title: string; bgColor: string }> = ({
  title,
  bgColor,
}) => {
  return (
    <div className={`absolute top-2 right-2 ${bgColor} rounded-md py-1 px-2`}>
      <p className="text-white text-sm"> {title} </p>
    </div>
  );
};
