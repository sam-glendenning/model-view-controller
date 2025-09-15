import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/shared/services/api';
import type { CreatePostMutationResponse, Post } from '@/shared/types';

const queryKeys = {
  posts: ['posts'] as const,
  userPosts: (userId: number) => ['posts', 'user', userId] as const,
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation<CreatePostMutationResponse, Error, Omit<Post, 'id'>>({
    mutationFn: (postData: Omit<Post, 'id'>) => apiService.createPost(postData),
    onSuccess: newPost => {
      // Invalidate and refetch posts
      queryClient.invalidateQueries({ queryKey: queryKeys.posts });
      queryClient.invalidateQueries({
        queryKey: queryKeys.userPosts(newPost.userId),
      });

      // Optimistically update the posts cache
      queryClient.setQueryData<Post[]>(queryKeys.posts, oldPosts => {
        return oldPosts ? [newPost, ...oldPosts] : [newPost];
      });
    },
    onError: error => {
      console.error('Failed to create post:', error);
    },
  });
};
