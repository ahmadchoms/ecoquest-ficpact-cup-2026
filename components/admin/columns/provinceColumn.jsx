import { Edit, Trash2 } from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";

/**
 * Membuat definisi kolom tabel user.
 * Dibuat sebagai fungsi (bukan array statis) agar bisa menerima
 * handler tanpa bergantung pada closure di dalam komponen induk.
 *
 * @param {{ onEdit: (user) => void, onDelete: (user) => void }} handlers
 */
export const createProvinceColumns = ({ onEdit, onDelete }) => [
  {
    key: "name",
    label: "Provinsi",
    render: (val, row) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white border-2 border-black rounded-xl flex items-center justify-center text-xl shadow-[3px_3px_0_#0f0f0f]">
          {row.illustration || "🗺️"}
        </div>
        <p className="font-body font-black text-black">{val}</p>
      </div>
    ),
  },
  {
    key: "region",
    label: "Wilayah",
    render: (val) => (
      <span className="inline-block px-3 py-1 bg-green-100 border-2 border-dashed border-green-700 rounded-lg text-[10px] font-black uppercase tracking-widest text-green-700">
        {val}
      </span>
    ),
  },
  {
    key: "threatLevel",
    label: "Threat Level",
    render: (val) => <StatusBadge variant={val}>{val}</StatusBadge>,
  },
  {
    key: "missionsCount",
    label: "Misi",
    render: (val) => (
      <div className="flex items-center gap-2">
        <span className="font-display font-black text-black">{val || 0}</span>
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
          Active
        </span>
      </div>
    ),
  },
  {
    key: "completionRate",
    label: "Avg. Completion",
    render: (val) => (
      <div className="flex items-center gap-3 w-32">
        <div className="flex-1 h-3 bg-slate-100 border-2 border-black rounded-full overflow-hidden">
          <div className="h-full bg-mint" style={{ width: `${val || 0}%` }} />
        </div>
        <span className="text-xs font-black">{val || 0}%</span>
      </div>
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
