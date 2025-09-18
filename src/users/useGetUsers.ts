import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/shared/services/api';
import type { UsersQueryResponse } from './types';

// Query Keys
const queryKeys = {
  users: ['users'] as const,
};

// User Hooks
export const useGetUsers = () => {
  return useQuery<UsersQueryResponse, Error>({
    queryKey: queryKeys.users,
    queryFn: () => apiService.getUsers(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};
