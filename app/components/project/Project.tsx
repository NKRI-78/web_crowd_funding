import ProgressBar from "@/app/(defaults)/sukuk/components/ProgressBar";
import { IProjectData } from "@/app/interface/IProject";
import { formatPriceOrEmpty } from "@/app/lib/price";
import { useRouter } from "next/navigation";

export const ProjectCard: React.FC<{ project: IProjectData }> = ({
  project,
}) => {
  const router = useRouter();

  const isFinish = project.is_apbn ? "block" : "hidden";

  return (
    <div
      onClick={() => {
        router.push(`/sukuk/${project.id}`);
      }}
      className="rounded-xl cursor-pointer overflow-hidden shadow"
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
            target.onerror = null;
            target.src = "/images/img.jpg";
          }}
        />
        <div className="absolute inset-0 bg-opacity-60 bg-[#10565C]/40" />
      </div>

      <div className="p-4 bg-[#10565C] w-full h-full text-white">
        <p className="font-semibold text-2xl md:text-lg text-start mb-2 text-white">
          {project.title}
        </p>
        <p className="text-white/40 text-xs w-full flex">Nilai Penawaran</p>
        <div className="w-full flex justify-between">
          <p className="text-white text-sm font-semibold">Rp 1.000.000.000</p>
          <p className="text-white/40 text-xs">10 Investor</p>
        </div>
        <ProgressBar percentage={50} />
        <div className="w-full flex justify-between">
          <p className="text-white/40 text-xs ">Sisa Penawaran</p>
          <p className="text-white text-sm font-semibold">33%</p>
        </div>
        <div className="w-full flex justify-between">
          <p className="text-white text-sm font-semibold">Rp 6.660.000.000</p>
        </div>

        <div className="w-full flex justify-end">
          <button className="text-black text-sm font-semibold bg-white px-2 py-1 rounded-md hover:bg-white/80 transition">
            Investasi
          </button>
        </div>
      </div>
    </div>
  );
};
