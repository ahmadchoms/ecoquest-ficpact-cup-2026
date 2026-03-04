export const DEFAULT_FILTERS = {
  page: 1,
  limit: 10,
  search: "",
  category: "ALL",
  type: "ALL",
};

export const DEFAULT_FORM_VALUES = {
  title: "",
  subtitle: "",
  description: "",
  type: "SIMULATION",
  difficulty: "EASY",
  status: "ACTIVE",
  xpReward: 0,
  pointsReward: 0,
  timeEstimate: "",
  category: "WASTE",
  provinceId: "",
  badgeRewardId: null,
  icon: "",
};

export const CATEGORY_FILTER_OPTIONS = [
  { label: "Semua", value: "ALL" },
  { label: "Ocean", value: "OCEAN" },
  { label: "Transport", value: "TRANSPORT" },
  { label: "Water", value: "WATER" },
  { label: "Coastal", value: "COASTAL" },
  { label: "Biodiversity", value: "BIODIVERSITY" },
  { label: "Waste", value: "WASTE" },
  { label: "Climate", value: "CLIMATE" },
];

export const CATEGORY_SELECT_OPTIONS = [
  { label: "Ocean", value: "OCEAN" },
  { label: "Transport", value: "TRANSPORT" },
  { label: "Water", value: "WATER" },
  { label: "Coastal", value: "COASTAL" },
  { label: "Biodiversity", value: "BIODIVERSITY" },
  { label: "Waste", value: "WASTE" },
  { label: "Climate", value: "CLIMATE" },
];

export const TYPE_FILTER_OPTIONS = [
  { label: "Semua", value: "ALL" },
  { label: "Action/Simulation", value: "SIMULATION" },
  { label: "Quiz AI", value: "QUIZ" },
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

export const TYPE_SELECT_OPTIONS = [
  { label: "Action/Simulation", value: "SIMULATION" },
  { label: "Quiz AI", value: "QUIZ" },
];

export const STATUS_SELECT_OPTIONS = [
  { label: "Draft", value: "DRAFT" },
  { label: "Active", value: "ACTIVE" },
  { label: "Archived", value: "ARCHIVED" },
];

export const MISSION_TABLE_FILTER_CONFIGS = [
  {
    key: "category",
    label: "Kategori Utama",
    options: CATEGORY_FILTER_OPTIONS,
  },
  {
    key: "type",
    label: "Tipe Misi",
    options: TYPE_FILTER_OPTIONS,
  },
];
