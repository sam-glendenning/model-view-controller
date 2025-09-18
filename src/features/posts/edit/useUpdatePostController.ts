import { useCallback, useEffect, useState } from 'react';
import { useUpdatePost } from './useUpdatePost';
import type { Post } from '@/features/posts/types';

interface PostUpdateController {
  // State
  isEditingPost: boolean;
  formData: Post;

  // Computed
  isUpdating: boolean;
  isSaveButtonDisabled: boolean;

  // Actions
  startEditing: () => void;
  cancelEditing: () => void;
  updateTitle: (title: string) => void;
  updateBody: (body: string) => void;
  updateUserId: (userId: number) => void;
  updatePost: () => Promise<void>;
}

interface useUpdatePostControllerProps {
  postData: Post;
  onPostUpdated?: (updatedPost: Post) => void;
  onPostUpdateError?: (error: Error) => void;
}

export const useUpdatePostController = ({
  postData,
  onPostUpdated,
  onPostUpdateError,
}: useUpdatePostControllerProps): PostUpdateController => {
  // Mutation hook
  const { mutateAsync: mutatePost, isPending: isUpdating } = useUpdatePost();

  // Local state
  const [isEditingPost, setIsEditingPost] = useState<boolean>(false);
  const [formData, setFormData] = useState<Post>(postData);

  // Computed values
  const isSaveButtonDisabled =
    isUpdating || !formData.title.trim() || !formData.body.trim();

  useEffect(() => {
    setFormData(postData);
  }, [postData]);

  // Actions
  const startEditing = useCallback(() => {
    setIsEditingPost(true);
  }, []);

  const cancelEditing = useCallback(() => {
    setIsEditingPost(false);
    setFormData(postData); // Reset form data to original post data
  }, [postData]);

  const updateTitle = useCallback((title: string) => {
    setFormData(prev => ({ ...prev, title }));
  }, []);

  const updateBody = useCallback((body: string) => {
    setFormData(prev => ({ ...prev, body }));
  }, []);

  const updateUserId = useCallback((userId: number) => {
    setFormData(prev => ({ ...prev, userId }));
  }, []);

  const updatePost = useCallback(async () => {
    try {
      await mutatePost(formData);
      setIsEditingPost(false);
      onPostUpdated?.(formData);
    } catch (error) {
      onPostUpdateError?.(error as Error);
    }
  }, [formData, mutatePost, onPostUpdated, onPostUpdateError]);

  return {
    // State
    isEditingPost,
    formData,

    // Computed
    isUpdating,
    isSaveButtonDisabled,

    // Actions
    startEditing,
    cancelEditing,
    updateTitle,
    updateBody,
    updateUserId,
    updatePost,
  };
};
