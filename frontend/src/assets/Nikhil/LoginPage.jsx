import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  LogIn, 
  Eye, 
  EyeOff
} from 'lucide-react';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    let formErrors = {};
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      formErrors.email = "Please enter a valid email address";
    }
    
    // Password validation
    if (formData.password.length < 1) {
      formErrors.password = "Password is required";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoggingIn(true);
      
      // Simulate login process
      setTimeout(() => {
        // Here you would typically make an API call to verify credentials
        console.log("Login attempt with:", formData);
        setIsLoggingIn(false);
        // Redirect user or show success message
      }, 1500);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-2xl">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-green-600 mb-3">
            Veg Farms
          </h2>
          <p className="text-gray-600 text-lg">Welcome Back, Farmer!</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Mail className="absolute left-4 top-4 text-green-600 h-6 w-6" />
            <input 
              type="email" 
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className={`w-full pl-14 pr-5 py-4 text-lg border-2 rounded-xl focus:outline-none ${
                errors.email 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-green-200 focus:border-green-600'
              }`}
              required 
            />
            {errors.email && (
              <p className="text-red-500 text-base mt-2 ml-2">{errors.email}</p>
            )}
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-4 text-green-600 h-6 w-6" />
            <input 
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full pl-14 pr-12 py-4 text-lg border-2 rounded-xl focus:outline-none ${
                errors.password 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-green-200 focus:border-green-600'
              }`}
              required 
            />
            <button 
              type="button" 
              onClick={togglePasswordVisibility}
              className="absolute right-4 top-4 text-gray-500 hover:text-green-600"
            >
              {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
            </button>
            {errors.password && (
              <p className="text-red-500 text-base mt-2 ml-2">{errors.password}</p>
            )}
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="h-5 w-5 text-green-600 border-2 border-green-200 rounded focus:ring-green-500"
              />
              <label htmlFor="remember" className="ml-2 text-gray-700">
                Remember me
              </label>
            </div>
            <a href="#" className="text-green-600 hover:underline font-medium">
              Forgot Password?
            </a>
          </div>

          <button 
            type="submit" 
            className="w-full bg-green-600 text-white py-4 rounded-xl hover:bg-green-700 transition duration-300 flex items-center justify-center text-lg font-medium mt-8 shadow-md"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-6 w-6" />
                Login
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-8">
          <p className="text-gray-600 text-lg">
            Don't have an account? 
            <a href="#" className="text-green-600 ml-2 hover:underline font-medium">
              Register
            </a>
          </p>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-center text-gray-500 mb-4">Or continue with</p>
          <div className="flex justify-center space-x-4">
            <button className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-gray-200 hover:border-green-300 transition-all">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="#4285F4" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.8055 10.0415H21V10H12V14H17.6515C16.827 16.3285 14.6115 18 12 18C8.6865 18 6 15.3135 6 12C6 8.6865 8.6865 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C6.4775 2 2 6.4775 2 12C2 17.5225 6.4775 22 12 22C17.5225 22 22 17.5225 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z" />
                <path d="M3.15302 7.3455L6.43851 9.755C7.32751 7.554 9.48052 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C8.15902 2 4.82802 4.1685 3.15302 7.3455Z" fill="#EA4335" />
                <path d="M12 22C14.583 22 16.93 21.0115 18.7045 19.404L15.6095 16.785C14.6055 17.5455 13.3575 18 12 18C9.39897 18 7.19047 16.3415 6.35847 14.027L3.09747 16.5395C4.75247 19.778 8.11347 22 12 22Z" fill="#34A853" />
                <path d="M21.8055 10.0415H21V10H12V14H17.6515C17.2571 15.1082 16.5467 16.0766 15.608 16.7855L15.6095 16.785L18.7045 19.4035C18.4855 19.6025 22 17 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z" fill="#FBBC05" />
              </svg>
            </button>
            <button className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-gray-200 hover:border-green-300 transition-all">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.04001C6.5 2.04001 2 6.53001 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85001C10.44 7.34001 11.93 5.96001 14.22 5.96001C15.31 5.96001 16.45 6.15001 16.45 6.15001V8.62001H15.19C13.95 8.62001 13.56 9.39001 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C15.9164 21.5879 18.0622 20.3855 19.6099 18.5701C21.1576 16.7546 22.0054 14.4457 22 12.06C22 6.53001 17.5 2.04001 12 2.04001Z" />
              </svg>
            </button>
            <button className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-gray-200 hover:border-green-300 transition-all">
              <svg className="h-7 w-7" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.09 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;