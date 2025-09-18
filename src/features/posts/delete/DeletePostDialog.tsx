import React from 'react';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { Cancel, Delete } from '@mui/icons-material';
import type { Post } from '@/features/posts/types';

interface DeletePostDialogProps {
  open: boolean;
  postData: Post;
  confirmPostDelete: () => void;
  cancelPostDelete: () => void;
  isDeleting: boolean;
}

export const DeletePostDialog: React.FC<DeletePostDialogProps> = ({
  open,
  postData,
  confirmPostDelete,
  cancelPostDelete,
  isDeleting,
}) => {
  return (
    <Dialog
      open={open}
      onClose={cancelPostDelete}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
    >
      <DialogTitle id="confirmation-dialog-title">Delete Post</DialogTitle>
      <DialogContent>
        <DialogContentText id="confirmation-dialog-description">
          {`Are you sure you want to delete ${postData.title}?`}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={cancelPostDelete}
          disabled={isDeleting}
          startIcon={<Cancel />}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          onClick={confirmPostDelete}
          disabled={isDeleting}
          startIcon={isDeleting ? <CircularProgress size={16} /> : <Delete />}
          variant="contained"
          color="error"
          autoFocus
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};
