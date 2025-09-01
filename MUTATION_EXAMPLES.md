# Mutation Examples: With vs Without Query Client

## ❌ Without Query Client (Basic Mutation)

```typescript
export const useCreatePostBasic = () => {
  return useMutation<Post, Error, CreatePostForm>({
    mutationFn: (postData: CreatePostForm) => apiService.createPost(postData),
    // No cache management - users see stale data!
  });
};
```

**Problems:**
- After creating a post, the posts list still shows old data
- User needs to manually refresh or wait for automatic refetch
- Poor user experience with stale UI

## ✅ With Query Client (Cache Management)

```typescript
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation<Post, Error, CreatePostForm>({
    mutationFn: (postData: CreatePostForm) => apiService.createPost(postData),
    onSuccess: (newPost) => {
      // 1. Invalidate queries to trigger refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.posts });
      
      // 2. Optimistic update - immediately show new post
      queryClient.setQueryData<Post[]>(queryKeys.posts, (oldPosts) => {
        return oldPosts ? [newPost, ...oldPosts] : [newPost];
      });
    },
  });
};
```

**Benefits:**
- ✅ Immediate UI update (optimistic)
- ✅ Cache stays synchronized
- ✅ Great user experience

## Real-World Example

### Scenario: User creates a new post

#### Without Query Client:
1. User clicks "Create Post" ✅
2. Post is created on server ✅  
3. UI still shows old posts list ❌
4. User wonders if it worked ❌
5. Eventually, cache expires and refetches ⏰

#### With Query Client:
1. User clicks "Create Post" ✅
2. Post is created on server ✅
3. `onSuccess` immediately adds post to UI ✅
4. User sees instant feedback ✅
5. Cache is perfectly synchronized ✅

## Query Client Methods Explained

### `invalidateQueries()`
```typescript
// Marks queries as stale and triggers refetch
queryClient.invalidateQueries({ queryKey: queryKeys.posts });
```
**Use when:** You want fresh data from server

### `setQueryData()`
```typescript
// Directly updates cached data
queryClient.setQueryData<Post[]>(queryKeys.posts, (oldPosts) => {
  return oldPosts ? [newPost, ...oldPosts] : [newPost];
});
```
**Use when:** You know exactly what the new data should be

### `removeQueries()`
```typescript
// Removes data from cache entirely
queryClient.removeQueries({ queryKey: queryKeys.post(deletedId) });
```
**Use when:** Data no longer exists (after deletion)

## Multiple Cache Updates

Notice in the current code, we update multiple related caches:

```typescript
onSuccess: (newPost) => {
  // Update main posts list
  queryClient.invalidateQueries({ queryKey: queryKeys.posts });
  
  // Update user-specific posts list
  queryClient.invalidateQueries({ queryKey: queryKeys.userPosts(newPost.userId) });
  
  // Optimistic update for immediate feedback
  queryClient.setQueryData<Post[]>(queryKeys.posts, (oldPosts) => {
    return oldPosts ? [newPost, ...oldPosts] : [newPost];
  });
}
```

This ensures ALL related views stay synchronized!

## Alternative: Mutation Without Cache Management

If you removed the query client usage:

```typescript
export const useCreatePostSimple = () => {
  return useMutation<Post, Error, CreatePostForm>({
    mutationFn: (postData: CreatePostForm) => apiService.createPost(postData),
    // Component would need to manually refetch or invalidate
  });
};

// Component usage would be:
const createPost = useCreatePostSimple();
const { refetch } = usePosts();

const handleCreate = async (data) => {
  await createPost.mutateAsync(data);
  refetch(); // Manual refetch required!
};
```

This puts the burden on every component to remember to refetch data after mutations.

## Conclusion

Using `useQueryClient` with mutations is a **best practice** because it:

1. **Provides better UX** - immediate feedback
2. **Keeps data consistent** - no stale cache issues  
3. **Reduces boilerplate** - cache management is centralized
4. **Improves performance** - smart cache updates vs full refetches

The pattern you see in the hooks is the recommended approach for production React Query applications!
