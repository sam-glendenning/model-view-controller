import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  Container,
  CssBaseline,
  IconButton,
  Paper,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
} from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PostsPage } from './pages/PostsPage';
import { UsersPage } from './pages/UsersPage';

// Create a MUI theme
const getTheme = (mode: 'light' | 'dark') =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
    },
    typography: {
      h3: {
        fontWeight: 600,
      },
      h5: {
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          '@global': {
            '@keyframes pulse': {
              '0%': {
                opacity: 1,
              },
              '50%': {
                opacity: 0.5,
              },
              '100%': {
                opacity: 1,
              },
            },
          },
        },
      },
    },
  });

// Create QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 30000, // 30 seconds
    },
    mutations: {
      retry: 1,
    },
  },
});

type AppView = 'posts' | 'users' | 'home';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [darkMode, setDarkMode] = useState(false);

  const theme = getTheme(darkMode ? 'dark' : 'light');

  const renderContent = () => {
    switch (currentView) {
      case 'posts':
        return <PostsPage />;
      case 'users':
        return <UsersPage />;
      case 'home':
      default:
        return (
          <Container maxWidth="md" sx={{ py: 8 }}>
            <Paper elevation={3} sx={{ p: 6, textAlign: 'center' }}>
              <Typography variant="h2" component="h1" gutterBottom>
                MVC React Demo
              </Typography>
              <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
                A demonstration of Model-View-Controller architecture in React
              </Typography>

              <Box sx={{ mb: 4 }}>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  This application showcases the MVC pattern with feature-based
                  organization:
                </Typography>
                <Box
                  component="ul"
                  sx={{ textAlign: 'left', maxWidth: 450, mx: 'auto' }}
                >
                  <li>
                    <strong>Model:</strong> TypeScript interfaces and API
                    services with UUID support
                  </li>
                  <li>
                    <strong>View:</strong> React components organized by feature
                  </li>
                  <li>
                    <strong>Controller:</strong> Custom hooks with TanStack
                    Query for state management
                  </li>
                </Box>
              </Box>

              <Box
                sx={{
                  mb: 4,
                  p: 2,
                  backgroundColor: 'rgba(255, 193, 7, 0.1)',
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  🔶 <strong>Mock API Active:</strong> All requests are
                  intercepted by MSW with 1000ms artificial delays to simulate
                  real network conditions.
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  This demo uses completely mocked data - no external API calls
                  are made.
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => { setCurrentView('posts'); }}
                >
                  View Posts
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => { setCurrentView('users'); }}
                >
                  View Users
                </Button>
              </Box>

              <Box sx={{ mt: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  Built with React 17, TypeScript 5, Material-UI 5, TanStack
                  Query v4, MSW v2, UUID v13, ESLint v9, Node v24, Jest v29,
                  Vite v7 and Axios v1
                </Typography>
              </Box>
            </Paper>
          </Container>
        );
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <AppBar position="static" elevation={1}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              MVC React Demo
            </Typography>

            {/* Mock API Status Indicator */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mr: 2,
                px: 1.5,
                py: 0.5,
                backgroundColor: 'rgba(255, 193, 7, 0.1)',
                borderRadius: 1,
                border: '1px solid rgba(255, 193, 7, 0.3)',
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#ff9800',
                  animation: 'pulse 2s infinite',
                }}
              />
              <Typography
                variant="caption"
                sx={{ color: '#ff9800', fontWeight: 500 }}
              >
                Mock API (1000ms delay)
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                color="inherit"
                onClick={() => { setCurrentView('home'); }}
                sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
              >
                Home
              </Button>
              <Button color="inherit" onClick={() => { setCurrentView('posts'); }}>
                Posts
              </Button>
              <Button color="inherit" onClick={() => { setCurrentView('users'); }}>
                Users
              </Button>

              <IconButton
                color="inherit"
                onClick={() => { setDarkMode(!darkMode); }}
                aria-label="toggle dark mode"
              >
                {darkMode ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        <Box component="main" sx={{ minHeight: 'calc(100vh - 64px)' }}>
          {renderContent()}
        </Box>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
