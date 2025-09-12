import { render, screen } from '@/test/utils';
import { UserCard } from './UserCard';
import { mockUsers } from '@/mocks/data';

const mockUser = mockUsers[0];

describe('UserCard', () => {
  it('renders correctly', () => {
    const { container } = render(<UserCard user={mockUser} />);
    expect(container).toMatchSnapshot();
  });

  it('should render in compact mode', () => {
    render(<UserCard user={mockUser} compact={true} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    // In compact mode, some details might be hidden - just check that it renders
    expect(screen.getByText('JD')).toBeInTheDocument(); // Avatar initials should still be there
  });

  it('should render loading state correctly', () => {
    render(<UserCard isLoading={true} />);

    // Should show skeleton loaders
    const skeletons = document.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should display user avatar with correct initial', () => {
    render(<UserCard user={mockUser} />);

    expect(screen.getByText('JD')).toBeInTheDocument(); // Initials for John Doe
  });

  it('should handle missing optional user fields gracefully', () => {
    const userWithMissingFields = {
      ...mockUser,
      phone: '',
      website: '',
    };

    render(<UserCard user={userWithMissingFields} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
    // Should still render without errors even with missing fields
  });

  it('should render error state when no user data and not loading', () => {
    render(<UserCard />);

    expect(screen.getByText('No user data available')).toBeInTheDocument();
  });
});
