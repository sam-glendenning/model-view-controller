import { render } from '@testing-library/react';
import { DeletePostDialog } from './DeletePostDialog';
import { mockPosts } from '@/shared/mocks/data';
import type { Post } from '@/posts/types';

describe('DeletePostDialog', () => {
  const mockConfirmPostDelete = vi.fn();
  const mockCancelPostDelete = vi.fn();
  let mockPost: Post;

  beforeEach(() => {
    vi.clearAllMocks();
    mockPost = mockPosts[0]!;
  });

  it('renders correctly', () => {
    const { baseElement } = render(
      <DeletePostDialog
        open={true}
        postData={mockPost}
        isDeleting={false}
        confirmPostDelete={mockConfirmPostDelete}
        cancelPostDelete={mockCancelPostDelete}
      />
    );

    expect(baseElement).toMatchSnapshot();
  });
});
