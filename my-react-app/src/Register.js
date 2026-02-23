import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showNotification } from './NotificationContainer';
import './Register.css';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    age: '',
    email: '',
    password: '',
    password_confirmation: ''
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
    
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }
    
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }
    
    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (formData.age < 1 || formData.age > 120) {
      newErrors.age = 'Please enter a valid age';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Passwords do not match';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({}); // Clear previous errors
    console.log('Submitting registration with data:', formData);
    
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    try {
      const response = await fetch('http://34.107.46.116/api/patient/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
        signal: controller.signal,
        mode: 'cors' // Ensure CORS mode is set
        
      });

      clearTimeout(timeoutId); // Clear timeout if request completes
      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        // Registration successful
        console.log('✅ Registration successful!');
        
        setLoading(false); // Important: reset loading before showing alert
        
        showNotification('Registration successful! You will be redirected to the login page.\nPlease check your email to activate your account.', 'success', 6000);
        
        // Redirect to signin page
        navigate('/signin');
      } else {
        // Handle validation errors from backend
        console.error('Registration error:', data);
        setLoading(false);
        
        if (data.errors) {
          // Laravel returns errors in format: { field: ["message"] }
          const formattedErrors = {};
          Object.keys(data.errors).forEach(key => {
            formattedErrors[key] = data.errors[key][0]; // Get first error message
          });
          setErrors(formattedErrors);
          showNotification('Please correct the errors in the form', 'error');
        } else if (data.message) {
          showNotification(data.message, 'error');
        } else {
          showNotification('An error occurred during registration. Please try again.', 'error');
        }
      }
    } catch (error) {
      clearTimeout(timeoutId); // Clear timeout on error
      setLoading(false); // CRITICAL: Reset loading FIRST
      console.error('❌ Registration fetch error:', error);
      
      if (error.name === 'AbortError') {
        showNotification('Connection timeout (15 seconds).\n\nPossible cause:\n- Laravel server is slow or stopped\n- CORS issue\n\nSolution:\n1. Make sure Laravel is running on port 8000\n2. Check CORS settings in config/cors.php', 'error', 8000);
      } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        showNotification('Server connection error!\n\nPossible cause:\n- CORS issue (most likely)\n- Laravel server is not running\n\nSolution:\n1. Open Developer Console (F12) and check the error\n2. Check config/cors.php file in Laravel\n3. Make sure the server is running on http://34.107.46.116', 'error', 8000);
      } else {
        showNotification('Unexpected error:\n' + error.message + '\n\nOpen Console (F12) for more details', 'error', 8000);
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2 className="register-title">Create Account</h2>
        <p className="register-subtitle">Join us today!</p>
        
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="first_name">First Name</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className={errors.first_name ? 'error' : ''}
                placeholder="Enter your first name"
              />
              {errors.first_name && <span className="error-message">{errors.first_name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="last_name">Last Name</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className={errors.last_name ? 'error' : ''}
                placeholder="Enter your last name"
              />
              {errors.last_name && <span className="error-message">{errors.last_name}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="age">Age</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className={errors.age ? 'error' : ''}
              placeholder="Enter your age"
              min="1"
              max="120"
            />
            {errors.age && <span className="error-message">{errors.age}</span>}
          </div>

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

          <div className="form-group">
            <label htmlFor="password_confirmation">Confirm Password</label>
            <input
              type="password"
              id="password_confirmation"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              className={errors.password_confirmation ? 'error' : ''}
              placeholder="Confirm your password"
            />
            {errors.password_confirmation && <span className="error-message">{errors.password_confirmation}</span>}
          </div>

          <button type="submit" className="register-button" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="signin-link">
          Already have an account? <a href="/signin">Sign In</a>
        </p>
      </div>
    </div>
  );
}

export default Register;
