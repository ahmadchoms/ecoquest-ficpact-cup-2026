import { useQuery } from "@tanstack/react-query";
import { UserAPI } from "@/lib/api/user"; // Sesuaikan path ini dengan letak API helper kamu

export const navbarKeys = {
  all: ["navbar"],
  stats: () => [...navbarKeys.all, "stats"],
};

export const useNavbarData = () => {
  return useQuery({
    queryKey: navbarKeys.stats(),
    queryFn: async () => {
      const response = await UserAPI.getNavbarData();
      // Mengikuti pola contoh 1 & 3: mengambil response.data
      // Jika interceptor kamu sudah unwrap ke data, biarkan saja return response;
      return response.data || response; 
    },
    staleTime: 1000 * 60 * 5, // 5 menit data dianggap fresh
    gcTime: 1000 * 60 * 10,   // 10 menit cache disimpan
  });
};