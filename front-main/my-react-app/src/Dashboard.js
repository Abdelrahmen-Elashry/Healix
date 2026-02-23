import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PatientCard from './PatientCard';
import ChatBot from './ChatBot';
import { showNotification } from './NotificationContainer';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const [showModal, setShowModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [medications, setMedications] = useState([{ name: '', duration: '', dosage: '' }]);
  const [patientRecords, setPatientRecords] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  
  const [formData, setFormData] = useState({
    doctorName: '',
    doctorSpecialty: '',
    appointmentDate: '',
    diseaseName: '',
    diagnosis: '',
    examinationPlace: ''
  });

  // Fetch appointments and profile on component mount
  useEffect(() => {
    fetchAppointments();
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
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
        setProfileData(data.profile || data.data || data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchAppointments = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://34.107.46.116/api/appointments', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        let data = await response.json();
        
        // Laravel \u0623\u062d\u064a\u0627\u0646\u064b\u0627 \u0628\u064a\u0631\u062c\u0639 \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a wrapped \u0641\u064a data object
        if (data.data && Array.isArray(data.data)) {
          data = data.data;
        }
        
        // \u0646\u062a\u0623\u0643\u062f \u0625\u0646 \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a array
        if (!Array.isArray(data)) {
          console.error('Unexpected data format:', data);
          setPatientRecords([]);
          setLoading(false);
          return;
        }
        
        // \u062a\u062d\u0648\u064a\u0644 \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a \u0645\u0646 Laravel format \u0625\u0644\u0649 React format
        const formattedRecords = data.map(appointment => {
          // Parse medications if it's a string
          let medications = appointment.medications || [];
          if (typeof medications === 'string') {
            try {
              medications = JSON.parse(medications);
            } catch (e) {
              medications = [];
            }
          }
          if (!Array.isArray(medications)) {
            medications = [];
          }
          
          return {
            id: appointment.id,
            doctorName: appointment.doctor_name,
            specialty: appointment.doctor_specialty,
            date: appointment.appointment_date,
            diseaseName: appointment.disease_name,
            diagnosis: appointment.diagnosis,
            place: appointment.examination_place,
            medications: medications,
            hasAttachments: appointment.attachments && appointment.attachments.length > 0
          };
        });
        setPatientRecords(formattedRecords);
      } else {
        console.error('Failed to fetch appointments, status:', response.status);
        const errorData = await response.json().catch(() => ({}));
        console.error('Error details:', errorData);
        setPatientRecords([]);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        // Call Laravel logout endpoint
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
    
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('profile_completed');
    
    // Navigate to signin
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

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setShowDetailsModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    
    const token = localStorage.getItem('token');
    
    if (!token) {
      showNotification('Please login first', 'error');
      setSubmitLoading(false);
      return;
    }

    try {
      // تجهيز البيانات للإرسال
      const appointmentData = {
        doctor_name: formData.doctorName,
        doctor_specialty: formData.doctorSpecialty,
        appointment_date: formData.appointmentDate,
        disease_name: formData.diseaseName,
        diagnosis: formData.diagnosis,
        examination_place: formData.examinationPlace,
        medications: medications.filter(med => med.name.trim() !== '')
      };

      const response = await fetch('http://34.107.46.116/api/appointments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(appointmentData)
      });

      if (response.ok) {
        // Reset form أولاً
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
        setShowModal(false);
        
        // جلب البيانات من database مرة تانية عشان نتأكد إن كل حاجة متزامنة
        await fetchAppointments();
        
        showNotification('Appointment saved successfully!', 'success');
      } else {
        const errorData = await response.json();
        showNotification('Failed to save appointment: ' + (errorData.message || 'Unknown error'), 'error');
      }
    } catch (error) {
      console.error('Error saving appointment:', error);
      showNotification('Error saving appointment. Please try again.', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const deleteRecord = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) {
      return;
    }

    const token = localStorage.getItem('token');
    
    if (!token) {
      showNotification('Please login first', 'error');
      return;
    }

    try {
      const response = await fetch(`http://34.107.46.116/api/appointments/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        // جلب البيانات من database مرة تانية بعد الحذف
        await fetchAppointments();
        showNotification('Record deleted successfully!', 'success');
      } else {
        const errorData = await response.json().catch(() => ({}));
        showNotification('Failed to delete record: ' + (errorData.message || 'Unknown error'), 'error');
      }
    } catch (error) {
      console.error('Error deleting record:', error);
      showNotification('Error deleting record. Please try again.', 'error');
    }
  };

  const handleExport = () => {
    // Export all records as CSV
    const headers = ['Doctor Name', 'Specialty', 'Date', 'Disease', 'Diagnosis', 'Place'];
    const csvContent = [
      headers.join(','),
      ...patientRecords.map(record => 
        `${record.doctorName},${record.specialty},${record.date},${record.diseaseName},${record.diagnosis},${record.place}`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `healix_records_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification(`Exported ${patientRecords.length} records successfully!`, 'success');
  };

  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <nav className="dashboard-navbar">
        <div className="navbar-content">
          <div className="navbar-brand">
            <img src="/healix-logo.png" alt="Healix Logo" className="brand-logo" />
            <span className="brand-name">
              <span className="brand-highlight">Healix</span>
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
            <button className="import-btn" onClick={() => showNotification('Import functionality coming soon!', 'info')}>
              <i className="fas fa-file-import"></i>
              Import
            </button>
            <button className="export-btn" onClick={handleExport}>
              <i className="fas fa-file-export"></i>
              Export All Records
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
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading appointments...</p>
              </div>
            ) : patientRecords.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-inbox"></i>
                <p>No appointments yet</p>
                <span>Click "Add Appointment" to create your first record</span>
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
                  {patientRecords.slice(0, 5).map(record => (
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
                        ></i>
                        {record.hasAttachments && (
                          <i className="fas fa-paperclip attachment-icon" title="Has attachments"></i>
                        )}
                      </td>
                    </tr>
                  ))}
                  {patientRecords.length > 5 && (
                    <tr style={{background: '#F9FAFB'}}>
                      <td colSpan="7" style={{textAlign: 'center', padding: '16px', color: '#6B7280', fontSize: '0.9rem'}}>
                        <i className="fas fa-info-circle" style={{marginRight: '8px', color: '#3B82F6'}}></i>
                        Showing 5 of {patientRecords.length} records.
                        <button 
                          onClick={() => navigate('/patient-records')} 
                          style={{
                            marginLeft: '10px',
                            padding: '6px 12px',
                            background: '#3B82F6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: '600'
                          }}
                        >
                          View All Records
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
          
          <div className="table-footer">
            Showing {Math.min(5, patientRecords.length)} of {patientRecords.length} records • updated {new Date().toLocaleDateString()}
          </div>
        </section>

        {/* Analytics Grid */}
        <div className="analytics-grid">
          {/* Yearly Analytics - Large Card */}
          <div className="analytics-main-card">
            <div className="analytics-main-header">
              <div>
                <h3 className="analytics-main-title">
                  <i className="fas fa-chart-line"></i>
                  Yearly Analytics Overview
                </h3>
                <p className="analytics-main-subtitle">Comprehensive insights for 2026</p>
              </div>
              <button className="view-details-btn">View Details</button>
            </div>
            
            <div className="analytics-metrics">
              <div className="metric-item">
                <div className="metric-header">
                  <span className="metric-label">Appointment Growth</span>
                  <span className="metric-value-large">+18%</span>
                </div>
                <span className="metric-sublabel">Compared to last year</span>
                <div className="metric-progress">
                  <div className="metric-progress-bar metric-progress-green" style={{width: '18%'}}></div>
                </div>
              </div>

              <div className="metric-item">
                <div className="metric-header">
                  <span className="metric-label">Treatment Completion</span>
                  <span className="metric-value-large">94%</span>
                </div>
                <span className="metric-sublabel">Successfully completed treatments</span>
                <div className="metric-progress">
                  <div className="metric-progress-bar metric-progress-blue" style={{width: '94%'}}></div>
                </div>
              </div>

              <div className="metric-item">
                <div className="metric-header">
                  <span className="metric-label">Patient Satisfaction</span>
                  <span className="metric-value-large">4.8/5</span>
                </div>
                <span className="metric-sublabel">Average rating from doctors</span>
                <div className="metric-progress">
                  <div className="metric-progress-bar metric-progress-cyan" style={{width: '96%'}}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Last QR Scan */}
          <div className="mini-card" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            minHeight: '280px'
          }}>
            {/* Decorative circles */}
            <div style={{position: 'absolute', width: '150px', height: '150px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', top: '-50px', right: '-50px'}}></div>
            <div style={{position: 'absolute', width: '100px', height: '100px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', bottom: '-30px', left: '-30px'}}></div>
            
            <div style={{position: 'relative', zIndex: 1}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
                <p className="mini-card-label" style={{color: 'rgba(255,255,255,0.95)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600', margin: 0}}>Last QR Scan</p>
                <div style={{background: 'rgba(255,255,255,0.25)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '600', backdropFilter: 'blur(10px)'}}>
                  <i className="fas fa-check-circle" style={{marginRight: '4px'}}></i>
                  Verified
                </div>
              </div>
              
              <div style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px'}}>
                <div style={{
                  width: '70px', 
                  height: '70px', 
                  background: 'rgba(255, 255, 255, 0.2)', 
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255,255,255,0.3)'
                }}>
                  <i className="fas fa-qrcode" style={{fontSize: '2rem'}}></i>
                </div>
                <div style={{flex: 1}}>
                  <h3 style={{fontSize: '2rem', fontWeight: '800', margin: '0 0 4px 0', letterSpacing: '-0.5px'}}>Today</h3>
                  <p style={{color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem', margin: 0, display: 'flex', alignItems: 'center', gap: '6px'}}>
                    <i className="fas fa-clock"></i>
                    13 minutes ago at 2:45 PM
                  </p>
                </div>
              </div>
              
              <div style={{background: 'rgba(255,255,255,0.15)', borderRadius: '12px', padding: '14px', backdropFilter: 'blur(10px)', marginBottom: '12px'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px'}}>
                  <i className="fas fa-map-marker-alt" style={{fontSize: '1rem', color: '#FFD700'}}></i>
                  <div style={{flex: 1}}>
                    <p style={{margin: 0, fontWeight: '600', fontSize: '0.95rem'}}>Pharmacy Visit</p>
                    <p style={{margin: '2px 0 0 0', fontSize: '0.8rem', color: 'rgba(255,255,255,0.85)'}}>El-Geish Medical Pharmacy</p>
                  </div>
                </div>
                <div style={{height: '1px', background: 'rgba(255,255,255,0.2)', margin: '10px 0'}}></div>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem'}}>
                  <span style={{color: 'rgba(255,255,255,0.85)'}}>
                    <i className="fas fa-pills" style={{marginRight: '6px'}}></i>
                    3 Medications picked up
                  </span>
                  <span style={{fontWeight: '600'}}>
                    <i className="fas fa-user-md" style={{marginRight: '4px'}}></i>
                    Dr. Hassan
                  </span>
                </div>
              </div>
              
              <button style={{
                width: '100%',
                padding: '10px',
                background: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '8px',
                color: 'white',
                fontWeight: '600',
                fontSize: '0.85rem',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s',
              }}
              onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
              onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
              >
                <i className="fas fa-history" style={{marginRight: '8px'}}></i>
                View Scan History
              </button>
            </div>
          </div>

          {/* Next Appointments */}
          <div className="mini-card" style={{
            border: '2px solid #E0E7FF', 
            background: 'white',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            minHeight: '280px'
          }}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
              <div>
                <p className="mini-card-label" style={{margin: '0 0 4px 0', color: '#6B7280', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Next Appointment</p>
                <p style={{margin: 0, fontSize: '0.8rem', color: '#9CA3AF'}}>
                  <i className="fas fa-calendar" style={{marginRight: '5px'}}></i>
                  In 6 days
                </p>
              </div>
              <span style={{
                background: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)', 
                color: '#1E40AF', 
                padding: '6px 12px', 
                borderRadius: '20px', 
                fontSize: '0.7rem', 
                fontWeight: '700',
                border: '1px solid #93C5FD',
                boxShadow: '0 2px 4px rgba(59, 130, 246, 0.1)'
              }}>
                <i className="fas fa-bell" style={{marginRight: '4px'}}></i>
                Upcoming
              </span>
            </div>
            
            <div style={{background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)', borderRadius: '12px', padding: '16px', marginBottom: '14px', border: '1px solid #BFDBFE'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px'}}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.4)'
                }}>
                  <div style={{textAlign: 'center'}}>
                    <div style={{fontSize: '1.4rem', fontWeight: '800', lineHeight: '1'}}>22</div>
                    <div style={{fontSize: '0.65rem', fontWeight: '600', opacity: '0.9'}}>FEB</div>
                  </div>
                </div>
                <div style={{flex: 1}}>
                  <h3 style={{margin: '0 0 4px 0', fontSize: '1.3rem', fontWeight: '700', color: '#1F2937'}}>February 22, 2026</h3>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#4B5563'}}>
                    <span style={{background: 'white', padding: '4px 8px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid #E5E7EB'}}>
                      <i className="fas fa-clock" style={{color: '#3B82F6'}}></i>
                      <strong>10:30 AM</strong>
                    </span>
                    <span style={{color: '#9CA3AF'}}>•</span>
                    <span>30 min</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{background: '#F9FAFB', borderRadius: '10px', padding: '14px', border: '1px solid #E5E7EB'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px'}}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  fontWeight: '700',
                  boxShadow: '0 2px 4px rgba(16, 185, 129, 0.3)',
                  border: '3px solid white'
                }}>SA</div>
                <div style={{flex: 1}}>
                  <p style={{margin: 0, fontWeight: '700', color: '#1F2937', fontSize: '1rem'}}>Dr. Sarah Ahmed</p>
                  <p style={{margin: '2px 0 0 0', color: '#6B7280', fontSize: '0.8rem'}}>
                    <i className="fas fa-stethoscope" style={{marginRight: '5px', color: '#10B981'}}></i>
                    Cardiology Specialist
                  </p>
                </div>
                <div style={{background: '#D1FAE5', color: '#065F46', padding: '4px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '600'}}>
                  <i className="fas fa-star" style={{marginRight: '3px'}}></i>
                  4.9
                </div>
              </div>
              
              <div style={{height: '1px', background: '#E5E7EB', margin: '10px 0'}}></div>
              
              <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                <p style={{margin: 0, color: '#6B7280', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <i className="fas fa-map-marker-alt" style={{color: '#EF4444', width: '14px'}}></i>
                  <span style={{flex: 1}}>Healix Medical Center - Building A, Floor 3, Room 305</span>
                </p>
                <p style={{margin: 0, color: '#6B7280', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <i className="fas fa-heart" style={{color: '#EC4899', width: '14px'}}></i>
                  <span style={{flex: 1}}>Annual Cardiac Checkup</span>
                </p>
              </div>
            </div>
            
            <div style={{display: 'flex', gap: '8px', marginTop: '14px'}}>
              <button style={{
                flex: 1,
                padding: '10px',
                background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontWeight: '600',
                fontSize: '0.8rem',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)',
                transition: 'all 0.3s'
              }}>
                <i className="fas fa-directions" style={{marginRight: '6px'}}></i>
                Get Directions
              </button>
              <button style={{
                flex: 1,
                padding: '10px',
                background: 'white',
                border: '2px solid #E5E7EB',
                borderRadius: '8px',
                color: '#6B7280',
                fontWeight: '600',
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}>
                <i className="fas fa-calendar-times" style={{marginRight: '6px'}}></i>
                Reschedule
              </button>
            </div>
          </div>

          {/* QR Card */}
          

          {/* Patient Card */}
          <div className="patient-card-wrapper">
            <PatientCard profileData={profileData} userData={user} />
          </div>

          {/* Medical Timeline */}
          <div className="timeline-preview-card">
            <div className="timeline-preview-header">
              <h3 className="timeline-preview-title">
                <i className="fas fa-calendar-check"></i>
                Recent Medical Visit
              </h3>
            </div>
            <p className="timeline-preview-subtitle">Your last appointment</p>
            <div className="timeline-preview-item">
              <div className="timeline-preview-row">
                <span className="timeline-preview-label">Doctor Name</span>
                <span className="timeline-preview-value">Dr. Mohamed Hassan</span>
              </div>
              <div className="timeline-preview-row">
                <span className="timeline-preview-label">Specialty</span>
                <span className="timeline-preview-value">General Medicine</span>
              </div>
              <div className="timeline-preview-row">
                <span className="timeline-preview-label">Date</span>
                <span className="timeline-preview-value">February 10, 2026</span>
              </div>
              <div className="timeline-preview-row">
                <span className="timeline-preview-label">Diagnosis</span>
                <span className="timeline-preview-value">Seasonal allergies - Prescribed antihistamine</span>
              </div>
            </div>
            <button className="view-history-btn">
              View Full Medical History
            </button>
          </div>

          {/* Health Insights */}
          <div className="health-insights-card">
            <div className="health-insights-header">
              <h3 className="health-insights-title">
                <i className="fas fa-lightbulb"></i>
                Health Insights
              </h3>
            </div>
            <p className="health-insights-subtitle">Smart recommendations for you</p>
            <div className="health-insights-list">
              <div className="health-insight-item">
                <div className="insight-indicator insight-indicator-green"></div>
                <div className="insight-content">
                  <p className="insight-text">Your BMI is within healthy range (22.8)</p>
                  <p className="insight-time">Updated today</p>
                </div>
              </div>
              <div className="health-insight-item">
                <div className="insight-indicator insight-indicator-blue"></div>
                <div className="insight-content">
                  <p className="insight-text">Medication refill due in 5 days</p>
                  <p className="insight-time">Reminder set</p>
                </div>
              </div>
              <div className="health-insight-item">
                <div className="insight-indicator insight-indicator-orange"></div>
                <div className="insight-content">
                  <p className="insight-text">Schedule annual checkup - Due next month</p>
                  <p className="insight-time">Action needed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Health Trends */}
          <div className="health-trends-card">
            <div className="health-trends-header">
              <h3 className="health-trends-title">
                <i className="fas fa-chart-line"></i>
                Health Trends Analysis
              </h3>
            </div>
            <p className="health-trends-subtitle">Year 2026 overview</p>
            <div className="health-trends-stats">
              <div className="health-trend-row">
                <span className="health-trend-label">Total Doctor Visits</span>
                <span className="health-trend-value">12 appointments</span>
              </div>
              <div className="health-trend-row">
                <span className="health-trend-label">Most Visited Specialty</span>
                <span className="health-trend-value health-trend-highlight">General Medicine</span>
              </div>
              <div className="health-trend-row">
                <span className="health-trend-label">Health Status</span>
                <span className="health-trend-value" style={{color: '#10B981'}}>Stable & Improving</span>
              </div>
            </div>
            <button className="view-analytics-btn">
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
            {loading ? (
              <div className="loading-appointments">
                <div className="spinner"></div>
                <p>Loading appointments...</p>
              </div>
            ) : patientRecords.length === 0 ? (
              <div className="no-appointments">
                <i className="fas fa-calendar-times"></i>
                <p>No appointments recorded yet</p>
                <p className="no-appointments-subtitle">Add your first appointment to get started</p>
              </div>
            ) : (
              patientRecords.slice(0, 6).map((record) => (
                <div key={record.id} className="appointment-card">
                  <div className="card-header-row">
                    <p className="appointment-name">
                      <i className="fas fa-user-md"></i>
                      {record.doctorName}
                    </p>
                    <button className="view-btn-icon" onClick={() => handleViewDetails(record)} title="View Details">
                      <i className="fas fa-eye"></i>
                    </button>
                  </div>
                  <p className="appointment-date">
                    <i className="fas fa-calendar"></i>
                    {new Date(record.date).toLocaleDateString('en-US', { 
                      weekday: 'long',
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </p>
                  <div className="appointment-details">
                    <span className="appointment-type">
                      <i className="fas fa-stethoscope"></i>
                      {record.specialty}
                    </span>
                    <span className="appointment-place">
                      <i className={`fas fa-${record.place === 'Hospital' ? 'hospital' : 'clinic-medical'}`}></i>
                      {record.place}
                    </span>
                  </div>
                  <div className="appointment-disease">
                    <i className="fas fa-notes-medical"></i>
                    {record.diseaseName}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="appointments-footer">
            <i className="fas fa-calendar-check"></i>
            {loading ? 'Loading...' : `${patientRecords.length} total appointment${patientRecords.length !== 1 ? 's' : ''}`}
            <span className="dot-separator"></span>
            <button className="view-calendar-btn" onClick={() => navigate('/patient-records')}>view all records</button>
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
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)} disabled={submitLoading}>
                  <i className="fas fa-times-circle"></i>
                  Cancel
                </button>
                <button type="submit" className="submit-btn" disabled={submitLoading}>
                  {submitLoading ? (
                    <>
                      <div className="btn-spinner"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save"></i>
                      Save Appointment
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {showDetailsModal && selectedRecord && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-content details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <i className="fas fa-file-medical"></i>
                Medical Record Details
              </h2>
              <button className="modal-close" onClick={() => setShowDetailsModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="modal-body">
              <div className="detail-section">
                <h3>Doctor Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Doctor Name:</span>
                    <span className="detail-value">{selectedRecord.doctorName}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Specialty:</span>
                    <span className="detail-value">
                      <span className="specialty-badge">{selectedRecord.specialty}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Appointment Details</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Date:</span>
                    <span className="detail-value">
                      {new Date(selectedRecord.date).toLocaleDateString('en-US', { 
                        weekday: 'long',
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Place:</span>
                    <span className="detail-value">
                      <span className={`place-badge ${selectedRecord.place?.toLowerCase()}`}>
                        <i className={`fas fa-${selectedRecord.place === 'Hospital' ? 'hospital' : 'clinic-medical'}`}></i>
                        {selectedRecord.place}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Medical Information</h3>
                <div className="detail-grid">
                  <div className="detail-item full-width">
                    <span className="detail-label">Disease:</span>
                    <span className="detail-value">{selectedRecord.diseaseName}</span>
                  </div>
                  <div className="detail-item full-width">
                    <span className="detail-label">Diagnosis:</span>
                    <span className="detail-value diagnosis-text">{selectedRecord.diagnosis}</span>
                  </div>
                </div>
              </div>

              {selectedRecord.medications && selectedRecord.medications.length > 0 && (
                <div className="detail-section">
                  <h3>Prescribed Medications</h3>
                  <div className="medications-list">
                    {selectedRecord.medications.map((med, index) => (
                      <div key={index} className="medication-item">
                        <i className="fas fa-pills"></i>
                        <div className="medication-info">
                          <strong>{med.name || 'Medication ' + (index + 1)}</strong>
                          {med.dosage && <span className="dosage">Dosage: {med.dosage}</span>}
                          {med.duration && <span className="duration">Duration: {med.duration}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="modal-btn secondary" onClick={() => setShowDetailsModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI ChatBot */}
      <ChatBot />
    </div>
  );
}

export default Dashboard;
