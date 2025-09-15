import React from 'react';
import { useUpdatePostController } from '@/controllers/useUpdatePostController';
import { useDeletePostController } from '@/controllers/useDeletePostController';
import { PostViewComponent } from './view/PostViewComponent';
import { PostEditComponent } from './edit/PostEditComponent';
import { DeletePostDialog } from './delete/DeletePostDialog';
import type { Post } from '@/types';

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
  } = useUpdatePostController({ postData, onPostUpdated });

  const {
    isDeletePostDialogOpen,
    isDeleting,
    showDeletePostDialog,
    hideDeletePostDialog,
    confirmDelete,
  } = useDeletePostController({
    postData,
    onPostDeleted,
  });

  return (
    <div>
      {isEditingPost ? (
        <PostEditComponent
          postData={formData}
          onTitleChange={updateTitle}
          onBodyChange={updateBody}
          onUserIdChange={updateUserId}
          onSave={updatePost}
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
        confirmPostDelete={confirmDelete}
        cancelPostDelete={hideDeletePostDialog}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default PostComponent;
