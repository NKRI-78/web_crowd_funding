import { setCookie } from "@/app/helper/cookie";
import React from "react";

export default function RegisterSelectRole({
  onNext,
  onClose,
}: {
  onNext?: () => void;
  onClose?: () => void;
}) {
  const handleSelectRole = async (role: number) => {
    try {
      setCookie("role", JSON.stringify({"role" : role}));
      onClose?.();
      window.location.reload();
    } catch (err: any) {
        console.error("Error ",err)
    }
  };
  return (
    <>
      <div className="flex flex-col md:flex-row bg-white rounded-lg overflow-hidden max-w-3xl w-full">
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl text-black font-bold mb-6">
            Pilih Peran Anda <br /> untuk Memulai
          </h2>

          <div className="space-y-6">
            <div
              onClick={()=> handleSelectRole(1)}
              className="border border-purple-600 rounded-xl p-4 hover:bg-purple-50 cursor-pointer"
            >
              <h3 className="text-purple-700 font-bold text-lg">Penerbit</h3>
              <p className="text-sm text-gray-600 mt-2">
                Anda tertarik mendukung dan membiayai ide bisnis yang
                menjanjikan. Temukan proyek potensial, kelola investasi Anda,
                dan bantu wujudkan inovasi.
              </p>
            </div>

            <div
              onClick={()=> handleSelectRole(2)}
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
      </div>
    </>
  );
}
