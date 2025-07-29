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

      localStorage.setItem("user", JSON.stringify(response.data.data));
      Cookies.set("user", JSON.stringify(response.data.data));

      await Swal.fire({
        icon: "success",
        title: "Login Berhasil",
        timer: 2000,
        showConfirmButton: false,
      });

      router.push("/");
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Login Gagal",
        text: error.response?.data?.message || "Terjadi kesalahan saat login.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full md:w-1/2 bg-white px-10 md:px-15 py-5 mx-auto">
      <div className="flex justify-between items-center mb-10">
        <img src="/images/img.jpg" alt="CapBridge Logo" className="w-20 h-20" />
        <a href="/">
          <button className="text-[#321B87] font-bold text-sm">
            &lt; Kembali Ke Beranda
          </button>
        </a>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div>
          <label className="font-bold text-[#321B87] block mb-1">Email</label>
          <input
            type="email"
            className="w-full p-3 bg-[#F1F5F9] rounded text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="font-bold text-[#321B87] block mb-1">
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
            className={`w-full md:w-1/4 bg-[#321B87] text-white py-3 rounded-full font-bold transition ${
              loading ? "opacity-60 cursor-not-allowed" : "hover:bg-[#2A1572]"
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
