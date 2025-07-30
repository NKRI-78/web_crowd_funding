import React, { useRef, useState, useEffect } from "react";
// import SignatureCanvas from "react-signature-canvas";
import axios from "axios";
import Swal from "sweetalert2";
import { FaFileAlt } from "react-icons/fa";
import Select from "react-select";
import { API_BACKEND_MEDIA } from "@/app/utils/constant";
import { compressImage } from "@/app/helper/CompressorImage";

// function getSignatureDataUrlWithWhiteBackground(
//   canvas: HTMLCanvasElement
// ): string {
//   const tempCanvas = document.createElement("canvas");
//   tempCanvas.width = canvas.width;
//   tempCanvas.height = canvas.height;

//   const ctx = tempCanvas.getContext("2d");
//   if (!ctx) return "";

//   ctx.fillStyle = "#ffffff";
//   ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
//   ctx.drawImage(canvas, 0, 0);

//   return tempCanvas.toDataURL("image/png");
// }

interface Props {
  formData: {
    namaPerusahaan: string;
    jabatan: string;
    alamatPerusahaan: string;
    penghasilanBulanan: string;
    tujuanInvestasi: string;
    tujuanInvestasiLainnya: string;
    toleransiResiko: string;
    pengalamanInvestasi: string;
    pengetahuanPasarModal: string;
    setujuKebenaranData: boolean;
    setujuRisikoInvestasi: boolean;
    signature: string;
    npwpUrl: string;
    fotoPemodalUrl: string;
    provincePekerjaan: { value: string; label: string };
    cityPekerjaan: { value: string; label: string };
    districtPekerjaan: { value: string; label: string };
    subDistrictPekerjaan: { value: string; label: string };
    posCodePekerjaan: string;
  };
  onLihatNPWP?: () => void;
  onLihatFotoPemodal?: () => void;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;

  onPenghasilanBulanan: (value: string) => void;
  onTujuanInvetasi: (value: string) => void;
  onToleransiResiko: (value: string) => void;
  onPengalamanInvestasi: (value: string) => void;
  onPengetahuanPasarModal: (value: string) => void;
  onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSignatureSave: (signature: string) => void;
  onUploadKTP: (url: string, keyName: string) => void;
  onAlamatChange: (alamat: {
    provincePekerjaan: { value: string; label: string } | null;
    cityPekerjaan: { value: string; label: string } | null;
    districtPekerjaan: { value: string; label: string } | null;
    subDistrictPekerjaan: { value: string; label: string } | null;
    posCodePekerjaan: string;
  }) => void;
  errors?: Record<string, string[]>;
}

// const SIG_W = 300;
// const SIG_H = 200;

const ComponentDataPekerjaan: React.FC<Props> = ({
  formData,
  onChange,
  onPenghasilanBulanan,
  onTujuanInvetasi,
  onToleransiResiko,
  onPengalamanInvestasi,
  onPengetahuanPasarModal,
  onCheckboxChange,
  // onSignatureSave,
  onUploadKTP,
  onAlamatChange,
  errors,
  onLihatNPWP,
  onLihatFotoPemodal,
}) => {
  type OptionType = { value: string; label: string } | null;

  // const signatureRef = useRef<SignatureCanvas | null>(null);
  const [isSignatureSaved, setIsSignatureSaved] = useState(false);
  const formPemodalStr = localStorage.getItem("formPemodal");
  const formPemodal = formPemodalStr ? JSON.parse(formPemodalStr) : null;

  const penghasilanBulananOptions = [
    { value: "< 100jt", label: "< 100jt" },
    { value: "100jt - 500jt", label: "100jt - 500jt" },
    { value: "500jt - 1m", label: "500jt - 1m" },
    { value: "> 1m", label: "> 1m" },
  ];
  const tujuanInvestasi = ["Jangka Pendek", "Jangka Panjang", "Lainnya"];
  const toleransiResiko = ["Rendah", "Menengah", "Tinggi"];
  const pengalamanInvestasi = ["Ada", "Tidak Ada"];
  const pengetahuanPasarModal = ["Ada", "Tidak Ada"];
  // const [isEmpty, setIsEmpty] = useState(true);
  const [uploadStatus, setUploadStatus] = useState<{ [key: string]: boolean }>(
    {}
  );

  const [province, setProvince] = useState<any>([]);
  const [selectedProvincePekerjaan, setSelectedProvincePekerjaan] =
    useState<OptionType>(null);
  const [city, setCity] = useState<any>([]);
  const [selectedCityPekerjaan, setSelectedCityPekerjaan] =
    useState<OptionType>(null);
  const [district, setDistrict] = useState<any>([]);
  const [selectedDistrictPekerjaan, setSelectedDistrictPekerjaan] =
    useState<OptionType>(null);
  const [subDistrict, setSubDistrict] = useState<any>([]);
  const [selectedSubDistrictPekerjaan, setSelectedSubDistrictPekerjaan] =
    useState<OptionType>(null);
  const [posCode, setPosCode] = useState("");

  const urlWilayah = "https://api.wilayah.site";

  // const uploadSignature = async (dataUrl: string): Promise<string | null> => {
  //   const blob = await (await fetch(dataUrl)).blob();
  //   const formData = new FormData();
  //   formData.append("folder", "web");
  //   formData.append("subfolder", "signature");
  //   formData.append("media", blob, "signature.png");

  //   try {
  //     const res = await axios.post(
  //       "https://api-media.inovatiftujuh8.com/api/v1/media/upload",
  //       formData
  //     );
  //     const fileUrl = res.data?.data?.path;

  //     if (fileUrl) {
  //       Swal.fire({
  //         title: "Berhasil",
  //         text: "Tanda tangan berhasil diupload!",
  //         icon: "success",
  //         timer: 3000,
  //       });
  //       return fileUrl;
  //     } else {
  //       alert("Upload gagal, tidak ada URL yang diterima.");
  //       return null;
  //     }
  //   } catch (error) {
  //     Swal.fire({
  //       title: "Gagal",
  //       text: "Upload tanda tangan gagal. Silakan coba lagi.",
  //       icon: "error",
  //       timer: 3000,
  //     });
  //     return null;
  //   }
  // };

  // const handleSaveSignature = async () => {
  //   const canvas = signatureRef.current?.getCanvas();
  //   if (!canvas) return;

  //   const dataUrl = getSignatureDataUrlWithWhiteBackground(canvas);
  //   if (!dataUrl) {
  //     alert("Tanda tangan kosong.");
  //     return;
  //   }

  //   localStorage.setItem("signature", dataUrl);

  //   const uploadedUrl = await uploadSignature(dataUrl);

  //   if (uploadedUrl) {
  //     onSignatureSave(uploadedUrl);
  //     signatureRef.current?.off();
  //     setIsSignatureSaved(true);
  //   }
  // };

  // const handleClearSignature = () => {
  //   signatureRef.current?.clear();
  //   signatureRef.current?.on();
  //   setIsSignatureSaved(false);
  //   localStorage.removeItem("signature");
  //   localStorage.setItem(
  //     "formPemodal",
  //     JSON.stringify({ ...formPemodal, signature: "" })
  //   );
  // };

  // useEffect(() => {
  //   const storedSignature = localStorage.getItem("signature");

  //   if (storedSignature && signatureRef.current) {
  //     const img = new Image();
  //     img.src = storedSignature;
  //     img.onload = () => {
  //       const canvas = signatureRef.current?.getCanvas();
  //       const ctx = canvas?.getContext("2d");
  //       ctx?.drawImage(img, 0, 0);
  //       signatureRef.current?.off();
  //       setIsSignatureSaved(true);
  //     };
  //   }
  // }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const keyName = e.target.getAttribute("data-keyname");
    if (!file || !keyName) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("Ukuran file maksimal 10MB");
      return;
    }

    const compressedFile = await compressImage(file);

    const formData = new FormData();
    formData.append("folder", "web");
    formData.append("subfolder", keyName);
    formData.append("media", compressedFile);

    setUploadStatus((prev) => ({ ...prev, [keyName]: true }));
    try {
      const res = await axios.post(
        `${API_BACKEND_MEDIA}/api/v1/media/upload`,
        formData
      );
      const fileUrl = res.data?.data?.path;
      if (fileUrl) {
        const labelMap: { [key: string]: string } = {
          ktpUrl: "KTP",
          rekeningKoran: "Rekening Koran",
          npwpUrl: "NPWP Perusahaan",
          fotoPemodalUrl: "Foto Pemodal",
        };

        const formattedKey = labelMap[keyName] || keyName;

        Swal.fire({
          title: "Berhasil",
          text: `Upload ${formattedKey} berhasil!`,
          icon: "success",
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
        });

        onUploadKTP(fileUrl, keyName ?? "");
      } else {
        alert("Upload gagal, tidak ada URL yang diterima.");
      }
    } catch (error) {
      console.error("Gagal upload KTP:", error);
      Swal.fire({
        title: "Gagal",
        text: `Upload ${keyName} gagal. Silakan coba lagi.`,
        icon: "warning",
        timer: 3000,
      });
    } finally {
      setUploadStatus((prev) => ({ ...prev, [keyName]: false }));
    }
  };

  useEffect(() => {
    const fetchProvince = async () => {
      try {
        const response = await axios.get(`${urlWilayah}/wilayah/province`);
        setProvince(response.data.data);
      } catch (error) {
        console.error("Gagal ambil province:", error);
      }
    };

    fetchProvince();
  }, []);

  useEffect(() => {
    if (!selectedProvincePekerjaan) return;
    const fetchCity = async () => {
      try {
        const response = await axios.get(`${urlWilayah}/wilayah/city`, {
          params: {
            code: selectedProvincePekerjaan?.value,
          },
        });
        setCity(response.data.data);
      } catch (error) {
        console.error("Gagal ambil city:", error);
      }
    };

    fetchCity();
  }, [selectedProvincePekerjaan]);

  useEffect(() => {
    if (!selectedCityPekerjaan) return;
    const fetchDistrict = async () => {
      try {
        const response = await axios.get(`${urlWilayah}/wilayah/district`, {
          params: {
            code: selectedCityPekerjaan?.value,
          },
        });
        setDistrict(response.data.data);
      } catch (error) {
        console.error("Gagal ambil district:", error);
      }
    };

    fetchDistrict();
  }, [selectedCityPekerjaan]);

  useEffect(() => {
    if (!selectedDistrictPekerjaan) return;
    const fetchSubDistrict = async () => {
      try {
        const response = await axios.get(`${urlWilayah}/wilayah/subdistrict`, {
          params: {
            code: selectedDistrictPekerjaan?.value,
          },
        });
        setSubDistrict(response.data.data);
      } catch (error) {
        console.error("Gagal ambil subdistrict:", error);
      }
    };

    fetchSubDistrict();
  }, [selectedDistrictPekerjaan]);

  useEffect(() => {
    if (!selectedSubDistrictPekerjaan) return;
    const fetchPosCode = async () => {
      try {
        const response = await axios.get(`${urlWilayah}/wilayah/postalcode`, {
          params: {
            code: selectedSubDistrictPekerjaan?.value,
          },
        });

        setPosCode(response?.data?.data?.postal_code || "");
      } catch (error) {
        console.error("Gagal ambil subdistrict:", error);
      }
    };

    fetchPosCode();
  }, [selectedSubDistrictPekerjaan]);

  useEffect(() => {
    onAlamatChange({
      provincePekerjaan: selectedProvincePekerjaan,
      cityPekerjaan: selectedCityPekerjaan,
      districtPekerjaan: selectedDistrictPekerjaan,
      subDistrictPekerjaan: selectedSubDistrictPekerjaan,
      posCodePekerjaan: posCode,
    });
  }, [
    selectedProvincePekerjaan,
    selectedCityPekerjaan,
    selectedDistrictPekerjaan,
    selectedSubDistrictPekerjaan,
    posCode,
  ]);

  useEffect(() => {
    // if (!formData || !province.length) return;
    if (Object.keys(formData).length && formData.provincePekerjaan) {
      setSelectedProvincePekerjaan(formData.provincePekerjaan);
    }

    if (Object.keys(formData).length && formData.cityPekerjaan) {
      setSelectedCityPekerjaan(formData.cityPekerjaan);
    }

    if (Object.keys(formData).length && formData.districtPekerjaan) {
      setSelectedDistrictPekerjaan(formData.districtPekerjaan);
    }

    if (Object.keys(formData).length && formData.subDistrictPekerjaan) {
      setSelectedSubDistrictPekerjaan(formData.subDistrictPekerjaan);
    }

    if (Object.keys(formData).length && formData.posCodePekerjaan) {
      setPosCode(formData.posCodePekerjaan);
    }
  }, []);

  const customOptions = province.map(
    (province: { code: string; nama: string }) => ({
      value: province.code,
      label: province.nama,
    })
  );

  const customOptionsCity = city.map(
    (city: { code: string; nama: string }) => ({
      value: city.code,
      label: city.nama,
    })
  );

  const customOptionsDistrict = district.map(
    (district: { code: string; nama: string }) => ({
      value: district.code,
      label: district.nama,
    })
  );

  const customOptionsSubDistrict = subDistrict.map(
    (subDistrict: { code: string; nama: string }) => ({
      value: subDistrict.code,
      label: subDistrict.nama,
    })
  );

  const formatOptionLabel = ({ label, icon }: any) => (
    <div className="flex items-center gap-2">
      {/* <img src={icon} alt={label} className="w-5 h-5" /> */}
      <span>{label}</span>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-lg md:text-xl font-bold mb-4">
          3. Informasi Pekerjaan (Jika Bekerja)
        </h2>

        <div>
          <label className="text-md mb-2">
            Nama Perusahaan <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            name="namaPerusahaan"
            value={formData.namaPerusahaan}
            onChange={onChange}
            placeholder="Masukan Nama Perusahaan"
            className="border p-2 w-full rounded mb-0"
          />

          {errors?.namaPerusahaan && (
            <p className="text-red-500 text-sm mt-1 mb-1">
              {errors.namaPerusahaan[0]}
            </p>
          )}
        </div>

        <div>
          <label className="text-md mb-2">
            Jabatan <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            name="jabatan"
            value={formData.jabatan}
            onChange={onChange}
            placeholder="Masukan Jabatan"
            className="border p-2 w-full rounded mb-0"
          />

          {errors?.jabatan && (
            <p className="text-red-500 text-sm mt-1 mb-1">
              {errors.jabatan[0]}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="address" className="text-md mb-2">
            Alamat Perusahaan
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 items-center">
            <div>
              <Select
                className="mt-0"
                value={selectedProvincePekerjaan}
                options={customOptions}
                // styles={customStyles}
                formatOptionLabel={formatOptionLabel}
                onChange={(e) => {
                  setSelectedProvincePekerjaan(e);
                  setSelectedCityPekerjaan(null);
                  setSelectedDistrictPekerjaan(null);
                  setSelectedSubDistrictPekerjaan(null);
                  setPosCode("");
                }}
                placeholder="Pilih Provinsi"
              />
              {errors?.provincePekerjaan && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.provincePekerjaan[0]}
                </p>
              )}
            </div>
            <div>
              <Select
                className="mt-0"
                value={selectedCityPekerjaan}
                options={customOptionsCity}
                // styles={customStyles}
                formatOptionLabel={formatOptionLabel}
                onChange={(e) => {
                  setSelectedCityPekerjaan(e);
                  setSelectedDistrictPekerjaan(null);
                  setSelectedSubDistrictPekerjaan(null);
                  setPosCode("");
                }}
                placeholder="Pilih Kota"
                isDisabled={!selectedProvincePekerjaan}
              />
              {errors?.cityPekerjaan && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.cityPekerjaan[0]}
                </p>
              )}
            </div>
            <div>
              <Select
                className="mt-0"
                value={selectedDistrictPekerjaan}
                options={customOptionsDistrict}
                // styles={customStyles}
                formatOptionLabel={formatOptionLabel}
                onChange={(e) => {
                  setSelectedDistrictPekerjaan(e);
                  setSelectedSubDistrictPekerjaan(null);
                  setPosCode("");
                }}
                placeholder="Pilih Kecamatan"
                isDisabled={!selectedCityPekerjaan}
              />
              {errors?.districtPekerjaan && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.districtPekerjaan[0]}
                </p>
              )}
            </div>
            <div>
              <Select
                className="mt-0"
                value={selectedSubDistrictPekerjaan}
                options={customOptionsSubDistrict}
                // styles={customStyles}
                formatOptionLabel={formatOptionLabel}
                onChange={(e) => {
                  setSelectedSubDistrictPekerjaan(e);
                  setPosCode("");
                }}
                placeholder="Pilih Kelurahan"
                isDisabled={!selectedDistrictPekerjaan}
              />
              {errors?.subDistrictPekerjaan && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.subDistrictPekerjaan[0]}
                </p>
              )}
            </div>
          </div>
          <div>
            <input
              type="number"
              name="codePos"
              placeholder="Kode Pos"
              value={posCode}
              onChange={onChange}
              className="border rounded p-2 w-full mb-2 placeholder:text-sm"
            />
            {errors?.posCodePekerjaan && (
              <p className="text-red-500 text-sm mt-1 mb-1">
                {errors.posCodePekerjaan[0]}
              </p>
            )}
          </div>
          <textarea
            id="alamatPerusahaan"
            name="alamatPerusahaan"
            value={formData.alamatPerusahaan}
            onChange={onChange}
            placeholder="Masukan Alamat Perusahaan"
            className="border p-2 w-full rounded resize-none"
            rows={4}
          />

          {errors?.alamatPerusahaan && (
            <p className="text-red-500 text-sm mt-1">
              {errors.alamatPerusahaan[0]}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="text-md mb-2">
            Penghasilan Pertahun <span className="text-red-500">*</span>
          </label>

          <Select
            options={penghasilanBulananOptions}
            placeholder="Pilih..."
            value={penghasilanBulananOptions.find(
              (opt) => opt.value === formData.penghasilanBulanan
            )}
            onChange={(selectedOption) =>
              onPenghasilanBulanan(selectedOption?.value || "")
            }
            className="react-select-container"
            classNamePrefix="react-select"
          />
          {errors?.penghasilanBulanan && (
            <p className="text-red-500 text-sm mt-1">
              {errors.penghasilanBulanan[0]}
            </p>
          )}
        </div>

        <h2 className="text-lg md:text-xl font-bold mb-4">4. Profil Resiko</h2>
        <label className="text-md mb-2">
          Tujuan Investasi <span className="text-red-500">*</span>
        </label>

        <div className="mb-4">
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tujuanInvestasi.map((option) => (
              <label
                key={option}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="tujuanInvestasi"
                  value={option}
                  checked={formData.tujuanInvestasi === option}
                  onChange={() => onTujuanInvetasi(option)}
                  className="form-radio text-purple-600"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
          {formData.tujuanInvestasi === "Lainnya" && (
            <input
              type="text"
              name="tujuanInvestasiLainnya"
              value={formData.tujuanInvestasiLainnya}
              onChange={onChange}
              placeholder="Lainnya"
              className="mt-3 border p-2 w-full rounded text-sm"
            />
          )}

          {errors?.tujuanInvestasi && (
            <p className="text-red-500 text-sm mt-1">
              {errors.tujuanInvestasi[0]}
            </p>
          )}
          {formData.tujuanInvestasi === "Lainnya" &&
            errors?.tujuanInvestasiLainnya && (
              <p className="text-red-500 text-sm mt-1">
                {errors.tujuanInvestasiLainnya[0]}
              </p>
            )}
        </div>

        <div className="mb-4">
          <label className="text-md mb-2">
            Toleransi Resiko <span className="text-red-500">*</span>
          </label>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {toleransiResiko.map((item) => (
              <label
                key={item}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="toleransiResiko"
                  value={item}
                  checked={formData.toleransiResiko === item}
                  onChange={() => onToleransiResiko(item)}
                  className="form-radio text-[#4821C2]"
                />
                <span className="text-gray-700">{item}</span>
              </label>
            ))}
          </div>
          {errors?.toleransiResiko && (
            <p className="text-red-500 text-sm mt-1">
              {errors.toleransiResiko[0]}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="text-md mb-2">
            Pengalaman Investasi <span className="text-red-500">*</span>
          </label>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pengalamanInvestasi.map((item) => (
              <label
                key={item}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="pengalamanInvestasi"
                  value={item}
                  checked={formData.pengalamanInvestasi === item}
                  onChange={() => onPengalamanInvestasi(item)}
                  className="form-radio text-[#4821C2]"
                />
                <span className="text-gray-700">{item}</span>
              </label>
            ))}
          </div>
          {errors?.pengalamanInvestasi && (
            <p className="text-red-500 text-sm mt-1">
              {errors.pengalamanInvestasi[0]}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label className="text-md mb-2">
            Pengetahuan Tentang Pasar Modal{" "}
            <span className="text-red-500">*</span>
          </label>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pengetahuanPasarModal.map((item) => (
              <label
                key={item}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="pengetahuanPasarModal"
                  value={item}
                  checked={formData.pengetahuanPasarModal === item}
                  onChange={() => onPengetahuanPasarModal(item)}
                  className="form-radio text-[#4821C2]"
                />
                <span className="text-gray-700">{item}</span>
              </label>
            ))}
          </div>
          {errors?.pengetahuanPasarModal && (
            <p className="text-red-500 text-sm mt-1">
              {errors.pengetahuanPasarModal[0]}
            </p>
          )}
        </div>
      </div>

      {/* KANAN */}
      <div>
        <div className="mb-4 mt-4">
          <label className="text-md mb-2">
            NPWP Perusahaan <span className="text-red-500">*</span>
          </label>

          <p className="text-sm text-gray-400 mb-2">
            File maksimal berukuran 10mb
          </p>

          {/* Input File yang disembunyikan */}
          <input
            type="file"
            id="npwpUrlUpload"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploadStatus["npwpUrl"] === true}
            accept="application/pdf, image/*"
            data-keyname="npwpUrl"
          />

          {/* Label sebagai tombol */}
          <label
            htmlFor="npwpUrlUpload"
            className="inline-flex text-sm items-center gap-2 py-2 px-4 bg-gray-800 text-white rounded-lg cursor-pointer hover:bg-gray-800 transition"
          >
            <>
              <FaFileAlt />
              Upload Dokumen
            </>
          </label>
        </div>
        {typeof window !== "undefined" && formData.npwpUrl && (
          <button
            type="button"
            onClick={onLihatNPWP}
            className="text-blue-600 underline text-sm block mt-2 mb-2"
          >
            Lihat NPWP
          </button>
        )}

        {errors?.npwpUrl && (
          <p className="text-red-500 text-sm mt-1">{errors.npwpUrl[0]}</p>
        )}

        <div className="mb-4 mt-4">
          <label className="text-md mb-2">
            Foto Pemodal <span className="text-red-500">*</span>
          </label>

          <p className="text-sm text-gray-400 mb-2">
            File maksimal berukuran 10mb
          </p>

          {/* Input File yang disembunyikan */}
          <input
            type="file"
            id="fotoPemodalUrlUpload"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploadStatus["fotoPemodalUrl"] === true}
            accept="image/*"
            data-keyname="fotoPemodalUrl"
          />

          {/* Label sebagai tombol */}
          <label
            htmlFor="fotoPemodalUrlUpload"
            className="inline-flex text-sm items-center gap-2 py-2 px-4 bg-gray-800 text-white rounded-lg cursor-pointer hover:bg-gray-800 transition"
          >
            <>
              <FaFileAlt />
              Upload Dokumen
            </>
            {/* )} */}
          </label>
        </div>
        {typeof window !== "undefined" && formData.fotoPemodalUrl && (
          <button
            type="button"
            onClick={onLihatFotoPemodal}
            className="text-blue-600 underline text-sm block mt-2 mb-2"
          >
            Lihat Foto Pemodal
          </button>
        )}

        {errors?.fotoPemodalUrl && (
          <p className="text-red-500 text-sm mt-1">
            {errors.fotoPemodalUrl[0]}
          </p>
        )}

        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">
            Pernyataan Kebenaran Data
          </h3>
          <p className="text-sm text-gray-500 mb-3">
            Dengan ini saya menyatakan bahwa seluruh data yang saya berikan
            adalah benar, akurat, dan sesuai dengan kondisi saat ini. Saya
            bertanggung jawab penuh atas data yang diinput dan memahami bahwa
            ketidaksesuaian informasi dapat berdampak pada proses investasi.
          </p>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="setujuKebenaranData"
              checked={formData.setujuKebenaranData}
              onChange={onCheckboxChange}
              className="form-checkbox text-[#4821C2]"
            />
            <span className="text-sm font-medium text-gray-700">
              Ya, saya setuju
            </span>
          </label>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">
            Pernyataan Memahami Risiko Investasi
          </h3>
          <p className="text-sm text-gray-500 mb-3">
            Saya memahami bahwa setiap investasi mengandung risiko, termasuk
            kemungkinan kehilangan sebagian atau seluruh dana yang
            diinvestasikan.
          </p>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="setujuRisikoInvestasi"
              checked={formData.setujuRisikoInvestasi}
              onChange={onCheckboxChange}
              className="form-checkbox text-[#4821C2]"
            />
            <span className="text-sm font-medium text-gray-700">
              Ya, saya setuju
            </span>
          </label>
        </div>

        {/* <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">
            Tanda Tangan Pemohon
          </h3>
          <div
            className="border border-gray-500 rounded bg-white overflow-visible"
            style={{ width: SIG_W, height: SIG_H }}
          >
            <SignatureCanvas
              ref={signatureRef}
              penColor="black"
              onEnd={() => {
                if (signatureRef.current) {
                  setIsEmpty(signatureRef.current.isEmpty());
                }
              }}
              canvasProps={{
                width: SIG_W,
                height: SIG_H,
                className: "sigCanvas block",
              }}
            />
          </div>

          <div className="flex gap-4 mt-3">
            <button
              type="button"
              onClick={() => {
                handleClearSignature();
                Swal.fire({
                  title: "Berhasil",
                  text: "Tanda tangan berhasil dihapus!",
                  icon: "success",
                  timer: 3000,
                });
              }}
              disabled={!isSignatureSaved}
              className={`px-3 py-1 text-white text-sm rounded ${
                !isSignatureSaved
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              Hapus
            </button>

            <button
              type="button"
              disabled={isSignatureSaved}
              onClick={handleSaveSignature}
              className={`px-3 py-1 text-white text-sm rounded ${
                isSignatureSaved
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500"
              }`}
            >
              Simpan Tanda Tangan
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default ComponentDataPekerjaan;
