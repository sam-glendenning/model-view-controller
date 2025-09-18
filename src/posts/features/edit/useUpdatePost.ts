import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/shared/services/api';
import type { Post } from '@/posts/types';

const queryKeys = {
  posts: ['posts'] as const,
  post: (id: string) => ['posts', id] as const,
  userPosts: (userId: number) => ['posts', 'user', userId] as const,
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postData: Post) => apiService.updatePost(postData),
    onSuccess: updatedPost => {
      // Update the specific post in cache
      queryClient.setQueryData(queryKeys.post(updatedPost.id), updatedPost);

      // Update the post in the posts list
      queryClient.setQueryData<Post[]>(queryKeys.posts, oldPosts => {
        return oldPosts?.map(post =>
          post.id === updatedPost.id ? updatedPost : post
        );
      });

      // Update the post in user posts list
      queryClient.setQueryData<Post[]>(
        queryKeys.userPosts(updatedPost.userId),
        oldPosts => {
          return oldPosts?.map(post =>
            post.id === updatedPost.id ? updatedPost : post
          );
        }
      );
    },
    onError: error => {
      console.error('Failed to update post:', error);
    },
  });
};
