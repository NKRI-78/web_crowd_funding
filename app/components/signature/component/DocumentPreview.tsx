"use client";

import React from "react";

interface Props {
  fileId: string;
}

const DocumentPreview: React.FC<Props> = ({ fileId }) => {
  return (
    <div className="w-full aspect-[4/3]">
      <iframe
        src={`https://drive.google.com/file/d/${fileId}/preview`}
        className="w-full h-full border rounded"
        allow="autoplay"
      />
    </div>
  );
};

export default DocumentPreview;
