"use client";

import { AppDispatch } from "@redux/store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import axios from "axios";
import Cookies from "js-cookie";
import { API_BACKEND } from "@/app/utils/constant";

const errorMessages: Record<string, string> = {
  CREDENTIALS_IS_INCORRECT: "Password yang kamu masukkan salah.",
  USER_NOT_FOUND: "Email salah atau belum terdaftar, cek kembali email Anda.",
};

const Login: React.FC = () => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      return Swal.fire({
        icon: "warning",
        title: "Form Belum Lengkap",
        text: "Mohon isi semua field wajib.",
      });
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BACKEND}/api/v1/auth/login`, {
        email,
        password,
      });
      const userData = response.data.data;
      Cookies.set("user", JSON.stringify(response.data.data), { expires: 7 });

      if (!userData.enabled) {
        await Swal.fire({
          icon: "info",
          title: "Verifikasi Diperlukan",
          text: "Anda belum memasukkan kode OTP. Silakan verifikasi terlebih dahulu.",
          confirmButtonText: "Oke",
        });

        const payloads = {
          val: userData.email,
        };
        const { data } = await axios.post(
          `${API_BACKEND}/api/v1/resend-otp`,
          payloads
        );

        localStorage.setItem("showOtp", "true");

        router.push("/");
        return;
      }
      if (userData.role === "user") {
        await Swal.fire({
          icon: "info",
          title: "Data Belum Lengkap",
          text: "Silakan pilih peran anda dan lengkapi semua data yang dibutuhkan.",
          confirmButtonText: "Oke",
        });

        localStorage.setItem("user", JSON.stringify(response.data.data));

        if (userData.role === "user") {
          localStorage.setItem("showSelectRole", "true");
          router.push("/");
          return;
        }
      }
      await Swal.fire({
        icon: "success",
        title: "Login Berhasil",
        timer: 2000,
        showConfirmButton: false,
      });

      router.push("/dashboard");
    } catch (error: any) {
      const rawMessage = error.response?.data?.message;

      const message =
        errorMessages[rawMessage as keyof typeof errorMessages] ??
        "Terjadi kesalahan saat login. Silakan coba lagi.";

      Swal.fire({
        icon: "error",
        title: "Login Gagal",
        text: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full md:w-1/2 bg-white px-10 md:px-15 py-5 mx-auto">
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-2">
          <img
            src="/images/logo-fulusme.png"
            alt="FuLusme Logo"
            className="w-12 h-12"
          />
          <span
            className={`text-xl font-bold
              text-[#00798a]`}
          >
            FuLusme
          </span>
        </div>
        <a href="/">
          <button className="text-[#10565C] font-bold text-sm">
            &lt; Kembali Ke Beranda
          </button>
        </a>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div>
          <label className="font-bold text-[#10565C] block mb-1">Email</label>
          <input
            type="email"
            className="w-full p-3 bg-[#F1F5F9] rounded text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="font-bold text-[#10565C] block mb-1">
            Kata Sandi
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full p-3 bg-[#F1F5F9] rounded text-black pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div className="flex flex-row flex-wrap justify-between">
          <button
            type="submit"
            disabled={loading}
            className={`w-full md:w-1/4 bg-[#10565C] text-white py-3 rounded-xl font-bold transition ${
              loading ? "opacity-60 cursor-not-allowed" : "hover:bg-[#16EDFF]"
            }`}
          >
            {loading ? "Loading..." : "Masuk"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
