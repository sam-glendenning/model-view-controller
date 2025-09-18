import { render } from '@testing-library/react';
import { CreatePostDialog } from './CreatePostDialog';
import type { Post } from '@/posts/types';
import { mockPosts } from '@/shared/mocks/data';

describe('CreatePostDialog', () => {
  let mockPost: Omit<Post, 'id'>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockPost = {
      title: mockPosts[0]!.title,
      body: mockPosts[0]!.body,
      userId: mockPosts[0]!.userId,
    };
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
      />
    );

    expect(baseElement).toMatchSnapshot();
  });
});
