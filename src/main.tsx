import ReactDOM from 'react-dom';
import { App } from './App';

// Always enable MSW for mock API
import('./mocks/browser').then(({ worker }) => {
  worker.start({
    onUnhandledRequest: 'warn',
  }).then(() => {
    console.log('🔶 MSW: Mock API is running with 1000ms artificial delays');
    ReactDOM.render(<App />, document.getElementById('root'));
  });
});
