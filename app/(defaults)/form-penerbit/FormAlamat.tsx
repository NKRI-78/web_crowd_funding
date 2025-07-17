import { Controller } from "react-hook-form";
import Select from "react-select";
import { useEffect } from "react";

interface OptionType {
  label: string;
  value: string;
}

// ✅ Props lengkap

type Props = {
  index: number;
  control: any;
  setValue: any;
  watch: any;
  register: any;
  provinsiList: OptionType[];
  kotaList: Record<number, OptionType[]>;
  setKotaList: React.Dispatch<React.SetStateAction<Record<number, OptionType[]>>>;
  kecamatanList: Record<number, OptionType[]>;
  setKecamatanList: React.Dispatch<React.SetStateAction<Record<number, OptionType[]>>>;
  kelurahanList: Record<number, OptionType[]>;
  setKelurahanList: React.Dispatch<React.SetStateAction<Record<number, OptionType[]>>>;
  fetchOptions: (type: string, id: string) => Promise<OptionType[]>;
};

const FormAlamat = ({
  index,
  control,
  setValue,
  watch,
  register,
  provinsiList,
  kotaList,
  setKotaList,
  kecamatanList,
  setKecamatanList,
  kelurahanList,
  setKelurahanList,
  fetchOptions,
}: Props) => {
  const watchProvinsi = watch(`alamat.${index}.provinsi`);
  const watchKota = watch(`alamat.${index}.kabupaten`);
  const watchKecamatan = watch(`alamat.${index}.kecamatan`);

  useEffect(() => {
    if (watchProvinsi)
      fetchOptions("api/v1/administration/city", watchProvinsi).then((res) =>
        setKotaList((prev) => ({ ...prev, [index]: res }))
      );
  }, [watchProvinsi]);

  useEffect(() => {
    if (watchKota)
      fetchOptions("api/v1/administration/district", watchKota).then((res) =>
        setKecamatanList((prev) => ({ ...prev, [index]: res }))
      );
  }, [watchKota]);

  useEffect(() => {
    if (watchKecamatan)
      fetchOptions("api/v1/administration/subdistrict", watchKecamatan).then((res) =>
        setKelurahanList((prev) => ({ ...prev, [index]: res }))
      );
  }, [watchKecamatan]);

  return (
    <div key={index} className="space-y-3">
      <h3 className="font-semibold">Alamat {index === 0 ? "Perusahaan" : "Korespondensi"}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name={`alamat.${index}.provinsi`}
          control={control}
          render={({ field }) => (
            <Select<OptionType>
              placeholder="Pilih Provinsi"
              options={provinsiList}
              isSearchable={true}
              value={provinsiList.find((opt) => opt.value === field.value) || null}
              onChange={(val) => {
                field.onChange(val?.value);
                setValue(`alamat.${index}.kabupaten`, "");
                setValue(`alamat.${index}.kecamatan`, "");
                setValue(`alamat.${index}.kelurahan`, "");
              }}
            />
          )}
        />

        <Controller
          name={`alamat.${index}.kabupaten`}
          control={control}
          render={({ field }) => (
            <Select<OptionType>
              placeholder="Pilih Kota"
              options={kotaList[index] || []}
              isSearchable={true}
              value={(kotaList[index] || []).find((opt) => opt.value === field.value) || null}
              onChange={(val) => {
                field.onChange(val?.value);
                setValue(`alamat.${index}.kecamatan`, "");
                setValue(`alamat.${index}.kelurahan`, "");
              }}
              isDisabled={!watchProvinsi}
            />
          )}
        />

        <Controller
          name={`alamat.${index}.kecamatan`}
          control={control}
          render={({ field }) => (
            <Select<OptionType>
              placeholder="Pilih Kecamatan"
              isSearchable={true}
              options={kecamatanList[index] || []}
              value={(kecamatanList[index] || []).find((opt) => opt.value === field.value) || null}
              onChange={(val) => {
                field.onChange(val?.value);
                setValue(`alamat.${index}.kelurahan`, "");
              }}
              isDisabled={!watchKota}
            />
          )}
        />

        <Controller
          name={`alamat.${index}.kelurahan`}
          control={control}
          render={({ field }) => (
            <Select<OptionType>
              placeholder="Pilih Kelurahan"
              isSearchable={true}
              options={kelurahanList[index] || []}
              value={(kelurahanList[index] || []).find((opt) => opt.value === field.value) || null}
              onChange={(val) => field.onChange(val?.value)}
              isDisabled={!watchKecamatan}
            />
          )}
        />
      </div>

      <input
        {...register(`alamat.${index}.kodePos`)}
        placeholder="Kode Pos"
        className="border px-3 py-2 rounded w-full"
      />

      <textarea
        {...register(`alamat.${index}.detailAlamat`)}
        placeholder="Detail Alamat"
        className="border px-3 py-2 rounded w-full"
      />
    </div>
  );
};

export default FormAlamat;
