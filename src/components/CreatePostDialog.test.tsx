import { render } from '@/test/utils';
import { CreatePostDialog } from './CreatePostDialog';

const mockOnClose = jest.fn();
const mockOnSuccess = jest.fn();
const mockOnError = jest.fn();

describe('CreatePostDialog', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders snapshot correctly', () => {
    const { baseElement } = render(
      <CreatePostDialog
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
        onError={mockOnError}
      />,
    );

    expect(baseElement).toMatchSnapshot();
  });
});
