import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PostCard } from '@/components/PostCard';
import { render } from '@/test/utils';
import { mockPosts } from '@/test/mocks/handlers';

describe('PostCard', () => {
  const mockPost = mockPosts[0];
  const mockHandlers = {
    onView: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Snapshot Tests', () => {
    it('renders populated post card correctly', () => {
      const { container } = render(
        <PostCard
          post={mockPost}
          onView={mockHandlers.onView}
          onEdit={mockHandlers.onEdit}
          onDelete={mockHandlers.onDelete}
          showActions={true}
        />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders post card without actions correctly', () => {
      const { container } = render(
        <PostCard
          post={mockPost}
          showActions={false}
        />
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('Loading State', () => {
    it('displays loading skeleton when isLoading is true', () => {
      render(<PostCard isLoading={true} showActions={true} />);
      
      // Check for skeleton elements by class
      const skeletons = document.querySelectorAll('.MuiSkeleton-root');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('displays loading skeleton without actions', () => {
      render(<PostCard isLoading={true} showActions={false} />);
      
      const skeletons = document.querySelectorAll('.MuiSkeleton-root');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe('Error State', () => {
    it('displays no data message when post is undefined', () => {
      render(<PostCard post={undefined} />);
      
      expect(screen.getByText('No post data available')).toBeInTheDocument();
    });
  });

  describe('Content Display', () => {
    it('displays post title and body', () => {
      render(<PostCard post={mockPost} />);
      
      expect(screen.getByText(mockPost.title)).toBeInTheDocument();
      expect(screen.getByText(mockPost.body)).toBeInTheDocument();
    });

    it('displays post metadata', () => {
      render(<PostCard post={mockPost} />);
      
      expect(screen.getByText(`Post ID: ${mockPost.id} | User ID: ${mockPost.userId}`)).toBeInTheDocument();
    });
  });

  describe('Action Handlers', () => {
    it('calls onView when view button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <PostCard
          post={mockPost}
          onView={mockHandlers.onView}
          showActions={true}
        />
      );
      
      const viewButton = screen.getByLabelText('view post');
      await user.click(viewButton);
      
      expect(mockHandlers.onView).toHaveBeenCalledWith(mockPost);
    });

    it('calls onEdit when edit button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <PostCard
          post={mockPost}
          onEdit={mockHandlers.onEdit}
          showActions={true}
        />
      );
      
      const editButton = screen.getByLabelText('edit post');
      await user.click(editButton);
      
      expect(mockHandlers.onEdit).toHaveBeenCalledWith(mockPost);
    });

    it('calls onDelete when delete button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <PostCard
          post={mockPost}
          onDelete={mockHandlers.onDelete}
          showActions={true}
        />
      );
      
      const deleteButton = screen.getByLabelText('delete post');
      await user.click(deleteButton);
      
      expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockPost);
    });

    it('does not render action buttons when showActions is false', () => {
      render(
        <PostCard
          post={mockPost}
          onView={mockHandlers.onView}
          onEdit={mockHandlers.onEdit}
          onDelete={mockHandlers.onDelete}
          showActions={false}
        />
      );
      
      expect(screen.queryByLabelText('view post')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('edit post')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('delete post')).not.toBeInTheDocument();
    });

    it('does not render action buttons when handlers are not provided', () => {
      render(<PostCard post={mockPost} showActions={true} />);
      
      expect(screen.queryByLabelText('view post')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('edit post')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('delete post')).not.toBeInTheDocument();
    });
  });
});
