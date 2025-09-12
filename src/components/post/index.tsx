import React from 'react';
import { usePostUpdateController } from '@/controllers/usePostUpdateController';
import { usePostDeleteController } from '@/controllers/usePostDeleteController';
import { PostViewComponent } from './view/PostViewComponent';
import { PostEditComponent } from './edit/PostEditComponent';
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
  } = usePostUpdateController({ postData, onPostUpdated });

  const { isDeleting, deletePost } = usePostDeleteController({
    postData,
    onPostDeleted,
  });

  if (isEditingPost) {
    return (
      <PostEditComponent
        formData={formData}
        onTitleChange={updateTitle}
        onBodyChange={updateBody}
        onUserIdChange={updateUserId}
        onSave={updatePost}
        onCancel={cancelEditing}
        onDelete={deletePost}
        isSaveButtonDisabled={isUpdateSaveButtonDisabled}
        isUpdating={isUpdating}
        isDeleting={isDeleting}
      />
    );
  }

  return (
    <PostViewComponent
      postData={postData}
      onEditClick={startEditing}
      onDeleteClick={deletePost}
      isDeleting={isDeleting}
    />
  );
};

export default PostComponent;
