import { createRoot } from 'react-dom/client';
import { App } from './App';
import { worker } from './shared/mocks/browser';

const domNode = document.getElementById('root');
// @ts-expect-error invalid type
const root = createRoot(domNode);

// Start MSW worker before rendering the app
worker
  .start({
    onUnhandledRequest: 'warn',
  })
  .then(() => {
    console.warn('🔶 MSW: Mock API is running with 1000ms artificial delays');
  })
  .catch((error: unknown) => {
    console.error('Failed to start MSW worker:', error);
  })
  .finally(() => {
    root.render(<App />);
  });
