import { create } from "zustand";

export const useMapStore = create((set) => ({
  selectedProvince: null,
  hoveredProvince: null,
  activeRegionFilter: null,
  mapCenter: [-2.5, 118],
  mapZoom: 5,

  setSelectedProvince: (province) => set({ selectedProvince: province }),
  setHoveredProvince: (province) => set({ hoveredProvince: province }),
  setActiveRegionFilter: (region) => set({ activeRegionFilter: region }),
  setMapView: (center, zoom) => set({ mapCenter: center, mapZoom: zoom }),
  resetMap: () => set({ selectedProvince: null, hoveredProvince: null, activeRegionFilter: null }),
}));
