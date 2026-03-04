export const DEFAULT_FILTERS = {
  page: 1,
  limit: 10,
  search: "",
  rarity: "ALL",
};

export const DEFAULT_FORM_VALUES = {
  name: "",
  description: "",
  rarity: "BRONZE",
  category: "COASTAL",
  icon: "",
};

export const RARITY_FILTER_OPTIONS = [
  { label: "Semua", value: "ALL" },
  { label: "Bronze", value: "BRONZE" },
  { label: "Silver", value: "SILVER" },
  { label: "Gold", value: "GOLD" },
  { label: "Platinum", value: "PLATINUM" },
  { label: "Diamond", value: "DIAMOND" },
  { label: "Challenger", value: "CHALLENGER" },
];

export const RARITY_SELECT_OPTIONS = [
  { label: "Bronze", value: "BRONZE" },
  { label: "Silver", value: "SILVER" },
  { label: "Gold", value: "GOLD" },
  { label: "Platinum", value: "PLATINUM" },
  { label: "Diamond", value: "DIAMOND" },
  { label: "Challenger", value: "CHALLENGER" },
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

export const BADGE_TABLE_FILTER_CONFIGS = [
  {
    key: "rarity",
    label: "Tingkat Kelangkaan",
    options: RARITY_FILTER_OPTIONS,
  },
];
