"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function MobileProvinceCards({
  filteredProvinces,
  getProvinceProgress,
  onClose,
}) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ y: 300 }}
      animate={{ y: 0 }}
      exit={{ y: 1000 }}
      className="lg:hidden absolute bottom-0 left-0 right-0 z-500 bg-white rounded-t-3xl shadow-2xl max-h-[50vh] overflow-y-auto"
    >
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-heading font-bold text-gray-800">Pilih Provinsi</h3>
        <button onClick={onClose} className="text-gray-400 text-sm">
          Tutup
        </button>
      </div>

      <div className="p-3 grid grid-cols-2 gap-2">
        {filteredProvinces.map((prov) => {
          const prog = getProvinceProgress(prov.id, prov.missionsCount || 0);

          return (
            <button
              key={prov.id}
              onClick={() => {
                router.push(`/province/${prov.id}`);
                onClose();
              }}
              className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 hover:bg-primary-50 transition-colors text-left"
            >
              <span className="text-lg">{prov.illustration}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-800 truncate">
                  {prov.name}
                </p>
                <p className="text-[10px] text-gray-400">{prog}% selesai</p>
              </div>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
