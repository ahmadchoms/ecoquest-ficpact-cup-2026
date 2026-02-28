import { provinces as mockProvinces } from "@/data/provinces";
import { missionList as mockMissions } from "@/data/missions";
import { badgeList as mockBadges } from "@/data/badges";

// Simulated Latency
const DELAY = 800;

export const MockAdminService = {
  // --- DASHBOARD ---
  getStats: async () => {
    await new Promise((resolve) => setTimeout(resolve, DELAY));
    const totalUsers = 1254; // Mocked total
    const totalXP = 452000;
    
    return {
      stats: [
        { label: "Total Pengguna", value: totalUsers.toLocaleString(), trend: "+12%", color: "bg-yellow" },
        { label: "Misi Selesai", value: "8,432", trend: "+5%", color: "bg-mint" },
        { label: "Provinsi Dijelajahi", value: "34", trend: "0%", color: "bg-purple" },
        { label: "Badge Terbit", value: mockBadges.length, trend: "+2", color: "bg-orange" },
      ],
      xpDistribution: [
        { name: "Lvl 1-5", value: 450 },
        { name: "Lvl 6-10", value: 320 },
        { name: "Lvl 11-20", value: 280 },
        { name: "Lvl 21+", value: 204 },
      ],
      recentActivity: [
        { id: 1, user: "Budi Santoso", action: "Menyelesaikan Misi", target: "Jejak Karbon", time: "2 menit yang lalu" },
        { id: 2, user: "Siti Aminah", action: "Membuka Badge", target: "Waste Warrior", time: "15 menit yang lalu" },
        { id: 3, user: "Andi Wijaya", action: "Level Up", target: "Level 12", time: "1 jam yang lalu" },
      ]
    };
  },

  // --- ACTIVITIES ---
  getActivities: async (page = 1, limit = 10) => {
    await new Promise((resolve) => setTimeout(resolve, DELAY));
    const actions = ["Menyelesaikan Misi", "Membuka Badge", "Level Up", "Mendaftar", "Klaim Reward"];
    const targets = ["Jejak Karbon", "Waste Warrior", "Level 12", "EcoQuest", "Pohon Avatar"];
    const users = ["Budi Santoso", "Siti Aminah", "Andi Wijaya", "Rina Marlina", "Joko Susilo"];
    
    const activities = Array.from({ length: 50 }).map((_, i) => ({
      id: `act-${i}`,
      user: users[Math.floor(Math.random() * users.length)],
      action: actions[Math.floor(Math.random() * actions.length)],
      target: targets[Math.floor(Math.random() * targets.length)],
      time: `${Math.floor(Math.random() * 24)} jam yang lalu`,
    }));
    return {
      data: activities.slice((page - 1) * limit, page * limit),
      total: activities.length,
      page,
      limit
    };
  },

  // --- USERS ---
  getUsers: async (page = 1, limit = 10, search = "") => {
    await new Promise((resolve) => setTimeout(resolve, DELAY));
    
    // Generate mock users based on search
    const users = Array.from({ length: 50 }).map((_, i) => ({
      id: `u-${i}`,
      username: `Explorer_${i + 1}`,
      email: `user${i + 1}@ecoquest.id`,
      level: Math.floor(Math.random() * 30) + 1,
      role: Math.random() > 0.8 ? "Admin" : "Standard",
      status: Math.random() > 0.1 ? "Aktif" : "Banned",
      xp: Math.floor(Math.random() * 5000),
      badges: Math.floor(Math.random() * 8),
      joinedAt: new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString("id-ID"),
    }));

    const filtered = search 
      ? users.filter(u => u.username.toLowerCase().includes(search.toLowerCase()) || u.email.includes(search))
      : users;

    return {
      data: filtered.slice((page - 1) * limit, page * limit),
      total: filtered.length,
      page,
      limit
    };
  },

  // --- PROVINCES ---
  getProvinces: async () => {
    await new Promise((resolve) => setTimeout(resolve, DELAY));
    return {
      data: mockProvinces.map(p => ({
        ...p,
        missionCount: p.missions.length,
        completionRate: Math.floor(Math.random() * 100)
      })),
      total: mockProvinces.length
    };
  },

  // --- MISSIONS ---
  getMissions: async () => {
    await new Promise((resolve) => setTimeout(resolve, DELAY));
    return {
      data: mockMissions.map(m => ({
        ...m,
        completions: Math.floor(Math.random() * 500),
        status: "active"
      })),
      total: mockMissions.length
    };
  },

  getPendingMissions: async () => {
    await new Promise((resolve) => setTimeout(resolve, DELAY));
    // Simulate one pending mission 
    return {
      data: [{
        id: "pm-1",
        title: "Restorasi Terumbu Karang",
        category: "Coastal",
        status: "pending"
      }],
      total: 1
    };
  },

  // --- BADGES ---
  getBadges: async () => {
    await new Promise((resolve) => setTimeout(resolve, DELAY));
    return {
      data: mockBadges.map(b => ({
        ...b,
        awardedCount: Math.floor(Math.random() * 200)
      })),
      total: mockBadges.length
    };
  },

  // --- GENERIC CRUD SIMULATION ---
  create: async (entity, data) => {
    await new Promise((resolve) => setTimeout(resolve, DELAY));
    console.log(`[MockAdminService] Creating ${entity}:`, data);
    return { success: true, data: { ...data, id: Math.random().toString(36).substr(2, 9) } };
  },

  update: async (entity, id, data) => {
    await new Promise((resolve) => setTimeout(resolve, DELAY));
    console.log(`[MockAdminService] Updating ${entity} ${id}:`, data);
    return { success: true, data: { ...data, id } };
  },

  delete: async (entity, id) => {
    await new Promise((resolve) => setTimeout(resolve, DELAY));
    console.log(`[MockAdminService] Deleting ${entity} ${id}`);
    return { success: true };
  }
};
