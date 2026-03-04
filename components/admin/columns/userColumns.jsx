import { Edit, Trash2 } from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import LevelBadge from "@/components/ui/LevelBadge";

/**
 * Membuat definisi kolom tabel user.
 * Dibuat sebagai fungsi (bukan array statis) agar bisa menerima
 * handler tanpa bergantung pada closure di dalam komponen induk.
 *
 * @param {{ onEdit: (user) => void, onDelete: (user) => void }} handlers
 */
export const createUserColumns = ({ onEdit, onDelete }) => [
  {
    key: "username",
    label: "Pengguna",
    render: (val, row) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-100 border-2 border-black rounded-xl flex items-center justify-center font-display font-black text-xs shadow-[3px_3px_0_#0f0f0f]">
          {val.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-body font-black text-black">{val}</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            {row.id}
          </p>
        </div>
      </div>
    ),
  },
  {
    key: "email",
    label: "Email",
    render: (val) => <span className="text-slate-600 font-bold">{val}</span>,
  },
  {
    key: "role",
    label: "Role",
    render: (val) => (
      <span className="font-bold uppercase text-xs tracking-wide">{val}</span>
    ),
  },
  {
    key: "level",
    label: "Level",
    render: (val) => <LevelBadge level={val} size="xs" />,
  },
  {
    key: "xp",
    label: "Total XP",
    render: (val) => (
      <span className="font-display font-black">{val.toLocaleString()}</span>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (val) => {
      const statusVariant = val.toLowerCase();
      return <StatusBadge variant={statusVariant}>{val}</StatusBadge>;
    },
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
