import ReactDOM from 'react-dom';
import { App } from './App';
import { worker } from './shared/mocks/browser';

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
    ReactDOM.render(<App />, document.getElementById('root'));
  });
