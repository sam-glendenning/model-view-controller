import { useState, useCallback } from 'react';
import { useCreatePost } from './useCreatePost';
import type { Post } from '@/shared/types';

const EMPTY_POST: Omit<Post, 'id'> = {
  title: '',
  body: '',
  userId: 1,
} as const;

interface CreatePostDialogController {
  // State
  postData: Post;
  isCreatePostDialogOpen: boolean;

  // Computed
  isCreating: boolean;
  isCreateButtonDisabled: boolean;

  // Actions
  showCreatePostDialog: () => void;
  hideCreatePostDialog: () => void;
  updateTitle: (title: string) => void;
  updateBody: (body: string) => void;
  updateUserId: (userId: number) => void;
  confirmCreate: () => Promise<void>;
}

interface UseCreatePostControllerProps {
  onPostCreated?: (createdPost: Post) => void;
  onPostCreationError?: (error: Error) => void;
}

export const useCreatePostController = ({
  onPostCreated,
  onPostCreationError,
}: UseCreatePostControllerProps): CreatePostDialogController => {
  // Mutation hook
  const { mutateAsync: createPost, isPending: isCreating } = useCreatePost();

  // Local state
  const [isCreatePostDialogOpen, setIsCreatePostDialogOpen] = useState(false);
  const [postData, setPostData] = useState<Post>({
    ...EMPTY_POST,
    id: 100000, // #TODO Generate unique ID
  });

  const resetPostData = useCallback(() => {
    setPostData({
      ...EMPTY_POST,
      id: 100000, // generator func here
    });
  }, []);

  // Computed values
  const isCreateButtonDisabled =
    isCreating || !postData.title.trim() || !postData.body.trim();

  // Actions
  const showCreatePostDialog = useCallback(() => {
    setIsCreatePostDialogOpen(true);
  }, []);

  const hideCreatePostDialog = useCallback(() => {
    setIsCreatePostDialogOpen(false);
  }, []);

  const updateTitle = useCallback((title: string) => {
    setPostData(prev => ({ ...prev, title }));
  }, []);

  const updateBody = useCallback((body: string) => {
    setPostData(prev => ({ ...prev, body }));
  }, []);

  const updateUserId = useCallback((userId: number) => {
    setPostData(prev => ({ ...prev, userId }));
  }, []);

  const confirmCreate = useCallback(async () => {
    try {
      await createPost(postData);
      onPostCreated?.(postData);
      setIsCreatePostDialogOpen(false);
      resetPostData();
    } catch (error) {
      onPostCreationError?.(error as Error);
    }
  }, [createPost, postData, resetPostData, onPostCreated, onPostCreationError]);

  return {
    // State
    postData,
    isCreatePostDialogOpen,

    // Computed
    isCreating,
    isCreateButtonDisabled,

    // Actions
    showCreatePostDialog,
    hideCreatePostDialog,
    updateTitle,
    updateBody,
    updateUserId,
    confirmCreate,
  };
};
