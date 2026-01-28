import { RouterProvider } from 'react-router';
import { router } from './routes';
import { MusicProvider } from './context/MusicContext';

function App() {
  return (
    <MusicProvider>
      <RouterProvider router={router} />
    </MusicProvider>
  );
}

export default App;
