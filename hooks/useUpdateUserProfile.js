import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userDashboardKeys } from "@/hooks/useDashboard";
import { userItemsKeys } from "@/hooks/useUserItems";
import api from "@/lib/api/axios";

/**
 * Hook for updating user's own profile (name, bio, profileImage)
 * Sends FormData to server - endpoint handles file upload to Supabase
 * 
 * @param {Object} data
 * @param {string} [data.name] - New name
 * @param {string} [data.bio] - New bio (can be empty string to clear)
 * @param {File|null} [data.profileImageFile] - File object to upload, or null to delete
 */
export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const formData = new FormData();
      
      // Add name if provided
      if (data.name !== undefined && data.name !== null && data.name !== "") {
        formData.append("name", data.name);
      }
      
      // Add bio if provided (can be empty string)
      if (data.bio !== undefined) {
        formData.append("bio", data.bio);
      }
      
      // Handle profile image: File object to upload or null to delete
      if (data.profileImageFile !== undefined) {
        if (data.profileImageFile instanceof File) {
          // Append actual file
          formData.append("profileImage", data.profileImageFile);
        } else if (data.profileImageFile === null) {
          // Send "null" string to signal deletion on server
          // parseFormData will convert this string to actual null
          formData.append("profileImage", "null");
        }
      }

      const response = await api.patch("/user/profile", formData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userDashboardKeys.dashboard() });
      queryClient.invalidateQueries({ queryKey: userItemsKeys.items() });
    }
  });
};


