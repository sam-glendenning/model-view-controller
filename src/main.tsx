import ReactDOM from 'react-dom';
import { App } from './App';
import { worker } from './mocks/browser';

// Start MSW worker before rendering the app
worker.start({
  onUnhandledRequest: 'warn',
}).then(() => {
  console.log('🔶 MSW: Mock API is running with 1000ms artificial delays');
}).catch((error) => {
  console.error('Failed to start MSW worker:', error);
}).finally(() => {
  ReactDOM.render(<App />, document.getElementById('root'));
});
