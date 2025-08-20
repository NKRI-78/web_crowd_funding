"use client";

import React, { useState, useEffect, useMemo } from "react";
import { compressImage } from "@/app/helper/CompressorImage";
import axios from "axios";
import { API_BACKEND_MEDIA } from "@/app/utils/constant";
import Swal from "sweetalert2";
import { fetchJenisUsaha, TypeOption } from "@/app/utils/fetchJenisUsaha";
import Select from "react-select";
import { FaFileAlt } from "react-icons/fa";

interface Props {
  formData: {
    jenisPerusahaan: string;
    nomorAktaPerubahanTerakhir: string;
    nomorNpwpPerusahaan: string;
    alamatTempatUsaha: string;
    noTeleponPerusahaan: string;
    situsPerusahaan: string;
    emailPerusahaan: string;
    namaBank: { value: string; label: string };
    nomorRekening: string;
    namaPemilik: string;

    aktaPendirianPerusahaanUrl?: string;
    skPendirianUrl?: string;
    skKumhamPerusahaanUrl?: string;
    npwpPerusahaanUrl?: string;

    provincePemodalPerusahaan: { value: string; label: string };
    cityPemodalPerusahaan: { value: string; label: string };
    districtPemodalPerusahaan: { value: string; label: string };
    subDistrictPemodalPerusahaan: { value: string; label: string };
    posCode: string;
    addres: string;
  };

  errors?: Record<string, string[]>;
  onBankChange: (bank: { value: string; label: string } | null) => void;

  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;

  onUploadAktaPendirianPerusahaan: (url: string, keyName: string) => void;
  onUploadSkPendirian: (url: string, keyName: string) => void;
  onUploadSkKumhamPerusahaan: (url: string, keyName: string) => void;
  onUploadNpwpPerusahaan: (url: string, keyName: string) => void;
  onAlamatChange: (alamat: {
    provincePemodalPerusahaan: { value: string; label: string } | null;
    cityPemodalPerusahaan: { value: string; label: string } | null;
    districtPemodalPerusahaan: { value: string; label: string } | null;
    subDistrictPemodalPerusahaan: { value: string; label: string } | null;
    posCode: string;
  }) => void;
}

const ComponentDataPemodalPerusahaanV1: React.FC<Props> = ({
  formData,
  onChange,
  onUploadAktaPendirianPerusahaan,
  onBankChange,
  onAlamatChange,
  errors,
}) => {
  const [optionsBussines, setOptionsBussines] = useState<TypeOption[]>([]);
  const [uploadStatus, setUploadStatus] = useState<{ [key: string]: boolean }>(
    {}
  );

  type OptionValue = {
    value: string;
    label: string;
  };

  type OptionType = OptionValue | null;

  const [province, setProvince] = useState<any>([]);
  const [
    selectedProvincePemodalPerusahaan,
    setSelectedProvincePemodalPerusahaan,
  ] = useState<OptionType>(null);
  const [city, setCity] = useState<any>([]);
  const [selectedCityPemodalPerusahaan, setSelectedCityPemodalPerusahaan] =
    useState<OptionType>(null);

  const [district, setDistrict] = useState<any>([]);
  const [
    selectedDistrictPemodalPerusahaan,
    setSelectedDistrictPemodalPerusahaan,
  ] = useState<OptionType>(null);
  const [subDistrict, setSubDistrict] = useState<any>([]);
  const [
    selectedSubDistrictPemodalPerusahaan,
    setSelectedSubDistrictPemodalPerusahaan,
  ] = useState<OptionType>(null);
  const [posCode, setPosCode] = useState("");

  const [selectedBank, setSelectedBank] = useState<OptionType>(null);
  const [bank, setBank] = useState<any[]>([]);

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

  const urlWilayah = "https://api.wilayah.site";

  useEffect(() => {
    if (!Object.keys(formData).length) return;

    if (formData.provincePemodalPerusahaan)
      setSelectedProvincePemodalPerusahaan(formData.provincePemodalPerusahaan);
    if (formData.cityPemodalPerusahaan)
      setSelectedCityPemodalPerusahaan(formData.cityPemodalPerusahaan);
    if (formData.districtPemodalPerusahaan)
      setSelectedDistrictPemodalPerusahaan(formData.districtPemodalPerusahaan);
    if (formData.subDistrictPemodalPerusahaan)
      setSelectedSubDistrictPemodalPerusahaan(
        formData.subDistrictPemodalPerusahaan
      );
    if (formData.namaBank) setSelectedBank(formData.namaBank);

    if (formData?.posCode) {
      console.log("Prefill posCode berhasil:", formData.posCode);
      setPosCode(formData.posCode);
    }
  }, [formData]);

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
    if (!selectedProvincePemodalPerusahaan) return;
    const fetchCity = async () => {
      try {
        const response = await axios.get(`${urlWilayah}/wilayah/city`, {
          params: {
            code: selectedProvincePemodalPerusahaan?.value,
          },
        });
        setCity(response.data.data);
      } catch (error) {
        console.error("Gagal ambil city:", error);
      }
    };

    fetchCity();
  }, [selectedProvincePemodalPerusahaan]);

  useEffect(() => {
    if (!selectedCityPemodalPerusahaan) return;
    const fetchDistrict = async () => {
      try {
        const response = await axios.get(`${urlWilayah}/wilayah/district`, {
          params: {
            code: selectedCityPemodalPerusahaan?.value,
          },
        });
        setDistrict(response.data.data);
      } catch (error) {
        console.error("Gagal ambil district:", error);
      }
    };

    fetchDistrict();
  }, [selectedCityPemodalPerusahaan]);

  useEffect(() => {
    if (!selectedDistrictPemodalPerusahaan) return;
    const fetchSubDistrict = async () => {
      try {
        const response = await axios.get(`${urlWilayah}/wilayah/subdistrict`, {
          params: {
            code: selectedDistrictPemodalPerusahaan?.value,
          },
        });
        setSubDistrict(response.data.data);
      } catch (error) {
        console.error("Gagal ambil subdistrict:", error);
      }
    };

    fetchSubDistrict();
  }, [selectedDistrictPemodalPerusahaan]);

  useEffect(() => {
    if (!selectedSubDistrictPemodalPerusahaan) return;

    const fetchPosCode = async () => {
      try {
        const response = await axios.get(`${urlWilayah}/wilayah/postalcode`, {
          params: {
            code: selectedSubDistrictPemodalPerusahaan?.value,
          },
        });
        setPosCode(response?.data?.data?.postal_code || "");
        console.log("CEK", response.data);
      } catch (error) {
        console.error("Gagal ambil kode pos:", error);
      }
    };

    fetchPosCode();
  }, [selectedSubDistrictPemodalPerusahaan]);

  const customOptions = province?.map(
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

  const customOptionsBank = useMemo(() => {
    return bank.map((b) => ({
      value: b.code,
      label: b.name,
    }));
  }, [bank]);

  const formatOptionLabel = ({ label, icon }: any) => (
    <div className="flex items-center gap-2">
      <span>{label}</span>
    </div>
  );

  // Fetch options bisnis
  useEffect(() => {
    fetchJenisUsaha()
      .then(setOptionsBussines)
      .catch((err) => console.error(err));
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const keyName = e.target.getAttribute("data-keyname");
    if (!file || !keyName) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("Ukuran file maksimal 10MB");
      return;
    }

    const compressedFile = await compressImage(file);
    const formDataUpload = new FormData();
    formDataUpload.append("folder", "web");
    formDataUpload.append("subfolder", keyName);
    formDataUpload.append("media", compressedFile);

    setUploadStatus((prev) => ({ ...prev, [keyName]: true }));
    try {
      const res = await axios.post(
        `${API_BACKEND_MEDIA}/api/v1/media/upload`,
        formDataUpload
      );

      const fileUrl = res.data?.data?.path;
      if (fileUrl) {
        const labelMap: { [key: string]: string } = {
          aktaPendirianPerusahaanUrl: "Akta Pendirian Perusahaan",
          skPendirianUrl: "SK Pendirian",
          skKumhamPerusahaanUrl: "SK KUMHAM Perusahaan",
          npwpPerusahaanUrl: "NPWP Perusahaan",
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

        onUploadAktaPendirianPerusahaan(fileUrl, keyName ?? "");
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

  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: "white", // background input
      color: "black", // text input
      borderColor: state.isFocused ? "#14b8a6" : "#d1d5db", // tailwind teal-500 / gray-300
      boxShadow: state.isFocused ? "0 0 0 1px #14b8a6" : null,
      "&:hover": {
        borderColor: "#14b8a6",
      },
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: "black", // text selected
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: "#9ca3af", // text-gray-400
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#14b8a6"
        : state.isFocused
        ? "#ccfbf1" // teal-100
        : "white",
      color: state.isSelected ? "white" : "black",
      cursor: "pointer",
    }),
  };

  useEffect(() => {
    if (
      selectedProvincePemodalPerusahaan &&
      selectedCityPemodalPerusahaan &&
      selectedDistrictPemodalPerusahaan &&
      selectedSubDistrictPemodalPerusahaan &&
      posCode
    ) {
      onAlamatChange({
        provincePemodalPerusahaan: selectedProvincePemodalPerusahaan,
        cityPemodalPerusahaan: selectedCityPemodalPerusahaan,
        districtPemodalPerusahaan: selectedDistrictPemodalPerusahaan,
        subDistrictPemodalPerusahaan: selectedSubDistrictPemodalPerusahaan,
        posCode: posCode,
      });
    }
  }, [
    selectedProvincePemodalPerusahaan,
    selectedCityPemodalPerusahaan,
    selectedDistrictPemodalPerusahaan,
    selectedSubDistrictPemodalPerusahaan,
    posCode,
  ]);

  useEffect(() => {
    onBankChange(selectedBank);
  }, [selectedBank]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 justify-center gap-6 p-6 max-w-6xl mx-auto">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-black">
          Isi Data Sebagai Pemodal Perusahaan
        </h2>
        <p className="text-sm text-gray-600">
          Untuk memastikan kelancaran proses verifikasi dan layanan yang
          optimal, kami mengajak Anda untuk melengkapi seluruh data secara
          jujur, benar, dan akurat.
        </p>

        <h3 className="font-semibold text-black">1. Jenis Perusahaan</h3>
        <Select
          options={optionsBussines}
          placeholder="Pilih Jenis Perusahaan"
          value={optionsBussines.find(
            (option) => option.value === formData.jenisPerusahaan
          )}
          className="text-gray-600"
          classNamePrefix="react-select"
          onChange={(selectedOption) => {
            const syntheticEvent = {
              target: {
                name: "jenisPerusahaan",
                value: selectedOption
                  ? (selectedOption as TypeOption).value
                  : "",
              },
            } as React.ChangeEvent<HTMLInputElement>;
            onChange(syntheticEvent);
          }}
          isClearable
        />

        <h3 className="font-semibold text-black mt-4">
          2. Nomor Akta Perubahan Terakhir
        </h3>
        <input
          type="text"
          name="nomorAktaPerubahanTerakhir"
          value={formData.nomorAktaPerubahanTerakhir}
          onChange={onChange}
          placeholder="Masukkan Nomor Akta Perubahan Terakhir"
          className="border p-2 w-full rounded mb-0 text-gray-700"
        />

        <h3 className="font-semibold text-black mt-4">
          3. Upload Dokumen Akta Pendirian Perusahaan
        </h3>
        <input
          type="file"
          id="aktaPendirianPerusahaanUrl"
          className="hidden"
          onChange={handleFileChange}
          disabled={uploadStatus["aktaPendirianPerusahaanUrl"] === true}
          accept="application/pdf,image/*"
          data-keyname="aktaPendirianPerusahaanUrl"
        />

        <label
          htmlFor="aktaPendirianPerusahaanUrl"
          className="inline-flex text-sm items-center gap-2 py-2 px-4 bg-gray-800 text-white rounded-lg cursor-pointer hover:bg-gray-800 transition"
        >
          <>
            <FaFileAlt />
            Upload Dokumen
          </>
        </label>

        {formData.aktaPendirianPerusahaanUrl && (
          <button
            type="button"
            onClick={() =>
              window.open(formData.aktaPendirianPerusahaanUrl, "_blank")
            }
            className="text-blue-600 underline text-sm block mt-2"
          >
            Lihat Dokumen Akta Pendirian Perusahaan
          </button>
        )}

        <h3 className="font-semibold text-black mt-4">
          4. Upload Dokumen SK Pendirian Perusahaan
        </h3>
        <input
          type="file"
          id="skPendirianUrl"
          className="hidden"
          onChange={handleFileChange}
          disabled={uploadStatus["skPendirianUrl"] === true}
          accept="application/pdf,image/*"
          data-keyname="skPendirianUrl"
        />

        <label
          htmlFor="skPendirianUrl"
          className="inline-flex text-sm items-center gap-2 py-2 px-4 bg-gray-800 text-white rounded-lg cursor-pointer hover:bg-gray-800 transition"
        >
          <>
            <FaFileAlt />
            Upload Dokumen
          </>
        </label>

        {formData.skPendirianUrl && (
          <button
            type="button"
            onClick={() => window.open(formData.skPendirianUrl, "_blank")}
            className="text-blue-600 underline text-sm block mt-2"
          >
            Lihat Dokumen SK Pendirian Perusahaan
          </button>
        )}

        <h3 className="font-semibold text-black mt-4">
          5. Upload Dokumen SK KUMHAM Perusahaan
        </h3>
        <input
          type="file"
          id="skKumhamPerusahaanUrl"
          className="hidden"
          onChange={handleFileChange}
          disabled={uploadStatus["skKumhamPerusahaanUrl"] === true}
          accept="application/pdf,image/*"
          data-keyname="skKumhamPerusahaanUrl"
        />

        <label
          htmlFor="skKumhamPerusahaanUrl"
          className="inline-flex text-sm items-center gap-2 py-2 px-4 bg-gray-800 text-white rounded-lg cursor-pointer hover:bg-gray-800 transition"
        >
          <>
            <FaFileAlt />
            Upload Dokumen
          </>
        </label>

        {formData.skKumhamPerusahaanUrl && (
          <button
            type="button"
            onClick={() =>
              window.open(formData.skKumhamPerusahaanUrl, "_blank")
            }
            className="text-blue-600 underline text-sm block mt-2"
          >
            Lihat Dokumen SK Pendirian Perusahaan
          </button>
        )}

        <h3 className="font-semibold text-black mt-4">
          6. Upload Dokumen NPWP Perusahaan
        </h3>
        <input
          type="file"
          id="npwpPerusahaanUrl"
          className="hidden"
          onChange={handleFileChange}
          disabled={uploadStatus["npwpPerusahaanUrl"] === true}
          accept="application/pdf,image/*"
          data-keyname="npwpPerusahaanUrl"
        />

        <label
          htmlFor="npwpPerusahaanUrl"
          className="inline-flex text-sm items-center gap-2 py-2 px-4 bg-gray-800 text-white rounded-lg cursor-pointer hover:bg-gray-800 transition"
        >
          <>
            <FaFileAlt />
            Upload Dokumen
          </>
        </label>

        {formData.npwpPerusahaanUrl && (
          <button
            type="button"
            onClick={() => window.open(formData.npwpPerusahaanUrl, "_blank")}
            className="text-blue-600 underline text-sm block mt-2"
          >
            Lihat Dokumen SK Pendirian Perusahaan
          </button>
        )}

        <h3 className="font-semibold text-black mt-4">
          7. Nomor NPWP Perusahaan
        </h3>
        <input
          type="text"
          name="nomorNpwpPerusahaan"
          value={formData.nomorNpwpPerusahaan}
          onChange={onChange}
          placeholder="Masukkan Nomor NPWP Perusahaan"
          className="border p-2 w-full rounded mb-0 text-gray-700"
        />
        <h3 className="font-semibold text-black mt-4">
          8. Alamat Tempat Usaha
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 items-center">
          <div className="text-black">
            <Select
              className="mt-0"
              value={selectedProvincePemodalPerusahaan}
              options={customOptions}
              formatOptionLabel={formatOptionLabel}
              onChange={(e) => {
                setSelectedProvincePemodalPerusahaan(e);
                setSelectedCityPemodalPerusahaan(null);
                setSelectedDistrictPemodalPerusahaan(null);
                setSelectedSubDistrictPemodalPerusahaan(null);
                setPosCode("");
              }}
              placeholder="Pilih Provinsi"
              // styles={customStyles}
            />

            {errors?.provincePemodalPerusahaan && (
              <p className="text-red-500 text-sm mt-1">
                {errors.provincePemodalPerusahaan[0]}
              </p>
            )}
          </div>
          <div className="text-black">
            <Select
              className="mt-0"
              value={selectedCityPemodalPerusahaan}
              options={customOptionsCity}
              formatOptionLabel={formatOptionLabel}
              onChange={(e) => {
                setSelectedCityPemodalPerusahaan(e);
                setSelectedDistrictPemodalPerusahaan(null);
                setSelectedSubDistrictPemodalPerusahaan(null);
                setPosCode("");
              }}
              placeholder="Pilih Kota"
              isDisabled={!selectedProvincePemodalPerusahaan}
            />
            {errors?.cityPemodalPerusahaan && (
              <p className="text-red-500 text-sm mt-1">
                {errors.cityPemodalPerusahaan[0]}
              </p>
            )}
          </div>
          <div className="text-black">
            <Select
              className="mt-0"
              value={selectedDistrictPemodalPerusahaan}
              options={customOptionsDistrict}
              formatOptionLabel={formatOptionLabel}
              onChange={(e) => {
                setSelectedDistrictPemodalPerusahaan(e);
                setSelectedSubDistrictPemodalPerusahaan(null);
                setPosCode("");
              }}
              placeholder="Pilih Kecamatan"
              isDisabled={!selectedCityPemodalPerusahaan}
            />
            {errors?.districtPemodalPerusahaan && (
              <p className="text-red-500 text-sm mt-1">
                {errors.districtPemodalPerusahaan[0]}
              </p>
            )}
          </div>
          <div className="text-black">
            <Select
              className="mt-0"
              value={selectedSubDistrictPemodalPerusahaan}
              options={customOptionsSubDistrict}
              formatOptionLabel={formatOptionLabel}
              onChange={(e) => {
                setSelectedSubDistrictPemodalPerusahaan(e);
                setPosCode("");
              }}
              placeholder="Pilih Kelurahan"
              isDisabled={!selectedDistrictPemodalPerusahaan}
            />
            {errors?.subDistrictPemodalPerusahaan && (
              <p className="text-red-500 text-sm mt-1">
                {errors.subDistrictPemodalPerusahaan[0]}
              </p>
            )}
          </div>
        </div>
        <div>
          <input
            type="number"
            name="posCode"
            placeholder="Kode Pos"
            value={posCode || formData.posCode || ""}
            onChange={onChange}
            className="border rounded p-2 w-full mb-2 placeholder:text-sm text-black"
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
          placeholder="Alamat Sesuai Tempat Usaha"
          className="border p-2 w-full rounded resize-none placeholder:text-sm text-black"
          rows={4}
        ></textarea>
        {errors?.addres && (
          <p className="text-red-500 text-sm mt-1">{errors.addres[0]}</p>
        )}
      </div>

      {/* KANAN */}
      <div className="space-y-4">
        <h3 className="font-semibold text-black mt-4">
          9. Nomor Telepon Perusahaan
        </h3>
        <input
          type="text"
          name="noTeleponPerusahaan"
          value={formData.noTeleponPerusahaan}
          onChange={(e) => {
            const onlyNums = e.target.value.replace(/[^0-9]/g, "");
            onChange({
              target: { name: "noTeleponPerusahaan", value: onlyNums },
            } as React.ChangeEvent<HTMLInputElement>);
          }}
          placeholder="Masukkan Nomor Telepon Perusahaan"
          className="border p-2 w-full rounded mb-0 text-gray-700"
        />
        {errors?.noTeleponPerusahaan && (
          <p className="text-red-500 text-sm mt-1">
            {errors.noTeleponPerusahaan[0]}
          </p>
        )}

        <h3 className="font-semibold text-black mt-4">10. Situs Perusahaan</h3>
        <input
          type="text"
          name="situsPerusahaan"
          value={formData.situsPerusahaan}
          onChange={onChange}
          placeholder="Masukkan Situs Perusahaan"
          className="border p-2 w-full rounded mb-0 text-gray-700"
        />
        {errors?.situsPerusahaan && (
          <p className="text-red-500 text-sm mt-1">
            {errors.situsPerusahaan[0]}
          </p>
        )}

        <h3 className="font-semibold text-black mt-4">11. Email Perusahaan</h3>
        <input
          type="text"
          name="emailPerusahaan"
          value={formData.emailPerusahaan}
          onChange={onChange}
          placeholder="Masukkan Email Perusahaan"
          className="border p-2 w-full rounded mb-0 text-gray-700"
        />
        {errors?.emailPerusahaan && (
          <p className="text-red-500 text-sm mt-1">
            {errors.emailPerusahaan[0]}
          </p>
        )}

        <h3 className="font-semibold text-black">
          12. Informasi Rekening Bank
        </h3>

        <div className="text-black">
          <Select
            className="mt-0"
            value={selectedBank}
            options={customOptionsBank}
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
          <label className="text-sm font-medium mb-2 text-black">
            Nomor Rekening
          </label>
          <div className="text-black">
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
          </div>
          {errors?.nomorRekening && (
            <p className="text-red-500 text-sm mt-1">
              {errors.nomorRekening[0]}
            </p>
          )}

          <div>
            <label className="text-sm font-medium mb-2 text-black">
              Nama Pemilik Rekening
            </label>
            <div className="text-black">
              <input
                type="text"
                name="namaPemilik"
                placeholder="Masukkan Nama Pemilik Rekening"
                value={formData.namaPemilik}
                onChange={onChange}
                className="border rounded p-2 w-full mb-0 placeholder:text-sm"
              />
            </div>
            {errors?.namaPemilik && (
              <p className="text-red-500 text-sm mt-1">
                {errors.namaPemilik[0]}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentDataPemodalPerusahaanV1;
