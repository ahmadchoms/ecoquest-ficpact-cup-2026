export const USER_ROLES = {
  ALL: "ALL",
  USER: "USER",
  ADMIN: "ADMIN",
};

export const USER_STATUSES = {
  ALL: "ALL",
  ACTIVE: "ACTIVE",
  BANNED: "BANNED",
  SUSPENDED: "SUSPENDED",
};

export const DEFAULT_FILTERS = {
  page: 1,
  limit: 10,
  search: "",
  role: USER_ROLES.ALL,
  status: USER_STATUSES.ALL,
};

export const DEFAULT_FORM_VALUES = {
  username: "",
  email: "",
  password: "",
  role: USER_ROLES.USER,
  status: USER_STATUSES.ACTIVE,
  level: 1,
  xp: 0,
  points: 0,
};

export const ROLE_FILTER_OPTIONS = [
  { label: "Semua", value: USER_ROLES.ALL },
  { label: "User", value: USER_ROLES.USER },
  { label: "Admin", value: USER_ROLES.ADMIN },
];

export const STATUS_FILTER_OPTIONS = [
  { label: "Semua", value: USER_STATUSES.ALL },
  { label: "Aktif", value: USER_STATUSES.ACTIVE },
  { label: "Suspended", value: USER_STATUSES.SUSPENDED },
  { label: "Banned", value: USER_STATUSES.BANNED },
];

export const ROLE_SELECT_OPTIONS = [
  { label: "User", value: USER_ROLES.USER },
  { label: "Admin", value: USER_ROLES.ADMIN },
];

export const USER_TABLE_FILTER_CONFIGS = [
  {
    key: "role",
    label: "Hak Akses",
    options: ROLE_FILTER_OPTIONS,
  },
  {
    key: "status",
    label: "Status Akun",
    options: STATUS_FILTER_OPTIONS,
  },
];
