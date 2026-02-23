import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { showNotification } from './NotificationContainer';
import './ProfileCompletion.css';

function ProfileCompletion() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    blood_group: '',
    drug_allergies_status: '',
    drug_allergies: '',
    chronic_diseases_status: '',
    chronic_diseases: [],
    one_time_medications_status: '',
    one_time_medications: [],
    long_term_medications_status: '',
    long_term_medications: [],
    past_surgeries: '',
    emergency_contact: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Fetch existing profile data on component mount
  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setInitialLoading(false);
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

      if (response.ok) {
        const data = await response.json();
        const profile = data.profile || data.data || data;
        
        if (profile) {
          // Populate form with existing data
          setFormData({
            height: profile.height || '',
            weight: profile.weight || '',
            blood_group: profile.blood_group || '',
            drug_allergies_status: profile.drug_allergies ? 'yes' : 'no',
            drug_allergies: profile.drug_allergies || '',
            chronic_diseases_status: profile.chronic_diseases && profile.chronic_diseases.length > 0 ? 'yes' : 'no',
            chronic_diseases: profile.chronic_diseases || [],
            one_time_medications_status: profile.one_time_medications && profile.one_time_medications.length > 0 ? 'yes' : 'no',
            one_time_medications: profile.one_time_medications 
              ? profile.one_time_medications.map(med => typeof med === 'string' ? med : med.name)
              : [],
            long_term_medications_status: profile.long_term_medications && profile.long_term_medications.length > 0 ? 'yes' : 'no',
            long_term_medications: profile.long_term_medications 
              ? profile.long_term_medications.map(med => typeof med === 'string' ? med : med.name)
              : [],
            past_surgeries: profile.past_surgeries || '',
            emergency_contact: profile.emergency_contact || ''
          });
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name === 'chronic_diseases') {
        const updatedDiseases = checked
          ? [...formData.chronic_diseases, value]
          : formData.chronic_diseases.filter(d => d !== value);
        setFormData({ ...formData, chronic_diseases: updatedDiseases });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const addMedication = (type) => {
    if (type === 'one_time') {
      setFormData({
        ...formData,
        one_time_medications: [...formData.one_time_medications, '']
      });
      // Clear error when adding a new field
      if (errors.one_time_medications) {
        setErrors({ ...errors, one_time_medications: '' });
      }
    } else {
      setFormData({
        ...formData,
        long_term_medications: [...formData.long_term_medications, '']
      });
      // Clear error when adding a new field
      if (errors.long_term_medications) {
        setErrors({ ...errors, long_term_medications: '' });
      }
    }
  };

  const updateMedication = (type, index, value) => {
    if (type === 'one_time') {
      const updated = [...formData.one_time_medications];
      updated[index] = value;
      setFormData({ ...formData, one_time_medications: updated });
      
      // Clear error if user has entered a valid medication
      if (value.trim() !== '' && errors.one_time_medications) {
        setErrors({ ...errors, one_time_medications: '' });
      }
    } else {
      const updated = [...formData.long_term_medications];
      updated[index] = value;
      setFormData({ ...formData, long_term_medications: updated });
      
      // Clear error if user has entered a valid medication
      if (value.trim() !== '' && errors.long_term_medications) {
        setErrors({ ...errors, long_term_medications: '' });
      }
    }
  };

  const removeMedication = (type, index) => {
    if (type === 'one_time') {
      setFormData({
        ...formData,
        one_time_medications: formData.one_time_medications.filter((_, i) => i !== index)
      });
    } else {
      setFormData({
        ...formData,
        long_term_medications: formData.long_term_medications.filter((_, i) => i !== index)
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Basic required fields
    if (!formData.height || formData.height === '') {
      newErrors.height = 'Height is required';
    }
    if (!formData.weight || formData.weight === '') {
      newErrors.weight = 'Weight is required';
    }
    if (!formData.blood_group || formData.blood_group === '') {
      newErrors.blood_group = 'Blood group is required';
    }
    if (!formData.emergency_contact || formData.emergency_contact === '') {
      newErrors.emergency_contact = 'Emergency contact is required';
    }

    // Conditional validation for drug allergies
    if (formData.drug_allergies_status === 'yes' && (!formData.drug_allergies || formData.drug_allergies === '')) {
      newErrors.drug_allergies = 'Please specify your drug allergies';
    }

    // Conditional validation for one-time medications
    if (formData.one_time_medications_status === 'yes') {
      const hasValidMedications = formData.one_time_medications.some(med => med && med.trim() !== '');
      if (!hasValidMedications) {
        newErrors.one_time_medications = 'يرجى إضافة دواء واحد على الأقل أو تغيير الاختيار إلى "No"';
      }
    }

    // Conditional validation for long-term medications
    if (formData.long_term_medications_status === 'yes') {
      const hasValidMedications = formData.long_term_medications.some(med => med && med.trim() !== '');
      if (!hasValidMedications) {
        newErrors.long_term_medications = 'يرجى إضافة دواء واحد على الأقل أو تغيير الاختيار إلى "No"';
      }
    }

    console.log('Validation errors:', newErrors);
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🔍 Form submitted with data:', formData);

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      console.log('❌ Validation failed:', newErrors);
      setErrors(newErrors);
      showNotification('Please fill in all required fields', 'warning');
      return;
    }

    setLoading(true);
    console.log('✅ Validation passed, sending to API...');

    try {
      const token = localStorage.getItem('token');
      console.log('Token found:', token ? 'Yes' : 'No');
      
      if (!token) {
        showNotification('You must login first', 'error');
        navigate('/signin');
        return;
      }
      
      // Prepare data for Laravel API
      const apiData = {
        height: formData.height,
        weight: formData.weight,
        blood_group: formData.blood_group,
        drug_allergies: formData.drug_allergies_status === 'yes' ? formData.drug_allergies : null,
        chronic_diseases: formData.chronic_diseases_status === 'yes' ? formData.chronic_diseases : [],
        one_time_medications: formData.one_time_medications_status === 'yes' 
          ? formData.one_time_medications
              .filter(med => med && med.trim() !== '')
              .map(med => ({ name: med }))
          : [],
        long_term_medications: formData.long_term_medications_status === 'yes' 
          ? formData.long_term_medications
              .filter(med => med && med.trim() !== '')
              .map(med => ({ name: med }))
          : [],
        past_surgeries: formData.past_surgeries,
        emergency_contact: formData.emergency_contact
      };
      
      console.log('📤 Sending API data:', apiData);
      console.log('🔗 API URL: http://34.107.46.116/api/profile/create-or-update');
      
      const response = await fetch('http://34.107.46.116/api/profile/create-or-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(apiData)
      });

      console.log('📥 Response status:', response.status);
      const data = await response.json();
      console.log('📥 Response data:', data);

      if (response.ok) {
        // Profile completed successfully
        console.log('✅ Profile saved successfully!');
        localStorage.setItem('profile_completed', 'true');
        showNotification('Medical data saved successfully!', 'success');
        navigate('/dashboard');
      } else {
        // Handle validation errors
        console.error('❌ Profile save error:', data);
        if (data.errors) {
          const formattedErrors = {};
          Object.keys(data.errors).forEach(key => {
            formattedErrors[key] = data.errors[key][0];
          });
          setErrors(formattedErrors);
          
          // Show first error in alert
          const firstError = Object.values(data.errors)[0][0];
          showNotification(firstError, 'error');
        } else if (data.message) {
          showNotification(data.message, 'error');
        } else {
          showNotification('An error occurred while saving data', 'error');
        }
      }
    } catch (error) {
      console.error('❌ Profile completion fetch error:', error);
      showNotification('Server connection error. Make sure Laravel is running on port 8000\n' + error.message, 'error', 6000);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="profile-completion-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-completion-container">
      <div className="profile-completion-wrapper">
        {/* Main Card */}
        <div className="profile-card">
          {/* Card Header */}
          <div className="card-header">
            <h2 className="card-title">
              <i className="fas fa-notes-medical"></i>
              Complete Medical Profile
            </h2>
            <div className="hipaa-badge">
              <i className="fas fa-shield-alt"></i>
              Secure & Private
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="profile-form">
            {/* Height & Weight */}
            <div className="form-row-double">
              <div className="form-group">
                <label>
                  <i className="fas fa-ruler-vertical"></i>
                  Height (cm)
                </label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  placeholder="e.g. 168"
                  className={errors.height ? 'error' : ''}
                />
                {errors.height && <span className="error-message">{errors.height}</span>}
              </div>
              <div className="form-group">
                <label>
                  <i className="fas fa-weight"></i>
                  Weight (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="e.g. 62.5"
                  className={errors.weight ? 'error' : ''}
                />
                {errors.weight && <span className="error-message">{errors.weight}</span>}
              </div>
            </div>

            {/* Blood Group */}
            <div className="form-group">
              <label>
                <i className="fas fa-tint"></i>
                Blood Group
              </label>
              <select
                name="blood_group"
                value={formData.blood_group}
                onChange={handleChange}
                className={errors.blood_group ? 'error' : ''}
              >
                <option value="">— select blood type —</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
              {errors.blood_group && <span className="error-message">{errors.blood_group}</span>}
            </div>

            {/* Drug Allergies */}
            <div className="form-section">
              <label>
                <i className="fas fa-pills"></i>
                Any drug allergies?
              </label>
              <select
                name="drug_allergies_status"
                value={formData.drug_allergies_status}
                onChange={handleChange}
                className={errors.drug_allergies_status ? 'error' : ''}
              >
                <option value="">— select —</option>
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
              {formData.drug_allergies_status === 'yes' && (
                <input
                  type="text"
                  name="drug_allergies"
                  value={formData.drug_allergies}
                  onChange={handleChange}
                  placeholder="e.g. penicillin, sulfa ..."
                  className="conditional-input"
                />
              )}
            </div>

            {/* Chronic Diseases */}
            <div className="form-section">
              <label>
                <i className="fas fa-heartbeat"></i>
                Any chronic diseases?
              </label>
              <select
                name="chronic_diseases_status"
                value={formData.chronic_diseases_status}
                onChange={handleChange}
                className={errors.chronic_diseases_status ? 'error' : ''}
              >
                <option value="">— select —</option>
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
              {formData.chronic_diseases_status === 'yes' && (
                <div className="checkbox-grid">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="chronic_diseases"
                      value="diabetes"
                      checked={formData.chronic_diseases.includes('diabetes')}
                      onChange={handleChange}
                    />
                    Diabetes
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="chronic_diseases"
                      value="hypertension"
                      checked={formData.chronic_diseases.includes('hypertension')}
                      onChange={handleChange}
                    />
                    Hypertension
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="chronic_diseases"
                      value="heart_disease"
                      checked={formData.chronic_diseases.includes('heart_disease')}
                      onChange={handleChange}
                    />
                    Heart disease
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="chronic_diseases"
                      value="asthma"
                      checked={formData.chronic_diseases.includes('asthma')}
                      onChange={handleChange}
                    />
                    Asthma
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="chronic_diseases"
                      value="cancer"
                      checked={formData.chronic_diseases.includes('cancer')}
                      onChange={handleChange}
                    />
                    Cancer
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="chronic_diseases"
                      value="other"
                      checked={formData.chronic_diseases.includes('other')}
                      onChange={handleChange}
                    />
                    Other
                  </label>
                </div>
              )}
            </div>

            {/* One-time Medications */}
            <div className="form-section">
              <label>
                <i className="fas fa-capsules"></i>
                One-time medications?
              </label>
              <select
                name="one_time_medications_status"
                value={formData.one_time_medications_status}
                onChange={handleChange}
                className={errors.one_time_medications_status ? 'error' : ''}
              >
                <option value="">— select —</option>
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
              {formData.one_time_medications_status === 'yes' && (
                <div className="medications-list">
                  {formData.one_time_medications.map((med, index) => (
                    <div key={index} className="medication-item">
                      <input
                        type="text"
                        value={med}
                        onChange={(e) => updateMedication('one_time', index, e.target.value)}
                        placeholder="Medication name"
                      />
                      <button
                        type="button"
                        onClick={() => removeMedication('one_time', index)}
                        className="remove-btn"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addMedication('one_time')}
                    className="add-medication-btn"
                  >
                    <i className="fas fa-plus"></i>
                    Add medication
                  </button>
                  {errors.one_time_medications && (
                    <span className="error-message" style={{display: 'block', marginTop: '8px'}}>
                      {errors.one_time_medications}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Long-term Medications */}
            <div className="form-section">
              <label>
                <i className="fas fa-clock"></i>
                Long-term medications?
              </label>
              <select
                name="long_term_medications_status"
                value={formData.long_term_medications_status}
                onChange={handleChange}
                className={errors.long_term_medications_status ? 'error' : ''}
              >
                <option value="">— select —</option>
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
              {formData.long_term_medications_status === 'yes' && (
                <div className="medications-list">
                  {formData.long_term_medications.map((med, index) => (
                    <div key={index} className="medication-item">
                      <input
                        type="text"
                        value={med}
                        onChange={(e) => updateMedication('long_term', index, e.target.value)}
                        placeholder="Medication name"
                      />
                      <button
                        type="button"
                        onClick={() => removeMedication('long_term', index)}
                        className="remove-btn"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addMedication('long_term')}
                    className="add-medication-btn"
                  >
                    <i className="fas fa-plus"></i>
                    Add medication
                  </button>
                  {errors.long_term_medications && (
                    <span className="error-message" style={{display: 'block', marginTop: '8px'}}>
                      {errors.long_term_medications}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Past Surgeries */}
            <div className="form-group">
              <label>
                <i className="fas fa-procedures"></i>
                Past surgeries
              </label>
              <textarea
                name="past_surgeries"
                value={formData.past_surgeries}
                onChange={handleChange}
                rows="3"
                placeholder="appendectomy 2018, ..."
              ></textarea>
            </div>

            {/* Emergency Contact */}
            <div className="form-group">
              <label>
                <i className="fas fa-phone"></i>
                Emergency contact
              </label>
              <input
                type="text"
                name="emergency_contact"
                value={formData.emergency_contact}
                onChange={handleChange}
                placeholder="Full name + phone"
                className={errors.emergency_contact ? 'error' : ''}
              />
              {errors.emergency_contact && <span className="error-message">{errors.emergency_contact}</span>}
            </div>

            {/* Submit Button */}
            <button type="submit" className="submit-btn" disabled={loading}>
              <i className="fas fa-check-circle"></i>
              {loading ? 'Saving...' : 'Save Medical Profile'}
            </button>
          </form>

          {/* Footer */}
          <p className="form-footer">
            <i className="fas fa-lock"></i>
            Your information is encrypted and secure
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProfileCompletion;
