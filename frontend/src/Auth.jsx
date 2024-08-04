import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';

const domain = import.meta.env.VITE_REACT_APP_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_REACT_APP_AUTH0_CLIENT_ID;

export const Auth0ProviderWithNavigate = ({ children }) => {
  const navigate = useNavigate();

  const onRedirectCallback = (appState) => {
    navigate(appState?.returnTo || '/describe');
  };

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{ redirect_uri: window.location.origin }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};

export const AuthPage = () => {
  const { loginWithRedirect } = useAuth0();

  useEffect(() => {
    loginWithRedirect({ appState: { returnTo: "/describe" } });
  }, [loginWithRedirect]);

  return <div>Redirecting to login...</div>;
};

export const CallbackPage = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/describe');
    }
  }, [isAuthenticated, isLoading, navigate]);

  return <div>Loading...</div>;
};
