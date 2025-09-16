import React from 'react';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Skeleton,
  Typography,
} from '@mui/material';
import { Email, Language, Phone } from '@mui/icons-material';
import type { User } from '@/shared/types';

interface UserCardProps {
  user?: User;
  isLoading?: boolean;
  compact?: boolean;
}

export const UserCard: React.FC<UserCardProps> = ({
  user,
  isLoading = false,
  compact = false,
}) => {
  if (isLoading) {
    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Skeleton variant="circular" width={40} height={40} />
            <Box sx={{ ml: 2, flex: 1 }}>
              <Skeleton variant="text" width="60%" height={24} />
              <Skeleton variant="text" width="80%" height={20} />
            </Box>
          </Box>
          {!compact && (
            <>
              <Skeleton variant="text" width="50%" height={20} />
              <Skeleton variant="text" width="40%" height={20} />
              <Skeleton variant="text" width="60%" height={20} />
            </>
          )}
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" color="text.secondary">
            No user data available
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card sx={{ mb: 2, transition: 'elevation 0.2s' }} elevation={1}>
      <CardContent>
        <Box
          sx={{ display: 'flex', alignItems: 'center', mb: compact ? 0 : 2 }}
        >
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
            {getInitials(user.name)}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" component="h3">
              {user.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ID: {user.id}
            </Typography>
          </Box>
        </Box>

        {!compact && (
          <>
            <Box sx={{ mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Email sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2">{user.email}</Typography>
              </Box>

              {user.phone && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Phone
                    sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }}
                  />
                  <Typography variant="body2">{user.phone}</Typography>
                </Box>
              )}

              {user.website && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Language
                    sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }}
                  />
                  <Typography variant="body2">{user.website}</Typography>
                </Box>
              )}
            </Box>

            {user.company && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Company
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  {user.company.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user.company.catchPhrase}
                </Typography>
              </Box>
            )}

            {user.address && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Address
                </Typography>
                <Typography variant="body2">
                  {user.address.street}, {user.address.suite}
                </Typography>
                <Typography variant="body2">
                  {user.address.city}, {user.address.zipcode}
                </Typography>
              </Box>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
