"use client";

import { useState } from "react";

import { useFormPenerbit } from "./_hooks/useFormPenerbit";

import TextField from "./_component/TextField";
import JobStructureForm from "./_component/JobStructureForm";
import FileInput from "./_component/FileInput";
import MonthSelection from "./_component/MonthSelection";
import SectionTitle from "./_component/SectionTitle";
import SectionPoint from "./_component/SectionPoint";
import SectionSubtitle from "./_component/SectionSubtitle";
import CustomSelection from "./_component/CustomSelection";
import FormButton from "./_component/FormButton";
import AddJobStructureModal from "./_component/AddJobStructureModal";

const FormPenerbit: React.FC = () => {
  //* main hooks
  const {
    formState,
    updateField,
    updateSusunanManajemen,
    addSusunanManajemen,
    removeSusunanManajemen,
  } = useFormPenerbit();

  //* show modal add job structure
  const [showAddJobStructureModal, setShowAddJobStructureModal] =
    useState(false);

  return (
    <div className="px-6 md:px-24 bg-white">
      <div className="w-full py-28 text-black grid grid-cols-1 md:grid-cols-2 gap-10 mx-auto">
        {/* === left section === */}
        <section className="w-full">
          {/* 1. Struktur Permodalan */}
          <div className="w-full flex flex-col">
            <SectionTitle text="2. Struktur Permodalan" />

            <SectionPoint text="Laporan Keuangan" className="mt-2" />
            <SectionSubtitle
              text="File maksimal berukuran 10mb"
              className="my-1"
            />

            <FileInput
              label="Upload Dokumen"
              fileUrl={formState.laporanKeuangan}
              onChange={(fileUrl) => {
                updateField("laporanKeuangan", fileUrl);
              }}
            />
          </div>

          {/* 2. Susunan Manajemen */}
          <div className="w-full flex flex-col mt-6">
            <SectionTitle text="3. Susunan Manajemen" />

            {formState.susunanManajemen.length !== 0 ? (
              formState.susunanManajemen.map((structure) => (
                <JobStructureForm
                  key={structure.id}
                  label={structure.title}
                  data={structure}
                  onChange={(updated) =>
                    updateSusunanManajemen(structure.id, updated)
                  }
                  showDeleteButton={
                    structure.id !== "komisaris" && structure.id !== "direksi"
                  }
                  onDelete={() => removeSusunanManajemen(structure.id)}
                />
              ))
            ) : (
              <div
                onClick={() => setShowAddJobStructureModal(true)}
                className="w-full mt-2 bg-white border border-dashed border-gray-300 text-gray-500 rounded-md p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition"
              >
                <p className="text-sm font-medium">
                  Belum ada susunan manajemen
                </p>
                <p className="text-xs">Klik untuk menambahkan jabatan baru</p>
              </div>
            )}

            {formState.susunanManajemen.length !== 0 && (
              <button
                type="button"
                className="w-full bg-white/90 border border-dashed border-gray-300 text-gray-500 py-2 mt-2 rounded-md text-sm hover:bg-gray-50 active:scale-[0.98] transition"
                onClick={() => {
                  setShowAddJobStructureModal(true);
                }}
              >
                + Tambah Jabatan
              </button>
            )}

            {/* Modal Tambah Struktur */}
            <AddJobStructureModal
              isOpen={showAddJobStructureModal}
              onClose={() => setShowAddJobStructureModal(false)}
              onSubmit={addSusunanManajemen}
            />

            <div className="mt-4">
              <TextField
                label="Jenis Obligasi"
                placeholder="(Pemerintah / Koprasi / Ritel / Syariah atau Syukuk)"
                value={formState.jenisObligasi || ""}
                className="mb-2"
                onChange={(e) => updateField("jenisObligasi", e.target.value)}
              />
              <TextField
                label="Nilai Nominal"
                placeholder="Rp."
                type="number"
                value={formState.nilaiNominal || ""}
                className="mb-2"
                onChange={(e) => updateField("nilaiNominal", e.target.value)}
              />
              <div className="w-full flex gap-2">
                <TextField
                  label="Jangka Waktu"
                  placeholder="6 Bulan"
                  value={formState.jangkaWaktu || ""}
                  className="flex-[1]"
                  onChange={(e) => updateField("jangkaWaktu", e.target.value)}
                />
                <TextField
                  label="Tingkat Bunga"
                  placeholder="10%"
                  value={formState.tingkatBunga || ""}
                  className="flex-[1]"
                  onChange={(e) => updateField("tingkatBunga", e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* === right section === */}
        <section className="w-full">
          <MonthSelection
            label="Jadwal Pembayaran Bunga"
            selected={formState.jadwalBunga || ""}
            onChange={(val) => updateField("jadwalBunga", val)}
          />

          <MonthSelection
            label="Jadwal Pembayaran Pokok"
            selected={formState.jadwalPokok || ""}
            onChange={(val) => updateField("jadwalPokok", val)}
          />

          <CustomSelection
            label="Penggunaan Dana"
            options={["Modal Usaha", "Pengembangan Usaga", "Proyek"]}
            enableOtherSelection={false}
            selected={formState.penggunaanDana || ""}
            onChange={(val) => updateField("penggunaanDana", val)}
          />

          <CustomSelection
            label="Jaminan Kolateral"
            options={[
              "Tanah Bangunan",
              "Kendaraan Bermotor",
              "Rumah",
              "Surat Berharga",
            ]}
            selected={formState.jaminanKolateral || ""}
            onChange={(val) => updateField("jaminanKolateral", val)}
          />

          <TextField
            label="Deskripsi Pekerjaan"
            placeholder="Maks 1500 kata"
            type="textarea"
            value={formState.deskripsiPekerjaan || ""}
            onChange={(e) => updateField("deskripsiPekerjaan", e.target.value)}
          />

          <CustomSelection
            label="Apakah di biaya oleh APBN/APBD?"
            options={["Iya", "Tidak"]}
            selected={formState.jenisBiaya || ""}
            enableOtherSelection={false}
            onChange={(val) => updateField("jenisBiaya", val)}
          />

          <div className="w-full flex flex-col mt-4">
            <SectionPoint text="Company Profile" />
            <SectionSubtitle
              text="File maksimal berukuran 10mb"
              className="my-1"
            />
            <FileInput
              label="Upload Dokumen"
              fileUrl={formState.companyProfile}
              onChange={(fileUrl) => {
                updateField("companyProfile", fileUrl);
              }}
            />
          </div>

          <div className="w-full flex justify-end gap-4 mt-6">
            <FormButton type="outlined">Save a Draft</FormButton>
            <FormButton onClick={() => console.log(formState)}>
              Kirim Data
            </FormButton>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FormPenerbit;
