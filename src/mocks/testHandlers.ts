import { http, HttpResponse } from 'msw';
import type { Post } from '@/types';
import { mockUsers, mockPosts } from './data';

// Test handlers with no delay for faster tests
export const testHandlers = [
  // Users
  http.get('https://jsonplaceholder.typicode.com/users', async () => {
    return HttpResponse.json(mockUsers);
  }),

  http.get(
    'https://jsonplaceholder.typicode.com/users/:id',
    async ({ params }) => {
      const id = parseInt(params.id as string);
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
      const id = parseInt(params.id as string);
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
      const newPost = (await request.json()) as Omit<Post, 'id'>;
      // Generate a unique ID that doesn't conflict with existing posts
      const maxId = Math.max(...mockPosts.map(p => p.id));
      const post: Post = {
        ...newPost,
        id: maxId + 1,
      };

      mockPosts.push(post);
      return HttpResponse.json(post, { status: 201 });
    },
  ),

  http.put(
    'https://jsonplaceholder.typicode.com/posts/:id',
    async ({ params, request }) => {
      const id = parseInt(params.id as string);
      const updatedData = (await request.json()) as Partial<Post>;
      const postIndex = mockPosts.findIndex(p => p.id === id);

      if (postIndex === -1) {
        return new HttpResponse(null, { status: 404 });
      }

      mockPosts[postIndex] = { ...mockPosts[postIndex], ...updatedData };
      return HttpResponse.json(mockPosts[postIndex]);
    },
  ),

  http.delete(
    'https://jsonplaceholder.typicode.com/posts/:id',
    async ({ params }) => {
      const id = parseInt(params.id as string);
      const postIndex = mockPosts.findIndex(p => p.id === id);

      if (postIndex === -1) {
        return new HttpResponse(null, { status: 404 });
      }

      mockPosts.splice(postIndex, 1);
      return new HttpResponse(null, { status: 200 });
    },
  ),
];
