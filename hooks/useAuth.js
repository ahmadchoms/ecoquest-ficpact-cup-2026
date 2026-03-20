import { useQueryClient, useMutation } from "@tanstack/react-query";
import { API } from "@/lib/api/api";

export const authKeys = {
  all: ["auth"],
  register: () => [...authKeys.all, "register"],
  forgotPassword: () => [...authKeys.all, "forgotPassword"],
  resetPassword: () => [...authKeys.all, "resetPassword"],
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => API.register(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
  });
};

export const useForgotPassword = (payload) => {
  return useMutation({
    mutationKey: authKeys.forgotPassword(),
    mutationFn: () => API.forgot_password(payload),
  });
};

export const useResetPassword = (payload) => {
  return useMutation({
    mutationKey: authKeys.resetPassword(),
    mutationFn: () => API.reset_password(payload),
  });
};
