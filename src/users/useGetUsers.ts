import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/shared/services/api';

// Query Keys
const queryKeys = {
  users: ['users'] as const,
};

// User Hooks
export const useGetUsers = () => {
  return useQuery({
    queryKey: queryKeys.users,
    queryFn: () => apiService.getUsers(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
