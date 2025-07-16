// ComponentDataPribadi.tsx
import React from "react";

interface Props {
  formData: {
    nama: string;
    nik: string;
    tempatLahir: string;
    tanggalLahir: string;
    jenisKelamin: string;
    statusPernikahan: string;
    pendidikanTerakhir: string;
    addres: string;
    namaBank: string;
    nomorRekening: string;
    namaPemilik: string;
    cabangBank: string;
  };
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onGenderChange: (value: string) => void;
}

const ComponentDataPribadi: React.FC<Props> = ({
  formData,
  onChange,
  onGenderChange,
}) => {
  const options = ["Laki-Laki", "Perempuan"];
  return (
    <div className="grid grid-cols-2 gap-8 justify-center">
      <div>
        <h2 className="text-xl font-bold mb-4">1. Informasi Pribadi</h2>

        <div>
          <label>Nama Lengkap</label>
          <input
            type="text"
            name="nama"
            value={formData.nama}
            onChange={onChange}
            placeholder="Nama"
            className="border p-2 w-full rounded mb-4"
          />
        </div>

        <div>
          <label>NIK KTP</label>
          <input
            type="text"
            name="nik"
            value={formData.nik}
            onChange={onChange}
            placeholder="NIK KTP"
            className="border p-2 w-full rounded mb-4"
          />
        </div>

        <div className="flex gap-2">
          <div>
            <label>Tempat Lahir</label>
            <input
              type="text"
              name="tempatLahir"
              value={formData.tempatLahir}
              onChange={onChange}
              placeholder="Tempat Lahir"
              className="border p-2 w-full rounded mb-4"
            />
          </div>

          <div>
            <label>Tanggal Lahir</label>
            <input
              type="text"
              name="tanggalLahir"
              value={formData.tanggalLahir}
              onChange={onChange}
              placeholder="Tanggal Lahir"
              className="border p-2 w-full rounded mb-4"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="text-gray-600 text-sm">Jenis Kelamin</label>
          {options.map((gender) => (
            <button
              key={gender}
              type="button"
              onClick={() => onGenderChange(gender)}
              className="form-radio text-[#a00000]"
            >
              {gender}
            </button>
          ))}
        </div>

        <div className="mb-4">
          <select
            name="statusPernikahan"
            value={formData.statusPernikahan}
            onChange={onChange}
            className={`border p-2 w-full rounded bg-white ${
              formData.statusPernikahan === "" ? "text-gray-400" : "text-black"
            }`}
          >
            <option value="" disabled>
              Status Pernikahan
            </option>
            <option value="Belum Menikah">Belum Menikah</option>
            <option value="Menikah">Menikah</option>
            <option value="Cerai">Cerai</option>
          </select>
        </div>

        <div>
          <input
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 mb-4"
            id="file_input"
            type="file"
          ></input>
        </div>

        <div>
          <select
            name="pendidikanTerakhir"
            value={formData.pendidikanTerakhir}
            onChange={onChange}
            className={`border p-2 w-full rounded bg-white ${
              formData.pendidikanTerakhir === ""
                ? "text-gray-400"
                : "text-black"
            } mb-4`}
          >
            <option value="" disabled>
              Pendidikan Terakhir
            </option>
            <option value="SD">SD</option>
            <option value="SMP">SMP</option>
            <option value="SMA">SMA</option>
            <option value="Diploma">Diploma</option>
            <option value="Sarjana">Sarjana</option>
            <option value="Pascasarjana">Pascasarjana</option>
          </select>
        </div>

        <div>
          <input
            type="text"
            name="addres"
            value={formData.addres}
            onChange={onChange}
            placeholder="Alamat sesuai KTP dan alamat domisili"
            className="border p-2 w-full rounded mb-4"
          />
        </div>
      </div>
      <div>
        <h2 className="text-xl font-bold mb-4">Informasi Rekening Bank</h2>

        <input
          type="text"
          name="namaBank"
          placeholder="Nama Bank (misal: BCA)"
          value={formData.namaBank}
          onChange={onChange}
          className="border p-2 w-full mb-4"
        />

        <input
          type="text"
          name="nomorRekening"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="Masukkan Nomor Rekening (maks 15 digit)"
          value={formData.nomorRekening}
          onChange={onChange}
          className="border p-2 w-full mb-4"
        />

        <input
          type="text"
          name="namaPemilik"
          placeholder="Masukkan Nama Pemilik Rekening"
          value={formData.namaPemilik}
          onChange={onChange}
          className="border p-2 w-full mb-4"
        />

        <input
          type="text"
          name="cabangBank"
          placeholder="Masukkan Cabang Bank"
          value={formData.cabangBank}
          onChange={onChange}
          className="border p-2 w-full"
        />
      </div>
    </div>
  );
};

export default ComponentDataPribadi;
