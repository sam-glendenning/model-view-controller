import { render } from '@testing-library/react';
import {
  PostViewComponent,
  type PostViewComponentProps,
} from './PostViewComponent';
import type { Post } from '@/features/posts/types';
import { mockPosts } from '@/mocks/data';

describe('PostViewComponent', () => {
  let mockPost: Post;

  beforeEach(() => {
    mockPost = mockPosts[0]!;
  });

  it('renders correctly', () => {
    const props: PostViewComponentProps = {
      postData: mockPost,
      onEditClick: jest.fn(),
      onDeleteClick: jest.fn(),
      isDeleting: false,
    };
    const { asFragment } = render(<PostViewComponent {...props} />);

    expect(asFragment()).toMatchSnapshot();
  });
});
