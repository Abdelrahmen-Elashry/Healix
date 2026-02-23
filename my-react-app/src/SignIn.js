import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showNotification } from './NotificationContainer';
import './SignIn.css';

function SignIn() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error for this field when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🔐 Sign in attempt with:', { email: formData.email });
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      console.log('❌ Validation failed:', newErrors);
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({}); // Clear previous errors
    console.log('✅ Validation passed, sending to API...');
    
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    try {
      const response = await fetch('http://34.107.46.116/api/patient/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
        signal: controller.signal
      });

      clearTimeout(timeoutId); // Clear timeout if request completes
      console.log('📥 Login response status:', response.status);
      
      const data = await response.json();
      console.log('📥 Login response data:', data);

      if (response.ok) {
        // Login successful
        console.log('✅ Login successful!');
        
        // Store token
        if (data.token) {
          localStorage.setItem('token', data.token);
          console.log('🔑 Token stored');
        }
        
        // Store user data
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
          console.log('👤 User data stored:', data.user);
        }
        
        // Check if profile is completed using API
        const token = data.token || localStorage.getItem('token');
        console.log('🔍 Checking profile completion...');
        
        try {
          const profileResponse = await fetch('http://34.107.46.116/api/profile/check', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            },
            signal: controller.signal
          });
          
          console.log('📥 Profile check status:', profileResponse.status);
          
          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            console.log('📥 Profile data:', profileData);
            
            setLoading(false); // Reset loading before navigation
            
            // Check multiple possible response formats from Laravel
            const hasProfile = profileData.exists === true || 
                              profileData.has_profile === true || 
                              profileData.profile_exists === true ||
                              profileData.completed === true ||
                              (profileData.data && profileData.data.exists === true);
            
            if (hasProfile) {
              console.log('✅ Profile completed, redirecting to dashboard');
              localStorage.setItem('profile_completed', 'true');
              navigate('/dashboard');
            } else {
              console.log('⚠️ Profile not completed, redirecting to profile completion');
              localStorage.removeItem('profile_completed');
              showNotification('Please complete your medical profile to continue', 'warning');
              navigate('/profile-completion');
            }
          } else {
            // If profile check endpoint returns error (404, 401, etc.)
            console.log('⚠️ Profile check endpoint returned error, assuming no profile');
            setLoading(false);
            localStorage.removeItem('profile_completed');
            showNotification('Please complete your medical profile to continue', 'warning');
            navigate('/profile-completion');
          }
        } catch (profileError) {
          console.error('❌ Profile check error:', profileError);
          setLoading(false);
          // If profile check fails completely, go to profile completion to be safe
          localStorage.removeItem('profile_completed');
          showNotification('Please complete your medical profile to continue', 'warning');
          navigate('/profile-completion');
        }
      } else {
        // Handle login errors
        console.error('❌ Login error:', data);
        setLoading(false);
        
        if (data.message) {
          setErrors({ general: data.message });
          showNotification(data.message, 'error');
        } else if (data.errors) {
          const formattedErrors = {};
          Object.keys(data.errors).forEach(key => {
            formattedErrors[key] = data.errors[key][0];
          });
          setErrors(formattedErrors);
          showNotification('Please correct the errors in the form', 'error');
        } else {
          showNotification('An error occurred during login', 'error');
        }
      }
    } catch (error) {
      clearTimeout(timeoutId); // Clear timeout on error
      setLoading(false); // CRITICAL: Reset loading FIRST
      console.error('❌ SignIn fetch error:', error);
      
      if (error.name === 'AbortError') {
        showNotification('Connection timeout (15 seconds).\n\nPossible cause:\n- Laravel server is slow or stopped\n- CORS issue\n\nSolution: Check Console (F12) and CORS settings', 'error', 8000);
      } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        showNotification('Server connection error!\n\nPossible cause:\n- CORS issue (most likely)\n\nSolution:\n1. Check Developer Console (F12)\n2. Check config/cors.php in Laravel', 'error', 8000);
      } else {
        showNotification('Unexpected error:\n' + error.message, 'error', 6000);
      }
      setErrors({ general: 'خطأ في الاتصال بالسيرفر' });
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-box">
        <h2 className="signin-title">Welcome Back</h2>
        <p className="signin-subtitle">Sign in to your account</p>
        
        {errors.general && (
          <div className="general-error">{errors.general}</div>
        )}
        
        <form onSubmit={handleSubmit} className="signin-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="Enter your email"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              placeholder="Enter your password"
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <a href="/forgot-password" className="forgot-password">Forgot Password?</a>
          </div>

          <button type="submit" className="signin-button" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="register-link">
          Don't have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
}

export default SignIn;
