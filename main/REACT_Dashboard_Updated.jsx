import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

// Configure axios base URL
const API_BASE_URL = 'http://127.0.0.1:8000/api';

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  
  const [showModal, setShowModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [medications, setMedications] = useState([{ name: '', duration: '', dosage: '' }]);
  const [patientRecords, setPatientRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    doctorName: '',
    doctorSpecialty: '',
    appointmentDate: '',
    diseaseName: '',
    diagnosis: '',
    examinationPlace: ''
  });

  // Configure axios defaults
  axios.defaults.baseURL = API_BASE_URL;
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  axios.defaults.headers.common['Accept'] = 'application/json';
  axios.defaults.withCredentials = true;

  // Fetch appointments on component mount
  useEffect(() => {
    if (token) {
      fetchAppointments();
    }
  }, [token]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/appointments');
      
      if (response.data.success) {
        // Transform data to match component structure
        const transformedData = response.data.data.map(apt => ({
          id: apt.id,
          doctorName: apt.doctor_name,
          specialty: apt.doctor_specialty,
          date: apt.appointment_date,
          diseaseName: apt.disease_name,
          diagnosis: apt.diagnosis,
          place: apt.examination_place,
          hasAttachments: apt.attachments && apt.attachments.length > 0,
          medications: apt.medications || []
        }));
        
        setPatientRecords(transformedData);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate('/signin');
      } else if (error.response?.status === 403) {
        alert('⚠️ Please verify your email to access appointments');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (token) {
      try {
        await axios.post('/patient/logout');
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('profile_completed');
    navigate('/signin');
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const removeFile = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const addMedication = () => {
    setMedications([...medications, { name: '', duration: '', dosage: '' }]);
  };

  const removeMedication = (index) => {
    if (medications.length > 1) {
      setMedications(medications.filter((_, i) => i !== index));
    }
  };

  const handleMedicationChange = (index, field, value) => {
    const updatedMedications = [...medications];
    updatedMedications[index][field] = value;
    setMedications(updatedMedications);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Filter out empty medications
      const validMedications = medications.filter(med => 
        med.name && med.name.trim() !== ''
      );
      
      const appointmentData = {
        doctor_name: formData.doctorName,
        doctor_specialty: formData.doctorSpecialty,
        appointment_date: formData.appointmentDate,
        disease_name: formData.diseaseName,
        diagnosis: formData.diagnosis,
        examination_place: formData.examinationPlace,
        medications: validMedications,
        attachments: selectedFiles.map(file => file.name)
      };
      
      const response = await axios.post('/appointments', appointmentData);
      
      if (response.data.success) {
        // Refresh appointments list
        await fetchAppointments();
        
        // Close modal and reset form
        setShowModal(false);
        setFormData({
          doctorName: '',
          doctorSpecialty: '',
          appointmentDate: '',
          diseaseName: '',
          diagnosis: '',
          examinationPlace: ''
        });
        setMedications([{ name: '', duration: '', dosage: '' }]);
        setSelectedFiles([]);
        
        alert('✅ Appointment saved successfully!');
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      
      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat().join('\n');
        alert('❌ Validation Error:\n' + errorMessages);
      } else if (error.response?.status === 401) {
        alert('⚠️ Session expired. Please login again.');
        localStorage.clear();
        navigate('/signin');
      } else if (error.response?.status === 403) {
        alert('⚠️ Please verify your email to create appointments');
      } else {
        alert('❌ Failed to save appointment. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteRecord = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) {
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.delete(`/appointments/${id}`);
      
      if (response.data.success) {
        await fetchAppointments();
        alert('✅ Record deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting appointment:', error);
      alert('❌ Failed to delete record. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Global Loading Overlay */}
      {loading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: 'white',
            padding: '30px 50px',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: '40px', color: '#4F46E5' }}></i>
            <p style={{ marginTop: '15px', fontSize: '16px', color: '#333' }}>Loading...</p>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="dashboard-navbar">
        <div className="navbar-content">
          <div className="navbar-brand">
            <i className="fas fa-clipboard-list"></i>
            <span className="brand-name">
              {user.first_name || 'User'}<span className="brand-highlight">summary</span>
            </span>
          </div>

          <div className={`navbar-links ${showMobileMenu ? 'show' : ''}`}>
            <a href="#" className="nav-link active">Dashboard</a>
            <a href="#" className="nav-link">Patients</a>
            <a href="#" className="nav-link">Appointments</a>
            <a href="#" className="nav-link">Analytics</a>
            <a href="#" className="nav-link">Records</a>
          </div>

          <div className="navbar-right">
            <div className="user-dropdown-wrapper">
              <div 
                className="user-badge" 
                onClick={() => setShowUserDropdown(!showUserDropdown)}
              >
                <i className="fas fa-bell"></i>
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
            <button 
              className="mobile-menu-btn"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </div>
      </nav>

      <div className="dashboard-wrapper">
        {/* Header Section */}
        <div className="dashboard-header-section">
          <div className="header-text">
            <h1 className="main-title">Dashboard Overview</h1>
            <p className="welcome-text">
              <i className="fas fa-hand-peace"></i>
              Welcome back, <span className="user-highlight">{user.first_name || 'User'}</span>. Here's your{' '}
              <span className="data-badge">Data summary</span>
            </p>
          </div>
          <div className="header-actions">
            <button className="import-btn" onClick={() => alert('Import functionality coming soon!')}>
              <i className="fas fa-file-import"></i>
              Import
            </button>
            <button className="export-btn" onClick={() => navigate('/patient-records')}>
              <i className="fas fa-file-export"></i>
              Export
            </button>
            <button className="add-appointment-btn" onClick={() => setShowModal(true)}>
              <i className="fas fa-calendar-plus"></i>
              Add Appointment
            </button>
          </div>
        </div>

        {/* Patient Records Table */}
        <section className="records-section">
          <div className="section-header">
            <h2 className="section-title">
              <i className="fas fa-notes-medical"></i>
              Patient Records
            </h2>
            <div className="update-badge">
              <i className="fas fa-clock"></i>
              last updated today
            </div>
          </div>
          
          <div className="table-container">
            {patientRecords.length === 0 && !loading ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '50px', 
                color: '#999',
                fontSize: '16px'
              }}>
                <i className="fas fa-inbox" style={{ fontSize: '48px', marginBottom: '20px', display: 'block' }}></i>
                No appointments yet. Click "Add Appointment" to create your first record.
              </div>
            ) : (
              <table className="records-table">
                <thead>
                  <tr>
                    <th>Doctor Name</th>
                    <th>Specialty</th>
                    <th>Date</th>
                    <th>Disease</th>
                    <th>Diagnosis</th>
                    <th>Place</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patientRecords.map(record => (
                    <tr key={record.id}>
                      <td className="font-medium">{record.doctorName}</td>
                      <td>{record.specialty}</td>
                      <td>{new Date(record.date).toLocaleDateString()}</td>
                      <td>{record.diseaseName}</td>
                      <td>{record.diagnosis}</td>
                      <td>{record.place}</td>
                      <td className="actions-cell">
                        <i 
                          className="fas fa-trash-alt delete-icon"
                          onClick={() => deleteRecord(record.id)}
                          title="Delete"
                          style={{ cursor: 'pointer' }}
                        ></i>
                        {record.hasAttachments && (
                          <i className="fas fa-paperclip attachment-icon" title="Has attachments"></i>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          
          <div className="table-footer">
            {patientRecords.length} records • updated {new Date().toLocaleDateString()}
          </div>
        </section>

        {/* Analytics Grid */}
        <div className="analytics-grid">
          {/* Yearly Analytics */}
          <div className="analytics-card">
            <div className="card-header">
              <h3 className="card-title">
                <i className="fas fa-chart-line"></i>
                Yearly Analytics Overview
              </h3>
              <span className="insight-badge">Comprehensive insights</span>
            </div>
            <div className="analytics-stats">
              <div className="stat-item">
                <div className="stat-left">
                  <span className="stat-code stat-code-primary">Total Visits</span>
                  <span className="stat-change">+18%</span>
                </div>
                <span className="stat-value">{patientRecords.length}</span>
              </div>
              <div className="stat-item">
                <div className="stat-left">
                  <span className="stat-code stat-code-warning">Treatments</span>
                  <span className="stat-change negative">-5%</span>
                </div>
                <span className="stat-value">42</span>
              </div>
              <div className="stat-item">
                <div className="stat-left">
                  <span className="stat-code stat-code-success">Rating</span>
                  <span className="stat-change">4.8/5</span>
                </div>
                <span className="stat-value">Excellent</span>
              </div>
            </div>
            <p className="card-note">* trends for last 12 months</p>
          </div>

          {/* Medical Timeline */}
          <div className="timeline-card">
            <div className="timeline-header">
              <i className="fas fa-calendar-check"></i>
              <h3 className="card-title">Medical Timeline Preview</h3>
            </div>
            <p className="timeline-subtitle">Your last appointments</p>
            {patientRecords.length > 0 ? (
              <div className="timeline-item">
                <div className="timeline-item-header">
                  <div className="timeline-avatar">
                    <i className="fas fa-user-md"></i>
                  </div>
                  <div className="timeline-info">
                    <p className="timeline-doctor">Doctor: <span>{patientRecords[0].doctorName}</span></p>
                    <p className="timeline-date">Date: {new Date(patientRecords[0].date).toLocaleDateString()}</p>
                  </div>
                </div>
                <p className="timeline-diagnosis"><span>Diagnosis:</span> {patientRecords[0].diagnosis}</p>
                <button className="view-history-btn" onClick={() => alert('Full history view coming soon!')}>
                  <i className="fas fa-eye"></i>
                  View Full Medical History
                </button>
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
                No appointments yet
              </p>
            )}
          </div>

          {/* Health Trends */}
          <div className="trends-card">
            <div className="trends-header">
              <h3 className="card-title">
                <i className="fas fa-heartbeat"></i>
                Health Trends Analysis
              </h3>
              <span className="metric-badge">This year's metrics</span>
            </div>
            <div className="trends-stats">
              <div className="trend-item">
                <span className="trend-label">Doctor visits:</span>
                <span className="trend-value">{patientRecords.length}</span>
              </div>
              <div className="trend-item">
                <span className="trend-label">Most visited:</span>
                <span className="trend-badge trend-badge-blue">
                  {patientRecords.length > 0 ? patientRecords[0].specialty : 'N/A'}
                </span>
              </div>
              <div className="trend-item">
                <span className="trend-label">Condition stability:</span>
                <span className="trend-badge trend-badge-green">Stable</span>
              </div>
            </div>
            <button className="view-analytics-btn" onClick={() => alert('Analytics view coming soon!')}>
              <i className="fas fa-chart-bar"></i>
              View Analytics
            </button>
          </div>
        </div>

        {/* Appointments Section */}
        <section className="appointments-section">
          <div className="appointments-header">
            <div className="appointments-title">
              <i className="fas fa-clock"></i>
              <h2>Appointments</h2>
              <span className="upcoming-badge">upcoming</span>
            </div>
          </div>

          <div className="appointments-grid">
            <div className="appointment-card">
              <p className="appointment-name">
                <i className="fas fa-user"></i>
                Sarah Johnson
              </p>
              <p className="appointment-date">
                <i className="fas fa-calendar"></i>
                Monday 15/1/2025
              </p>
              <div className="appointment-details">
                <span className="appointment-time">
                  <i className="fas fa-clock"></i>
                  10:30 AM
                </span>
                <span className="appointment-type type-eyes">
                  <i className="fas fa-eye"></i>
                  Eyes
                </span>
                <span className="appointment-doctor">Dr. Smith</span>
              </div>
            </div>

            <div className="appointment-card">
              <p className="appointment-name">
                <i className="fas fa-user"></i>
                Michael Chen
              </p>
              <p className="appointment-date">
                <i className="fas fa-calendar"></i>
                Monday 15/1/2025
              </p>
              <div className="appointment-details">
                <span className="appointment-time">
                  <i className="fas fa-clock"></i>
                  11:00 AM
                </span>
                <span className="appointment-type type-nose">
                  <i className="fas fa-head-side-mask"></i>
                  ENT
                </span>
                <span className="appointment-doctor">Dr. Mona</span>
              </div>
            </div>

            <div className="appointment-card">
              <p className="appointment-name">
                <i className="fas fa-user"></i>
                Ateeq Rafiq
              </p>
              <p className="appointment-date">
                <i className="fas fa-calendar"></i>
                Tuesday 16/1/2025
              </p>
              <div className="appointment-details">
                <span className="appointment-time">
                  <i className="fas fa-clock"></i>
                  2:00 PM
                </span>
                <span className="appointment-type type-general">
                  <i className="fas fa-stethoscope"></i>
                  General
                </span>
                <span className="appointment-doctor">Dr. Emad</span>
              </div>
            </div>

            <div className="appointment-card">
              <p className="appointment-name">
                <i className="fas fa-user"></i>
                Emma Wilson
              </p>
              <p className="appointment-date">
                <i className="fas fa-calendar"></i>
                Wednesday 17/1/2025
              </p>
              <div className="appointment-details">
                <span className="appointment-time">
                  <i className="fas fa-clock"></i>
                  3:30 PM
                </span>
                <span className="appointment-type type-checkup">
                  <i className="fas fa-check-circle"></i>
                  Check-up
                </span>
                <span className="appointment-doctor">Dr. Salah</span>
              </div>
            </div>
          </div>

          <div className="appointments-footer">
            <i className="fas fa-bell"></i>
            4 upcoming appointments
            <span className="dot-separator"></span>
            <button className="view-calendar-btn">view calendar</button>
          </div>
        </section>

        {/* Footer */}
        <div className="dashboard-footer">
          <span>📋 Dashboard snapshot · {user.first_name || 'User'}'s summary</span>
          <span>
            <i className="fas fa-smile"></i>
            Medical portal by Healix
          </span>
        </div>
      </div>

      {/* Appointment Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                <i className="fas fa-calendar-check"></i>
                Add New Appointment
              </h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-field">
                  <label>
                    <i className="fas fa-user-md"></i>
                    Doctor Name
                  </label>
                  <input
                    type="text"
                    name="doctorName"
                    value={formData.doctorName}
                    onChange={handleInputChange}
                    placeholder="Enter doctor name"
                    required
                  />
                </div>

                <div className="form-field">
                  <label>
                    <i className="fas fa-stethoscope"></i>
                    Doctor Specialty
                  </label>
                  <select
                    name="doctorSpecialty"
                    value={formData.doctorSpecialty}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select specialty</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="Dentistry">Dentistry</option>
                    <option value="ENT">ENT</option>
                    <option value="Ophthalmology">Ophthalmology</option>
                    <option value="Internal Medicine">Internal Medicine</option>
                    <option value="Neurology">Neurology</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label>
                    <i className="fas fa-calendar"></i>
                    Appointment Date
                  </label>
                  <input
                    type="date"
                    name="appointmentDate"
                    value={formData.appointmentDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-field">
                  <label>
                    <i className="fas fa-disease"></i>
                    Disease Name
                  </label>
                  <input
                    type="text"
                    name="diseaseName"
                    value={formData.diseaseName}
                    onChange={handleInputChange}
                    placeholder="Enter disease name"
                    required
                  />
                </div>
              </div>

              <div className="form-field">
                <label>
                  <i className="fas fa-notes-medical"></i>
                  Diagnosis
                </label>
                <input
                  type="text"
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleInputChange}
                  placeholder="Enter diagnosis"
                  required
                />
              </div>

              <div className="form-field">
                <label>
                  <i className="fas fa-hospital"></i>
                  Place of Examination
                </label>
                <select
                  name="examinationPlace"
                  value={formData.examinationPlace}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select place</option>
                  <option value="Clinic">Clinic</option>
                  <option value="Hospital">Hospital</option>
                  <option value="Private Hospital">Private Hospital</option>
                  <option value="Home Visit">Home Visit</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>

              <div className="medications-section">
                <div className="medications-header">
                  <h3 className="section-subtitle">
                    <i className="fas fa-pills"></i>
                    Prescribed Medications
                  </h3>
                  <button 
                    type="button" 
                    className="add-medication-btn"
                    onClick={addMedication}
                  >
                    <i className="fas fa-plus"></i>
                    Add Medication
                  </button>
                </div>
                
                <div className="medications-list">
                  {medications.map((med, index) => (
                    <div key={index} className="medication-item">
                      <div className="medication-number">{index + 1}</div>
                      <div className="form-row">
                        <div className="form-field">
                          <label>Medication Name</label>
                          <input
                            type="text"
                            value={med.name}
                            onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                            placeholder="e.g., Amoxicillin"
                          />
                        </div>
                        <div className="form-field">
                          <label>Duration</label>
                          <input
                            type="text"
                            value={med.duration}
                            onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                            placeholder="e.g., 2 weeks"
                          />
                        </div>
                        <div className="form-field">
                          <label>Dosage</label>
                          <input
                            type="text"
                            value={med.dosage}
                            onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                            placeholder="e.g., 1 tablet twice daily"
                          />
                        </div>
                      </div>
                      {medications.length > 1 && (
                        <button 
                          type="button" 
                          className="remove-medication-btn"
                          onClick={() => removeMedication(index)}
                        >
                          <i className="fas fa-trash-alt"></i>
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="attachments-section">
                <h3 className="section-subtitle">
                  <i className="fas fa-paperclip"></i>
                  Attachments
                </h3>
                <div className="file-upload-area" onClick={() => document.getElementById('fileInput').click()}>
                  <i className="fas fa-cloud-upload-alt"></i>
                  <p>Click to upload or drag and drop</p>
                  <span>PDF, JPG, PNG (Max 10MB)</span>
                  <input
                    type="file"
                    id="fileInput"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                  />
                </div>
                {selectedFiles.length > 0 && (
                  <div className="file-list">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="file-item">
                        <div className="file-info">
                          <i className="fas fa-file"></i>
                          <span>{file.name}</span>
                          <span className="file-size">({(file.size / 1024).toFixed(1)} KB)</span>
                        </div>
                        <button type="button" onClick={() => removeFile(index)}>
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="cancel-btn" 
                  onClick={() => setShowModal(false)}
                  disabled={loading}
                >
                  <i className="fas fa-times-circle"></i>
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={loading}
                >
                  <i className="fas fa-save"></i>
                  {loading ? 'Saving...' : 'Save Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
