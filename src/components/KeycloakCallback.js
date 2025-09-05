import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const KEYCLOAK_CONFIG = {
  url: "https://seu-keycloak.com/auth",
  realm: "seu-realm",
  clientId: "seu-client-id",
  redirectUri: `${window.location.origin}/dashboard`
};

const KeycloakCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleKeycloakCallback = async () => {
      const params = new URLSearchParams(location.search);
      const code = params.get('code');
      const error = params.get('error');

      if (error) {
        console.error('Erro de autenticação:', error);
        navigate('/login');
        return;
      }

      if (code) {
        try {
          const codeVerifier = localStorage.getItem('pkce_code_verifier');
          
          const response = await fetch(`${KEYCLOAK_CONFIG.url}/realms/${KEYCLOAK_CONFIG.realm}/protocol/openid-connect/token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              client_id: KEYCLOAK_CONFIG.clientId,
              grant_type: 'authorization_code',
              code,
              redirect_uri: KEYCLOAK_CONFIG.redirectUri,
              code_verifier: codeVerifier,
            }),
          });

          if (response.ok) {
            const tokens = await response.json();
            localStorage.setItem('access_token', tokens.access_token);
            localStorage.setItem('refresh_token', tokens.refresh_token);
                        navigate('/dashboard');
          } else {
            throw new Error('Falha na troca de código por token');
          }
        } catch (error) {
          console.error('Erro no callback:', error);
          navigate('/login');
        }
      } else {
        navigate('/login');
      }
    };

    handleKeycloakCallback();
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Processando autenticação...</p>
      </div>
    </div>
  );
};

export default KeycloakCallback;