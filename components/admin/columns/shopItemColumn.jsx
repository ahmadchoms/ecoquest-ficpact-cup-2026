import {
  Edit,
  Trash2,
  Coins,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";

/**
 * Membuat definisi kolom tabel Shop Item.
 *
 * @param {{ onEdit: (item) => void, onDelete: (item) => void }} handlers
 */
export const createShopItemColumns = ({ onEdit, onDelete }) => [
  {
    key: "name",
    label: "Item",
    render: (val, row) => (
      <div className="flex flex-col gap-1 items-start">
        <p className="font-body font-black text-black text-base">{val}</p>
        <StatusBadge variant={row.type === "BANNER" ? "banner" : "border"}>
          {row.type === "BANNER" ? "Banner Profil" : "Border Profil"}
        </StatusBadge>
      </div>
    ),
  },
  {
    key: "price",
    label: "Harga Poin",
    render: (val) => (
      <div className="flex items-center gap-1">
        <Coins
          size={14}
          className="text-yellow fill-yellow/20"
          strokeWidth={3}
        />
        <span className="font-display font-black text-black">{val}</span>
      </div>
    ),
  },
  {
    key: "event",
    label: "Ketersediaan",
    render: (_, row) => {
      if (row.event) {
        return (
          <StatusBadge variant="limited" className="flex items-center gap-1">
            <Sparkles size={10} /> Limited: {row.event.name}
          </StatusBadge>
        );
      }
      return <StatusBadge variant="permanent">Permanen</StatusBadge>;
    },
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
    key: "purchasesCount",
    label: "Dibeli",
    render: (val) => (
      <div className="flex items-center gap-2">
        <span className="font-display font-black text-black">{val || 0}</span>
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
          Kali
        </span>
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
