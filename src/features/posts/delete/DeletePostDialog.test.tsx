import { render } from '@testing-library/react';
import { DeletePostDialog } from './DeletePostDialog';
import { mockPosts } from '@/mocks/data';
import type { Post } from '@/features/posts/types';

describe('DeletePostDialog', () => {
  const mockConfirmPostDelete = jest.fn();
  const mockCancelPostDelete = jest.fn();
  let mockPost: Post;

  beforeEach(() => {
    jest.clearAllMocks();
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
