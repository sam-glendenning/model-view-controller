import React from 'react';
import { useUpdatePostController } from '../edit';
import { useDeletePostController } from '../delete';
import { PostViewComponent } from '../view';
import { PostEditComponent } from '../edit';
import { DeletePostDialog } from '../delete';
import type { Post } from '@/posts/types';

interface PostComponentProps {
  postData: Post;
  onPostDeleted?: (deletedPost: Post) => void;
  onPostUpdated?: (updatedPost: Post) => void;
}

/**
 * Composite Post Component - Orchestrates all post-related features
 *
 * This component follows the MVC pattern:
 * - Model: Post type and data from props
 * - View: PostViewComponent and PostEditComponent
 * - Controller: useUpdatePostController and useDeletePostController hooks
 */
export const PostComponent: React.FC<PostComponentProps> = ({
  postData,
  onPostDeleted,
  onPostUpdated,
}) => {
  const {
    isEditingPost,
    formData,
    isUpdating,
    isSaveButtonDisabled: isUpdateSaveButtonDisabled,
    startEditing,
    cancelEditing,
    updateTitle,
    updateBody,
    updateUserId,
    updatePost,
  } = useUpdatePostController({
    postData,
    ...(onPostUpdated && { onPostUpdated }),
  });

  const {
    isDeletePostDialogOpen,
    isDeleting,
    showDeletePostDialog,
    hideDeletePostDialog,
    confirmDelete,
  } = useDeletePostController({
    postData,
    ...(onPostDeleted && { onPostDeleted }),
  });

  return (
    <div>
      {isEditingPost ? (
        <PostEditComponent
          postData={formData}
          onTitleChange={updateTitle}
          onBodyChange={updateBody}
          onUserIdChange={updateUserId}
          onSave={() => void updatePost()}
          onCancel={cancelEditing}
          onDelete={showDeletePostDialog}
          isSaveButtonDisabled={isUpdateSaveButtonDisabled}
          isUpdating={isUpdating}
          isDeleting={isDeleting}
        />
      ) : (
        <PostViewComponent
          postData={postData}
          onEditClick={startEditing}
          onDeleteClick={showDeletePostDialog}
          isDeleting={isDeleting}
        />
      )}
      <DeletePostDialog
        open={isDeletePostDialogOpen}
        postData={postData}
        confirmPostDelete={() => void confirmDelete()}
        cancelPostDelete={hideDeletePostDialog}
        isDeleting={isDeleting}
      />
    </div>
  );
};
