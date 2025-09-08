import { Project } from "@/app/interfaces/project/IProject";
import FormButton from "../inputFormPenerbit/_component/FormButton";
import { FilledButton, OutlinedButton } from "../Button";

//* project card
export const ProjectCard: React.FC<{
  project: Project;
}> = ({ project }) => {
  const medias = project.medias ?? project.media;

  return (
    <div className="rounded-xl overflow-hidden shadow border bg-[#10565C]">
      <div className="relative h-40">
        <img
          src={
            medias && medias.length !== 0 ? medias[0].path : "/images/img.jpg"
          }
          alt={project.title}
          className="object-cover w-full h-full"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null; // mencegah infinite loop
            target.src = "/images/img.jpg";
          }}
        />

        <div className="absolute inset-0 bg-[#10565C]/40" />

        {project.status === "PUBLISH" ? (
          <StatusContainer title="Sedang Tayang" bgColor="bg-red-500" />
        ) : (
          <StatusContainer title="Sedang Direview" bgColor="bg-gray-700" />
        )}
      </div>

      <div className="p-4  h-full">
        <p className="font-semibold text-white text-sm text-start mb-2">
          {project.title}
        </p>
        <p className="text-white text-xs text-start line-clamp-5">
          {project.desc_job ?? project.deskripsi}
        </p>
      </div>

      <div className="w-full flex justify-end pr-4 pb-4">
        <FilledButton className="bg-white px-3 py-1 rounded-[6px] text-black text-sm">
          Lihat Detail
        </FilledButton>
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
