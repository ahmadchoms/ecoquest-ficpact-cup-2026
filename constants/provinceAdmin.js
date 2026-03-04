export const DEFAULT_FILTERS = {
  page: 1,
  limit: 10,
  search: "",
  region: "ALL",
  threatLevel: "ALL",
};

export const DEFAULT_FORM_VALUES = {
  name: "",
  region: "JAWA",
  threatLevel: "LOW",
  description: "",
  funFact: "",
  ecosystems: [],
  species: [],
};

export const REGION_FILTER_OPTIONS = [
  { label: "Semua", value: "ALL" },
  { label: "Sumatera", value: "SUMATERA" },
  { label: "Jawa", value: "JAWA" },
  { label: "Kalimantan", value: "KALIMANTAN" },
  { label: "Sulawesi", value: "SULAWESI" },
  { label: "Papua", value: "PAPUA" },
  { label: "Bali Nusa Tenggara", value: "BALI_NUSA_TENGGARA" },
];

export const REGION_SELECT_OPTIONS = [
  { label: "Sumatera", value: "SUMATERA" },
  { label: "Jawa", value: "JAWA" },
  { label: "Kalimantan", value: "KALIMANTAN" },
  { label: "Sulawesi", value: "SULAWESI" },
  { label: "Papua", value: "PAPUA" },
  { label: "Bali Nusa Tenggara", value: "BALI_NUSA_TENGGARA" },
];

export const DIFFICULTY_FILTER_OPTIONS = [
  { label: "Semua", value: "ALL" },
  { label: "Easy", value: "EASY" },
  { label: "Medium", value: "MEDIUM" },
  { label: "Hard", value: "HARD" },
];

export const DIFFICULTY_SELECT_OPTIONS = [
  { label: "Easy", value: "EASY" },
  { label: "Medium", value: "MEDIUM" },
  { label: "Hard", value: "HARD" },
];

export const PROVINCE_TABLE_FILTER_CONFIGS = [
  {
    key: "region",
    label: "Wilayah",
    options: REGION_FILTER_OPTIONS,
  },
  {
    key: "threatLevel",
    label: "Tingkat Ancaman",
    options: DIFFICULTY_FILTER_OPTIONS,
  },
];
