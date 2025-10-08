import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Eye, EyeOff } from "lucide-react";
import { loginUser } from "@/api"; // <-- Make sure this path is correct
import CryptoJS from 'crypto-js';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Helper function for form data change
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const canSubmit = () => formData.username.trim() && formData.password.trim();

  // Main submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const userName = formData.username.trim();
    const password = formData.password.trim();

    if (!userName && !password) {
      setLoading(false);
      setError('Please enter User Name and Password.');
      return;
    }
    if (!userName) {
      setLoading(false);
      setError('Please enter User Name');
      return;
    }
    if (!password) {
      setLoading(false);
      setError('Please enter Password');
      return;
    }

    // Check for encryptedData in localStoragelocalStorage
    let encryptedData = sessionStorage.getItem('encryptedData') || '';
    if (encryptedData) {
      try {
        const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, 'Excelsoft');
        const decryptedData = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));
        if (decryptedData && decryptedData.username && decryptedData.email) {
          // Check username match
          if (userName !== decryptedData.username) {
            setLoading(false);
            setError('Username does not match');
            return;
          }
          await callIsActiveAPI(decryptedData.username, password, decryptedData.email);
          return;
        }
      } catch (error) {
        setLoading(false);
        console.error('Error decrypting data:', error);
        setError('Invalid or corrupted data.');
        return;
      }
    }

    // Normal login flow
    try {
      const user = await loginUser(userName, password);
      sessionStorage.setItem('userInfo', JSON.stringify(user.data[0]));
      sessionStorage.setItem('email', userName);
      sessionStorage.setItem('password', password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Correct callIsActiveAPI definition
  const callIsActiveAPI = async (userName, password, email) => {
    sessionStorage.removeItem('encryptedData');
    const apiUrl = 'https://ailevate-poc.excelsoftcorp.com/aiapps/AIProductApi/updateActiveRegisteredUser';

    if (!userName || !email) {
      setLoading(false);
      alert('Username or email is missing.');
      return;
    }

    try {
      const payload = {
        username: userName,
        email: email
      };
      const isActiveResponse = await axios.post(apiUrl, payload);
      if (isActiveResponse.data.status === "S001") {
        const loginResponse = await loginUser(userName, password);

        if (loginResponse.status === "S001" && loginResponse.data?.length > 0) {
          const userData = loginResponse.data[0];

          sessionStorage.setItem('isLogin', 'true');
          sessionStorage.setItem('username', userName);
          sessionStorage.setItem('password', password);
          sessionStorage.setItem('userCode', userData.userCode);
          sessionStorage.setItem('orgCode', userData.orgCode);
          sessionStorage.setItem('customerCode', userData.customerCode);
          sessionStorage.setItem('UserNameDetails', userData.username);
          sessionStorage.setItem('Isloggedin', 'true');
          sessionStorage.setItem('userRole', userData.userRole);

          const redirectPath = userData.userRole.trim() === 'SuperAdmin' ? '/admin' : '/dashboard';
          navigate(redirectPath);
          window.history.replaceState({}, '', `${window.location.origin}/dashboard`);
        } else if (loginResponse.data.status === "FU001") {
          setError('User Name is invalid');
        } else if (loginResponse.data.status === "FP001") {
          setError('Password is invalid');
        } else {
          setError('Invalid Credentials');
        }
      } else {
        alert('User is not active or there was an issue.');
      }
    } catch (error) {
      console.error('❌ Error during login:', error);
      alert('An error occurred during login. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auth check
    const checkAuth = () => {
      const isLoggedIn = sessionStorage.getItem('isLogin') === 'true';
      const publicRoutes = ['/login'];
      // currentPath is not used, removed for clarity
      if (!isLoggedIn && !publicRoutes.includes(location.pathname)) {
        if (location.hash.split('/login?data=').length > 1) {
          // Get encryptedData from hash
          const urlWithoutHash = location.hash.split('#')[1] || '';
          const urlParams = new URLSearchParams(urlWithoutHash.split('?')[1] || '');
          const encryptedData = urlParams.get('data') || '';
          sessionStorage.setItem('encryptedData', encryptedData);
          navigate('/login');
        } else {
          navigate('/login');
        }
      }
    };
    checkAuth();
  }, [location, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-spin" style={{ animationDuration: '20s' }} />
        <div className="absolute top-1/3 -right-20 w-64 h-64 bg-gradient-to-r from-purple-400/15 to-pink-400/15 rounded-full blur-3xl animate-spin" style={{ animationDuration: '25s', animationDirection: 'reverse' }} />
        <div className="absolute -bottom-32 left-1/4 w-96 h-96 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 rounded-full blur-3xl animate-spin" style={{ animationDuration: '30s' }} />

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/40 rounded-full animate-pulse" />
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-purple-400/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-cyan-400/40 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - AI Illustration Area */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
          <div className="max-w-md text-center space-y-8">
            {/* AI-Levate Logo */}
            <div className="flex items-center justify-center space-x-3 mb-8">
              <img
                src="/lovable-uploads/b5b0f5a8-9552-4635-8c44-d5e6f994179c.png"
                alt="AI-Levate"
                className="h-12 w-auto"
              />
            </div>

            {/* Abstract AI Visualization */}
            <div className="relative mx-auto w-80 h-80">
              {/* Central Core */}
              <div className="absolute inset-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-r from-primary to-blue-500 rounded-full shadow-2xl animate-pulse" />

              {/* Orbiting Elements */}
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: '20s' }}>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-80" />
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-80" />
              </div>

              <div className="absolute inset-0 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}>
                <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full opacity-80" />
                <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-6 h-6 bg-gradient-to-r from-red-400 to-rose-400 rounded-full opacity-80" />
              </div>

              {/* Neural Network Lines */}
              <div className="absolute inset-0">
                <svg className="w-full h-full opacity-30" viewBox="0 0 320 320">
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2e5c9e" />
                      <stop offset="100%" stopColor="#06B6D4" />
                    </linearGradient>
                  </defs>
                  <path d="M160,60 Q160,160 60,160" stroke="url(#lineGradient)" strokeWidth="2" fill="none" className="animate-pulse" />
                  <path d="M160,60 Q160,160 260,160" stroke="url(#lineGradient)" strokeWidth="2" fill="none" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
                  <path d="M60,160 Q160,160 160,260" stroke="url(#lineGradient)" strokeWidth="2" fill="none" className="animate-pulse" style={{ animationDelay: '1s' }} />
                  <path d="M260,160 Q160,160 160,260" stroke="url(#lineGradient)" strokeWidth="2" fill="none" className="animate-pulse" style={{ animationDelay: '1.5s' }} />
                </svg>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-gray-900 leading-tight">
                Welcome Back to
                <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent"> AI Innovation</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Sign in to continue your AI-powered automation and intelligent workflows.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center mb-8">
              <img
                src="/lovable-uploads/b5b0f5a8-9552-4635-8c44-d5e6f994179c.png"
                alt="AI-Levate"
                className="h-10 w-auto"
              />
            </div>

            <Card className="border-0 shadow-2xl bg-white/70 backdrop-blur-sm">
              <CardContent className="p-8">
                {/* Header */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                  <p className="text-gray-600">Sign in to your AI-powered platform</p>
                </div>

                {/* Login Form */}
                <form className="space-y-6" onSubmit={handleSubmit}>
                  {loading && (
                    <div className="flex justify-center items-center text-blue-600 text-base font-medium py-2">
                      Signing in, please wait...
                    </div>
                  )}
                  <div>
                    <Input
                      placeholder="Username or Email"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className="h-12 border-gray-200 bg-white/80 focus:border-primary focus:ring-primary/20 transition-all duration-200"
                      disabled={loading}
                    />
                  </div>

                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="h-12 border-gray-200 bg-white/80 focus:border-primary focus:ring-primary/20 transition-all duration-200 pr-12"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {error && (
                    <div className="text-sm text-red-600 font-medium text-center">
                      {error}
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      className="text-sm text-primary hover:text-primary/80 transition-colors"
                      disabled={loading}
                    >
                      Forgot password?
                    </button>
                  </div>

                  <Button
                    type="submit"
                    disabled={!canSubmit() || loading}
                    className="w-full h-12 bg-[#2563eb] hover:bg-[#2563eb]/90 text-white font-semibold rounded-lg transform transition-all duration-200 hover:scale-[1.02] disabled:opacity-50"
                  >
                    {loading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <button
                      onClick={() => navigate('/register')}
                      className="text-primary hover:text-primary/80 font-medium transition-colors underline"
                    >
                      Sign up
                    </button>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Footer */}
            <div className="mt-8 text-center space-y-2">
              <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                <Sparkles className="w-3 h-3" />
                <span className="flex items-center gap-1">Powered By:
                  <img
                    src="/lovable-uploads/b5b0f5a8-9552-4635-8c44-d5e6f994179c.png"
                    alt="AI-Levate"
                    className="h-3 w-auto"
                  />
                </span>
              </div>
              <div className="text-xs text-gray-400 space-y-1">
                <p>Copyright © 2025 | Excelsoft Technologies Ltd.</p>
                <div className="flex items-center justify-center space-x-4">
                  <a href="#" className="hover:text-primary transition-colors">Privacy and Cookie Policy</a>
                  <span>•</span>
                  <a href="#" className="hover:text-primary transition-colors">Help</a>
                  <span>•</span>
                  <span>Version: V.1.0.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;