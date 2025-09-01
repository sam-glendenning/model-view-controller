import { screen } from '@testing-library/react';
import { UsersList } from '@/components/UsersList';
import { render } from '@/test/utils';
import { mockUsers } from '@/test/mocks/handlers';

describe('UsersList', () => {
  describe('Snapshot Tests', () => {
    it('renders users list with data correctly', () => {
      const { container } = render(
        <UsersList
          users={mockUsers}
          isLoading={false}
          title="Test Users"
          compact={false}
        />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders compact users list correctly', () => {
      const { container } = render(
        <UsersList
          users={mockUsers}
          isLoading={false}
          title="Compact Users"
          compact={true}
        />
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('Loading State', () => {
    it('displays loading skeletons when isLoading is true', () => {
      render(
        <UsersList
          users={[]}
          isLoading={true}
          title="Loading Users"
        />
      );
      
      expect(screen.getByText('Loading Users')).toBeInTheDocument();
      
      // Should render skeleton cards
      const skeletons = document.querySelectorAll('.MuiSkeleton-root');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('displays compact loading skeletons', () => {
      render(
        <UsersList
          users={[]}
          isLoading={true}
          title="Loading Users"
          compact={true}
        />
      );
      
      const skeletons = document.querySelectorAll('.MuiSkeleton-root');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe('Error State', () => {
    it('displays error message when error is provided', () => {
      const errorMessage = 'Failed to load users';
      render(
        <UsersList
          users={[]}
          isLoading={false}
          error={errorMessage}
          title="Users"
        />
      );
      
      expect(screen.getByText('Users')).toBeInTheDocument();
      expect(screen.getByText(`Error loading users: ${errorMessage}`)).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('displays default empty message when no users', () => {
      render(
        <UsersList
          users={[]}
          isLoading={false}
          title="No Users"
        />
      );
      
      expect(screen.getByText('No Users')).toBeInTheDocument();
      expect(screen.getByText('No users found')).toBeInTheDocument();
    });

    it('displays custom empty message', () => {
      const customMessage = 'No users available in this organization';
      render(
        <UsersList
          users={[]}
          isLoading={false}
          title="Organization Users"
          emptyMessage={customMessage}
        />
      );
      
      expect(screen.getByText(customMessage)).toBeInTheDocument();
    });
  });

  describe('Content Display', () => {
    it('displays all users', () => {
      render(
        <UsersList
          users={mockUsers}
          isLoading={false}
          title="All Users"
        />
      );
      
      mockUsers.forEach(user => {
        expect(screen.getByText(user.name)).toBeInTheDocument();
      });
    });

    it('displays custom title', () => {
      const customTitle = 'Team Members';
      render(
        <UsersList
          users={mockUsers}
          isLoading={false}
          title={customTitle}
        />
      );
      
      expect(screen.getByText(customTitle)).toBeInTheDocument();
    });

    it('renders users in compact mode correctly', () => {
      render(
        <UsersList
          users={mockUsers}
          isLoading={false}
          title="Compact Users"
          compact={true}
        />
      );
      
      // In compact mode, detailed information should not be visible
      expect(screen.queryByText('Company')).not.toBeInTheDocument();
      expect(screen.queryByText('Address')).not.toBeInTheDocument();
    });

    it('renders users in detailed mode correctly', () => {
      render(
        <UsersList
          users={mockUsers}
          isLoading={false}
          title="Detailed Users"
          compact={false}
        />
      );
      
      // Should show detailed information for users that have it
      const userWithCompany = mockUsers.find(user => user.company);
      if (userWithCompany?.company) {
        expect(screen.getAllByText('Company')).toHaveLength(mockUsers.filter(u => u.company).length);
      }
      
      const userWithAddress = mockUsers.find(user => user.address);
      if (userWithAddress?.address) {
        expect(screen.getAllByText('Address')).toHaveLength(mockUsers.filter(u => u.address).length);
      }
    });
  });

  describe('Responsive Layout', () => {
    it('renders users in grid layout', () => {
      render(
        <UsersList
          users={mockUsers}
          isLoading={false}
          title="Grid Users"
        />
      );
      
      // Check that users are rendered in a grid container
      const gridContainer = document.querySelector('[class*="MuiGrid-container"]');
      expect(gridContainer).toBeInTheDocument();
    });

    it('adjusts grid spacing for compact mode', () => {
      render(
        <UsersList
          users={mockUsers}
          isLoading={false}
          title="Compact Grid"
          compact={true}
        />
      );
      
      // In compact mode, grid items should use md=6 instead of md=4
      // This is tested through snapshot comparison
      expect(screen.getByText('Compact Grid')).toBeInTheDocument();
    });
  });
});
