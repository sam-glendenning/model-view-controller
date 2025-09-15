import { render } from '@testing-library/react';
import { CreatePostDialog } from './CreatePostDialog';
import type { Post } from '@/types';
import { mockPosts } from '@/mocks/data';

describe('CreatePostDialog', () => {
  let mockPost: Post;

  beforeEach(() => {
    jest.clearAllMocks();

    mockPost = { ...mockPosts[0] };
  });

  it('renders correctly', () => {
    const { baseElement } = render(
      <CreatePostDialog
        open={true}
        postData={mockPost}
        onTitleChange={jest.fn()}
        onBodyChange={jest.fn()}
        onUserIdChange={jest.fn()}
        onSubmit={jest.fn()}
        onClose={jest.fn()}
        isCreating={false}
      />,
    );

    expect(baseElement).toMatchSnapshot();
  });
});
