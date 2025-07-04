"use client";

import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { API_BACKEND } from "@/app/utils/constant";
import { useEffect } from "react";
import ImageUploading, {
  ImageListType,
  ImageType,
} from "react-images-uploading";
import { Plus } from "lucide-react";

interface RoleModalProps {
  open: boolean;
  onClose: () => void;
}

const schema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  placeOfBirth: z.string(),
  gender: z.string(),
  maritalStatus: z.string(),
  companyName: z.string(),
  companyAddress: z.string(),
  monthlyIncome: z.string(),
  position: z.string(),
  lastEducation: z.string(),
  work: z.string(),
  noTelp: z.string(),
  accountOwner: z.string(),
  bankBranch: z.string(),
  address: z.string(),
  email: z.string(),
  tep: z.string(),
  npwp: z.string(),
  deedOfIncorp: z.string(),
  numberOfEmploye: z.string(),
  capitalStruktur: z.string(),
  financialStatements: z.string(),
  nameDirection: z.string(),
  nameCommissioner: z.string(),
  noKtp: z.string(),
  nameBank: z.string(),
  noRekening: z.string(),
  experience: z.string(),
  risk: z.string(),
  dokumen1: z.any(),
  dokumen2: z.any(),
  dokumen3: z.any(),
  dokumen4: z.any(),
  password: z.any(),
});

type FormValues = {
  name: string;
  placeOfBirth: string;
  gender: string;
  maritalStatus: string;
  companyName: string;
  companyAddress: string;
  monthlyIncome: string;
  position: string;
  lastEducation: string;
  work: string;
  noTelp: string;
  accountOwner: string;
  bankBranch: string;
  address: string;
  email: string;
  tep: string;
  npwp: string;
  deedOfIncorp: string;
  numberOfEmploye: string;
  capitalStruktur: string;
  financialStatements: string;
  nameDirection: string;
  nameCommissioner: string;
  noKtp: string;
  nameBank: string;
  noRekening: string;
  experience: string;
  risk: string;
  dokumen1: any;
  dokumen2: any;
  dokumen3: any;
  dokumen4: any;
  password: string;
};

const schemaPenerbit = z.object({
  dataCompany: z
    .string()
    .nonempty({ message: "Tanggal berdiri perusahaan wajib diisi" }),
  nameCompany: z.string().nonempty({ message: "Nama perusahaan wajib diisi" }),
  numberInduk: z
    .string()
    .nonempty({ message: "Nomor induk perusahaan wajib diisi" }),
  aktaCompany: z
    .string()
    .nonempty({ message: "Nomor akta perusahaan wajib diisi" }),
  aktaLast: z
    .string()
    .nonempty({ message: "Akta Perubahan terakhir wajib diisi" }),
  kumham: z
    .string()
    .nonempty({ message: "Nomor pengesahan KUMHAM wajib diisi" }),
  addresCompany: z
    .string()
    .nonempty({ message: "Alamat perusahaan wajib diisi" }),
  npwpCompany: z.string().nonempty({ message: "NPWP perusahaan wajib diisi" }),
  countEmployee: z
    .string()
    .nonempty({ message: "Jumlah karyawan wajib diisi" }),
  capitalStructure: z
    .string()
    .nonempty({ message: "Struktur permodalan wajib diisi" }),
  reportFinancial: z
    .string()
    .nonempty({ message: "Laporan keuangan wajib diisi" }),
  nameKomisaris: z.string().nonempty({ message: "Nama komisaris wajib diisi" }),
  jobPositionKomisaris: z
    .string()
    .nonempty({ message: "Jabatan komisaris wajib diisi" }),
  ktpKomisaris: z.string().nonempty({ message: "KTP komisaris wajib diisi" }),
  NpwpKomisaris: z.string().nonempty({ message: "NPWP komisaris wajib diisi" }),
  nameDireksi: z.string().nonempty({ message: "Nama direksi wajib diisi" }),
  jobPositionDireksi: z
    .string()
    .nonempty({ message: "Jabatan direksi wajib diisi" }),
  ktpDireksi: z.string().nonempty({ message: "KTP direksi wajib diisi" }),
  NpwpDireksi: z.string().nonempty({ message: "NPWP direksi wajib diisi" }),
  typeObligasi: z.string().nonempty({ message: "Jenis obligasi wajib diisi" }),
  nominalObligasi: z
    .string()
    .nonempty({ message: "Nominal obligasi wajib diisi" }),
  timePriodObligasi: z
    .string()
    .nonempty({ message: "Jangka waktu obligasi wajib diisi" }),
  interestRateObligasi: z
    .string()
    .nonempty({ message: "Tingkat bunga obligasi wajib diisi" }),
  interestPaymentObligasi: z
    .string()
    .nonempty({ message: "Pembayaran bunga wajib diisi" }),
  interestPokokObligasi: z
    .string()
    .nonempty({ message: "Pelunasan pokok obligasi wajib diisi" }),
  useDana: z.string().nonempty({ message: "Penggunaan dana wajib diisi" }),
  guaranteeKolateral: z
    .string()
    .nonempty({ message: "Jaminan/kolateral wajib diisi" }),
  description: z
    .string()
    .nonempty({ message: "Deskripsi penerbit wajib diisi" }),
  funded: z.string().nonempty({ message: "Sumber pendanaan wajib diisi" }),
  name: z.string().nonempty({ message: "Nama penerbit wajib diisi" }),
  email: z.string().nonempty({ message: "Email penerbit wajib diisi" }),
  phone: z.string().nonempty({ message: "Nomor Telepon penerbit wajib diisi" }),
  password: z.string().nonempty({ message: "Password wajib diisi" }),
  title: z.string().nonempty({ message: "Judul proyek wajib diisi" }),
  proposal: z.any().refine((file: FileList) => file?.length > 0, {
    message: "Proposal wajib diunggah",
  }),
});

type FormValuesPenerbit = {
  dataCompany: string;
  nameCompany: string;
  numberInduk: string;
  aktaCompany: string;
  kumham: string;
  addresCompany: string;
  npwpCompany: string;
  countEmployee: string;
  capitalStructure: string;
  reportFinancial: string;
  nameKomisaris: string;
  jobPositionKomisaris: string;
  ktpKomisaris: string;
  NpwpKomisaris: string;
  nameDireksi: string;
  jobPositionDireksi: string;
  ktpDireksi: string;
  NpwpDireksi: string;
  typeObligasi: string;
  nominalObligasi: string;
  timePriodObligasi: string;
  interestRateObligasi: string;
  interestPaymentObligasi: string;
  interestPokokObligasi: string;
  useDana: string;
  guaranteeKolateral: string;
  description: string;
  funded: string;
  aktaLast: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  title: string;
  proposal?: string;
};

const RoleModal: React.FC<RoleModalProps> = ({ open, onClose }) => {
  const [workDesc, setWorkDesc] = useState("");
  const [step, setStep] = useState<"select" | "penerbit" | "pemodal">("select");
  const [linkKtp, setLinkKtp] = useState("");
  const [linKnpwp, setLinkNpwp] = useState("");
  const [linkRek, setLinkRek] = useState("");
  const [linkOptional, setLinkOptional] = useState("");

  const onSubmitInvestor: SubmitHandler<FormValues> = async (data) => {
    console.log("Data : " + JSON.stringify(data));
    const res = await axios.post(`${API_BACKEND}/api/v1/auth/register`, {
      fullname: data.name,
      email: data.email,
      phone: data.noTelp,
      role: "2",
      password: data.password,
      investor: {
        ktp: data.noKtp,
        address_ktp: data.address,
        gender: data.gender,
        status_marital: data.maritalStatus,
        last_edu: data.lastEducation,
        bank: {
          no: data.noRekening,
          name: data.nameBank,
          owner: data.accountOwner,
          branch: data.bankBranch,
        },
        job: {
          company_name: data.companyName,
          company_address: data.companyAddress,
          monthly_income: data.monthlyIncome,
          position: data.position,
        },
      },
    });
    const result = await res.data;
    console.log("Hasil:", result);
  };

  const [images, setImages] = useState<ImageListType>([]);
  const maxNumber = 1;

  // const {
  //   register,
  //   control,
  //   handleSubmit,
  //   reset,
  //   setValue,
  //   formState: { errors },
  // } = useForm<FormValues>({
  //   resolver: zodResolver(schema),
  // });

  const formPenerbit = useForm<FormValuesPenerbit>({
    resolver: zodResolver(schemaPenerbit),
    defaultValues: {
      dataCompany: "",
      nameCompany: "",
      numberInduk: "",
      aktaCompany: "",
      kumham: "",
      addresCompany: "",
      npwpCompany: "",
      countEmployee: "",
      capitalStructure: "",
      reportFinancial: "",
      nameKomisaris: "",
      jobPositionKomisaris: "",
      ktpKomisaris: "",
      NpwpKomisaris: "",
      nameDireksi: "",
      jobPositionDireksi: "",
      ktpDireksi: "",
      NpwpDireksi: "",
      typeObligasi: "",
      nominalObligasi: "",
      timePriodObligasi: "",
      interestRateObligasi: "",
      interestPaymentObligasi: "",
      interestPokokObligasi: "",
      useDana: "",
      guaranteeKolateral: "",
      description: "",
      funded: "",
      aktaLast: "",
      name: "",
      email: "",
      phone: "",
      password: "",
      title: "",
      proposal: "",
    },
  });

  const onChange = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined
  ) => {
    setImages(imageList as never[]);
  };

  const uploadImage = async () => {
    const uploadedUrls: string[] = [];

    for (const image of images) {
      try {
        if (!image.file) continue;

        const formData = new FormData();
        formData.append("folder", "gambar");
        formData.append("app", "capbridge");
        formData.append("files", image.file);

        const response = await axios.put(
          `https://api-media.langitdigital78.com/api/v1/media`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        const path = response.data.data[0].url;

        uploadedUrls.push(path);
      } catch (err) {
        console.error("Upload gagal:", err);
        return null;
      }
    }

    return uploadedUrls;
  };

  const uploadProposalFile = async (
    file: File | null
  ): Promise<string | null> => {
    if (!file) {
      console.error("File proposal tidak ditemukan.");
      return null;
    }

    try {
      const formData = new FormData();
      formData.append("folder", "proposal");
      formData.append("app", "capbridge");
      formData.append("files", file);

      const response = await axios.put(
        "https://api-media.langitdigital78.com/api/v1/media",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const uploadedUrl = response.data.data[0].url;
      return uploadedUrl;
    } catch (err) {
      console.error("Upload proposal gagal:", err);
      return null;
    }
  };

  const onSubmitPenerbit = async (data: any) => {
    const uploadedUrls = await uploadImage();
    const file = data.proposal[0];

    const proposalUrl = await uploadProposalFile(file);

    if (!uploadedUrls || uploadedUrls.length === 0) {
      alert("Belum upload gambar");
      return;
    }

    if (!proposalUrl) {
      alert("Upload gagal!");
      return;
    }
    try {
      const payload = {
        fullname: data.name,
        email: data.email,
        phone: data.phone,
        role: "2",
        password: data.password,
        investor: {
          ktp: data.ktpInvestor,
          address_ktp: data.addressKtpInvestor,
          gender: data.gender,
          status_marital: data.statusMarital,
          last_edu: data.lastEdu,
          bank: {
            no: "-",
            name: "-",
            owner: "-",
            branch: "-",
          },
          job: {
            company_name: data.companyName,
            company_address: data.companyAddress,
            monthly_income: data.monthlyIncome,
            position: data.jobPosition,
          },
        },
        emiten: {
          company_name: data.nameCompany,
          company_data: data.dataCompany,
          company_nib: data.numberInduk,
          deed_of_incorporation: data.aktaCompany,
          latest_amendment_deed: data.aktaLast,
          sk_kemenkumham: data.kumham,
          company_address: data.addresCompany,
          company_npwp: data.npwpCompany,
          total_employees: data.countEmployee,
          capital_structure: data.capitalStructure,
          financial_statements: data.reportFinancial,
          commisioner_name: data.nameKomisaris,
          commisioner_position: data.jobPositionKomisaris,
          commisioner_ktp: data.ktpKomisaris,
          commisioner_npwp: data.NpwpKomisaris,
          director_name: data.nameDireksi,
          director_position: data.jobPositionDireksi,
          director_ktp: data.ktpDireksi,
          director_npwp: data.NpwpDireksi,
          info_bond: {
            title: data.title,
            img: uploadedUrls[0],
            doc: proposalUrl,
            location: {
              name: "-",
              url: "-",
              lat: "-",
              lng: "-",
            },
            type_of_bond: data.typeObligasi,
            nominal_value: data.nominalObligasi,
            time_periode: data.timePriodObligasi,
            interest_rate: data.interestRateObligasi,
            interest_payment_schedule: data.interestPaymentObligasi,
            principal_payment_schedule: data.interestPokokObligasi,
            use_of_funds: data.useDana,
            collateral_guarantee: data.guaranteeKolateral,
            desc_job: data.description,
            is_apbn: data.funded === "true",
          },
        },
      };

      console.log(JSON.stringify(payload, null, 2), "pay");

      const response = await axios.post(
        "https://api-capbridge.langitdigital78.com/api/v1/auth/register",
        payload
      );

      // console.log("✅ Success:", response.data);
      alert("Berhasil kirim");
      onClose();
      // reset();
      setImages([]);
      window.location.href = "/";
    } catch (error) {
      console.error("❌ Gagal submit:", error);
      alert("Gagal kirim data!");
    }
  };

  const [fileNames, setFileNames] = useState([
    "Upload dokumen Fotokopi KTP",
    "Upload dokumen NPWP (jika ada)",
    "Upload dokumen Rekening Koran",
    "Upload dokumen Lainnya (Optional)",
  ]);

  const handleFileChange = async (index: number, file?: File) => {
    // const newFileNames = [...fileNames];
    // newFileNames[index] = file ? file.name : fileNames[index];
    // console.log("File " + newFileNames)
    // console.log("File " , file)
    // setFileNames(newFileNames);
    const formData = new FormData();
    formData.append("folder", "image");
    formData.append("app", "capbridge");
    formData.append("files", file ?? "");

    try {
      const res = await axios.put(
        "http://157.245.193.49:3099/api/v1/media",
        formData
      );
      const result = await res.data;
      console.log("Hasil:", result.data[0].url);
      if (index == 0) {
        setLinkKtp(result.data[0].url);
      } else if (index == 1) {
        setLinkNpwp(result.data[0].url);
      } else if (index == 2) {
        setLinkRek(result.data[0].url);
      } else {
        setLinkOptional(result.data[0].url);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const pemodal = useForm<FormValues>({
    // resolver: zodResolver(schema),
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-3xl overflow-y-scroll h-[700px] max-w-3xl w-full relative flex flex-col md:flex-row">
        {step !== "select" && (
          <button
            onClick={() => setStep("select")}
            className="absolute top-4 left-4 text-gray-600"
          >
            ←
          </button>
        )}
        <button
          onClick={() => {
            onClose();
            setStep("select");
          }}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl z-10"
        >
          ×
        </button>
        {step === "select" && (
          <>
            <div className="p-8 md:w-1/2 bg-white z-20">
              <h2 className="text-3xl text-black font-bold mb-6">
                Pilih Peran Anda <br /> untuk Memulai
              </h2>

              <div className="space-y-6">
                <div
                  onClick={() => setStep("penerbit")}
                  className="border border-purple-600 rounded-xl p-4 hover:bg-purple-50 cursor-pointer"
                >
                  <h3 className="text-purple-700 font-bold text-lg">
                    Penerbit
                  </h3>
                  <p className="text-sm text-gray-600 mt-2">
                    Anda tertarik mendukung dan membiayai ide bisnis yang
                    menjanjikan. Temukan proyek potensial, kelola investasi
                    Anda, dan bantu wujudkan inovasi.
                  </p>
                </div>

                <div
                  onClick={() => setStep("pemodal")}
                  className="border border-green-600 rounded-xl p-4 hover:bg-green-50 cursor-pointer"
                >
                  <h3 className="text-green-700 font-bold text-lg">Pemodal</h3>
                  <p className="text-sm text-gray-600 mt-2">
                    Anda memiliki ide atau bisnis yang siap dikembangkan. Cari
                    dukungan finansial dan bangun koneksi dengan pemodal.
                  </p>
                </div>
              </div>

              <p className="text-1xl text-gray-500 mt-6">
                Pilihan Anda akan menentukan alur dan fitur yang tersedia dalam
                platform.
              </p>
            </div>

            <div className="md:w-1/2 relative hidden md:block">
              <img
                src="/images/modal-auth.png"
                alt="Professional Woman"
                className="object-cover h-full w-full"
              />
            </div>
          </>
        )}

        {step === "penerbit" && (
          <div className="py-2 px-8 w-full flex flex-col">
            <div className="my-4">
              <div className="center text-center space-y-2">
                <h4 className="text-black text-2xl center block">
                  Isi Data Sebagai Penerbit
                </h4>
                <p className="text-sm text-gray-500">
                  Untuk memastikan kelancaran proses verifikasi dan layanan yang
                  optimal, kami <br /> mengajak Anda untuk melengkapi seluruh
                  data secara jujur, benar, dan akurat.
                </p>
              </div>
              <form onSubmit={formPenerbit.handleSubmit(onSubmitPenerbit)}>
                <div className="space-y-4 my-4">
                  <div>
                    <h3 className="text-black my-2 font-semibold text-sm">
                      Informasi Penerbit
                    </h3>
                    <div className="flex flex-wrap gap-4 mt-2">
                      {/* Nama Penerbit */}
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Nama Penerbit
                        </label>
                        <input
                          type="text"
                          // value={dataCompany}
                          // onChange={(e) => setDataCompany(e.target.value)}
                          className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Nama Penerbit"
                          {...formPenerbit.register("name")}
                        />
                        {formPenerbit.formState.errors.name && (
                          <p className="text-red-500 text-sm">
                            {formPenerbit.formState.errors.name.message}
                          </p>
                        )}
                      </div>

                      {/* Email Penerbit */}
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Email Penerbit
                        </label>
                        <input
                          type="text"
                          // value={nameCompany}
                          // onChange={(e) => setNameCompany(e.target.value)}
                          className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Email Penerbit"
                          {...formPenerbit.register("email")}
                        />
                        {formPenerbit.formState.errors.email && (
                          <p className="text-red-500 text-sm">
                            {formPenerbit.formState.errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-2">
                      {/* Nomor telepon penerbit */}
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Nomor telepon penerbit
                        </label>
                        <input
                          type="text"
                          // value={dataCompany}
                          // onChange={(e) => setDataCompany(e.target.value)}
                          className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Nomor telepon penerbit"
                          {...formPenerbit.register("phone")}
                        />
                        {formPenerbit.formState.errors.phone && (
                          <p className="text-red-500 text-sm">
                            {formPenerbit.formState.errors.phone.message}
                          </p>
                        )}
                      </div>

                      {/* Password */}
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Password
                        </label>
                        <input
                          type="text"
                          // value={nameCompany}
                          // onChange={(e) => setNameCompany(e.target.value)}
                          className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Password"
                          {...formPenerbit.register("password")}
                        />
                        {formPenerbit.formState.errors.password && (
                          <p className="text-red-500 text-sm">
                            {formPenerbit.formState.errors.password.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <h3 className="text-black my-2 font-semibold text-sm">
                      Informasi Perusahaan
                    </h3>

                    <div className="flex flex-wrap gap-4 mt-2">
                      {/* Nama */}
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Data Perusahaan
                        </label>
                        <input
                          type="text"
                          // value={dataCompany}
                          // onChange={(e) => setDataCompany(e.target.value)}
                          className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Data Perusahaan"
                          {...formPenerbit.register("dataCompany")}
                        />
                        {formPenerbit.formState.errors.dataCompany && (
                          <p className="text-red-500 text-sm">
                            {formPenerbit.formState.errors.dataCompany.message}
                          </p>
                        )}
                      </div>

                      {/* Nama Perusahaan */}
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Nama Perusahaan
                        </label>
                        <input
                          type="text"
                          // value={nameCompany}
                          // onChange={(e) => setNameCompany(e.target.value)}
                          className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Nama Perusahaan"
                          {...formPenerbit.register("nameCompany")}
                        />
                        {formPenerbit.formState.errors.nameCompany && (
                          <p className="text-red-500 text-sm">
                            {formPenerbit.formState.errors.nameCompany.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-2">
                      {/* Nomor Induk Perusahaan */}
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Nomor Induk Berusaha (NIB)
                        </label>
                        <input
                          type="text"
                          // value={numberInduk}
                          // onChange={(e) => setNumberInduk(e.target.value)}
                          className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Nomor Induk Berusaha (NIB)"
                          {...formPenerbit.register("numberInduk")}
                        />
                        {formPenerbit.formState.errors.numberInduk && (
                          <p className="text-red-500 text-sm">
                            {formPenerbit.formState.errors.numberInduk.message}
                          </p>
                        )}
                      </div>

                      {/* Gender */}
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Akta Pendirian Perusahaan
                        </label>
                        <input
                          type="text"
                          // value={aktaCompany}
                          // onChange={(e) => setAktaCompany(e.target.value)}
                          className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Akta Pendirian Perusahaan"
                          {...formPenerbit.register("aktaCompany")}
                        />
                        {formPenerbit.formState.errors.aktaCompany && (
                          <p className="text-red-500 text-sm">
                            {formPenerbit.formState.errors.aktaCompany.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-2">
                      {/* SK Kumham */}
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          SK Kumham
                        </label>
                        <input
                          type="text"
                          // value={kumham}
                          // onChange={(e) => setKumham(e.target.value)}
                          className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="SK Kumham"
                          {...formPenerbit.register("kumham")}
                        />
                        {formPenerbit.formState.errors.kumham && (
                          <p className="text-red-500 text-sm">
                            {formPenerbit.formState.errors.kumham.message}
                          </p>
                        )}
                      </div>
                      {/* Pendidikan Terakhir */}
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Akta Perubahan Terakhir
                        </label>
                        <input
                          type="text"
                          // value={aktaLast}
                          // onChange={(e) => setAktaLast(e.target.value)}
                          className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Akta Perubahan Terahkir"
                          {...formPenerbit.register("aktaLast")}
                        />
                        {formPenerbit.formState.errors.aktaLast && (
                          <p className="text-red-500 text-sm">
                            {formPenerbit.formState.errors.aktaLast.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    {/* Alamat Perusahaan */}
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Alamat Perusahaan
                    </label>
                    <input
                      type="text"
                      // value={addresCompany}
                      // onChange={(e) => setAddresCompany(e.target.value)}
                      className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Alamat Perusahaan"
                      {...formPenerbit.register("addresCompany")}
                    />
                    {formPenerbit.formState.errors.addresCompany && (
                      <p className="text-red-500 text-sm">
                        {formPenerbit.formState.errors.addresCompany.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-4">
                    {/* NPWP Perusahaan */}
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        NPWP Perusahaan
                      </label>
                      <input
                        type="text"
                        // value={npwpCompany}
                        // onChange={(e) => setNpwpCompany(e.target.value)}
                        className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="NPWP Perusahaan"
                        {...formPenerbit.register("npwpCompany")}
                      />
                      {formPenerbit.formState.errors.npwpCompany && (
                        <p className="text-red-500 text-sm">
                          {formPenerbit.formState.errors.npwpCompany.message}
                        </p>
                      )}
                    </div>
                    {/* Jumlah Karyawan */}
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Jumlah Karyawan
                      </label>
                      <input
                        type="text"
                        // value={countEmployee}
                        // onChange={(e) => setCountEmployee(e.target.value)}
                        className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Jumlah Karyawan"
                        {...formPenerbit.register("countEmployee")}
                      />
                      {formPenerbit.formState.errors.countEmployee && (
                        <p className="text-red-500 text-sm">
                          {formPenerbit.formState.errors.countEmployee.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    {/* Struktur Pemodalan */}
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Struktur Pemodalan
                      </label>
                      <input
                        type="text"
                        // value={capitalStructure}
                        // onChange={(e) => setCapitalStructure(e.target.value)}
                        className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Struktur Pemodalan"
                        {...formPenerbit.register("capitalStructure")}
                      />
                      {formPenerbit.formState.errors.capitalStructure && (
                        <p className="text-red-500 text-sm">
                          {
                            formPenerbit.formState.errors.capitalStructure
                              .message
                          }
                        </p>
                      )}
                    </div>
                    {/* Laporan Keuangan */}
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Laporan Keuangan
                      </label>
                      <input
                        type="text"
                        // value={reportFinancial}
                        // onChange={(e) => setReportFinancial(e.target.value)}
                        className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Laporan Keuangan"
                        {...formPenerbit.register("reportFinancial")}
                      />
                      {formPenerbit.formState.errors.reportFinancial && (
                        <p className="text-red-500 text-sm">
                          {
                            formPenerbit.formState.errors.reportFinancial
                              .message
                          }
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-black my-2 font-semibold text-sm">
                      Susunan Manajemen
                    </h3>
                    <div className="my-2">
                      <div className="flex flex-wrap gap-4">
                        {/* Komisaris */}
                        <div className="flex-1">
                          <p className="block text-sm text-gray-500 mb-1 font-semibold">
                            Komisaris
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      {/* Nama Komisaris */}
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Nama
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Nama Komisaris"
                          // value={nameKomisaris}
                          // onChange={(e) => setNameKomisaris(e.target.value)}
                          {...formPenerbit.register("nameKomisaris")}
                        />
                        {formPenerbit.formState.errors.nameKomisaris && (
                          <p className="text-red-500 text-sm">
                            {
                              formPenerbit.formState.errors.nameKomisaris
                                .message
                            }
                          </p>
                        )}
                      </div>
                      {/* Jabatan Komisaris */}
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Jabatan
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Jabatan"
                          // value={jobPositionKomisaris}
                          // onChange={(e) =>
                          //   setJobPositionKomisaris(e.target.value)
                          // }
                          {...formPenerbit.register("jobPositionKomisaris")}
                        />
                        {formPenerbit.formState.errors.jobPositionKomisaris && (
                          <p className="text-red-500 text-sm">
                            {
                              formPenerbit.formState.errors.jobPositionKomisaris
                                .message
                            }
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-2">
                      {/* KTP Komisaris */}
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          KTP
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="KTP"
                          // value={ktpKomisaris}
                          // onChange={(e) => setKtpKomisaris(e.target.value)}
                          {...formPenerbit.register("ktpKomisaris")}
                        />
                        {formPenerbit.formState.errors.ktpKomisaris && (
                          <p className="text-red-500 text-sm">
                            {formPenerbit.formState.errors.ktpKomisaris.message}
                          </p>
                        )}
                      </div>
                      {/* NPWP Komisaris */}
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          NPWP
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="NPWP"
                          // value={NpwpKomisaris}
                          // onChange={(e) => setNpwpKomisaris(e.target.value)}
                          {...formPenerbit.register("NpwpKomisaris")}
                        />
                        {formPenerbit.formState.errors.NpwpKomisaris && (
                          <p className="text-red-500 text-sm">
                            {
                              formPenerbit.formState.errors.NpwpKomisaris
                                .message
                            }
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="my-2">
                      <div className="flex flex-wrap gap-4">
                        {/* Direksi */}
                        <div className="flex-1">
                          <p className="block text-sm text-gray-500 mb-1 font-semibold">
                            Direksi
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      {/* Nama Direksi */}
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Nama
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Nama Direksi"
                          // value={nameDireksi}
                          // onChange={(e) => setNameDireksi(e.target.value)}
                          {...formPenerbit.register("nameDireksi")}
                        />
                        {formPenerbit.formState.errors.nameDireksi && (
                          <p className="text-red-500 text-sm">
                            {formPenerbit.formState.errors.nameDireksi.message}
                          </p>
                        )}
                      </div>
                      {/* Jabatan Direksi */}
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Jabatan
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Jabatan"
                          // value={jobPositionDireksi}
                          // onChange={(e) =>
                          //   setJobPositionDireksi(e.target.value)
                          // }
                          {...formPenerbit.register("jobPositionDireksi")}
                        />
                        {formPenerbit.formState.errors.jobPositionDireksi && (
                          <p className="text-red-500 text-sm">
                            {
                              formPenerbit.formState.errors.jobPositionDireksi
                                .message
                            }
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-2">
                      {/* KTP Direksi */}
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          KTP
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="KTP"
                          // value={ktpDireksi}
                          // onChange={(e) => setKtpDireksi(e.target.value)}
                          {...formPenerbit.register("ktpDireksi")}
                        />
                        {formPenerbit.formState.errors.ktpDireksi && (
                          <p className="text-red-500 text-sm">
                            {formPenerbit.formState.errors.ktpDireksi.message}
                          </p>
                        )}
                      </div>
                      {/* NPWP Direksi */}
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          NPWP
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="NPWP"
                          // value={NpwpDireksi}
                          // onChange={(e) => setNpwpDireksi(e.target.value)}
                          {...formPenerbit.register("NpwpDireksi")}
                        />
                        {formPenerbit.formState.errors.NpwpDireksi && (
                          <p className="text-red-500 text-sm">
                            {formPenerbit.formState.errors.NpwpDireksi.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-black my-2 font-semibold text-sm">
                      Informasi Obligasi
                    </h3>

                    <div className="flex flex-wrap gap-4">
                      {/* Jenis Obligasi */}
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Jenis Obligasi
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Jenis Obligasi"
                          // value={typeObligasi}
                          // onChange={(e) => setTypeObligasi(e.target.value)}
                          {...formPenerbit.register("typeObligasi")}
                        />
                        {formPenerbit.formState.errors.typeObligasi && (
                          <p className="text-red-500 text-sm">
                            {formPenerbit.formState.errors.typeObligasi.message}
                          </p>
                        )}
                      </div>
                      {/*  Nilai Nominal */}
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Nilai Nominal
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder=" Nilai Nominal"
                          // value={nominalObligasi}
                          // onChange={(e) => setNominalObligasi(e.target.value)}
                          {...formPenerbit.register("nominalObligasi")}
                        />
                        {formPenerbit.formState.errors.nominalObligasi && (
                          <p className="text-red-500 text-sm">
                            {
                              formPenerbit.formState.errors.nominalObligasi
                                .message
                            }
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                      {/* Jangka Waktu */}
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Jangka Waktu
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Jangka Waktu"
                          // value={timePriodObligasi}
                          // onChange={(e) => setTimePriodObligasi(e.target.value)}
                          {...formPenerbit.register("timePriodObligasi")}
                        />
                        {formPenerbit.formState.errors.timePriodObligasi && (
                          <p className="text-red-500 text-sm">
                            {
                              formPenerbit.formState.errors.timePriodObligasi
                                .message
                            }
                          </p>
                        )}
                      </div>
                      {/* Tingkat Bunga */}
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Tingkat Bunga
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Tingkat Bunga"
                          // value={interestRateObligasi}
                          // onChange={(e) =>
                          //   setInterestRateObligasi(e.target.value)
                          // }
                          {...formPenerbit.register("interestRateObligasi")}
                        />
                        {formPenerbit.formState.errors.interestRateObligasi && (
                          <p className="text-red-500 text-sm">
                            {
                              formPenerbit.formState.errors.interestRateObligasi
                                .message
                            }
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                      {/* Jadwal Pembayaran Bunga */}
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Jadwal Pembayaran Bunga
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Jadwal Pembayaran Bunga"
                          // value={interestPaymentObligasi}
                          // onChange={(e) =>
                          //   setInterestPaymentObligasi(e.target.value)
                          // }
                          {...formPenerbit.register("interestPaymentObligasi")}
                        />
                        {formPenerbit.formState.errors
                          .interestPaymentObligasi && (
                          <p className="text-red-500 text-sm">
                            {
                              formPenerbit.formState.errors
                                .interestPaymentObligasi.message
                            }
                          </p>
                        )}
                      </div>
                      {/* Jadwal Pembayaran Pokok */}
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Jadwal Pembayaran Pokok
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Jadwal Pembayaran Pokok"
                          // value={interestPokokObligasi}
                          // onChange={(e) =>
                          //   setInterestPokokObligasi(e.target.value)
                          // }
                          {...formPenerbit.register("interestPokokObligasi")}
                        />
                        {formPenerbit.formState.errors
                          .interestPokokObligasi && (
                          <p className="text-red-500 text-sm">
                            {
                              formPenerbit.formState.errors
                                .interestPokokObligasi.message
                            }
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                      {/* Penggunaan Dana */}
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Penggunaan Dana
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Penggunaan Dana"
                          // value={useDana}
                          // onChange={(e) => setUseDana(e.target.value)}
                          {...formPenerbit.register("useDana")}
                        />
                        {formPenerbit.formState.errors.useDana && (
                          <p className="text-red-500 text-sm">
                            {formPenerbit.formState.errors.useDana.message}
                          </p>
                        )}
                      </div>
                      {/* Jadwal Pembayaran Pokok */}
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Jaminan Kolateral
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Jaminan Kolateral"
                          // value={guaranteeKolateral}
                          // onChange={(e) =>
                          //   setGuaranteeKolateral(e.target.value)
                          // }
                          {...formPenerbit.register("guaranteeKolateral")}
                        />
                        {formPenerbit.formState.errors.guaranteeKolateral && (
                          <p className="text-red-500 text-sm">
                            {
                              formPenerbit.formState.errors.guaranteeKolateral
                                .message
                            }
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    {/* Judul Proyek */}
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Judul Proyek
                    </label>
                    <input
                      type="text"
                      // value={addresCompany}
                      // onChange={(e) => setAddresCompany(e.target.value)}
                      className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Judul Proyek"
                      {...formPenerbit.register("title")}
                    />
                    {formPenerbit.formState.errors.title && (
                      <p className="text-red-500 text-sm">
                        {formPenerbit.formState.errors.title.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium text-gray-500 mb-1"
                      htmlFor="description"
                    >
                      Deskripsi Pekerjaan
                    </label>
                    <textarea
                      id="description"
                      // value={description}
                      // onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Tuliskan deskripsi mu dengan jelas di sini"
                      rows={4}
                      {...formPenerbit.register("description")}
                    />
                    {formPenerbit.formState.errors.description && (
                      <p className="text-red-500 text-sm">
                        {formPenerbit.formState.errors.description.message}
                      </p>
                    )}
                  </div>

                  <div>
                    {/* Judul Proyek */}
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Proposal
                    </label>
                    <input
                      type="file"
                      // value={addresCompany}
                      // onChange={(e) => setAddresCompany(e.target.value)}
                      accept=".pdf"
                      className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Judul Proyek"
                      {...formPenerbit.register("proposal")}
                    />
                    {formPenerbit.formState.errors.proposal && (
                      <p className="text-red-500 text-sm">
                        {formPenerbit.formState.errors.proposal.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <div
                      className="custom-file-container"
                      data-upload-id="myFirstImage"
                    >
                      {/* <div className="flex flex-col justify-start mb-5">
                        <label className="!text-black">Foto Produk</label>
                        <span className="text-sm text-red-500">
                          Maksimal upload foto 5
                        </span>
                      </div> */}
                      <input
                        type="hidden"
                        name="MAX_FILE_SIZE"
                        value="10485760"
                      />
                      <ImageUploading
                        multiple
                        value={images}
                        onChange={onChange}
                        maxNumber={maxNumber}
                        dataURLKey="dataURL"
                      >
                        {({ imageList, onImageUpload, onImageRemove }) => (
                          <div className="upload__image-wrapper flex flex-wrap items-center gap-4">
                            {/* Loop semua gambar */}
                            {imageList.map((image, index) => (
                              <div
                                key={index}
                                className="relative w-[100px] h-[100px]"
                              >
                                <img
                                  src={image.dataURL}
                                  alt={`Preview-${index}`}
                                  className="object-cover w-full h-full rounded-lg ring-1 ring-gray-400"
                                />
                                <button
                                  type="button"
                                  onClick={() => onImageRemove(index)}
                                  className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                                >
                                  ×
                                </button>
                              </div>
                            ))}

                            {/* Tombol tambah jika belum max */}
                            {imageList.length < maxNumber && (
                              <div
                                onClick={onImageUpload}
                                className="relative w-[100px] h-[100px] border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-500 transition"
                              >
                                <Plus className="text-gray-400" />
                              </div>
                            )}
                          </div>
                        )}
                      </ImageUploading>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between">
                    <div className="flex flex-col flex-wrap gap-4">
                      <div>
                        <label className="block text-gray-500 text-sm font-medium">
                          Apakah di Biayai oleh APBN/APBD
                        </label>
                      </div>
                      <div className="flex gap-6">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            // name="funded"
                            value="true"
                            className="accent-black"
                            // onChange={handleFundedChange}
                            // checked={funded === "true"}
                            {...formPenerbit.register("funded")}
                          />
                          <span className="text-sm text-black">Ya</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            // name="funded"
                            value="false"
                            className="accent-black"
                            // onChange={handleFundedChange}
                            // checked={funded === "false"}
                            {...formPenerbit.register("funded")}
                          />
                          <span className="text-sm text-black">Tidak</span>
                        </label>
                      </div>
                      {formPenerbit.formState.errors.funded && (
                        <p className="text-red-500 text-sm">
                          {formPenerbit.formState.errors.funded.message}
                        </p>
                      )}
                    </div>
                    <button
                      type="submit"
                      className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 font-semibold"
                    >
                      Submit Data
                    </button>
                    {/* <pre className="text-xs text-black">
                      {JSON.stringify(formPenerbit.watch(), null, 2)}
                    </pre> */}
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {step === "pemodal" && (
          <form
            onSubmit={pemodal.handleSubmit(onSubmitInvestor)}
            data-tes="tes"
          >
            <div className="py-2 px-8 w-full flex flex-col">
              <div className="my-4">
                <div className="center text-center space-y-2">
                  <h4 className="text-black text-2xl center block">
                    Isi Data Sebagai Pemodal
                  </h4>
                  <p className="text-sm text-gray-500">
                    Untuk memastikan kelancaran proses verifikasi dan layanan
                    yang optimal, kami <br /> mengajak Anda untuk melengkapi
                    seluruh data secara jujur, benar, dan akurat.
                  </p>
                </div>
                <h3 className="text-black my-4 font-semibold text-sm">
                  Informasi Pribadi
                </h3>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-4">
                    {/* Nama */}
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Email
                      </label>
                      <input
                        type="text"
                        {...pemodal.register("email")}
                        name="name"
                        className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Email"
                      />
                      {pemodal.formState.errors.email && (
                        <div className="text-danger mt-1">
                          {pemodal.formState.errors.email.message}
                        </div>
                      )}
                    </div>

                    {/* KTP */}
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Password
                      </label>
                      <input
                        type="text"
                        {...pemodal.register("noKtp")}
                        name="noKtp"
                        className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Password"
                      />
                      {pemodal.formState.errors.password && (
                        <div className="text-danger mt-1">
                          {pemodal.formState.errors.password.message}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {/* Nama */}
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Nama
                      </label>
                      <input
                        type="text"
                        {...pemodal.register("name")}
                        name="name"
                        className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Nama"
                      />
                      {pemodal.formState.errors.name && (
                        <div className="text-danger mt-1">
                          {pemodal.formState.errors.name.message}
                        </div>
                      )}
                    </div>

                    {/* KTP */}
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        KTP
                      </label>
                      <input
                        type="text"
                        {...pemodal.register("noKtp")}
                        name="noKtp"
                        className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="KTP"
                      />
                      {pemodal.formState.errors.noKtp && (
                        <div className="text-danger mt-1">
                          {pemodal.formState.errors.noKtp.message}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    {/* Tempat Tanggal Lahir */}
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Tempat Tanggal Lahir
                      </label>
                      <input
                        type="text"
                        {...pemodal.register("placeOfBirth")}
                        className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Tempat Tanggal Lahir"
                      />
                      {pemodal.formState.errors.placeOfBirth && (
                        <div className="text-danger mt-1">
                          {pemodal.formState.errors.placeOfBirth.message}
                        </div>
                      )}
                    </div>

                    {/* Gender */}
                    <div className="flex-1">
                      <div className="flex flex-col flex-wrap gap-4">
                        <div>
                          <label className="block text-gray-500 text-sm font-medium">
                            Jenis Kelamin
                          </label>
                        </div>
                        <div className="flex gap-6">
                          <label className="flex items-center gap-2">
                            <input
                              {...pemodal.register("gender")}
                              type="radio"
                              name="gender"
                              value="L"
                              className="accent-black"
                            />
                            <span className="text-sm text-black">Pria</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              {...pemodal.register("gender")}
                              type="radio"
                              name="gender"
                              value="P"
                              className="accent-black"
                            />
                            <span className="text-sm text-black">Wanita</span>
                          </label>
                          {pemodal.formState.errors.gender && (
                            <div className="text-danger mt-1">
                              {pemodal.formState.errors.gender.message}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    {/* Status Pernikahan */}
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Status Pernikahan
                      </label>
                      <input
                        type="text"
                        {...pemodal.register("maritalStatus")}
                        className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Status Pernikahan"
                      />
                      {pemodal.formState.errors.maritalStatus && (
                        <div className="text-danger mt-1">
                          {pemodal.formState.errors.maritalStatus.message}
                        </div>
                      )}
                    </div>
                    {/* Pendidikan Terakhir */}
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Pendidikan Terakhir
                      </label>
                      <input
                        type="text"
                        {...pemodal.register("lastEducation")}
                        className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Pendidikan Terakhir"
                      />
                      {pemodal.formState.errors.lastEducation && (
                        <div className="text-danger mt-1">
                          {pemodal.formState.errors.lastEducation.message}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    {/* Pekerjaan */}
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Pekerjaan
                      </label>
                      <input
                        type="text"
                        {...pemodal.register("work")}
                        className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Pekerjaan"
                      />
                      {pemodal.formState.errors.work && (
                        <div className="text-danger mt-1">
                          {pemodal.formState.errors.work.message}
                        </div>
                      )}
                    </div>

                    {/* No Telp */}
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        No Tlp
                      </label>
                      <input
                        {...pemodal.register("noTelp")}
                        type="text"
                        className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="No Tlp"
                      />
                      {pemodal.formState.errors.noTelp && (
                        <div className="text-danger mt-1">
                          {pemodal.formState.errors.noTelp.message}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Alamat Sesuai KTP dan Alamat Domisili */}

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Alamat Sesuai KTP dan Alamat Domisili
                    </label>
                    <input
                      type="text"
                      {...pemodal.register("address")}
                      className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Alamat Sesuai KTP dan Alamat Domisili"
                    />
                    {pemodal.formState.errors.address && (
                      <div className="text-danger mt-1">
                        {pemodal.formState.errors.address.message}
                      </div>
                    )}
                  </div>

                  {/* Alamat Email Aktif */}

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Alamat Email Aktif
                    </label>
                    <input
                      type="text"
                      {...pemodal.register("email")}
                      className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Alamat Email Aktif"
                    />
                    {pemodal.formState.errors.email && (
                      <div className="text-danger mt-1">
                        {pemodal.formState.errors.email.message}
                      </div>
                    )}
                  </div>
                </div>

                {/* Information Bank */}

                <div className="my-4">
                  <h3 className="text-black mb-2 font-semibold text-sm">
                    Informasi Bank
                  </h3>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-4">
                      {/* Nama Bank */}
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Nama Bank
                        </label>
                        <input
                          type="text"
                          {...pemodal.register("nameBank")}
                          className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Nama Bank"
                        />
                        {pemodal.formState.errors.nameBank && (
                          <div className="text-danger mt-1">
                            {pemodal.formState.errors.nameBank.message}
                          </div>
                        )}
                      </div>
                      {/* Nomor Rekening */}
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Nomor Rekening
                        </label>
                        <input
                          type="text"
                          {...pemodal.register("noRekening")}
                          className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Nomor Rekening"
                        />
                        {pemodal.formState.errors.noRekening && (
                          <div className="text-danger mt-1">
                            {pemodal.formState.errors.noRekening.message}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                      {/* Nama Pemilik Rekening */}
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Nama Pemilik Rekening
                        </label>
                        <input
                          type="text"
                          {...pemodal.register("accountOwner")}
                          className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Nama Pemilik Rekening"
                        />
                        {pemodal.formState.errors.accountOwner && (
                          <div className="text-danger mt-1">
                            {pemodal.formState.errors.accountOwner.message}
                          </div>
                        )}
                      </div>
                      {/* Cabang Bank */}
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Cabang Bank
                        </label>
                        <input
                          type="text"
                          {...pemodal.register("bankBranch")}
                          className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Cabang Bank"
                        />
                        {pemodal.formState.errors.bankBranch && (
                          <div className="text-danger mt-1">
                            {pemodal.formState.errors.bankBranch.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informasi Pekerjaan */}

                <div className="my-4">
                  <h3 className="text-black mb-2 font-semibold text-sm">
                    Informasi Pekerjaan
                  </h3>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-4">
                      {/* Nama Perusahaan */}
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Nama Perusahaan
                        </label>
                        <input
                          type="text"
                          {...pemodal.register("companyName")}
                          className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Nama Perusahaan"
                        />
                        {pemodal.formState.errors.companyName && (
                          <div className="text-danger mt-1">
                            {pemodal.formState.errors.companyName.message}
                          </div>
                        )}
                      </div>
                      {/* Jabatan */}
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Jabatan
                        </label>
                        <input
                          type="text"
                          {...pemodal.register("position")}
                          className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Jabatan"
                        />
                        {pemodal.formState.errors.position && (
                          <div className="text-danger mt-1">
                            {pemodal.formState.errors.position.message}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Alamat Perusahaan
                      </label>
                      <input
                        type="text"
                        {...pemodal.register("companyAddress")}
                        className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Alamat Sesuai KTP dan Alamat Domisili"
                      />
                      {pemodal.formState.errors.companyAddress && (
                        <div className="text-danger mt-1">
                          {pemodal.formState.errors.companyAddress.message}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Penghasilan Bulanan
                      </label>
                      <input
                        type="text"
                        {...pemodal.register("monthlyIncome")}
                        className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Penghasilan Bulanan"
                      />
                      {pemodal.formState.errors.monthlyIncome && (
                        <div className="text-danger mt-1">
                          {pemodal.formState.errors.monthlyIncome.message}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Profil Risiko */}

                <div className="my-4">
                  <h3 className="text-black mb-2 font-semibold text-sm">
                    Profil Risiko
                  </h3>
                  <div className="space-y-6">
                    <div className="flex flex-wrap gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Pilih tujuan
                        </label>
                        <select className="w-full bg-white px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500">
                          <option value="pendapatan">
                            Pendapatan Tambahan
                          </option>
                          <option value="jangka-panjang">
                            Pertumbuhan Jangka Panjang
                          </option>
                          <option value="lainnya">Lainnya</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                      <div>
                        <label className="block text-gray-500 text-sm font-medium">
                          Toleransi Resiko
                        </label>
                      </div>
                      <div className="flex gap-6">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            value="rendah"
                            {...pemodal.register("risk")}
                            className="accent-black"
                          />
                          <span className="text-sm text-black">Rendah</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            value="sedang"
                            {...pemodal.register("risk")}
                            className="accent-black"
                          />
                          <span className="text-sm text-black">Sedang</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            value="tinggi"
                            {...pemodal.register("risk")}
                            className="accent-black"
                          />
                          <span className="text-sm text-black">Tinggi</span>
                        </label>
                      </div>
                      {pemodal.formState.errors.risk && (
                        <p className="text-red-500 text-sm">
                          {pemodal.formState.errors.risk.message}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-4">
                      <div>
                        <label className="block text-gray-500 text-sm font-medium">
                          Pengalaman Investasi
                        </label>
                      </div>
                      <div className="flex gap-6">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            value="tidak_ada"
                            {...pemodal.register("experience")}
                            className="accent-black"
                          />
                          <span className="text-sm text-black">Tidak ada</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            value="kurang"
                            {...pemodal.register("experience")}
                            className="accent-black"
                          />
                          <span className="text-sm text-black">Kurang</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            value="cukup"
                            {...pemodal.register("experience")}
                            className="accent-black"
                          />
                          <span className="text-sm text-black">Cukup</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            value="banyak"
                            {...pemodal.register("experience")}
                            className="accent-black"
                          />
                          <span className="text-sm text-black">Banyak</span>
                        </label>
                      </div>
                      {pemodal.formState.errors.experience && (
                        <p className="text-red-500 text-sm">
                          {pemodal.formState.errors.experience.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="my-8">
                  <h3 className="text-black mb-2 font-semibold text-sm">
                    Pernyataan dan Tanda Tangan
                  </h3>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-4">
                      {/* Pernyataan Kebenaran Data */}
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Pernyataan Kebenaran Data
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Pernyataan Kebenaran Data"
                        />
                      </div>
                      {/* Pernyataan Memahami Risiko Investasi */}
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Pernyataan Memahami Risiko Investasi
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Pernyataan Memahami Risiko Investasi"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Tanda Tangan Pemohon
                      </label>
                      <textarea
                        className="w-full px-4 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Tanda Tangan Pemohon"
                      />
                    </div>

                    <div className="space-y-4">
                      {["dokumen1", "dokumen2", "dokumen3", "dokumen4"].map(
                        (field, index) => (
                          <label
                            key={field}
                            className="flex items-center gap-3 border border-dashed border-gray-300 rounded-md px-4 py-3 cursor-pointer hover:bg-gray-50"
                          >
                            <span>📄</span>
                            <span className="text-sm text-gray-600">
                              {fileNames[index]}
                            </span>
                            <input
                              type="file"
                              {...pemodal.register(field as any)}
                              className="hidden"
                              onChange={(e) =>
                                handleFileChange(index, e.target.files?.[0])
                              }
                            />
                          </label>
                        )
                      )}

                      {/* Tombol Submit */}
                      <div className="flex justify-center pt-4">
                        <button
                          type="submit"
                          className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 font-semibold"
                        >
                          Submit Data
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RoleModal;
