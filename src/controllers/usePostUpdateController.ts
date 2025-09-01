import { useState, useCallback } from 'react';
import { useUpdatePost } from '@/hooks';
import type { Post, UpdatePostForm, PostFormData } from '@/types';

export interface PostUpdateController {
  // Data
  post: Post;

  // State
  isEditingPost: boolean;
  formData: PostFormData;

  // Computed
  isUpdateSubmitDisabled: boolean;

  // Actions
  startEditing: () => void;
  cancelEditing: () => void;
  updateTitle: (title: string) => void;
  updateBody: (body: string) => void;
  updateUserId: (userId: number) => void;
  updatePost: () => Promise<void>;
}

export interface UsePostUpdateControllerProps {
  post: Post;
  onPostUpdated?: () => void;
}

export const usePostUpdateController = ({
  post,
  onPostUpdated,
}: UsePostUpdateControllerProps): PostUpdateController => {
  // Mutation hook
  const { mutateAsync: mutatePost, isPending: isUpdatePostPending } =
    useUpdatePost();

  // Local state
  const [isEditingPost, setIsEditingPost] = useState<boolean>(false);
  const [formData, setFormData] = useState<PostFormData>({
    title: post.title,
    body: post.body,
    userId: post.userId,
  });

  // Computed values
  const isUpdateSubmitDisabled =
    !formData.title.trim() || !formData.body.trim() || isUpdatePostPending;

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
    setFormData(prev => ({ ...prev, userId: userId ?? 1 }));
  }, []);

  const updatePost = useCallback(async () => {
    const updateData: UpdatePostForm = {
      id: post.id,
      ...formData,
    };

    await mutatePost(updateData);

    setIsEditingPost(false);
    onPostUpdated?.();
  }, [post.id, formData, mutatePost, onPostUpdated]);

  return {
    // Data
    post,

    // State
    isEditingPost,
    formData,

    // Computed
    isUpdateSubmitDisabled,

    // Actions
    startEditing,
    cancelEditing,
    updateTitle,
    updateBody,
    updateUserId,
    updatePost,
  };
};
