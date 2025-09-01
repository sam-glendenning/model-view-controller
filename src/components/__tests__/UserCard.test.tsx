import { screen } from '@testing-library/react';
import { UserCard } from '@/components/UserCard';
import { render } from '@/test/utils';
import { mockUsers } from '@/test/mocks/handlers';

describe('UserCard', () => {
  const mockUser = mockUsers[0];

  describe('Snapshot Tests', () => {
    it('renders populated user card correctly', () => {
      const { container } = render(
        <UserCard user={mockUser} compact={false} />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders compact user card correctly', () => {
      const { container } = render(
        <UserCard user={mockUser} compact={true} />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders user card without optional fields correctly', () => {
      const minimalUser = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
      };
      
      const { container } = render(
        <UserCard user={minimalUser} compact={false} />
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('Loading State', () => {
    it('displays loading skeleton when isLoading is true', () => {
      render(<UserCard isLoading={true} compact={false} />);
      
      const skeletons = document.querySelectorAll('.MuiSkeleton-root');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('displays compact loading skeleton', () => {
      render(<UserCard isLoading={true} compact={true} />);
      
      const skeletons = document.querySelectorAll('.MuiSkeleton-root');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe('Error State', () => {
    it('displays no data message when user is undefined', () => {
      render(<UserCard user={undefined} />);
      
      expect(screen.getByText('No user data available')).toBeInTheDocument();
    });
  });

  describe('Content Display', () => {
    it('displays user name and ID', () => {
      render(<UserCard user={mockUser} />);
      
      expect(screen.getByText(mockUser.name)).toBeInTheDocument();
      expect(screen.getByText(`ID: ${mockUser.id}`)).toBeInTheDocument();
    });

    it('displays user initials in avatar', () => {
      render(<UserCard user={mockUser} />);
      
      const initials = mockUser.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
      
      expect(screen.getByText(initials)).toBeInTheDocument();
    });

    it('displays contact information in non-compact mode', () => {
      render(<UserCard user={mockUser} compact={false} />);
      
      expect(screen.getByText(mockUser.email)).toBeInTheDocument();
      if (mockUser.phone) {
        expect(screen.getByText(mockUser.phone)).toBeInTheDocument();
      }
      if (mockUser.website) {
        expect(screen.getByText(mockUser.website)).toBeInTheDocument();
      }
    });

    it('displays company information when available', () => {
      render(<UserCard user={mockUser} compact={false} />);
      
      if (mockUser.company) {
        expect(screen.getByText('Company')).toBeInTheDocument();
        expect(screen.getByText(mockUser.company.name)).toBeInTheDocument();
        expect(screen.getByText(mockUser.company.catchPhrase)).toBeInTheDocument();
      }
    });

    it('displays address information when available', () => {
      render(<UserCard user={mockUser} compact={false} />);
      
      if (mockUser.address) {
        expect(screen.getByText('Address')).toBeInTheDocument();
        expect(screen.getByText(`${mockUser.address.street}, ${mockUser.address.suite}`)).toBeInTheDocument();
        expect(screen.getByText(`${mockUser.address.city}, ${mockUser.address.zipcode}`)).toBeInTheDocument();
      }
    });

    it('hides detailed information in compact mode', () => {
      render(<UserCard user={mockUser} compact={true} />);
      
      expect(screen.queryByText('Company')).not.toBeInTheDocument();
      expect(screen.queryByText('Address')).not.toBeInTheDocument();
      if (mockUser.phone) {
        expect(screen.queryByText(mockUser.phone)).not.toBeInTheDocument();
      }
    });
  });
});
