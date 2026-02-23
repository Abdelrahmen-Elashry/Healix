import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { showNotification } from './NotificationContainer';
import './PatientRecords.css';

function PatientRecords() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [patientRecords, setPatientRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

  // Fetch appointments from API
  useEffect(() => {
    fetchAppointments();
  }, []);

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
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const appointments = data.data || data.appointments || data || [];
        
        const formattedRecords = appointments.map(appointment => {
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
            medications: medications
          };
        });
        setPatientRecords(formattedRecords);
      } else {
        console.error('Failed to fetch appointments');
        setPatientRecords([]);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      showNotification('Error loading patient records', 'error');
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

  const handleExport = () => {
    // تصدير البيانات كـ CSV
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
    link.setAttribute('download', `patient_records_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setShowDetailsModal(true);
  };

  const handleDeleteClick = (record) => {
    setRecordToDelete(record);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!recordToDelete) return;

    const token = localStorage.getItem('token');
    
    if (!token) {
      showNotification('Please login first', 'error');
      setShowDeleteModal(false);
      return;
    }

    try {
      const response = await fetch(`http://34.107.46.116/api/appointments/${recordToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        await fetchAppointments();
        showNotification('Record deleted successfully!', 'success');
        setShowDeleteModal(false);
        setRecordToDelete(null);
      } else {
        const errorData = await response.json().catch(() => ({}));
        showNotification('Failed to delete record: ' + (errorData.message || 'Unknown error'), 'error');
      }
    } catch (error) {
      console.error('Error deleting record:', error);
      showNotification('Error deleting record. Please try again.', 'error');
    }
  };

  // Old deleteRecord function removed - now using confirmDelete with modal confirmation

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="patient-records-container">
      <div className="patient-records-wrapper">
        {/* Navbar */}
        <nav className="dashboard-navbar">
          <div className="navbar-content">
            <div className="navbar-brand" style={{cursor: 'pointer'}} onClick={() => navigate('/dashboard')}>
              <i className="fas fa-clipboard-list"></i>
              <span className="brand-name">
                Patient<span className="brand-highlight">Records</span>
              </span>
            </div>

            <div className="navbar-right">
              <button className="back-btn-nav" onClick={() => navigate('/dashboard')}>
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

        {/* Header Section */}
        <div className="records-header-section">
          <div className="header-content">
            <div className="header-text">
              <h1 className="page-title">Complete Patient Records</h1>
              <p className="page-subtitle">
                <i className="fas fa-database"></i>
                All medical records and appointments history
              </p>
            </div>
            <div className="header-actions">
              <button className="print-btn" onClick={handlePrint}>
                <i className="fas fa-print"></i>
                Print
              </button>
              <button className="export-csv-btn" onClick={handleExport}>
                <i className="fas fa-download"></i>
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card blue">
            <div className="stat-icon">
              <i className="fas fa-file-medical"></i>
            </div>
            <div className="stat-content">
              <span className="stat-value">{patientRecords.length}</span>
              <span className="stat-label">Total Records</span>
            </div>
          </div>
          
          <div className="stat-card green">
            <div className="stat-icon">
              <i className="fas fa-user-md"></i>
            </div>
            <div className="stat-content">
              <span className="stat-value">{new Set(patientRecords.map(r => r.doctorName)).size}</span>
              <span className="stat-label">Doctors Visited</span>
            </div>
          </div>
          
          <div className="stat-card purple">
            <div className="stat-icon">
              <i className="fas fa-calendar-check"></i>
            </div>
            <div className="stat-content">
              <span className="stat-value">{patientRecords.length}</span>
              <span className="stat-label">Appointments</span>
            </div>
          </div>
          
          <div className="stat-card orange">
            <div className="stat-icon">
              <i className="fas fa-clock"></i>
            </div>
            <div className="stat-content">
              <span className="stat-value">
                {patientRecords[0]?.date 
                  ? new Date(patientRecords[0].date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })
                  : 'N/A'}
              </span>
              <span className="stat-label">Last Visit</span>
            </div>
          </div>
        </div>

        {/* Records Table */}
        <div className="records-table-section">
          <div className="table-header">
            <h2 className="table-title">
              <i className="fas fa-list"></i>
              Medical Records Database
            </h2>
            <div className="table-info">
              <span className="records-count">{patientRecords.length} Records</span>
              <span className="last-updated">
                <i className="fas fa-sync-alt"></i>
                Updated: {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="table-container">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading patient records...</p>
              </div>
            ) : patientRecords.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-inbox"></i>
                <p>No patient records found</p>
                <span>Visit the Dashboard to add your first appointment</span>
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
                  {patientRecords.map((record) => (
                    <tr key={record.id}>
                      <td className="doctor-name">
                        <div className="doctor-cell">
                          <div className="doctor-avatar">
                            {record.doctorName.split(' ')[1]?.charAt(0) || record.doctorName.charAt(0) || 'D'}
                          </div>
                          <span>{record.doctorName}</span>
                        </div>
                      </td>
                      <td>
                        <span className="specialty-badge">{record.specialty}</span>
                      </td>
                      <td>{new Date(record.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}</td>
                      <td>{record.diseaseName}</td>
                      <td className="diagnosis-cell">{record.diagnosis}</td>
                      <td>
                        <span className={`place-badge ${record.place?.toLowerCase()}`}>
                          <i className={`fas fa-${record.place === 'Hospital' ? 'hospital' : 'clinic-medical'}`}></i>
                          {record.place}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <button 
                          className="view-btn-icon"
                          onClick={() => handleViewDetails(record)}
                          title="View details"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button 
                          className="delete-btn-icon"
                          onClick={() => handleDeleteClick(record)}
                          title="Delete record"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="table-footer">
            <div className="footer-info">
              <i className="fas fa-info-circle"></i>
              Showing all {patientRecords.length} records
            </div>
            <div className="footer-date">
              Generated on {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
      </div>

      {/* View Details Modal */}
      {showDetailsModal && selectedRecord && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && recordToDelete && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header delete-header">
              <h2>
                <i className="fas fa-exclamation-triangle"></i>
                Confirm Delete
              </h2>
              <button className="modal-close" onClick={() => setShowDeleteModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="modal-body">
              <p className="delete-warning">
                Are you sure you want to delete this medical record? This action cannot be undone.
              </p>
              <div className="delete-record-info">
                <div className="delete-info-item">
                  <strong>Doctor:</strong> {recordToDelete.doctorName}
                </div>
                <div className="delete-info-item">
                  <strong>Date:</strong> {new Date(recordToDelete.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
                <div className="delete-info-item">
                  <strong>Disease:</strong> {recordToDelete.diseaseName}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="modal-btn secondary" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="modal-btn danger" onClick={confirmDelete}>
                <i className="fas fa-trash-alt"></i>
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientRecords;
