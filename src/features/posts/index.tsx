import React from 'react';
import { useUpdatePostController } from '@/features/posts/edit/useUpdatePostController';
import { useDeletePostController } from '@/features/posts/delete/useDeletePostController';
import { PostViewComponent } from '@/features/posts/view/PostViewComponent';
import { PostEditComponent } from '@/features/posts/edit/PostEditComponent';
import { DeletePostDialog } from '@/features/posts/delete/DeletePostDialog';
import type { Post } from '@/shared/types';

interface PostComponentProps {
  postData: Post;
  onPostDeleted?: (deletedPost: Post) => void;
  onPostUpdated?: (updatedPost: Post) => void;
}

const PostComponent: React.FC<PostComponentProps> = ({
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

export default PostComponent;
