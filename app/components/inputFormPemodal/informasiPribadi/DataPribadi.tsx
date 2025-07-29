"use client";
// ComponentDataPribadi.tsx
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { FaFileAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import Select from "react-select";
import { API_BACKEND_MEDIA } from "@/app/utils/constant";

interface Props {
  formData: {
    nama: string;
    nik: string;
    tempatLahir: string;
    tanggalLahir: string;
    jenisKelamin: string;
    statusPernikahan: string;
    pendidikanTerakhir: string;
    pekerjaan: string;
    pekerjaanLainnya: string;
    addres: string;
    namaBank: { value: string; label: string };
    nomorRekening: string;
    namaPemilik: string;
    cabangBank: string;
    ktpUrl: string;
    rekeningKoran: string;
    provincePribadi: { value: string; label: string };
    cityPribadi: { value: string; label: string };
    districtPribadi: { value: string; label: string };
    subDistrictPribadi: { value: string; label: string };
    posCode: string;
  };
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  onGenderChange: (value: string) => void;
  onWeddingChange: (value: string) => void;
  onEducationChange: (value: string) => void;
  onPekerjaanChange: (value: string) => void;
  onUploadKTP: (url: string, keyName: string) => void;
  onAlamatChange: (alamat: {
    provincePribadi: { value: string; label: string } | null;
    cityPribadi: { value: string; label: string } | null;
    districtPribadi: { value: string; label: string } | null;
    subDistrictPribadi: { value: string; label: string } | null;
    posCode: string;
  }) => void;
  errors?: Record<string, string[]>;
  onBankChange: (bank: { value: string; label: string } | null) => void;
}

const ComponentDataPribadi: React.FC<Props> = ({
  formData,
  onChange,
  onGenderChange,
  onWeddingChange,
  onEducationChange,
  onPekerjaanChange,
  onUploadKTP,
  onAlamatChange,
  errors,
  onBankChange,
}) => {
  type OptionType = { value: string; label: string } | null;

  const optionsGender = ["Laki-Laki", "Perempuan"];
  const optionsPernikahan = ["Belum Menikah", "Menikah", "Cerai"];
  const optionsLastEducation = [
    "SD",
    "SMP",
    "SMA",
    "Diploma",
    "Sarjana",
    "Pascasarjana",
  ];
  const pekerjaanOptions = ["PNS", "Swasta", "Wiraswasta", "Lainnya"];
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [province, setProvince] = useState<any>([]);
  const [selectedProvincePribadi, setSelectedProvincePribadi] =
    useState<OptionType>(() => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("selectedSubDistrict");
        return saved ? JSON.parse(saved) : null;
      }
      return null;
    });
  const [city, setCity] = useState<any>([]);
  const [selectedCityPribadi, setSelectedCityPribadi] =
    useState<OptionType>(null);
  const [district, setDistrict] = useState<any>([]);
  const [selectedDistrictPribadi, setSelectedDistrictPribadi] =
    useState<OptionType>(null);
  const [subDistrict, setSubDistrict] = useState<any>([]);
  const [selectedSubDistrictPribadi, setSelectedSubDistrictPribadi] =
    useState<OptionType>(null);
  const [posCode, setPosCode] = useState("");
  const [bank, setBank] = useState<any>([]);
  const [selectedBank, setSelectedBank] = useState<OptionType>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const urlWilayah = "https://api.wilayah.site";

  const today = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(today.getFullYear() - 17);

  const [localFormData, setLocalFormData] = useState<any>({});
  const [hasMounted, setHasMounted] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const keyName = e.target.getAttribute("data-keyname");
    if (!file || !keyName) return;

    // Validasi maksimal 10MB
    if (file.size > 10 * 1024 * 1024) {
      // alert("Ukuran file maksimal 10MB");
      Swal.fire({
        title: "Warning",
        text: `Ukuran file maksimal 10MB!`,
        icon: "warning",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      return;
    }

    const formData = new FormData();
    formData.append("folder", "web");
    formData.append("subfolder", keyName);
    formData.append("media", file);

    // setIsUploading(true);
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
          // rekeningKoran: "Rekening Koran",
          npwpUrl: "NPWP Perusahaan",
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
      // alert("Upload gagal. Silakan coba lagi.");
      Swal.fire({
        title: "Gagal",
        text: `Upload ${keyName} gagal. Silakan coba lagi.`,
        icon: "warning",
        timer: 3000,
      });
    } finally {
      // setIsUploading(false);
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
    if (!selectedProvincePribadi) return;
    const fetchCity = async () => {
      try {
        const response = await axios.get(`${urlWilayah}/wilayah/city`, {
          params: {
            code: selectedProvincePribadi?.value,
          },
        });
        setCity(response.data.data);
      } catch (error) {
        console.error("Gagal ambil city:", error);
      }
    };

    fetchCity();
  }, [selectedProvincePribadi]);

  useEffect(() => {
    if (!selectedCityPribadi) return;
    const fetchDistrict = async () => {
      try {
        const response = await axios.get(`${urlWilayah}/wilayah/district`, {
          params: {
            code: selectedCityPribadi?.value,
          },
        });
        setDistrict(response.data.data);
      } catch (error) {
        console.error("Gagal ambil district:", error);
      }
    };

    fetchDistrict();
  }, [selectedCityPribadi]);

  useEffect(() => {
    if (!selectedDistrictPribadi) return;
    const fetchSubDistrict = async () => {
      try {
        const response = await axios.get(`${urlWilayah}/wilayah/subdistrict`, {
          params: {
            code: selectedDistrictPribadi?.value,
          },
        });
        setSubDistrict(response.data.data);
      } catch (error) {
        console.error("Gagal ambil subdistrict:", error);
      }
    };

    fetchSubDistrict();
  }, [selectedDistrictPribadi]);

  useEffect(() => {
    if (!selectedSubDistrictPribadi) return;
    const fetchPosCode = async () => {
      try {
        const response = await axios.get(`${urlWilayah}/wilayah/postalcode`, {
          params: {
            code: selectedSubDistrictPribadi?.value,
          },
        });

        setPosCode(response?.data?.data?.postal_code || "");
      } catch (error) {
        console.error("Gagal ambil subdistrict:", error);
      }
    };

    fetchPosCode();
  }, [selectedSubDistrictPribadi]);

  useEffect(() => {
    const fetchBank = async () => {
      try {
        const response = await axios.get(
          `https://api.gateway.langitdigital78.com/v1/bank`
        );
        setBank(response.data.data.beneficiary_banks);
      } catch (error) {
        console.error("Gagal ambil bank:", error);
      }
    };

    fetchBank();
  }, []);

  useEffect(() => {
    onAlamatChange({
      provincePribadi: selectedProvincePribadi,
      cityPribadi: selectedCityPribadi,
      districtPribadi: selectedDistrictPribadi,
      subDistrictPribadi: selectedSubDistrictPribadi,
      posCode: posCode,
    });
  }, [
    selectedProvincePribadi,
    selectedCityPribadi,
    selectedDistrictPribadi,
    selectedSubDistrictPribadi,
    posCode,
  ]);

  useEffect(() => {
    onBankChange(selectedBank);
  }, [selectedBank]);

  useEffect(() => {
    // if (!formData || !province.length) return;
    if (Object.keys(formData).length && formData.provincePribadi) {
      setSelectedProvincePribadi(formData.provincePribadi);
    }

    if (Object.keys(formData).length && formData.cityPribadi) {
      setSelectedCityPribadi(formData.cityPribadi);
    }

    if (Object.keys(formData).length && formData.districtPribadi) {
      setSelectedDistrictPribadi(formData.districtPribadi);
    }

    if (Object.keys(formData).length && formData.subDistrictPribadi) {
      setSelectedSubDistrictPribadi(formData.subDistrictPribadi);
    }

    if (Object.keys(formData).length && formData.posCode) {
      setPosCode(formData.posCode);
    }

    if (Object.keys(formData).length && formData.namaBank) {
      setSelectedBank(formData.namaBank);
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

  const customOptionsBank = bank.map(
    (bank: { code: string; name: string }) => ({
      value: bank.code,
      label: bank.name,
    })
  );

  const formatOptionLabel = ({ label, icon }: any) => (
    <div className="flex items-center gap-2">
      {/* <img src={icon} alt={label} className="w-5 h-5" /> */}
      <span>{label}</span>
    </div>
  );

  const tanggalLahirDate = useMemo(() => {
    return formData.tanggalLahir ? new Date(formData.tanggalLahir) : undefined;
  }, [formData.tanggalLahir]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 justify-center gap-6 p-6 max-w-6xl mx-auto">
      <div>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Isi Data Sebagai Pemodal</h2>
          <p className="text-sm text-gray-600">
            Untuk memastikan kelancaran proses verifikasi dan layanan yang
            optimal, kami mengajak Anda untuk melengkapi seluruh data secara
            jujur, benar, dan akurat.
          </p>

          <h3 className="font-semibold text-black">1. Informasi Pribadi</h3>

          <div>
            <label className="text-sm font-medium mb-2">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={onChange}
              placeholder="Nama"
              className="border p-2 w-full rounded mb-0 placeholder:text-sm"
            />
            {errors?.nama && (
              <p className="text-red-500 text-sm mt-1">{errors.nama[0]}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium mb-2">
              NIK KTP <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nik"
              value={formData.nik}
              onChange={onChange}
              placeholder="NIK KTP"
              className="border p-2 w-full rounded mb-0 placeholder:text-sm"
            />
            {errors?.nik && (
              <p className="text-red-500 text-sm mt-1">{errors.nik[0]}</p>
            )}
          </div>

          <div className="flex gap-2">
            <div>
              <label className="text-sm font-medium mb-2">
                Tempat Lahir <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="tempatLahir"
                value={formData.tempatLahir}
                onChange={onChange}
                placeholder="Tempat Lahir"
                className="border p-2 w-full rounded mb-4 placeholder:text-sm"
              />
              {errors?.tempatLahir && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.tempatLahir[0]}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium mb-2">
                Tanggal Lahir <span className="text-red-500">*</span>
              </label>
              {/* <input
              type="text"
              name="tanggalLahir"
              value={formData.tanggalLahir}
              onChange={onChange}
              placeholder="Tanggal Lahir"
              className="border p-2 w-full rounded mb-4"
            /> */}

              <Flatpickr
                options={{
                  dateFormat: "d-m-Y",
                  // maxDate: "today",
                  maxDate: maxDate,
                }}
                value={tanggalLahirDate}
                onChange={(selectedDates) => {
                  const selectedDate = selectedDates[0];
                  if (selectedDate) {
                    const formatted = selectedDate.toISOString().split("T")[0];
                    onChange({
                      target: {
                        name: "tanggalLahir",
                        value: formatted,
                      },
                    } as React.ChangeEvent<HTMLInputElement>);
                  }
                }}
                placeholder="Tanggal Lahir"
                className="border p-2 w-full rounded mb-4 placeholder:text-sm"
              />
              {errors?.tanggalLahir && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.tanggalLahir[0]}
                </p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="text-md mb-2">
              Jenis Kelamin <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-6">
              {optionsGender.map((gender) => (
                <label
                  key={gender}
                  className="flex items-center gap-2 cursor-pointer text-sm"
                >
                  <input
                    type="radio"
                    name="jenisKelamin"
                    value={gender}
                    checked={formData.jenisKelamin === gender}
                    onChange={() => onGenderChange(gender)}
                    className="form-radio text-[#4821C2]"
                  />
                  <span className="text-gray-700">{gender}</span>
                </label>
              ))}
            </div>
            {errors?.jenisKelamin && (
              <p className="text-red-500 text-sm mt-1">
                {errors.jenisKelamin[0]}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="text-md mb-2">
              Status Pernikahan <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-6">
              {optionsPernikahan.map((wedding) => (
                <label
                  key={wedding}
                  className="flex text-sm items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="statusPernikahan"
                    value={wedding}
                    checked={formData.statusPernikahan === wedding}
                    onChange={() => onWeddingChange(wedding)}
                    className="form-radio text-[#4821C2]"
                  />
                  <span className="text-gray-700">{wedding}</span>
                </label>
              ))}
            </div>
            {errors?.statusPernikahan && (
              <p className="text-red-500 text-sm mt-1">
                {errors.statusPernikahan[0]}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="text-sm font-medium mb-2">
              Upload KTP <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-2">
              File maksimal berukuran 10mb
            </p>

            {/* Input File yang disembunyikan */}
            <input
              type="file"
              id="ktpUpload"
              className="hidden"
              onChange={handleFileChange}
              disabled={uploadStatus["ktpUrl"] === true}
              accept="application/pdf, image/*"
              data-keyname="ktpUrl"
            />

            {/* Label sebagai tombol */}
            <label
              htmlFor="ktpUpload"
              className="inline-flex text-sm items-center gap-2 py-2 px-4 bg-gray-800 text-white rounded-lg cursor-pointer hover:bg-gray-800 transition"
              // className={`inline-flex items-center gap-2 px-4 py-2 ${
              //   uploadStatus["ktpUrl"]
              //     ? "bg-gray-400 cursor-not-allowed"
              //     : "bg-[#505050] hover:bg-gray-800"
              // } text-white rounded-md transition`}
            >
              <>
                <FaFileAlt />
                Upload Dokumen
              </>
            </label>
          </div>
          <>
            {isClient && formData.ktpUrl && (
              <a
                href={formData.ktpUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline text-sm block mt-2 mb-2"
              >
                Lihat KTP
              </a>
            )}
          </>
          {errors?.ktpUrl && (
            <p className="text-red-500 text-sm mt-1">{errors.ktpUrl[0]}</p>
          )}
          <div className="mb-4">
            <label className="text-md mb-2">
              Pendidikan Terakhir <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-y-2 gap-x-4">
              {optionsLastEducation.map((education) => (
                <label
                  key={education}
                  className="flex text-sm items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="pendidikanTerakhir"
                    value={education}
                    checked={formData.pendidikanTerakhir === education}
                    onChange={() => onEducationChange(education)}
                    className="form-radio text-[#4821C2]"
                  />
                  <span className="text-gray-700">{education}</span>
                </label>
              ))}
            </div>
            {errors?.pendidikanTerakhir && (
              <p className="text-red-500 text-sm mt-1">
                {errors.pendidikanTerakhir[0]}
              </p>
            )}
          </div>
        </div>

        <div className="mb-4 mt-2">
          <label className="text-md mb-2">
            Pekerjaan <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-6">
            {pekerjaanOptions.map((option) => (
              <label
                key={option}
                className="flex text-sm items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="pekerjaan"
                  value={option}
                  checked={formData.pekerjaan === option}
                  onChange={() => onPekerjaanChange(option)}
                  className="form-radio text-purple-600"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>

          {formData.pekerjaan === "Lainnya" && (
            <input
              type="text"
              name="pekerjaanLainnya"
              value={formData.pekerjaanLainnya}
              onChange={onChange}
              placeholder="Lainnya"
              className="mt-3 border p-2 w-full rounded text-sm"
            />
          )}

          {errors?.pekerjaan && (
            <p className="text-red-500 text-sm mt-1">{errors.pekerjaan[0]}</p>
          )}
          {formData.pekerjaan === "Lainnya" && errors?.pekerjaanLainnya && (
            <p className="text-red-500 text-sm mt-1">
              {errors.pekerjaanLainnya[0]}
            </p>
          )}
        </div>
      </div>

      {/* form bagian kanan */}
      <div>
        <div className="mb-4">
          <label htmlFor="address" className="text-sm font-medium mb-2 mt-2">
            Alamat Lengkap <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 items-center">
            <div>
              <Select
                className="mt-0"
                value={selectedProvincePribadi}
                options={customOptions}
                // styles={customStyles}
                formatOptionLabel={formatOptionLabel}
                onChange={(e) => {
                  setSelectedProvincePribadi(e);
                  setSelectedCityPribadi(null);
                  setSelectedDistrictPribadi(null);
                  setSelectedSubDistrictPribadi(null);
                  setPosCode("");
                }}
                placeholder="Pilih Provinsi"
              />
              {errors?.provincePribadi && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.provincePribadi[0]}
                </p>
              )}
            </div>
            <div>
              <Select
                className="mt-0"
                value={selectedCityPribadi}
                options={customOptionsCity}
                // styles={customStyles}
                formatOptionLabel={formatOptionLabel}
                onChange={(e) => {
                  setSelectedCityPribadi(e);
                  setSelectedDistrictPribadi(null);
                  setSelectedSubDistrictPribadi(null);
                  setPosCode("");
                }}
                placeholder="Pilih Kota"
                isDisabled={!selectedProvincePribadi}
              />
              {errors?.cityPribadi && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.cityPribadi[0]}
                </p>
              )}
            </div>
            <div>
              <Select
                className="mt-0"
                value={selectedDistrictPribadi}
                options={customOptionsDistrict}
                // styles={customStyles}
                formatOptionLabel={formatOptionLabel}
                onChange={(e) => {
                  setSelectedDistrictPribadi(e);
                  setSelectedSubDistrictPribadi(null);
                  setPosCode("");
                }}
                placeholder="Pilih Kecamatan"
                isDisabled={!selectedCityPribadi}
              />
              {errors?.districtPribadi && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.districtPribadi[0]}
                </p>
              )}
            </div>
            <div>
              <Select
                className="mt-0"
                value={selectedSubDistrictPribadi}
                options={customOptionsSubDistrict}
                // styles={customStyles}
                formatOptionLabel={formatOptionLabel}
                onChange={(e) => {
                  setSelectedSubDistrictPribadi(e);
                  setPosCode("");
                }}
                placeholder="Pilih Kelurahan"
                isDisabled={!selectedDistrictPribadi}
              />
              {errors?.subDistrictPribadi && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.subDistrictPribadi[0]}
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
            {errors?.posCode && (
              <p className="text-red-500 text-sm mt-1 mb-1">
                {errors.posCode[0]}
              </p>
            )}
          </div>

          <textarea
            id="address"
            name="addres"
            value={formData.addres}
            onChange={onChange}
            placeholder="Alamat sesuai KTP dan alamat domisili"
            className="border p-2 w-full rounded resize-none placeholder:text-sm"
            rows={4}
          ></textarea>
          {errors?.addres && (
            <p className="text-red-500 text-sm mt-1">{errors.addres[0]}</p>
          )}
        </div>
        <h2 className="font-semibold text-black">2. Informasi Rekening Bank</h2>

        <div>
          <label className="text-sm font-medium mb-2">
            Nama Bank <span className="text-red-500">*</span>
          </label>
          {/* <input
            type="text"
            name="namaBank"
            placeholder="Nama Bank (misal: BCA)"
            value={formData.namaBank}
            onChange={onChange}
            className="border rounded p-2 w-full mb-0 placeholder:text-sm"
          /> */}
          <Select
            className="mt-0"
            value={selectedBank}
            options={customOptionsBank}
            // styles={customStyles}
            formatOptionLabel={formatOptionLabel}
            onChange={(e) => {
              setSelectedBank(e);
            }}
            placeholder="Pilih Nama Bank"
          />
          {errors?.namaBank && (
            <p className="text-red-500 text-sm mt-1">{errors.namaBank[0]}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium mb-2">
            Nomor Rekening <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nomorRekening"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Masukkan Nomor Rekening"
            value={formData.nomorRekening}
            onChange={onChange}
            className="border rounded p-2 w-full mb-0 placeholder:text-sm"
          />
          {errors?.nomorRekening && (
            <p className="text-red-500 text-sm mt-1">
              {errors.nomorRekening[0]}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium mb-2">
            Nama Pemilik Rekening <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="namaPemilik"
            placeholder="Masukkan Nama Pemilik Rekening"
            value={formData.namaPemilik}
            onChange={onChange}
            className="border rounded p-2 w-full mb-0 placeholder:text-sm"
          />
          {errors?.namaPemilik && (
            <p className="text-red-500 text-sm mt-1">{errors.namaPemilik[0]}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium mb-2">
            Cabang Bank <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="cabangBank"
            placeholder="Masukkan Cabang Bank"
            value={formData.cabangBank}
            onChange={onChange}
            className="border rounded p-2 w-full placeholder:text-sm"
          />
          {errors?.cabangBank && (
            <p className="text-red-500 text-sm mt-1">{errors.cabangBank[0]}</p>
          )}
        </div>

        {/* <div className="mb-4 mt-4">
          <label className="text-md mb-2">Rekening Koran</label>
          <p className="text-xs text-gray-500 mb-2">
            File maksimal berukuran 10mb
          </p>

          <input
            type="file"
            id="rekeningKoranUpload"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploadStatus["rekeningKoran"] === true}
            accept="application/pdf, image/*"
            data-keyname="rekeningKoran"
          />

          <label
            htmlFor="rekeningKoranUpload"
            className="inline-flex text-sm items-center gap-2 py-2 px-4 bg-gray-800 text-white rounded-lg cursor-pointer hover:bg-gray-800 transition"
          >
            <>
              <FaFileAlt />
              Upload Dokumen
            </>
          </label>
        </div>
        {formData.rekeningKoran && (
          <a
            href={formData.rekeningKoran}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline text-sm block mt-2 mb-2"
          >
            Lihat Rekening Koran
          </a>
        )} */}
      </div>
    </div>
  );
};

export default ComponentDataPribadi;
