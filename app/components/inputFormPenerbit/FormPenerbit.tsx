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
import DropdownSelect from "./_component/DropdownSelect";
import CurrencyField from "./_component/CurrencyField";

interface Props {
  handlePageChanged: () => void;
}

const FormPenerbit: React.FC<Props> = ({ handlePageChanged }) => {
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
          {/* 2. Struktur Permodalan */}
          <div className="w-full flex flex-col">
            <SectionTitle text="2. Struktur Permodalan" />

            <SectionPoint text="Laporan Keuangan" className="mt-2" />
            <SectionSubtitle
              text="File maksimal berukuran 10mb"
              className="my-1"
            />

            <FileInput
              fileName="Laporan Keuangan"
              fileUrl={formState.laporanKeuangan}
              onChange={(fileUrl) => {
                updateField("laporanKeuangan", fileUrl);
              }}
            />
          </div>

          {/* 3. Susunan Manajemen */}
          <div className="w-full flex flex-col mt-6">
            <SectionTitle text="3. Susunan Manajemen" />

            {formState.susunanManajemen.map((structure) => (
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
            ))}

            <button
              type="button"
              className="w-full bg-white/90 border border-dashed border-gray-300 text-gray-500 py-2 mt-2 rounded-md text-sm hover:bg-gray-50 active:scale-[0.98] transition"
              onClick={() => {
                setShowAddJobStructureModal(true);
              }}
            >
              + Tambah Jabatan
            </button>

            {/* Modal Tambah Struktur */}
            <AddJobStructureModal
              isOpen={showAddJobStructureModal}
              onClose={() => setShowAddJobStructureModal(false)}
              onSubmit={addSusunanManajemen}
            />

            <div className="mt-4">
              <SectionPoint text="Foto Proyek" className="mt-2" />
              <SectionSubtitle
                text="File maksimal berukuran 10mb"
                className="my-1"
              />

              <FileInput
                fileName="Laporan Keuangan"
                fileUrl={formState.fotoProyek}
                onChange={(fileUrl) => {
                  updateField("fotoProyek", fileUrl);
                }}
              />

              <TextField
                label="Title Proyek"
                placeholder="Title Proyek"
                value={formState.titleProyek || ""}
                className="my-2"
                onChange={(e) => updateField("titleProyek", e.target.value)}
              />
              <DropdownSelect
                label="Jenis Obligasi"
                options={[{ label: "Konvensional", value: "konvensional" }]}
                defaultValue="konvensional"
                value={formState.jenisObligasi || ""}
                onChange={(val) => {
                  updateField("jenisObligasi", val);
                }}
                placeholder="Jenis Obligasi"
                maxHeightDropdown="180px"
                className="mb-2"
              />
              <CurrencyField
                label="Nilai Nominal"
                placeholder="Rp."
                value={formState.nilaiNominal || ""}
                className="mb-2"
                onChange={(e) => updateField("nilaiNominal", e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* === right section === */}
        <section className="w-full">
          <div className="w-full flex gap-2 mb-3">
            <DropdownSelect
              label="Jangka Waktu"
              options={[{ label: "6 Bulan", value: "6 Bulan" }]}
              defaultValue="6 Bulan"
              value={formState.jangkaWaktu || ""}
              onChange={(val) => {
                updateField("jangkaWaktu", val);
              }}
              placeholder="Jangka Waktu"
              maxHeightDropdown="180px"
              className="flex-[1]"
            />
            <DropdownSelect
              label="Tingkat Bunga"
              options={[{ label: "10%", value: "10" }]}
              defaultValue="10"
              value={formState.tingkatBunga || ""}
              onChange={(val) => {
                updateField("tingkatBunga", val);
              }}
              placeholder="Tingkat Bunga"
              maxHeightDropdown="180px"
              className="flex-[1]"
            />
          </div>

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
            maxWords={1500}
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
              fileName="Company Profile"
              fileUrl={formState.companyProfile}
              onChange={(fileUrl) => {
                updateField("companyProfile", fileUrl);
              }}
            />
          </div>

          <div className="w-full flex justify-end gap-4 mt-6">
            <FormButton type="outlined" onClick={handlePageChanged}>
              Kembali
            </FormButton>
            <FormButton onClick={() => console.log(formState)}>
              Kirim Data || Hit API
            </FormButton>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FormPenerbit;
