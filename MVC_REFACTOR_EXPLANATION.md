# MVC Architecture Refactor: Separating View from Controller

## 🎯 Problem: Original Component Was Doing Too Much

The original `PostsPage` component was violating the **Single Responsibility Principle** by handling both **View** and **Controller** concerns:

### ❌ Before (Mixed Responsibilities)

```tsx
export const PostsPage: React.FC = () => {
  // ❌ CONTROLLER LOGIC (should be extracted)
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState<PostFormData>({...});
  
  const { data: posts, isLoading, error } = usePosts();
  const createPostMutation = useCreatePost();
  
  const handleSubmit = async () => {
    // Complex business logic...
    try {
      if (editingPost) {
        const updateData: UpdatePostForm = {...};
        await updatePostMutation.mutateAsync(updateData);
        setSnackbar({ open: true, message: 'Post updated!' });
      } else {
        const createData: CreatePostForm = {...};
        await createPostMutation.mutateAsync(createData);
        setSnackbar({ open: true, message: 'Post created!' });
      }
      handleCloseDialog();
    } catch {
      setSnackbar({ open: true, message: 'Failed!', severity: 'error' });
    }
  };

  // ✅ VIEW LOGIC (this belongs here)
  return (
    <Container>
      <TextField value={formData.title} onChange={...} />
      <Button onClick={handleSubmit}>Submit</Button>
    </Container>
  );
};
```

## ✅ After: Clean Separation of Concerns

### 🎮 Controller Layer (`usePostsController.ts`)

```tsx
export const usePostsController = (): PostsController => {
  // Data management
  const { data: posts, isLoading, error } = usePosts();
  const createPostMutation = useCreatePost();
  
  // State management
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<PostFormData>({...});
  
  // Business logic
  const submitForm = useCallback(async () => {
    try {
      if (editingPost) {
        await updatePostMutation.mutateAsync(updateData);
        setSnackbar({ open: true, message: 'Post updated!' });
      } else {
        await createPostMutation.mutateAsync(createData);
        setSnackbar({ open: true, message: 'Post created!' });
      }
      closeDialog();
    } catch {
      setSnackbar({ open: true, message: 'Failed!', severity: 'error' });
    }
  }, [...]);
  
  // Form helpers
  const updateFormField = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);
  
  return { posts, formData, submitForm, updateFormField, ... };
};
```

### 🖼️ View Layer (`PostsPage.tsx`)

```tsx
export const PostsPage: React.FC = () => {
  const controller = usePostsController();
  
  // Pure UI - no business logic!
  return (
    <Container>
      <PostsList posts={controller.posts} onEditPost={controller.openEditDialog} />
      <TextField 
        value={controller.formData.title} 
        onChange={(e) => controller.updateFormField('title', e.target.value)} 
      />
      <Button onClick={controller.submitForm}>
        {controller.editingPost ? 'Update' : 'Create'}
      </Button>
    </Container>
  );
};
```

## 🏗️ Architecture Benefits

### ✅ **Single Responsibility Principle**
- **View**: Only renders UI elements and handles user interactions
- **Controller**: Manages state, business logic, and data flow
- **Model**: Data fetching and caching (existing hooks layer)

### ✅ **Testability**
```tsx
// Easy to test controller logic in isolation
describe('usePostsController', () => {
  it('should update form field correctly', () => {
    const { result } = renderHook(() => usePostsController());
    act(() => {
      result.current.updateFormField('title', 'New Title');
    });
    expect(result.current.formData.title).toBe('New Title');
  });
});

// Easy to test view with mocked controller
describe('PostsPage', () => {
  it('should render form fields correctly', () => {
    const mockController = { formData: { title: 'Test' }, ... };
    jest.mock('@/controllers/usePostsController', () => ({
      usePostsController: () => mockController
    }));
    
    render(<PostsPage />);
    expect(screen.getByDisplayValue('Test')).toBeInTheDocument();
  });
});
```

### ✅ **Reusability**
```tsx
// Controller can be reused in different views
export const PostsModal: React.FC = () => {
  const controller = usePostsController(); // Same logic!
  return <Modal>...</Modal>;
};

export const PostsMobile: React.FC = () => {
  const controller = usePostsController(); // Same logic!
  return <MobileView>...</MobileView>;
};
```

### ✅ **Maintainability**
- Business logic changes only require controller updates
- UI changes only require view updates
- Clear interface between layers via TypeScript types

## 📊 Comparison Summary

| Aspect | Before (Mixed) | After (Separated) |
|--------|----------------|-------------------|
| **Lines in Component** | 218 lines | 95 lines |
| **Responsibilities** | View + Controller | View only |
| **Business Logic** | Embedded in JSX | Extracted to controller |
| **Testability** | Complex (UI + logic) | Simple (separate concerns) |
| **Reusability** | Component-specific | Controller reusable |
| **Type Safety** | Implicit | Explicit interface |

## 🎯 MVC Pattern Achieved

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│     MODEL       │    │   CONTROLLER     │    │      VIEW       │
│                 │    │                  │    │                 │
│ • usePosts()    │────│ • usePostsCtrl() │────│ • PostsPage     │
│ • useCreatePost │    │ • Form state     │    │ • Material-UI   │
│ • useUpdatePost │    │ • Business logic │    │ • Event handlers│
│ • useDeletePost │    │ • Error handling │    │ • Presentation  │
│                 │    │ • Validation     │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Model (Data Layer)
- `usePosts()`, `useCreatePost()` etc. - TanStack Query hooks
- `apiService` - HTTP client and API calls

### Controller (Business Logic)
- `usePostsController()` - State management and business logic
- Form validation, error handling, data transformation

### View (Presentation Layer)  
- `PostsPage` - Pure UI component with no business logic
- Material-UI components, event handling, layout

## 🚀 Result: Better Architecture

The refactored code now properly follows MVC principles:
- **Separation of Concerns**: Each layer has a single responsibility
- **Loose Coupling**: Layers communicate via well-defined interfaces
- **High Cohesion**: Related functionality is grouped together
- **Easier Testing**: Each layer can be tested independently
- **Better Maintainability**: Changes are localized to appropriate layers

This is how a **"dumb" UI component** should look - it only handles presentation and delegates all business logic to the controller layer!
