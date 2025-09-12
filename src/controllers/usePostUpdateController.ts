import { useState, useCallback } from 'react';
import { useUpdatePost } from '@/hooks';
import type { Post } from '@/types';

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

export interface UsePostUpdateControllerProps {
  postData: Post;
  onPostUpdated?: (updatedPost: Post) => void;
}

export const usePostUpdateController = ({
  postData,
  onPostUpdated,
}: UsePostUpdateControllerProps): PostUpdateController => {
  // Mutation hook
  const { mutateAsync: mutatePost, isPending: isUpdating } = useUpdatePost();

  // Local state
  const [isEditingPost, setIsEditingPost] = useState<boolean>(false);
  const [formData, setFormData] = useState<Post>(postData);

  // Computed values
  const isSaveButtonDisabled =
    isUpdating || !formData.title.trim() || !formData.body.trim();

  // Actions
  const startEditing = useCallback(() => {
    setIsEditingPost(true);
  }, []);

  const cancelEditing = useCallback(() => {
    setIsEditingPost(false);
  }, []);

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
    await mutatePost(formData);

    setIsEditingPost(false);
    onPostUpdated?.(formData);
  }, [formData, mutatePost, onPostUpdated]);

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
