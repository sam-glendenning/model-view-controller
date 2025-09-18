import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/shared/services/api';
import type { Post } from '@/posts/types';
import type { DeletePostMutationResponse } from './types';

const queryKeys = {
  posts: ['posts'] as const,
  post: (id: string) => ['posts', id] as const,
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation<DeletePostMutationResponse, Error, string>({
    mutationFn: (id: string) => apiService.deletePost(id),
    onSuccess: (_, deletedId) => {
      // Remove the post from all relevant caches
      queryClient.removeQueries({ queryKey: queryKeys.post(deletedId) });

      queryClient.setQueryData<Post[]>(queryKeys.posts, oldPosts => {
        return oldPosts?.filter(post => post.id !== deletedId);
      });

      // Remove from all user posts caches
      void queryClient.invalidateQueries({ queryKey: ['posts', 'user'] });
    },
    onError: error => {
      console.error('Failed to delete post:', error);
    },
  });
};
