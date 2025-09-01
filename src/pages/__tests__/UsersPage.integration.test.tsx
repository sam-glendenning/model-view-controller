import { screen, waitFor } from '@testing-library/react';
import { UsersPage } from '@/pages/UsersPage';
import { render } from '@/test/utils';
import { mockUsers } from '@/test/mocks/handlers';

describe('UsersPage Integration Tests', () => {
  describe('Users Loading and Display', () => {
    it('should load and display users on mount', async () => {
      render(<UsersPage />);

      // Wait for loading to finish - look for actual user data instead of skeletons
      await waitFor(() => {
        // Wait for the first user's name to appear (this means loading is done)
        expect(screen.getByText(mockUsers[0].name)).toBeInTheDocument();
      }, { timeout: 10000 });

      // Should display all mock users
      mockUsers.forEach(user => {
        expect(screen.getByText(user.name)).toBeInTheDocument();
        expect(screen.getByText(user.email)).toBeInTheDocument();
      });
    });

    it('should show users directory header', async () => {
      render(<UsersPage />);

      expect(screen.getByText('Users Directory')).toBeInTheDocument();
      expect(screen.getByText('View all users in the system')).toBeInTheDocument();
    });

    it('should display user details correctly', async () => {
      render(<UsersPage />);

      // Wait for users to load
      await waitFor(() => {
        expect(screen.getByText(mockUsers[0].name)).toBeInTheDocument();
      }, { timeout: 10000 });

      // Check first user's details
      const firstUser = mockUsers[0];
      expect(screen.getByText(firstUser.name)).toBeInTheDocument();
      expect(screen.getByText(firstUser.email)).toBeInTheDocument();
      
      if (firstUser.phone) {
        expect(screen.getByText(firstUser.phone)).toBeInTheDocument();
      }
      
      if (firstUser.website) {
        expect(screen.getByText(firstUser.website)).toBeInTheDocument();
      }
      
      if (firstUser.company) {
        expect(screen.getAllByText('Company').length).toBeGreaterThan(0);
        expect(screen.getByText(firstUser.company.name)).toBeInTheDocument();
        expect(screen.getByText(firstUser.company.catchPhrase)).toBeInTheDocument();
      }
      
      if (firstUser.address) {
        expect(screen.getAllByText('Address').length).toBeGreaterThan(0);
        expect(screen.getByText(`${firstUser.address.street}, ${firstUser.address.suite}`)).toBeInTheDocument();
        expect(screen.getByText(`${firstUser.address.city}, ${firstUser.address.zipcode}`)).toBeInTheDocument();
      }
    });
  });

  describe('User Display States', () => {
    it('should show loading state initially', async () => {
      render(<UsersPage />);

      // Should show loading skeletons initially
      const skeletons = document.querySelectorAll('.MuiSkeleton-root');
      expect(skeletons.length).toBeGreaterThan(0);

      // Wait for users to load
      await waitFor(() => {
        expect(screen.getByText('All Users')).toBeInTheDocument();
      });

      // Loading skeletons should be gone after loading
      await waitFor(() => {
        expect(screen.getByText(mockUsers[0].name)).toBeInTheDocument();
      });
    });

    it('should display user avatars with initials', async () => {
      render(<UsersPage />);

      // Wait for users to load
      await waitFor(() => {
        expect(screen.getByText(mockUsers[0].name)).toBeInTheDocument();
      }, { timeout: 10000 });

      // Check that user initials are displayed in avatars
      mockUsers.forEach(user => {
        const initials = user.name
          .split(' ')
          .map(n => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);
        
        expect(screen.getByText(initials)).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should display error when users fail to load', async () => {
      // Override the mock to return an error
      const { server } = await import('@/test/mocks/server');
      const { http, HttpResponse } = await import('msw');
      
      server.use(
        http.get('https://jsonplaceholder.typicode.com/users', () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      render(<UsersPage />);

      // Should show error message
      await waitFor(() => {
        expect(screen.getByText(/Error loading users/)).toBeInTheDocument();
      });

      // Should still show the header
      expect(screen.getByText('Users Directory')).toBeInTheDocument();
    });

    it('should handle network timeout gracefully', async () => {
      // Override the mock to simulate timeout/error
      const { server } = await import('@/test/mocks/server');
      const { http, HttpResponse } = await import('msw');
      
      server.use(
        http.get('https://jsonplaceholder.typicode.com/users', async () => {
          // Simulate network error
          return HttpResponse.error();
        })
      );

      render(<UsersPage />);

      // Should show error message
      await waitFor(() => {
        const errorElement = screen.queryByText(/Error loading users/);
        expect(errorElement).toBeInTheDocument();
      }, { timeout: 5000 });
    });
  });

  describe('Responsive Layout', () => {
    it('should render users in a responsive grid', async () => {
      render(<UsersPage />);

      // Wait for users to load
      await waitFor(() => {
        expect(screen.getByText('All Users')).toBeInTheDocument();
        expect(screen.getByText(mockUsers[0].name)).toBeInTheDocument();
      });

      // Check that container has grid structure
      const gridContainer = document.querySelector('[class*="MuiGrid-container"]');
      expect(gridContainer).toBeInTheDocument();
    });

    it('should display all users in non-compact mode', async () => {
      render(<UsersPage />);

      // Wait for users to load
      await waitFor(() => {
        expect(screen.getByText(mockUsers[0].name)).toBeInTheDocument();
      }, { timeout: 10000 });

      // All users should have detailed information visible
      mockUsers.forEach(user => {
        expect(screen.getByText(user.name)).toBeInTheDocument();
        expect(screen.getByText(user.email)).toBeInTheDocument();
        expect(screen.getByText(`ID: ${user.id}`)).toBeInTheDocument();
      });
    });
  });

  describe('Data Integration', () => {
    it('should handle empty users list gracefully', async () => {
      // Override the mock to return empty array
      const { server } = await import('@/test/mocks/server');
      const { http, HttpResponse } = await import('msw');
      
      server.use(
        http.get('https://jsonplaceholder.typicode.com/users', () => {
          return HttpResponse.json([]);
        })
      );

      render(<UsersPage />);

      // Should show empty state message
      await waitFor(() => {
        expect(screen.getByText('No users found')).toBeInTheDocument();
      });

      // Should still show the header
      expect(screen.getByText('Users Directory')).toBeInTheDocument();
    });

    it('should handle malformed user data gracefully', async () => {
      // Override the mock to return partial user data
      const { server } = await import('@/test/mocks/server');
      const { http, HttpResponse } = await import('msw');
      
      const partialUsers = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          // Missing optional fields
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '555-0456',
          // Partial data
        }
      ];
      
      server.use(
        http.get('https://jsonplaceholder.typicode.com/users', () => {
          return HttpResponse.json(partialUsers);
        })
      );

      render(<UsersPage />);

      // Should display what data is available
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        expect(screen.getByText('john@example.com')).toBeInTheDocument();
        expect(screen.getByText('jane@example.com')).toBeInTheDocument();
      });

      // Should handle missing fields gracefully
      expect(screen.getByText('555-0456')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should efficiently render multiple users', async () => {
      // Create a larger dataset for performance testing
      const manyUsers = Array.from({ length: 50 }, (_, index) => ({
        id: index + 1,
        name: `User ${index + 1}`,
        email: `user${index + 1}@example.com`,
        phone: `555-${String(index).padStart(4, '0')}`,
      }));

      const { server } = await import('@/test/mocks/server');
      const { http, HttpResponse } = await import('msw');
      
      server.use(
        http.get('https://jsonplaceholder.typicode.com/users', () => {
          return HttpResponse.json(manyUsers);
        })
      );

      const startTime = performance.now();
      render(<UsersPage />);

      // Wait for all users to load
      await waitFor(() => {
        expect(screen.getByText('User 1')).toBeInTheDocument();
        expect(screen.getByText('User 50')).toBeInTheDocument();
      });

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render reasonably quickly (less than 3 seconds)
      expect(renderTime).toBeLessThan(3000);
    });
  });
});
