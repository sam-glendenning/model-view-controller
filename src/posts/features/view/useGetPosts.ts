import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/shared/services/api';

const queryKeys = {
  posts: ['posts'] as const,
};

export const useGetPosts = () => {
  return useQuery({
    queryKey: queryKeys.posts,
    queryFn: () => apiService.getPosts(),
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};
