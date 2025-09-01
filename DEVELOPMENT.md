# Development Tips

## 🔶 Mock API vs Real API

### Mock API (Default - Port 5173)
```bash
yarn dev        # or yarn dev:mock
```
**Features:**
- 500ms artificial delay on all requests
- Rich mock data with realistic content
- Persistent state during session
- Perfect for development without external dependencies
- Orange "Mock API" indicator in the app header

**When to use:**
- ✅ Development and testing
- ✅ Demonstrating loading states
- ✅ Working offline
- ✅ Consistent data for demos

### Real API (Port 5174)
```bash
yarn dev:api
```
**Features:**
- Connects to JSONPlaceholder API
- Real external data
- Network dependent
- No artificial delays

**When to use:**
- ✅ Testing against real API
- ✅ Production-like behavior
- ✅ Validating API integration

## 🧪 Testing the Differences

1. **Loading States**: Mock API shows loading indicators due to 500ms delay
2. **Data Content**: Mock API has tech-focused posts, Real API has Lorem Ipsum
3. **Network Tab**: Mock API shows MSW interception, Real API shows actual HTTP requests
4. **Offline**: Mock API works offline, Real API requires internet

## 🛠️ Development Workflow

1. Start with mock API for feature development
2. Switch to real API for integration testing  
3. Use tests with mock API for consistent results
4. Deploy with real API endpoints

## ⚙️ Customizing Mock Data

Edit `src/mocks/handlers.ts` to:
- Change artificial delay duration
- Add more mock data
- Simulate different error scenarios
- Add new API endpoints

```typescript
// Change delay from 500ms to 1000ms
const artificialDelay = () => delay(1000);

// Add error simulation
http.get('/posts/error', async () => {
  await artificialDelay();
  return new HttpResponse(null, { status: 500 });
});
```
