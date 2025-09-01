import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PostsList } from '@/components/PostsList';
import { render } from '@/test/utils';
import { mockPosts } from '@/test/mocks/handlers';

describe('PostsList', () => {
  const mockHandlers = {
    onViewPost: jest.fn(),
    onEditPost: jest.fn(),
    onDeletePost: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Snapshot Tests', () => {
    it('renders posts list with data correctly', () => {
      const { container } = render(
        <PostsList
          posts={mockPosts}
          isLoading={false}
          title="Test Posts"
          onViewPost={mockHandlers.onViewPost}
          onEditPost={mockHandlers.onEditPost}
          onDeletePost={mockHandlers.onDeletePost}
          showActions={true}
        />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders posts list without actions correctly', () => {
      const { container } = render(
        <PostsList
          posts={mockPosts}
          isLoading={false}
          title="Test Posts"
          showActions={false}
        />
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('Loading State', () => {
    it('displays loading skeletons when isLoading is true', () => {
      render(
        <PostsList
          posts={[]}
          isLoading={true}
          title="Loading Posts"
        />
      );
      
      expect(screen.getByText('Loading Posts')).toBeInTheDocument();
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
      
      // Should render skeleton cards
      const skeletons = document.querySelectorAll('.MuiSkeleton-root');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe('Error State', () => {
    it('displays error message when error is provided', () => {
      const errorMessage = 'Failed to load posts';
      render(
        <PostsList
          posts={[]}
          isLoading={false}
          error={errorMessage}
          title="Posts"
        />
      );
      
      expect(screen.getByText('Posts')).toBeInTheDocument();
      expect(screen.getByText(`Error loading posts: ${errorMessage}`)).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('displays default empty message when no posts', () => {
      render(
        <PostsList
          posts={[]}
          isLoading={false}
          title="No Posts"
        />
      );
      
      expect(screen.getByText('No Posts')).toBeInTheDocument();
      expect(screen.getByText('No posts found')).toBeInTheDocument();
    });

    it('displays custom empty message', () => {
      const customMessage = 'No posts available for this user';
      render(
        <PostsList
          posts={[]}
          isLoading={false}
          title="User Posts"
          emptyMessage={customMessage}
        />
      );
      
      expect(screen.getByText(customMessage)).toBeInTheDocument();
    });
  });

  describe('Content Display', () => {
    it('displays all posts', () => {
      render(
        <PostsList
          posts={mockPosts}
          isLoading={false}
          title="All Posts"
        />
      );
      
      mockPosts.forEach(post => {
        expect(screen.getByText(post.title)).toBeInTheDocument();
      });
    });

    it('displays custom title', () => {
      const customTitle = 'My Custom Posts';
      render(
        <PostsList
          posts={mockPosts}
          isLoading={false}
          title={customTitle}
        />
      );
      
      expect(screen.getByText(customTitle)).toBeInTheDocument();
    });
  });

  describe('Action Handling', () => {
    it('passes handlers to post cards when showActions is true', async () => {
      const user = userEvent.setup();
      render(
        <PostsList
          posts={[mockPosts[0]]}
          isLoading={false}
          onViewPost={mockHandlers.onViewPost}
          onEditPost={mockHandlers.onEditPost}
          onDeletePost={mockHandlers.onDeletePost}
          showActions={true}
        />
      );
      
      // Click view button on first post
      const viewButton = screen.getByLabelText('view post');
      await user.click(viewButton);
      
      expect(mockHandlers.onViewPost).toHaveBeenCalledWith(mockPosts[0]);
    });

    it('does not show action buttons when showActions is false', () => {
      render(
        <PostsList
          posts={[mockPosts[0]]}
          isLoading={false}
          showActions={false}
        />
      );
      
      expect(screen.queryByLabelText('view post')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('edit post')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('delete post')).not.toBeInTheDocument();
    });
  });

  describe('Responsive Layout', () => {
    it('renders posts in grid layout', () => {
      render(
        <PostsList
          posts={mockPosts}
          isLoading={false}
          title="Grid Posts"
        />
      );
      
      // Check that posts are rendered in a grid container
      const gridContainer = document.querySelector('[class*="MuiGrid-container"]');
      expect(gridContainer).toBeInTheDocument();
    });
  });
});
