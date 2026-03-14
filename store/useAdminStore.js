import { create } from "zustand";

export const useAdminStore = create((set) => ({
  // Navigation State
  sidebarOpen: true,
  mobileSidebarOpen: false,
  activePage: "dashboard",
  
  // UI Preferences
  compactMode: false,
  
  // Global Filters
  searchQuery: "",
  
  // Actions
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleMobileSidebar: () => set((state) => ({ mobileSidebarOpen: !state.mobileSidebarOpen })),
  setMobileSidebar: (open) => set({ mobileSidebarOpen: open }),
  setActivePage: (page) => set({ activePage: page }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setCompactMode: (compact) => set({ compactMode: compact }),
  
  // Reset
  resetAdminUI: () => set({ 
    sidebarOpen: true, 
    mobileSidebarOpen: false, 
    activePage: "dashboard",
    searchQuery: "" 
  }),
}));
