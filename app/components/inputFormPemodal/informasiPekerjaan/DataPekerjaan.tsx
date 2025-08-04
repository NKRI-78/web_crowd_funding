import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaFileAlt } from "react-icons/fa";
import Select from "react-select";
import { API_BACKEND_MEDIA } from "@/app/utils/constant";
import { compressImage } from "@/app/helper/CompressorImage";
import UpdateRing from "../component/UpdateRing";

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
  dataProfile: {
    id: string;
    fullname: string;
    avatar: string;
    last_education: string;
    gender: string;
    status_marital: string;
    address_detail: string;
    occupation: string;
    investor: {
      bank: {
        no: string;
        bank_name: string;
        bank_owner: string;
        bank_branch: string;
        rek_koran_path: string;
        created_at: string;
      };
      ktp: {
        name: string;
        nik: string;
        place_datebirth: string;
        path: string;
        created_at: string;
      };
      job: {
        province_name: string;
        city_name: string;
        district_name: string;
        subdistrict_name: string;
        postal_code: string;
        company_name: string;
        company_address: string;
        monthly_income: string;
        npwp_path: string;
        position: string;
      };
      risk: {
        goal: string;
        tolerance: string;
        experience: string;
        capital_market_knowledge: string;
      };
    };
    form: string;
  };
  isUpdate: boolean;
}

const ComponentDataPekerjaan: React.FC<Props> = ({
  formData,
  onChange,
  onPenghasilanBulanan,
  onTujuanInvetasi,
  onToleransiResiko,
  onPengalamanInvestasi,
  onPengetahuanPasarModal,
  onCheckboxChange,
  onUploadKTP,
  onAlamatChange,
  errors,
  onLihatNPWP,
  onLihatFotoPemodal,
  dataProfile,
  isUpdate,
}) => {
  type OptionType = { value: string; label: string } | null;

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
    if (
      selectedProvincePekerjaan &&
      selectedCityPekerjaan &&
      selectedDistrictPekerjaan &&
      selectedSubDistrictPekerjaan &&
      posCode
    ) {
      onAlamatChange({
        provincePekerjaan: selectedProvincePekerjaan,
        cityPekerjaan: selectedCityPekerjaan,
        districtPekerjaan: selectedDistrictPekerjaan,
        subDistrictPekerjaan: selectedSubDistrictPekerjaan,
        posCodePekerjaan: posCode,
      });
    }
  }, [
    selectedProvincePekerjaan,
    selectedCityPekerjaan,
    selectedDistrictPekerjaan,
    selectedSubDistrictPekerjaan,
    posCode,
  ]);

  useEffect(() => {
    if (isUpdate && dataProfile?.investor?.risk) {
      onTujuanInvetasi(dataProfile.investor.risk.goal || "");
      onToleransiResiko(dataProfile.investor.risk.tolerance || "");
      onPengalamanInvestasi(dataProfile.investor.risk.experience || "");
      onPengetahuanPasarModal(
        dataProfile.investor.risk.capital_market_knowledge || ""
      );
    }
  }, []);

  useEffect(() => {
    if (isUpdate && dataProfile?.investor?.job) {
      const job = dataProfile.investor.job;

      onChange({
        target: {
          name: "namaPerusahaan",
          value: job.company_name || "",
        },
      } as React.ChangeEvent<HTMLInputElement>);

      onChange({
        target: {
          name: "alamatPerusahaan",
          value: job.company_address || "",
        },
      } as React.ChangeEvent<HTMLInputElement>);

      onChange({
        target: {
          name: "jabatan",
          value: job.position || "",
        },
      } as React.ChangeEvent<HTMLInputElement>);

      onPenghasilanBulanan(job.monthly_income || "");

      setSelectedProvincePekerjaan({
        value: job.province_name,
        label: job.province_name,
      });

      setSelectedCityPekerjaan({
        value: job.city_name,
        label: job.city_name,
      });

      setSelectedDistrictPekerjaan({
        value: job.district_name,
        label: job.district_name,
      });

      setSelectedSubDistrictPekerjaan({
        value: job.subdistrict_name,
        label: job.subdistrict_name,
      });

      setPosCode(job.postal_code || "");
    }
  }, [isUpdate, dataProfile]);

  useEffect(() => {
    if (formData?.provincePekerjaan) {
      setSelectedProvincePekerjaan(formData.provincePekerjaan);
    }
    if (formData?.cityPekerjaan) {
      setSelectedCityPekerjaan(formData.cityPekerjaan);
    }
    if (formData?.districtPekerjaan) {
      setSelectedDistrictPekerjaan(formData.districtPekerjaan);
    }
    if (formData?.subDistrictPekerjaan) {
      setSelectedSubDistrictPekerjaan(formData.subDistrictPekerjaan);
    }
    if (formData?.posCodePekerjaan) {
      console.log("Prefill posCode berhasil:", formData.posCodePekerjaan);
      setPosCode(formData.posCodePekerjaan);
    }
  }, [formData]);

  const customOptions = province.map(
    (province: { code: string; nama: string }) => ({
      value: province.code,
      label: province.nama,
    })
  );

  const customOptionsCity = city?.map(
    (city: { code: string; nama: string }) => ({
      value: city.code,
      label: city.nama,
    })
  );

  const customOptionsDistrict = district?.map(
    (district: { code: string; nama: string }) => ({
      value: district.code,
      label: district.nama,
    })
  );

  const customOptionsSubDistrict = subDistrict?.map(
    (subDistrict: { code: string; nama: string }) => ({
      value: subDistrict.code,
      label: subDistrict.nama,
    })
  );

  const formatOptionLabel = ({ label, icon }: any) => (
    <div className="flex items-center gap-2">
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
              name="posCodePekerjaan"
              placeholder="Kode Pos"
              value={formData.posCodePekerjaan || ""}
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
          <UpdateRing
            identity={`${dataProfile?.form}`}
            // formKey={dataProfile?.form}
            formKey="npwp"
          >
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
          </UpdateRing>
        </div>

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
      </div>
    </div>
  );
};

export default ComponentDataPekerjaan;
