import ProgressBar from "@/app/(defaults)/sukuk/components/ProgressBar";
import { Project } from "@/app/interfaces/project/IProject";
import { formatRupiah } from "@/app/lib/utils";
import { useRouter } from "next/navigation";
import { FilledButton } from "../Button";

export const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
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

      <div className="px-4 pt-2 pb-4 bg-[#10565C] w-full h-full text-white">
        {/* jenis proyek */}
        <p className="text-white text-sm w-full flex mb-2">
          {project.type_of_project}
        </p>

        {/* title proyek */}
        <p className="font-semibold text-2xl md:text-lg text-start text-white mb-2">
          {project.title}
        </p>

        {/* progress bar */}
        <ProgressBar percentage={50} />

        {/* nilai penawaran */}
        <div className="w-full flex justify-between mt-3">
          <p className="text-white text-sm font-semibold">
            {formatRupiah(project?.capital)}
          </p>
          <p className="text-white/40 text-xs">10 Investor</p>
        </div>

        {/* sisa masa tayang */}
        <div className="w-full flex justify-end mb-3 mt-2">
          <p className="text-white text-xs font-semibold">{`Tersisa ${project.remaining_days} hari lagi`}</p>
        </div>

        {/* <div className="w-full flex justify-end">
          <FilledButton className="bg-white px-3 py-1 rounded-[6px] text-black">
            Investasi
          </FilledButton>
        </div> */}
      </div>
    </div>
  );
};
