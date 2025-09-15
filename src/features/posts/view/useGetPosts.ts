import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/shared/services/api';
import type { PostsQueryResponse } from '@/shared/types';

const queryKeys = {
  posts: ['posts'] as const,
};

export const useGetPosts = () => {
  return useQuery<PostsQueryResponse, Error>({
    queryKey: queryKeys.posts,
    queryFn: () => apiService.getPosts(),
    staleTime: 1 * 60 * 1000, // 1 minute
    cacheTime: 5 * 60 * 1000, // 5 minutes
  });
};
