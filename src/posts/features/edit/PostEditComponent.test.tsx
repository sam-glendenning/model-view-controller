import { render } from '@testing-library/react';
import {
  PostEditComponent,
  type PostEditComponentProps,
} from './PostEditComponent';
import { mockPosts } from '@/shared/mocks/data';
import type { Post } from '@/posts/types';

describe('PostEditComponent', () => {
  let mockPost: Post;

  beforeEach(() => {
    mockPost = mockPosts[0]!;
  });

  it('renders correctly', () => {
    const props: PostEditComponentProps = {
      postData: mockPost,
      onTitleChange: vi.fn(),
      onBodyChange: vi.fn(),
      onUserIdChange: vi.fn(),
      onSave: vi.fn(),
      onCancel: vi.fn(),
      onDelete: vi.fn(),
      isSaveButtonDisabled: false,
      isUpdating: false,
      isDeleting: false,
    };

    const { asFragment } = render(<PostEditComponent {...props} />);

    expect(asFragment()).toMatchSnapshot();
  });
});
