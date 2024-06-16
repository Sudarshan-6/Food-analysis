import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Auth0Provider } from '@auth0/auth0-react';
import { ChakraProvider } from '@chakra-ui/react';
import { LoadingProvider } from './components/utils/loading/LoadingContext';

localStorage.clear();
const root = ReactDOM.createRoot(document.getElementById('root'));
console.log(process.env.REACT_APP_AUTH_DOMAIN);
root.render(
  <>
    <Auth0Provider
      domain= {process.env.REACT_APP_AUTH_DOMAIN}
      clientId={process.env.REACT_APP_AUTH_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        prompt: 'login'
      }}
    >
      <ChakraProvider>
        <LoadingProvider>
        <App />
        </LoadingProvider>
      </ChakraProvider>
    </Auth0Provider>
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
