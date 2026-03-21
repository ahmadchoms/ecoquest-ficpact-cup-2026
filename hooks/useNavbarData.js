import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { API } from "@/lib/api/api"; // Sesuaikan path ini dengan letak API helper kamu

export const navbarKeys = {
  all: ["navbar"],
  stats: () => [...navbarKeys.all, "stats"],
};

export const useNavbarData = () => {
  const pathname = usePathname();

  // Jangan fetch di landing page dan halaman auth
  const shouldFetch =
    pathname !== "/" &&
    pathname !== "/auth/login" &&
    pathname !== "/auth/register" &&
    pathname !== "/auth/error" &&
    !pathname.startsWith("/admin");

  return useQuery({
    queryKey: navbarKeys.stats(),
    queryFn: async () => {
      const response = await API.getNavbarData();
      // Mengikuti pola contoh 1 & 3: mengambil response.data
      // Jika interceptor kamu sudah unwrap ke data, biarkan saja return response;
      return response.data || response; 
    },
    enabled: shouldFetch, // Hanya fetch ketika di halaman yang tepat
    staleTime: 1000 * 60 * 5, // 5 menit data dianggap fresh
    gcTime: 1000 * 60 * 10,   // 10 menit cache disimpan
  });
};