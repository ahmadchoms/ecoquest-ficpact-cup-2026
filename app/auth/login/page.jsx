"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";
import AnimatedButton from "@/components/ui/AnimatedButton";
import { toast } from "@/lib/toast";
import {
  Leaf,
  User,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // Proteksi tambahan di sisi client
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      if (session.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    }
  }, [session, status, router]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "registered") {
      toast.success(
        "Registrasi Berhasil",
        "Akun berhasil dibuat. Silakan masuk.",
      );
      const url = new URL(window.location.href);
      url.searchParams.delete("success");
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (!result?.ok) {
        toast.error(
          "Login Gagal",
          result?.error || "Terjadi kesalahan saat login.",
        );
        setLoading(false);
        return;
      }

      toast.success("Login Berhasil", "Mengarahkan ke dashboard...");
      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login Gagal", "Terjadi kesalahan. Silakan coba lagi.");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);

    try {
      const result = await signIn("google", {
        redirect: false,
      });

      if (!result?.ok) {
        // toast.error("Google Sign-In Gagal", result?.error || "Terjadi kesalahan saat login dengan Google.");
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error("Google Sign-In error:", error);
      // toast.error("Google Sign-In Gagal", "Terjadi kesalahan. Silakan coba lagi.");
      setLoading(false);
    }
  };

  return (
    <PageWrapper className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-9 h-9 md:w-10 md:h-10 bg-green border-3 border-black rounded-2xl flex items-center justify-center text-black shadow-hard transition-all duration-200 group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-none">
              <Leaf size={20} strokeWidth={2.5} />
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
                  type={showPassword ? "text" : "password"}
                  required
                  className="appearance-none block w-full pl-10 pr-10 py-3 border border-slate-300 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-shadow"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <AnimatedButton
              type="submit"
              disabled={loading}
              variant="auth"
              className="text-slate-800 bg-yellow"
              icon={
                loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <ArrowRight size={18} />
                )
              }
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
                  Atau masuk dengan
                </span>
              </div>
            </div>

            <div className="mt-6">
              <AnimatedButton
                type="button"
                variant="secondary"
                onClick={() => handleGoogleSignIn()}
                className="w-full py-3 font-medium"
                icon={
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                }
              >
                Google
              </AnimatedButton>
            </div>
          </div>

          <div className="mt-8 text-center bg-slate-50 border border-slate-100 py-3 rounded-xl">
            <p className="text-sm text-slate-600">
              Belum punya akun?{" "}
              <Link
                href="/auth/register"
                className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
              >
                Daftar sekarang
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
