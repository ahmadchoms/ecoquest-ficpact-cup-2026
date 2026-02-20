"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";
import AnimatedButton from "@/components/ui/AnimatedButton";
import { useUserStore } from "@/store/useUserStore";
import { Leaf, User, Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { setExplorerName } = useUserStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    setTimeout(() => {
      if (formData.email && formData.password.length >= 6) {
        setExplorerName("Eco Explorer");
        setLoading(false);
        router.push("/dashboard");
      } else {
        setLoading(false);
        setError("Email atau password salah.");
      }
    }, 1000);
  };

  return (
    <PageWrapper className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center text-white">
              <Leaf size={20} />
            </div>
            <span className="font-heading font-bold text-2xl text-slate-800">
              EcoQuest
            </span>
          </Link>

          <h2 className="mt-2 text-3xl font-extrabold text-slate-900 font-heading">
            Selamat Datang Kembali
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Lanjutkan petualanganmu menyelamatkan bumi 🌍
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-slate-100"
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Email / Username
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-slate-400" />
                </div>

                <input
                  id="email"
                  type="text"
                  required
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-shadow"
                  placeholder="explorer@ecoquest.id"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Password
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-slate-400" />
                </div>

                <input
                  id="password"
                  type="password"
                  required
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-shadow"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="text-red-600 text-sm bg-red-50 p-3 rounded-lg flex items-center gap-2"
              >
                ⚠️ {error}
              </motion.div>
            )}

            <AnimatedButton
              type="submit"
              disabled={loading}
              className="w-full py-4 text-base font-semibold"
              icon={loading ? null : <ArrowRight size={18} />}
            >
              {loading ? "Memproses..." : "Masuk"}
            </AnimatedButton>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>

              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">
                  Belum punya akun?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link href="/register">
                <AnimatedButton variant="secondary" className="w-full py-3">
                  Daftar Sekarang
                </AnimatedButton>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
