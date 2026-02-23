import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'react-qr-code';
import html2canvas from 'html2canvas';
import './PatientCard.css';

function PatientCard({ profileData, userData }) {
  const [cardData, setCardData] = useState(null);
  const cardRef = useRef(null);

  useEffect(() => {
    if (profileData && userData) {
      // Prepare card data
      const data = {
        name: userData.name || profileData.name || 'Patient Name',
        age: userData.age || profileData.age || calculateAge(profileData.date_of_birth) || '--',
        city: 'Mansoura',
        patientId: profileData.patient_id || userData.patient_id || generatePatientId(userData.id),
        gender: 'Male',
        allergies: formatAllergies(profileData.drug_allergies),
        medicines: formatMedicines(profileData.one_time_medications),
        healthStatus: formatHealthStatus(profileData.chronic_diseases),
        height: profileData.height || '--',
        weight: profileData.weight || '--',
        bloodType: profileData.blood_group || '--'
      };
      setCardData(data);
    }
  }, [profileData, userData]);

  // Generate temporary patient ID (will be replaced with backend ID)
  const generatePatientId = (userId) => {
    if (!userId) return 'UF0000';
    return `UF${userId.toString().padStart(4, '0')}`;
  };

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Format allergies for display
  const formatAllergies = (allergies) => {
    if (!allergies || allergies.length === 0) return '--';
    if (Array.isArray(allergies)) {
      return allergies.join(', ');
    }
    return allergies;
  };

  // Format medicines for display
  const formatMedicines = (medicines) => {
    if (!medicines || medicines.length === 0) return '--';
    if (Array.isArray(medicines)) {
      return medicines.map(med => med.name || med).join(', ');
    }
    return medicines;
  };

  // Format health status for display
  const formatHealthStatus = (diseases) => {
    if (!diseases || diseases.length === 0) return '--';
    if (Array.isArray(diseases)) {
      return diseases.map(disease => disease.name || disease).join(', ');
    }
    return diseases;
  };

  // Generate QR Code data (URL to public patient records API)
  const generateQRData = () => {
    if (!cardData) return '';
    // Use production API URL if available, otherwise localhost
    const apiUrl = process.env.REACT_APP_API_URL || 'http://34.107.46.116';
    return `${apiUrl}/api/public/patient/${cardData.patientId}/records`;
  };

  // Download card as image
  const handleDownloadCard = async () => {
    if (!cardRef.current) return;
    
    try {
      const element = cardRef.current;
      const originalOverflow = element.style.overflow;
      
      // Temporarily remove overflow hidden to capture full content
      element.style.overflow = 'visible';
      
      // Wait a moment to ensure all elements are rendered
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: null,
        logging: false,
        useCORS: true,
        allowTaint: true,
        imageTimeout: 0,
        scrollY: -window.scrollY,
        scrollX: -window.scrollX,
        windowHeight: element.scrollHeight + 100
      });
      
      // Restore original overflow
      element.style.overflow = originalOverflow;
      
      // Convert to blob for better quality
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `Healix_Medical_Card_${cardData.patientId}_${new Date().toISOString().split('T')[0]}.png`;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 'image/png', 1.0);
    } catch (error) {
      console.error('Error downloading card:', error);
      alert('Failed to download card. Please try again.');
    }
  };

  if (!cardData) {
    return (
      <div className="patient-card-loading">
        <i className="fas fa-spinner fa-spin"></i>
        <p>Loading card data...</p>
      </div>
    );
  }

  return (
    <div className="patient-card-container">
      {/* Medical ID Card */}
      <div className="medical-id-card" ref={cardRef}>
        {/* Card Background Pattern */}
        <div className="card-background-pattern"></div>
        
        {/* Card Header */}
        <div className="card-header">
          <div className="card-logo">
            <div className="logo-icon">
              <i className="fas fa-heartbeat"></i>
            </div>
            <div className="logo-text">
              <h1 className="brand-name">HEALIX</h1>
              <span className="brand-tagline">Medical ID</span>
            </div>
          </div>
          
          <div className="qr-code-section-main">
            <QRCode 
              value={generateQRData()} 
              size={100}
              level="H"
              bgColor="#ffffff"
              fgColor="#1e293b"
            />
          </div>
        </div>

        {/* Patient Information */}
        <div className="card-main-info">
          <div className="patient-primary-info">
            <div className="info-label-small">PATIENT NAME</div>
            <div className="patient-name-large">{cardData.name}</div>
          </div>

          <div className="patient-secondary-row">
            <div className="info-block">
              <div className="info-label-small">ID NUMBER</div>
              <div className="info-value-medium">{cardData.patientId}</div>
            </div>
            <div className="info-block">
              <div className="info-label-small">BLOOD TYPE</div>
              <div className="info-value-medium blood-type">{cardData.bloodType}</div>
            </div>
            <div className="info-block">
              <div className="info-label-small">AGE</div>
              <div className="info-value-medium">{cardData.age} Y</div>
            </div>
          </div>
        </div>

        {/* Medical Information Grid */}
        <div className="card-info-grid">
          <div className="info-item">
            <div className="info-icon vitals">
              <i className="fas fa-ruler-vertical"></i>
            </div>
            <div className="info-text">
              <span className="info-label-small">HEIGHT</span>
              <span className="info-data">{cardData.height} cm</span>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon vitals">
              <i className="fas fa-weight"></i>
            </div>
            <div className="info-text">
              <span className="info-label-small">WEIGHT</span>
              <span className="info-data">{cardData.weight} kg</span>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon gender">
              <i className="fas fa-venus-mars"></i>
            </div>
            <div className="info-text">
              <span className="info-label-small">GENDER</span>
              <span className="info-data">{cardData.gender}</span>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon location">
              <i className="fas fa-map-marker-alt"></i>
            </div>
            <div className="info-text">
              <span className="info-label-small">CITY</span>
              <span className="info-data">{cardData.city}</span>
            </div>
          </div>
        </div>

        {/* Critical Information */}
        <div className="card-critical-info">
          <div className="critical-badge">
            <i className="fas fa-exclamation-triangle"></i>
            <span>CRITICAL INFORMATION</span>
          </div>
          <div className="critical-data">
            <div className="critical-item">
              <i className="fas fa-allergies"></i>
              <span className="critical-label">Allergies:</span>
              <span className="critical-value">{cardData.allergies}</span>
            </div>
            {cardData.healthStatus !== '--' && (
              <div className="critical-item">
                <i className="fas fa-notes-medical"></i>
                <span className="critical-label">Chronic:</span>
                <span className="critical-value">{cardData.healthStatus}</span>
              </div>
            )}
            {cardData.medicines !== '--' && (
              <div className="critical-item">
                <i className="fas fa-pills"></i>
                <span className="critical-label">Medications:</span>
                <span className="critical-value">{cardData.medicines}</span>
              </div>
            )}
          </div>
        </div>

        {/* Card Footer */}
        <div className="card-footer">
          <div className="footer-item">
            <div className="info-label-tiny">ISSUED</div>
            <div className="info-value-small">{new Date().toLocaleDateString('en-US', { month: '2-digit', year: 'numeric' })}</div>
          </div>
          <div className="footer-item">
            <div className="info-label-tiny">EMERGENCY</div>
            <div className="info-value-small">{profileData?.emergency_contact || '--'}</div>
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="card-actions">
        <button className="card-action-btn download-btn" onClick={handleDownloadCard}>
          <i className="fas fa-download"></i>
          Download Card
        </button>
        <button className="card-action-btn share-btn" onClick={() => {
          navigator.clipboard.writeText(generateQRData());
          alert('Patient ID link copied to clipboard!');
        }}>
          <i className="fas fa-share-alt"></i>
          Share Patient ID
        </button>
      </div>
    </div>
  );
}

export default PatientCard;
