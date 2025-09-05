import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Loader2, Key, Mail, Lock, Eye, EyeOff } from "lucide-react";

const toastFallback = {
  success: (message: string) => alert(`Success: ${message}`),
  error: (message: string) => alert(`Error: ${message}`),
  info: (message: string) => alert(`Info: ${message}`),
};

let toast: typeof toastFallback;

try {
  const toastModule = await import('react-toastify');
  toast = toastModule.toast;
  await import('react-toastify/dist/ReactToastify.css');
} catch (error) {
  toast = toastFallback;
  console.warn('react-toastify não está disponível, usando fallback');
}

const KEYCLOAK_CONFIG = {
  url: import.meta.env.VITE_KEYCLOAK_URL || "http://localhost:8080",
  realm: import.meta.env.VITE_KEYCLOAK_REALM || "master",
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || "hypesoft-app",
  redirectUri: import.meta.env.VITE_KEYCLOAK_REDIRECT_URI || `${window.location.origin}/dashboard`
};

type UserRole = 'admin' | 'manager' | 'user';

type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
};

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isKeycloakEnabled, setIsKeycloakEnabled] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isKeycloakLoading, setIsKeycloakLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const formValid = email.trim() !== "" && password.trim() !== "";

  useEffect(() => {
    const { url, realm, clientId } = KEYCLOAK_CONFIG;
    if (url && realm && clientId) {
      setIsKeycloakEnabled(true);
    }

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');
    
    if (error) {
      toast.error("Authentication failed. Please try again.");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    if (code) {
      handleKeycloakCallback(code);
    }
  }, []);

  const handleLogin = async () => {
    if (!formValid) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
        let userData: User;
      
      if (email === "admin@gmail.com") {
        userData = {
          id: "1",
          name: "Admin",
          email: "admin@gmail.com",
          role: "admin",
          avatar: "https://ui-avatars.com/api/?name=Admin"
        };
      } else if (email === "manager@gmail.com") {
        userData = {
          id: "2",
          name: "Manager",
          email: "manager@gmail.com",
          role: "manager",
          avatar: "https://ui-avatars.com/api/?name=Manager"
        };
      } else if (email === "user@gmail.com") {
        userData = {
          id: "3",
          name: "User",
          email: "user@gmail.com",
          role: "user",
          avatar: "https://ui-avatars.com/api/?name=User"
        };
      } else {
        throw new Error("Invalid credentials");
      }

      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('authToken', 'simulated-token');
      
      toast.success(`Welcome back, ${userData.name}!`);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      navigate("/dashboard");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeycloakCallback = async (code: string) => {
    setIsKeycloakLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const tokenResponse = await fetch(`${KEYCLOAK_CONFIG.url}/realms/${KEYCLOAK_CONFIG.realm}/protocol/openid-connect/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: KEYCLOAK_CONFIG.clientId,
          code: code,
          redirect_uri: KEYCLOAK_CONFIG.redirectUri,
          code_verifier: localStorage.getItem('pkce_code_verifier') || ''
        })
      });

      if (tokenResponse.ok) {
        const tokenData = await tokenResponse.json();
        
        const userResponse = await fetch(`${KEYCLOAK_CONFIG.url}/realms/${KEYCLOAK_CONFIG.realm}/protocol/openid-connect/userinfo`, {
          headers: {
            'Authorization': `Bearer ${tokenData.access_token}`
          }
        });

        if (userResponse.ok) {
          const userInfo = await userResponse.json();
          
          let userRole: UserRole = 'user';
          if (userInfo.groups?.includes('admin')) userRole = 'admin';
          else if (userInfo.groups?.includes('manager')) userRole = 'manager';

          const userData: User = {
            id: userInfo.sub,
            name: userInfo.name || userInfo.preferred_username,
            email: userInfo.email,
            role: userRole,
            avatar: userInfo.picture || `https://ui-avatars.com/api/?name=${userInfo.name || userInfo.preferred_username}`
          };

          localStorage.setItem('userData', JSON.stringify(userData));
          localStorage.setItem('authToken', tokenData.access_token);
          
          window.history.replaceState({}, document.title, window.location.pathname);
          
          toast.success(`Welcome back, ${userData.name}!`);
          
          navigate("/dashboard");
        } else {
          throw new Error("Failed to fetch user info");
        }
      } else {
        throw new Error("Failed to exchange code for token");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Authentication failed";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsKeycloakLoading(false);
    }
  };

  const handleKeycloakLogin = async () => {
    setIsKeycloakLoading(true);
    try {
      const generateRandomString = (length: number): string => {
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
        const values = crypto.getRandomValues(new Uint8Array(length));
        return Array.from(values).reduce((acc, x) => acc + possible[x % possible.length], "");
      };

      const base64UrlEncode = (arrayBuffer: ArrayBuffer): string => {
        const bytes = new Uint8Array(arrayBuffer);
        return btoa(String.fromCharCode(...bytes))
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=/g, '');
      };

      const codeVerifier = generateRandomString(128);
      localStorage.setItem('pkce_code_verifier', codeVerifier);

      const encoder = new TextEncoder();
      const data = encoder.encode(codeVerifier);
      const digest = await crypto.subtle.digest('SHA-256', data);
      
      const codeChallenge = base64UrlEncode(digest);

      const authEndpoint = `${KEYCLOAK_CONFIG.url}/realms/${KEYCLOAK_CONFIG.realm}/protocol/openid-connect/auth`;

      const params = new URLSearchParams({
        client_id: KEYCLOAK_CONFIG.clientId,
        response_type: 'code',
        scope: 'openid profile email',
        redirect_uri: KEYCLOAK_CONFIG.redirectUri,
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
      });

      window.location.href = `${authEndpoint}?${params.toString()}`;
    } catch (err) {
      const errorMessage = "Failed to initiate Keycloak authentication";
      setError(errorMessage);
      toast.error(errorMessage);
      setIsKeycloakLoading(false);
    }
  };

  const handleDemoLogin = (role: UserRole) => {
    setError("");
    let demoEmail = "";
    let demoPassword = "password123";
    
    switch(role) {
      case "admin":
        demoEmail = "admin@gmail.com";
        break;
      case "manager":
        demoEmail = "manager@gmail.com";
        break;
      case "user":
        demoEmail = "user@gmail.com";
        break;
    }
    
    setEmail(demoEmail);
    setPassword(demoPassword);
    
    toast.info(`Demo ${role} credentials filled`);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div 
        className="hidden lg:flex w-1/2 items-center justify-center p-12 relative"
        style={{
          backgroundImage: "url('http://i.pinimg.com/736x/6d/c7/d8/6dc7d8f80871f569e077cfddc2c5f5ad.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 to-purple-800/70 rounded-r-3xl"></div>
        
        <div className="relative z-10 text-white text-center max-w-md">
          <div className="mb-10">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/20">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold mb-4">Welcome to Hypesoft</h1>
            <p className="text-lg opacity-90 mb-6">
              Your complete product management solution
            </p>
            
            <div className="space-y-3 text-left bg-white/10 backdrop-blur-sm p-6 rounded-2xl">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>Advanced product analytics</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>Real-time inventory tracking</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>Seamless team collaboration</span>
              </div>
            </div>
          </div>

          {/* Demo credentials section */}
          <div className="mt-8 p-6 bg-white/10 backdrop-blur-sm rounded-2xl">
            <h3 className="text-lg font-semibold mb-4">Demo Credentials</h3>
            <div className="space-y-3">
              <button
                onClick={() => handleDemoLogin("admin")}
                className="w-full py-2 px-4 bg-indigo-600/30 hover:bg-indigo-700/40 rounded-lg text-sm transition-colors border border-indigo-500/30"
              >
                Use Admin Account
              </button>
              <button
                onClick={() => handleDemoLogin("manager")}
                className="w-full py-2 px-4 bg-purple-600/30 hover:bg-purple-700/40 rounded-lg text-sm transition-colors border border-purple-500/30"
              >
                Use Manager Account
              </button>
              <button
                onClick={() => handleDemoLogin("user")}
                className="w-full py-2 px-4 bg-gray-600/30 hover:bg-gray-700/40 rounded-lg text-sm transition-colors border border-gray-500/30"
              >
                Use User Account
              </button>
            </div>
            <p className="text-xs opacity-70 mt-3">Password: password123</p>
          </div>
        </div>
      </div>

      <div className="flex w-full lg:w-1/2 items-center justify-center bg-white rounded-l-3xl lg:rounded-none shadow-lg">
        <div className="w-full max-w-md p-10">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
            <p className="text-sm text-gray-500">
              Please enter your details to access your dashboard
            </p>
          </div>

          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-5">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                label="Email"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 rounded-lg py-3 px-4 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                disabled={isLoading || isKeycloakLoading}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 rounded-lg py-3 px-4 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                disabled={isLoading || isKeycloakLoading}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading || isKeycloakLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  className="rounded text-indigo-600 focus:ring-indigo-500" 
                  disabled={isLoading || isKeycloakLoading}
                />
                <span className="ml-2 text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-indigo-600 hover:text-indigo-500 font-medium">Forgot password?</a>
            </div>
            
            <Button
              variant="primary"
              disabled={!formValid || isLoading || isKeycloakLoading}
              onClick={handleLogin}
              className="w-full mt-2 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Continue to Dashboard"
              )}
            </Button>
          </div>

          {isKeycloakEnabled && (
            <>
              <div className="flex items-center gap-2 my-6">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="text-xs text-gray-400">Or sign in with</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              <div className="flex justify-center mb-6">
                <Button
                  onClick={handleKeycloakLogin}
                  disabled={isLoading || isKeycloakLoading}
                  className="w-full py-3 rounded-lg bg-white border border-gray-300 text-gray-700 font-medium shadow-sm hover:bg-gray-50 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isKeycloakLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Redirecting...
                    </>
                  ) : (
                    <>
                      <Key className="w-5 h-5 mr-2" />
                      Sign in with Keycloak
                    </>
                  )}
                </Button>
              </div>
            </>
          )}

          <p className="text-xs text-gray-500 text-center">
            Don't have an account?{' '}
            <a href="#" className="text-indigo-600 hover:text-indigo-500 font-medium">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;