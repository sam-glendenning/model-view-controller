import { http, HttpResponse, delay } from 'msw';
import type { Post } from '@/shared/types';
import { mockUsers, mockPosts } from './data';
import { v4 as uuidv4 } from 'uuid';

// Artificial delay function
const artificialDelay = () => delay(1000);

// Request handlers with artificial delays
export const handlers = [
  // Users
  http.get('https://jsonplaceholder.typicode.com/users', async () => {
    await artificialDelay();
    return HttpResponse.json(mockUsers);
  }),

  http.get(
    'https://jsonplaceholder.typicode.com/users/:id',
    async ({ params }) => {
      await artificialDelay();
      const id = parseInt(params['id'] as string);
      const user = mockUsers.find(u => u.id === id);

      if (!user) {
        return new HttpResponse(null, { status: 404 });
      }

      return HttpResponse.json(user);
    },
  ),

  // Posts
  http.get(
    'https://jsonplaceholder.typicode.com/posts',
    async ({ request }) => {
      await artificialDelay();
      const url = new URL(request.url);
      const userId = url.searchParams.get('userId');

      if (userId) {
        const filteredPosts = mockPosts.filter(
          p => p.userId === parseInt(userId),
        );
        return HttpResponse.json(filteredPosts);
      }

      return HttpResponse.json(mockPosts);
    },
  ),

  http.get(
    'https://jsonplaceholder.typicode.com/posts/:id',
    async ({ params }) => {
      await artificialDelay();
      const id = params['id'] as string;
      const post = mockPosts.find(p => p.id === id);

      if (!post) {
        return new HttpResponse(null, { status: 404 });
      }

      return HttpResponse.json(post);
    },
  ),

  http.post(
    'https://jsonplaceholder.typicode.com/posts',
    async ({ request }) => {
      await artificialDelay();
      const newPost = (await request.json()) as Omit<Post, 'id'>;
      // Generate a unique UUID for the new post
      const post: Post = {
        ...newPost,
        id: uuidv4(),
      };

      mockPosts.push(post);
      return HttpResponse.json(post, { status: 201 });
    },
  ),

  http.put(
    'https://jsonplaceholder.typicode.com/posts/:id',
    async ({ params, request }) => {
      await artificialDelay();
      const id = params['id'] as string;
      const updatedData = (await request.json()) as Partial<Post>;
      const postIndex = mockPosts.findIndex(p => p.id === id);

      if (postIndex === -1) {
        return new HttpResponse(null, { status: 404 });
      }

      const existingPost = mockPosts[postIndex]!;

      const updatedPost: Post = {
        id: existingPost.id,
        userId: updatedData.userId ?? existingPost.userId,
        title: updatedData.title ?? existingPost.title,
        body: updatedData.body ?? existingPost.body,
      };

      mockPosts[postIndex] = updatedPost;
      return HttpResponse.json(updatedPost);
    },
  ),

  http.delete(
    'https://jsonplaceholder.typicode.com/posts/:id',
    async ({ params }) => {
      await artificialDelay();
      const id = params['id'] as string;
      const postIndex = mockPosts.findIndex(p => p.id === id);

      if (postIndex === -1) {
        return new HttpResponse(null, { status: 404 });
      }

      mockPosts.splice(postIndex, 1);
      return new HttpResponse(null, { status: 200 });
    },
  ),
];
