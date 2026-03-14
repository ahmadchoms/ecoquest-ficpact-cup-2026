export const DEFAULT_FILTERS = {
  page: 1,
  limit: 10,
  search: "",
  type: "ALL",
  isActive: "ALL",
};

export const DEFAULT_FORM_VALUES = {
  name: "",
  description: "",
  price: 0,
  type: "BANNER",
  content: "",
  previewUrl: "",
  eventId: "", // treating empty string as null in frontend
  isActive: true,
};

export const TYPE_FILTER_OPTIONS = [
  { label: "Semua Tipe", value: "ALL" },
  { label: "Banner Profil", value: "BANNER" },
  { label: "Border Profil", value: "BORDER" },
];

export const TYPE_SELECT_OPTIONS = [
  { label: "Banner Profil", value: "BANNER" },
  { label: "Border Profil", value: "BORDER" },
];

export const STATUS_FILTER_OPTIONS = [
  { label: "Semua", value: "ALL" },
  { label: "Aktif", value: "true" },
  { label: "Tidak Aktif", value: "false" },
];

export const SHOP_ITEM_TABLE_FILTER_CONFIGS = [
  {
    key: "type",
    label: "Tipe Item",
    options: TYPE_FILTER_OPTIONS,
  },
  {
    key: "isActive",
    label: "Status Item",
    options: STATUS_FILTER_OPTIONS,
  },
];
