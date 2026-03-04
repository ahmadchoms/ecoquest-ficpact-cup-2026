import RankBadge from "@/components/ui/RankBadge";
import { Edit, Star, Trash2 } from "lucide-react";

/**
 * Membuat definisi kolom tabel user.
 * Dibuat sebagai fungsi (bukan array statis) agar bisa menerima
 * handler tanpa bergantung pada closure di dalam komponen induk.
 *
 * @param {{ onEdit: (user) => void, onDelete: (user) => void }} handlers
 */
export const createBadgeColumns = ({ onEdit, onDelete }) => [
  {
    key: "name",
    label: "Badge",
    render: (val, row) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-50 border-2 border-black rounded-xl flex items-center justify-center text-xl shadow-[3px_3px_0_#0f0f0f]">
          {row.icon || "🏅"}
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
    key: "rarity",
    label: "Rarity",
    render: (val) => {
      const variant = val.toLowerCase();
      return (
        <RankBadge size={40} rank={variant}>
          {val}
        </RankBadge>
      );
    },
  },
  {
    key: "usersCount",
    label: "Penerima",
    render: (val) => (
      <div className="flex items-center gap-2">
        <Star size={14} className="text-yellow fill-yellow" />
        <span className="font-display font-black text-black">{val || 0}</span>
      </div>
    ),
  },
  {
    key: "description",
    label: "Deskripsi",
    className: "hidden md:table-cell max-w-xs",
    render: (val) => (
      <p className="truncate text-xs text-slate-500 font-bold">{val}</p>
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
