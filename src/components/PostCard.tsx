import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Skeleton,
  Box,
  IconButton,
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import { Post } from '@/types';

interface PostCardProps {
  post?: Post;
  isLoading?: boolean;
  onView?: (post: Post) => void;
  onEdit?: (post: Post) => void;
  onDelete?: (post: Post) => void;
  showActions?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  isLoading = false,
  onView,
  onEdit,
  onDelete,
  showActions = true,
}) => {
  if (isLoading) {
    return (
      <Card sx={{ minHeight: 200, mb: 2 }}>
        <CardContent>
          <Skeleton variant="text" width="60%" height={32} />
          <Skeleton variant="text" width="100%" height={20} sx={{ mt: 1 }} />
          <Skeleton variant="text" width="100%" height={20} />
          <Skeleton variant="text" width="80%" height={20} />
        </CardContent>
        {showActions && (
          <CardActions>
            <Skeleton variant="rectangular" width={80} height={36} />
            <Skeleton variant="rectangular" width={80} height={36} />
            <Skeleton variant="rectangular" width={80} height={36} />
          </CardActions>
        )}
      </Card>
    );
  }

  if (!post) {
    return (
      <Card sx={{ minHeight: 200, mb: 2 }}>
        <CardContent>
          <Typography variant="h6" color="text.secondary">
            No post data available
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ minHeight: 200, mb: 2, transition: 'elevation 0.2s' }} elevation={2}>
      <CardContent>
        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {post.title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.4,
          }}
        >
          {post.body}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Post ID: {post.id} | User ID: {post.userId}
          </Typography>
        </Box>
      </CardContent>
      {showActions && (
        <CardActions sx={{ justifyContent: 'space-between', px: 2 }}>
          <Box>
            {onView && (
              <IconButton
                size="small"
                onClick={() => onView(post)}
                aria-label="view post"
                color="primary"
              >
                <Visibility />
              </IconButton>
            )}
            {onEdit && (
              <IconButton
                size="small"
                onClick={() => onEdit(post)}
                aria-label="edit post"
                color="secondary"
              >
                <Edit />
              </IconButton>
            )}
            {onDelete && (
              <IconButton
                size="small"
                onClick={() => onDelete(post)}
                aria-label="delete post"
                color="error"
              >
                <Delete />
              </IconButton>
            )}
          </Box>
        </CardActions>
      )}
    </Card>
  );
};
