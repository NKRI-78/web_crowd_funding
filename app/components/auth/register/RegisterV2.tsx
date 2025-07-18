"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import axios from "axios";
import { API_BACKEND } from "@/app/utils/constant";
import { setCookie } from "@/app/helper/cookie";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";

const schema = z
  .object({
    name: z.string().min(2, "Nama wajib diisi"),
    phone: z.string().min(8, "No. Tlp wajib diisi"),
    email: z.string().email("Format email tidak valid"),
    password: z.string().min(6, "Password minimal 6 karakter"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  });

type RegisterFormSchema = z.infer<typeof schema>;

export default function RegisterForm({ onNext, onClose }: {
  onNext?: () => void;
  onClose?: () => void;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormSchema>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: RegisterFormSchema) => {
    setLoading(true);
    console.log("Data:", data);

    const payload = {
        fullname: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
    };

    setLoading(true);
    try {
      console.log('Data yang dikirim:', data);

      const response = await axios.post(`${API_BACKEND}/api/v1/auth/register`, payload);

      const result: AuthResponse = response.data;

      console.log('Respon backend:', result.data);
      setCookie("user", JSON.stringify(result.data));
      onNext?.();
    } catch (err: any) {
      console.error("Failed to fetch:", err);

      let errorMessage = "Terjadi kesalahan. Silakan coba lagi.";
      if (axios.isAxiosError(err)) {
        if (err.response) {
          errorMessage =
            err.response.data?.message || JSON.stringify(err.response.data);
        } else if (err.request) {
          errorMessage = "Tidak ada respon dari server.";
        } else {
          errorMessage = err.message;
        }
      } else {
        errorMessage = err.message || String(err);
      }

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row bg-white rounded-lg overflow-hidden max-w-3xl w-full">
        {/* Form */}
        <div className="w-full md:w-1/2 p-8">
          <div className="text-2xl font-bold mb-4">
            Silakan Buat Akun Terlebih Dahulu
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <input
                {...register("name")}
                type="text"
                placeholder="Nama Lengkap"
                className="w-full border border-gray-300 px-4 py-2 rounded"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div>
              <input
                {...register("phone")}
                type="text"
                placeholder="No. Tlp"
                className="w-full border border-gray-300 px-4 py-2 rounded"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <input
                {...register("email")}
                type="email"
                placeholder="Alamat Email"
                className="w-full border border-gray-300 px-4 py-2 rounded"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full border border-gray-300 px-4 py-2 rounded"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="relative">
              <input
                {...register("confirmPassword")}
                type={showPasswordConfirm ? "text" : "password"}
                placeholder="Konfirmasi Password"
                className="w-full border border-gray-300 px-4 py-2 rounded"
              />
              <button
                type="button"
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                className="absolute right-3 top-3 text-gray-500"
                aria-label="Toggle password visibility"
              >
                {showPasswordConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-500 text-white'
              }`}
            >
              {loading ? 'Mendaftarkan...' : 'Buat Akun'}
            </button>
          </form>
        </div>

        {/* Gambar */}
        <div className="hidden md:block md:w-1/2">
          <img
            src="/images/modal-auth.png"
            alt="Register"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
