import { Edit, Trash2, Zap } from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";

/**
 * Membuat definisi kolom tabel user.
 * Dibuat sebagai fungsi (bukan array statis) agar bisa menerima
 * handler tanpa bergantung pada closure di dalam komponen induk.
 *
 * @param {{ onEdit: (user) => void, onDelete: (user) => void }} handlers
 */
export const createMissionColumns = ({ onEdit, onDelete }) => [
  {
    key: "title",
    label: "Misi",
    render: (val, row) => (
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 border-2 border-black rounded-xl flex items-center justify-center text-lg shadow-[3px_3px_0_#0f0f0f] ${row.color || "bg-yellow"}`}
        >
          {row.icon || "🎯"}
        </div>
        <div>
          <p className="font-body font-black text-black">{val}</p>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            {row.category}
          </span>
        </div>
      </div>
    ),
  },
  {
    key: "type",
    label: "Tipe",
    render: (val) => (
      <StatusBadge variant={val === "QUIZ" ? "diamond" : "easy"}>
        {val === "QUIZ" ? "Kuis AI" : "Aksi Nyata"}
      </StatusBadge>
    ),
  },
  {
    key: "xpReward",
    label: "XP Reward",
    render: (val) => (
      <div className="flex items-center gap-1">
        <Zap size={14} className="text-yellow fill-yellow" strokeWidth={3} />
        <span className="font-display font-black text-black">{val}</span>
      </div>
    ),
  },
  {
    key: "completionsCount",
    label: "Peserta",
    render: (val) => (
      <div className="flex items-center gap-2">
        <span className="font-display font-black text-black">{val || 0}</span>
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
          Anak Bangsa
        </span>
      </div>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (val) => (
      <StatusBadge variant={val === "ACTIVE" ? "active" : "inactive"}>
        {val}
      </StatusBadge>
    ),
  },
  {
    key: "actions",
    label: "Aksi",
    render: (_, row) => (
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(row)}
          className="p-2 hover:bg-yellow/30 rounded-lg transition-colors"
        >
          <Edit size={18} />
        </button>
        <button
          onClick={() => onDelete(row)}
          className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
        >
          <Trash2 size={18} />
        </button>
      </div>
    ),
  },
];
