"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";
import AnimatedButton from "@/components/ui/AnimatedButton";
import { Leaf, AlertTriangle, ArrowLeft } from "lucide-react";
import { Suspense } from "react";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  let errorMessage = "Terjadi kesalahan saat proses autentikasi. Silakan coba lagi.";
  
  if (error === "Configuration") {
    errorMessage = "Terdapat masalah pada konfigurasi server autentikasi.";
  } else if (error === "AccessDenied") {
    errorMessage = "Akses ditolak. Anda tidak memiliki izin untuk halaman ini.";
  } else if (error === "Verification") {
    errorMessage = "Link verifikasi sudah tidak berlaku atau telah kedaluwarsa.";
  } else if (
    error === "OAuthSignin" || 
    error === "OAuthCallback" || 
    error === "OAuthCreateAccount" || 
    error === "EmailCreateAccount" || 
    error === "Callback" || 
    error === "OAuthAccountNotLinked" || 
    error === "EmailSignin" || 
    error === "CredentialsSignin"
  ) {
     errorMessage = "Gagal masuk. Periksa kembali kredensial atau akun Anda.";
  }

  return (
    <PageWrapper className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-9 h-9 md:w-10 md:h-10 bg-linear-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Leaf size={18} />
            </div>
            <span className="font-heading font-bold text-2xl text-slate-800">
              EcoQuest
            </span>
          </Link>

          <h2 className="mt-2 text-3xl font-extrabold text-slate-900 font-heading">
            Autentikasi Gagal
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Ups! Sepertinya ada kendala saat kamu mencoba masuk.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-slate-100 text-center"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="text-red-500" size={32} />
          </div>
          
          <h3 className="text-xl font-bold text-slate-800 mb-2 font-heading">
            Akses Ditolak
          </h3>
          
          <div className="text-red-600 text-sm bg-red-50 p-4 rounded-xl mb-8 border border-red-100">
            {errorMessage}
          </div>

          <div className="space-y-4">
            <Link href="/auth/login" className="block">
              <AnimatedButton
                type="button"
                variant="auth"
                className="w-full py-4 text-base font-semibold text-slate-800 bg-yellow"
                icon={<ArrowLeft size={18} />}
              >
                Kembali ke Login
              </AnimatedButton>
            </Link>
          </div>
        </motion.div>
      </div>
    </PageWrapper>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <PageWrapper className="min-h-screen flex items-center justify-center bg-slate-50">
         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
      </PageWrapper>
    }>
      <ErrorContent />
    </Suspense>
  );
}
