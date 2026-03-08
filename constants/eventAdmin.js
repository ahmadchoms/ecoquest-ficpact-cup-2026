export const DEFAULT_FILTERS = {
  page: 1,
  limit: 10,
  search: "",
  isActive: "ALL",
};

export const DEFAULT_FORM_VALUES = {
  name: "",
  description: "",
  bannerUrl: "",
  startDate: new Date().toISOString().split("T")[0],
  endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // default 1 week later
  isActive: true,
};

export const STATUS_FILTER_OPTIONS = [
  { label: "Semua", value: "ALL" },
  { label: "Aktif", value: "true" },
  { label: "Tidak Aktif", value: "false" },
];

export const EVENT_TABLE_FILTER_CONFIGS = [
  {
    key: "isActive",
    label: "Status Event",
    options: STATUS_FILTER_OPTIONS,
  },
];
