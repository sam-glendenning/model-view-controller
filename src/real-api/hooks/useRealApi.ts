import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { realApiService } from '../services/realApiService';
import {
  PostsQueryResponse,
  PostQueryResponse,
  UsersQueryResponse,
  UserQueryResponse,
  CommentsQueryResponse,
  CreatePostForm,
  UpdatePostForm,
  CreatePostMutationResponse,
  UpdatePostMutationResponse,
  GetPostsParams,
  GetCommentsParams,
} from '@/types';

// Query Keys for real API
export const REAL_API_QUERY_KEYS = {
  posts: ['real-posts'] as const,
  post: (id: number) => ['real-post', id] as const,
  users: ['real-users'] as const,
  user: (id: number) => ['real-user', id] as const,
  comments: ['real-comments'] as const,
  postComments: (postId: number) => ['real-post-comments', postId] as const,
} as const;

// Posts Hooks
export const useRealPosts = (params?: GetPostsParams) => {
  return useQuery<PostsQueryResponse, Error>({
    queryKey: [...REAL_API_QUERY_KEYS.posts, params],
    queryFn: () => realApiService.getPosts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useRealPost = (id: number) => {
  return useQuery<PostQueryResponse, Error>({
    queryKey: REAL_API_QUERY_KEYS.post(id),
    queryFn: () => realApiService.getPost(id),
    enabled: !!id && id > 0,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
};

export const useCreateRealPost = () => {
  const queryClient = useQueryClient();

  return useMutation<CreatePostMutationResponse, Error, CreatePostForm>({
    mutationFn: realApiService.createPost,
    onSuccess: (newPost) => {
      // Update the posts list cache
      queryClient.setQueryData<PostsQueryResponse>(
        REAL_API_QUERY_KEYS.posts,
        (oldPosts) => {
          if (oldPosts) {
            return [newPost, ...oldPosts];
          }
          return [newPost];
        }
      );
      
      // Invalidate and refetch posts
      queryClient.invalidateQueries({ queryKey: REAL_API_QUERY_KEYS.posts });
      
      console.log('✅ Real post created successfully');
    },
    onError: (error) => {
      console.error('❌ Failed to create real post:', error);
    },
  });
};

export const useUpdateRealPost = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdatePostMutationResponse, Error, UpdatePostForm>({
    mutationFn: realApiService.updatePost,
    onSuccess: (updatedPost) => {
      // Update the posts list cache
      queryClient.setQueryData<PostsQueryResponse>(
        REAL_API_QUERY_KEYS.posts,
        (oldPosts) => {
          if (oldPosts) {
            return oldPosts.map((post) =>
              post.id === updatedPost.id ? updatedPost : post
            );
          }
          return [updatedPost];
        }
      );

      // Update the individual post cache
      queryClient.setQueryData(
        REAL_API_QUERY_KEYS.post(updatedPost.id),
        updatedPost
      );

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: REAL_API_QUERY_KEYS.posts });
      queryClient.invalidateQueries({ queryKey: REAL_API_QUERY_KEYS.post(updatedPost.id) });
      
      console.log('✅ Real post updated successfully');
    },
    onError: (error) => {
      console.error('❌ Failed to update real post:', error);
    },
  });
};

export const useDeleteRealPost = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: realApiService.deletePost,
    onSuccess: (_, deletedId) => {
      // Remove from posts list cache
      queryClient.setQueryData<PostsQueryResponse>(
        REAL_API_QUERY_KEYS.posts,
        (oldPosts) => {
          if (oldPosts) {
            return oldPosts.filter((post) => post.id !== deletedId);
          }
          return [];
        }
      );

      // Remove individual post cache
      queryClient.removeQueries({ queryKey: REAL_API_QUERY_KEYS.post(deletedId) });

      // Invalidate posts list
      queryClient.invalidateQueries({ queryKey: REAL_API_QUERY_KEYS.posts });
      
      console.log('✅ Real post deleted successfully');
    },
    onError: (error) => {
      console.error('❌ Failed to delete real post:', error);
    },
  });
};

// Users Hooks
export const useRealUsers = () => {
  return useQuery<UsersQueryResponse, Error>({
    queryKey: REAL_API_QUERY_KEYS.users,
    queryFn: realApiService.getUsers,
    staleTime: 10 * 60 * 1000, // 10 minutes (users change less frequently)
    cacheTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useRealUser = (id: number) => {
  return useQuery<UserQueryResponse, Error>({
    queryKey: REAL_API_QUERY_KEYS.user(id),
    queryFn: () => realApiService.getUser(id),
    enabled: !!id && id > 0,
    staleTime: 10 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
  });
};

// Comments Hooks
export const useRealComments = (params?: GetCommentsParams) => {
  return useQuery<CommentsQueryResponse, Error>({
    queryKey: [...REAL_API_QUERY_KEYS.comments, params],
    queryFn: () => realApiService.getComments(params),
    staleTime: 5 * 60 * 1000,
    cacheTime: 15 * 60 * 1000,
  });
};

export const useRealPostComments = (postId: number) => {
  return useQuery<CommentsQueryResponse, Error>({
    queryKey: REAL_API_QUERY_KEYS.postComments(postId),
    queryFn: () => realApiService.getPostComments(postId),
    enabled: !!postId && postId > 0,
    staleTime: 5 * 60 * 1000,
    cacheTime: 15 * 60 * 1000,
  });
};
