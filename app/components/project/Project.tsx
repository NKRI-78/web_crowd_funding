import { IProjectData } from "@/app/interface/IProject";
import { formatPriceOrEmpty, priceLib } from "@/app/lib/price";
import { useRouter } from "next/navigation";

export const ProjectCard: React.FC<{ project: IProjectData }> = ({
  project,
}) => {
  const router = useRouter();

  const bgColor = project.is_approved
    ? "bg-purple-900 text-purple-800"
    : "bg-green-700 text-green-700";
  const isFinish = project.is_apbn ? "block" : "hidden";

  return (
    <div
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
        {/* <div
          className={`absolute inset-0 ${
            project.is_apbn ? "bg-purple-900" : "bg-green-700"
          } bg-opacity-60`}
        /> */}
        <div className={`absolute inset-0  bg-opacity-60`} />
        {/* <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <span
            className={`bg-white ${bgColor} text-xs font-bold px-4 py-1 rounded-full shadow`}
          >
            {project.goal}
          </span>
        </div> */}
      </div>
      <div className="p-4 bg-gray-100 h-full">
        <p className="font-semibold text-sm text-start mb-2">{project.title}</p>
        <ul className="text-xs my-4 space-y-1">
          <li className="flex justify-between font-bold">
            <span>Dana Terkumpul</span>
            <span>{project.goal}</span>
          </li>
          <li className={isFinish}>
            <div className="relative w-[80%] h-4 bg-purple-200 rounded-full my-2">
              <div
                className="absolute top-0 left-0 h-4 bg-[#3E268D] rounded-full"
                style={{ width: "80%" }}
              ></div>
              <span className="absolute right-[-4px] top-1/2 -translate-y-1/2 translate-x-full bg-green-500 text-white text-xs font-bold px-2 rounded-full shadow">
                80%
              </span>
            </div>
          </li>
          <li className="flex justify-between">
            <span>Kebutuhan Modal</span>
            <span>
              {formatPriceOrEmpty(
                (project?.nominal_value ?? 0).toString() ?? "",
                "id-ID",
                "IDR"
              )}
            </span>
          </li>
          <li className="flex justify-between">
            <span>Minimal Investasi</span>
            <span>{formatPriceOrEmpty(1000000, "id-ID", "IDR")}</span>
          </li>
          <li className="flex justify-between">
            <span>Jangka Waktu</span>
            <span>{project.time_periode}</span>
          </li>
          <li className="flex justify-between">
            <span>Proyeksi ROI</span>
            <span>18% p.a</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
