import { Provider } from 'react-redux';
import { AppProps } from 'next/app';
import { makeStore } from '../store/store';

const store = makeStore(); 

function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default App;
