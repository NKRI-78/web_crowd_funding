import { Controller } from "react-hook-form";
import Select from "react-select";
import { useEffect } from "react";

interface OptionType {
  label: string;
  value: string;
  zip_code: string;
}

// ✅ Props lengkap

type Props = {
  index: number;
  control: any;
  setValue: any;
  watch: any;
  register: any;
  errors: any; //
  provinsiList: OptionType[];
  kotaList: Record<number, OptionType[]>;
  setKotaList: React.Dispatch<
    React.SetStateAction<Record<number, OptionType[]>>
  >;
  kecamatanList: Record<number, OptionType[]>;
  setKecamatanList: React.Dispatch<
    React.SetStateAction<Record<number, OptionType[]>>
  >;
  kelurahanList: Record<number, OptionType[]>;
  setKelurahanList: React.Dispatch<
    React.SetStateAction<Record<number, OptionType[]>>
  >;
  fetchOptions: (type: string, id: string) => Promise<OptionType[]>;
};

const FormAlamat = ({
  index,
  control,
  setValue,
  watch,
  register,
  errors,
  provinsiList,
  kotaList,
  setKotaList,
  kecamatanList,
  setKecamatanList,
  kelurahanList,
  setKelurahanList,
  fetchOptions,
}: Props) => {
  const watchProvinsi = watch(`address.${index}.province_name`);
  const watchKota = watch(`address.${index}.city_name`);
  const watchKecamatan = watch(`address.${index}.district_name`);

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
      fetchOptions("api/v1/administration/subdistrict", watchKecamatan).then(
        (res : any) => {
          const data = res.data || [];
          console.log("Data ", data)
          setKelurahanList((prev) => ({ ...prev, [index]: res }))
        }
      );
  }, [watchKecamatan]);

  return (
    <div key={index} className="space-y-3">
      <h3 className="font-semibold">
        Alamat {index === 0 ? "Perusahaan" : "Korespondensi"}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Provinsi */}
        <Controller
          name={`address.${index}.province_id`}
          control={control}
          rules={{ required: "Provinsi wajib diisi" }}
          render={({ field, fieldState: { error } }) => (
            <div>
              <Select<OptionType>
                placeholder="Pilih Provinsi"
                options={provinsiList}
                isSearchable={true}
                value={
                  provinsiList.find((opt) => opt.value === field.value) || null
                }
                onChange={(val) => {
                  field.onChange(val?.value); // simpan ID
                  setValue(`address.${index}.province_name`, val?.label || "");
                  setValue(`address.${index}.city_id`, "");
                  setValue(`address.${index}.city_name`, "");
                  setValue(`address.${index}.district_id`, "");
                  setValue(`address.${index}.district_name`, "");
                  setValue(`address.${index}.subdistrict_id`, "");
                  setValue(`address.${index}.subdistrict_name`, "");
                }}
              />
              {error && <p className="text-red-500 text-sm">{error.message}</p>}
            </div>
          )}
        />

        {/* Hidden input untuk simpan label */}
        <input type="hidden" {...register(`address.${index}.province_name`)} />

        {/* Kota */}
        <Controller
          name={`address.${index}.city_id`}
          control={control}
          rules={{ required: "Kota wajib diisi" }}
          render={({ field, fieldState: { error } }) => (
            <div>
              <Select<OptionType>
                placeholder="Pilih Kota"
                options={kotaList[index] || []}
                isSearchable={true}
                value={
                  (kotaList[index] || []).find(
                    (opt) => opt.value === field.value
                  ) || null
                }
                onChange={(val) => {
                  field.onChange(val?.value);
                  setValue(`address.${index}.city_name`, val?.label || "");
                  setValue(`address.${index}.district_id`, "");
                  setValue(`address.${index}.district_name`, "");
                  setValue(`address.${index}.subdistrict_id`, "");
                  setValue(`address.${index}.subdistrict_name`, "");
                }}
                isDisabled={!watchProvinsi}
              />
              {error && <p className="text-red-500 text-sm">{error.message}</p>}
            </div>
          )}
        />
        <input type="hidden" {...register(`address.${index}.city_name`)} />

        {/* Kecamatan */}
        <Controller
          name={`address.${index}.district_id`}
          control={control}
          rules={{ required: "Kecamatan wajib diisi" }}
          render={({ field, fieldState: { error } }) => (
            <div>
              <Select<OptionType>
                placeholder="Pilih Kecamatan"
                isSearchable={true}
                options={kecamatanList[index] || []}
                value={
                  (kecamatanList[index] || []).find(
                    (opt) => opt.value === field.value
                  ) || null
                }
                onChange={(val) => {
                  field.onChange(val?.value);
                  setValue(`address.${index}.district_name`, val?.label || "");
                  setValue(`address.${index}.subdistrict_id`, "");
                  setValue(`address.${index}.subdistrict_name`, "");
                }}
                isDisabled={!watchKota}
              />
              {error && <p className="text-red-500 text-sm">{error.message}</p>}
            </div>
          )}
        />
        <input type="hidden" {...register(`address.${index}.district_name`)} />

        {/* Kelurahan */}
        <Controller
          name={`address.${index}.subdistrict_id`}
          control={control}
          rules={{ required: "Kelurahan wajib diisi" }}
          render={({ field, fieldState: { error } }) => (
            <div>
              <Select<OptionType>
                placeholder="Pilih Kelurahan"
                isSearchable={true}
                options={kelurahanList[index] || []}
                value={
                  (kelurahanList[index] || []).find(
                    (opt) => opt.value === field.value
                  ) || null
                }
                onChange={(val) => {
                  field.onChange(val?.value);
                  setValue(
                    `address.${index}.subdistrict_name`,
                    val?.label || ""
                  );
                  setValue(`address.${index}.postal_code`, val?.zip_code || "");
                }}
                isDisabled={!watchKecamatan}
              />
              {error && <p className="text-red-500 text-sm">{error.message}</p>}
            </div>
          )}
        />
        <input type="hidden" {...register(`address.${index}.subdistrict_name`)} />
      </div>

      {/* Kode Pos */}
      <div>
        <input
          {...register(`address.${index}.postal_code`, {
            required: "Kode Pos wajib diisi",
          })}
          placeholder="Kode Pos"
          type="number"
          className="border px-3 py-2 rounded w-full"
        />
        {errors?.address?.[index]?.postal_code && (
          <p className="text-red-500 text-sm">
            {errors.address[index].postal_code.message}
          </p>
        )}
      </div>

      {/* Detail Alamat */}
      <div>
        <textarea
          {...register(`address.${index}.detail`, {
            required: "Detail alamat wajib diisi",
          })}
          placeholder="Detail Alamat"
          className="border px-3 py-2 rounded w-full"
        />
        {errors?.address?.[index]?.detail && (
          <p className="text-red-500 text-sm">
            {errors.address[index].detail.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default FormAlamat;
