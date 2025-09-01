import { useState, useCallback } from 'react';
import { useCreatePost } from '@/hooks';
import type { PostFormData } from '@/types';

export interface CreatePostDialogController {
  // Form State
  formData: PostFormData;

  // Form Validation
  isSubmitDisabled: boolean;

  // Actions
  handleClose: () => void;
  updateTitle: (title: string) => void;
  updateBody: (body: string) => void;
  updateUserId: (userId: number) => void;
  submitForm: () => Promise<void>;
}

export interface useCreatePostControllerProps {
  onClose?: () => void;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

export const useCreatePostController = ({
  onClose,
  onSuccess,
  onError,
}: useCreatePostControllerProps = {}): CreatePostDialogController => {
  // Mutation hook
  const { mutateAsync: createPost, isPending: createPostPending } =
    useCreatePost();

  // Local state
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    body: '',
    userId: 1,
  });

  // Computed values
  const isSubmitDisabled =
    !formData.title.trim() || !formData.body.trim() || createPostPending;

  // Actions
  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  const updateTitle = useCallback((title: string) => {
    setFormData(prev => ({ ...prev, title }));
  }, []);

  const updateBody = useCallback((body: string) => {
    setFormData(prev => ({ ...prev, body }));
  }, []);

  const updateUserId = useCallback((userId: number) => {
    setFormData(prev => ({ ...prev, userId: userId ?? 1 }));
  }, []);

  const submitForm = useCallback(async () => {
    try {
      await createPost(formData);

      onSuccess?.('Post created successfully!');
    } catch {
      onError?.('Failed to create post');
    } finally {
      onClose?.();
    }
  }, [createPost, formData, onSuccess, onError, onClose]);

  return {
    // State
    formData,

    // Computed
    isSubmitDisabled,

    // Actions
    handleClose,
    updateTitle,
    updateBody,
    updateUserId,
    submitForm,
  };
};
