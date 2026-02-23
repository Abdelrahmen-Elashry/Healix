import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  useEffect(() => {
    fetchProfileData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfileData = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/signin');
      return;
    }

    try {
      const response = await fetch('http://34.107.46.116/api/profile/my-profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      const data = await response.json();
      console.log('Profile data received:', data);

      if (response.ok) {
        setProfileData(data.profile || data.data || data);
      } else {
        console.error('Failed to fetch profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        await fetch('http://34.107.46.116/api/patient/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('profile_completed');
    navigate('/signin');
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-state">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading your medical profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        {/* Navbar - Same as Dashboard */}
        <nav className="dashboard-navbar">
          <div className="navbar-content">
            <div className="navbar-brand" style={{cursor: 'pointer'}} onClick={() => navigate('/dashboard')}>
              <i className="fas fa-clipboard-list"></i>
              <span className="brand-name">
                My<span className="brand-highlight">Profile</span>
              </span>
            </div>

            <div className="navbar-right">
              <button className="back-btn" onClick={() => navigate('/dashboard')}>
                <i className="fas fa-arrow-left"></i>
                Back to Dashboard
              </button>
              
              <div className="user-dropdown-wrapper">
                <div 
                  className="user-badge" 
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                >
                  <div className="user-avatar">
                    {user.first_name ? user.first_name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="user-name">{user.first_name || 'User'}</span>
                  <i className="fas fa-chevron-down"></i>
                </div>
                
                {showUserDropdown && (
                  <div className="user-dropdown-menu">
                    <button className="dropdown-item" onClick={() => navigate('/profile')}>
                      <i className="fas fa-user"></i>
                      Profile
                    </button>
                    <button className="dropdown-item logout" onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt"></i>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* User Info Card */}
        <div className="user-info-card">
          <div className="user-main-info">
            <div>
              <div className="user-avatar-large">
                {user.first_name ? user.first_name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="user-details">
                <h3 className="user-full-name">
                  {user.first_name && user.last_name 
                    ? `${user.first_name} ${user.last_name}` 
                    : 'User Name'}
                </h3>
                <p className="user-meta">
                  <i className="fas fa-user-md"></i>
                  Patient · {user.age || 'N/A'} years
                </p>
              </div>
            </div>
            <button className="edit-profile-btn" onClick={() => navigate('/profile-completion')}>
              <i className="fas fa-edit"></i>
              Edit Profile
            </button>
          </div>

          <div className="contact-info-grid">
            <div className="contact-item">
              <i className="fas fa-envelope"></i>
              <div>
                <span className="contact-label">Email</span>
                <span className="contact-value">{user.email || 'user@example.com'}</span>
              </div>
            </div>
            <div className="contact-item">
              <i className="fas fa-phone"></i>
              <div>
                <span className="contact-label">Emergency Contact</span>
                <span className="contact-value">{profileData?.emergency_contact || 'Not provided'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Medical Metrics */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon-wrapper blue">
              <i className="fas fa-tint"></i>
            </div>
            <div className="metric-content">
              <span className="metric-label">Blood Group</span>
              <span className="metric-value">{profileData?.blood_group || 'O+'}</span>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-icon-wrapper purple">
              <i className="fas fa-weight"></i>
            </div>
            <div className="metric-content">
              <span className="metric-label">Weight</span>
              <span className="metric-value">{profileData?.weight || '62'} kg</span>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-icon-wrapper green">
              <i className="fas fa-ruler-vertical"></i>
            </div>
            <div className="metric-content">
              <span className="metric-label">Height</span>
              <span className="metric-value">{profileData?.height || '165'} cm</span>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-icon-wrapper orange">
              <i className="fas fa-heartbeat"></i>
            </div>
            <div className="metric-content">
              <span className="metric-label">BMI</span>
              <span className="metric-value">{profileData?.bmi || '22.8'}</span>
            </div>
          </div>
        </div>

        {/* Medical Information Grid */}
        <div className="profile-content-grid">
          {/* Allergies */}
          {profileData?.drug_allergies && (
            <div className="info-section alert-section">
              <div className="section-header alert">
                <i className="fas fa-exclamation-triangle"></i>
                <h3>Drug Allergies</h3>
                <span className="badge alert">Important</span>
              </div>
              <div className="section-content">
                <div className="tags-list">
                  {profileData.drug_allergies.split(',').map((allergy, index) => (
                    <span key={index} className="tag alert">
                      <i className="fas fa-times-circle"></i>
                      {allergy.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Chronic Conditions */}
          {profileData?.chronic_diseases && profileData.chronic_diseases.length > 0 && (
            <div className="info-section">
              <div className="section-header">
                <i className="fas fa-notes-medical"></i>
                <h3>Chronic Conditions</h3>
              </div>
              <div className="section-content">
                <div className="tags-list">
                  {profileData.chronic_diseases.map((disease, index) => (
                    <span key={index} className="tag">
                      <i className="fas fa-check-circle"></i>
                      {disease}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Current Medications */}
          {profileData?.long_term_medications && profileData.long_term_medications.length > 0 && (
            <div className="info-section">
              <div className="section-header">
                <i className="fas fa-pills"></i>
                <h3>Long-term Medications</h3>
                <span className="badge">{profileData.long_term_medications.length} Active</span>
              </div>
              <div className="section-content">
                <div className="medications-list">
                  {profileData.long_term_medications.map((med, index) => (
                    <div key={index} className="medication-item">
                      <i className="fas fa-capsules"></i>
                      <span>{med.name || med}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* One-time Medications */}
          {profileData?.one_time_medications && profileData.one_time_medications.length > 0 && (
            <div className="info-section">
              <div className="section-header">
                <i className="fas fa-syringe"></i>
                <h3>One-time Medications</h3>
              </div>
              <div className="section-content">
                <div className="medications-list">
                  {profileData.one_time_medications.map((med, index) => (
                    <div key={index} className="medication-item">
                      <i className="fas fa-prescription-bottle"></i>
                      <span>{med.name || med}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Past Surgeries */}
          {profileData?.past_surgeries && (
            <div className="info-section full-width">
              <div className="section-header">
                <i className="fas fa-procedures"></i>
                <h3>Past Surgeries</h3>
              </div>
              <div className="section-content">
                <p className="text-content">{profileData.past_surgeries}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
