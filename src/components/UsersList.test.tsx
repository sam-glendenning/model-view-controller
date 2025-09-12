import { render, screen } from '@/test/utils';
import { UsersList } from './UsersList';
import { mockUsers } from '@/mocks/data';

describe('UsersList', () => {
  it('renders correctly', () => {
    const { container } = render(
      <UsersList users={mockUsers} title="Test Users" />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render loading state correctly', () => {
    render(<UsersList isLoading={true} title="Loading Users" />);

    expect(screen.getByText('Loading Users')).toBeInTheDocument();
    // Should show skeleton loaders for multiple users
    const skeletons = document.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should render error state correctly', () => {
    const errorMessage = 'Failed to load users';
    render(<UsersList error={errorMessage} title="Users with Error" />);

    expect(screen.getByText('Users with Error')).toBeInTheDocument();
    expect(
      screen.getByText('Error loading users: Failed to load users'),
    ).toBeInTheDocument();
  });

  it('should render empty state when no users provided', () => {
    render(<UsersList users={[]} title="No Users" />);

    expect(screen.getByText('No Users')).toBeInTheDocument();
    expect(screen.getByText('No users found')).toBeInTheDocument();
  });

  it('should render in compact mode', () => {
    render(
      <UsersList users={mockUsers} title="Compact Users" compact={true} />,
    );

    expect(screen.getByText('Compact Users')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('should render correct number of user cards', () => {
    render(<UsersList users={mockUsers} title="Test Users" />);

    // Should render one card for each user
    const userCards = screen.getAllByText(/Doe Enterprises|Smith & Co/);
    expect(userCards).toHaveLength(2);
  });

  it('should handle large number of users', () => {
    const manyUsers = Array.from({ length: 10 }, (_, i) => ({
      ...mockUsers[0],
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
    }));

    render(<UsersList users={manyUsers} title="Many Users" />);

    expect(screen.getByText('Many Users')).toBeInTheDocument();
    expect(screen.getByText('User 1')).toBeInTheDocument();
    expect(screen.getByText('User 10')).toBeInTheDocument();
  });
});
