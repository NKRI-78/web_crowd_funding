"use client";

import React, { useState } from "react";
import ContainerSignature from "./component/ContainerSignature";
import DocumentPreview from "./component/DocumentPreview";
import { PDFDocument } from "pdf-lib";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

interface FormData {
  signature: string;
}

const FormSignature: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({ signature: "" });

  const handleSignatureSave = (signatureUrl: string) => {
    setFormData((prev) => ({ ...prev, signature: signatureUrl }));
  };

  const handleSubmit = async () => {
    if (!formData.signature) {
      Swal.fire({
        title: "Tanda Tangan Wajib Diisi",
        text: "Silakan isi tanda tangan terlebih dahulu!",
        icon: "warning",
        timer: 2500,
      });
      return;
    }

    const pdfUrl =
      "/dummy_pdf/Formulir%20Perjanjian%20Fulusme%20layanan%20urun%20dana%20dengan%20Pemodal%20bersifat%20utang.pdf";
    const existingPdfBytes = await fetch(pdfUrl).then((res) =>
      res.arrayBuffer()
    );

    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const signatureRes = await fetch(formData.signature);
    const signatureBytes = await signatureRes.arrayBuffer();

    let signatureImage;
    try {
      signatureImage = await pdfDoc.embedPng(signatureBytes);
    } catch {
      signatureImage = await pdfDoc.embedJpg(signatureBytes);
    }

    const pages = pdfDoc.getPages();
    const lastPage = pages[pages.length - 1];

    const { width, height } = lastPage.getSize();
    const { width: sigW, height: sigH } = signatureImage.scale(0.1);

    lastPage.drawImage(signatureImage, {
      x: 65,
      y: 365,
      width: sigW,
      height: sigH,
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([new Uint8Array(pdfBytes)], {
      type: "application/pdf",
    });
    const url = URL.createObjectURL(blob);

    window.open(url, "_blank");

    localStorage.removeItem("signature");

    Swal.fire({
      title: "Berhasil!",
      text: "Tanda tangan berhasil ditempel ke dokumen.",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    }).then(() => {
      router.push("/dashboard");
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 pt-20">
      <h3 className="font-semibold text-gray-900 mt-3 text-lg">
        Form Tanda Tangan Pemodal
      </h3>

      <DocumentPreview fileUrl="/dummy_pdf/Formulir%20Perjanjian%20Fulusme%20layanan%20urun%20dana%20dengan%20Pemodal%20bersifat%20utang.pdf" />

      <ContainerSignature
        formData={formData}
        onSignatureSave={handleSignatureSave}
      />

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          className="px-4 py-2 rounded bg-[#3C2B90] text-white hover:bg-[#2e2176]"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default FormSignature;
