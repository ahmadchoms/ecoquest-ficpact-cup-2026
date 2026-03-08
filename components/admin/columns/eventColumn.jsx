import { Edit, Trash2, Calendar, ShoppingBag } from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";

/**
 * Membuat definisi kolom tabel Event.
 *
 * @param {{ onEdit: (event) => void, onDelete: (event) => void }} handlers
 */
export const createEventColumns = ({ onEdit, onDelete }) => [
  {
    key: "name",
    label: "Event",
    render: (val, row) => (
      <div className="flex flex-col gap-1">
        <p className="font-body font-black text-black text-base">{val}</p>
        {row.description && (
          <span
            className="text-xs text-slate-500 font-medium line-clamp-1 max-w-50"
            title={row.description}
          >
            {row.description}
          </span>
        )}
      </div>
    ),
  },
  {
    key: "dates",
    label: "Periode Event",
    render: (_, row) => {
      const formatter = new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      const start = formatter.format(new Date(row.startDate));
      const end = formatter.format(new Date(row.endDate));
      return (
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-slate-400" />
          <span className="font-body font-bold text-slate-600 text-xs">
            {start} - {end}
          </span>
        </div>
      );
    },
  },
  {
    key: "itemsCount",
    label: "Jumlah Item",
    render: (val) => (
      <div className="flex items-center gap-2">
        <ShoppingBag size={14} className="text-pink fill-pink/20" />
        <span className="font-display font-black text-black">{val || 0}</span>
      </div>
    ),
  },
  {
    key: "isActive",
    label: "Status",
    render: (val) => (
      <StatusBadge variant={val ? "active" : "inactive"}>
        {val ? "Aktif" : "Tidak Aktif"}
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
