import React from "react";
import { Metadata } from "next";

import { fetchDetailProject } from "../action/fetchDetailProject";
import { IDetailProjectData } from "../interface/IDetailProject";
import Sukuk from "@/app/components/sukuk/Sukuk";
import SukukClient from "./client";

interface Params {
  projectId: string;
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const detail: IDetailProjectData = await fetchDetailProject(params.projectId);

    const APP_DEFAULT_TITLE = detail.title;
    const APP_DESCRIPTION = detail.desc_job;

    return {
      title: APP_DEFAULT_TITLE,
      description: APP_DESCRIPTION,
      // metadataBase: new URL('/nonton/' + params.projectId + '/'),
      alternates: {
          canonical: '/',
          languages: {
              'en-US': '/en-US',
              'de-DE': '/de-DE',
          },
      },
      openGraph: {
          title: APP_DEFAULT_TITLE,
          description: APP_DESCRIPTION,
          images: [
              {
                  url: detail?.medias[0]?.path ?? "",
                  width: 800,
                  height: 600,
              },
          ],
          type: 'article',
          locale: 'en_US',
          url: params.projectId.toString(),
          siteName: "CAPTBRIDGE",
      },
  };
}

const SukukPage = ({ params }: { params: Params }) => {
  // if (!project) return <div>Project not found</div>;

  return <SukukClient id={params.projectId} />;
};

export default SukukPage;
