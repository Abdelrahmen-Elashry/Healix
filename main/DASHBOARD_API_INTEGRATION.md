# Dashboard API Integration Guide

## ✅ Backend Setup Complete

تم إنشاء كل شيء في Laravel:
- ✅ جدول `appointments` في Database
- ✅ Model: `Appointment`
- ✅ Controller: `AppointmentController`
- ✅ Routes في `api.php`

---

## 📡 API Endpoints

### Base URL
```
http://127.0.0.1:8000/api
```

### 1. Get All Appointments (GET)
```
GET /appointments
Headers: Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "Appointments retrieved successfully",
  "data": [
    {
      "id": 1,
      "doctor_name": "Dr. Ahmed",
      "doctor_specialty": "Cardiology",
      "appointment_date": "2026-02-20",
      "disease_name": "Hypertension",
      "diagnosis": "High blood pressure",
      "examination_place": "Clinic",
      "medications": [
        {
          "name": "Aspirin",
          "duration": "2 weeks",
          "dosage": "1 tablet daily"
        }
      ],
      "attachments": [],
      "created_at": "2026-02-16T..."
    }
  ]
}
```

### 2. Create Appointment (POST)
```
POST /appointments
Headers: 
  Authorization: Bearer {token}
  Content-Type: application/json
```

**Request Body:**
```json
{
  "doctor_name": "Dr. Ahmed",
  "doctor_specialty": "Cardiology",
  "appointment_date": "2026-02-20",
  "disease_name": "Hypertension",
  "diagnosis": "High blood pressure",
  "examination_place": "Clinic",
  "medications": [
    {
      "name": "Aspirin",
      "duration": "2 weeks",
      "dosage": "1 tablet daily"
    }
  ],
  "attachments": []
}
```

**Response:**
```json
{
  "success": true,
  "message": "Appointment created successfully",
  "data": { /* appointment object */ }
}
```

### 3. Delete Appointment (DELETE)
```
DELETE /appointments/{id}
Headers: Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "Appointment deleted successfully"
}
```

---

## 🔧 React Dashboard - Updated Code

### في أول ملف Dashboard.js، استبدل الكود ده:

```javascript
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
    fetchAppointments();
  }, []);

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
        // Token expired or invalid
        localStorage.clear();
        navigate('/signin');
      } else if (error.response?.status === 403) {
        alert('Please verify your email to access appointments');
      } else {
        alert('Failed to load appointments. Please try again.');
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
        attachments: selectedFiles.map(file => file.name) // For now, just store filenames
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
        // Validation errors
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat().join('\\n');
        alert('Validation Error:\\n' + errorMessages);
      } else if (error.response?.status === 401) {
        alert('Session expired. Please login again.');
        localStorage.clear();
        navigate('/signin');
      } else if (error.response?.status === 403) {
        alert('Please verify your email to create appointments');
      } else {
        alert('Failed to save appointment. Please try again.');
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
        // Refresh appointments list
        await fetchAppointments();
        alert('Record deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting appointment:', error);
      alert('Failed to delete record. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Rest of your component JSX remains the same...
  return (
    <div className="dashboard-container">
      {/* Show loading indicator */}
      {loading && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 9999,
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '20px 40px',
          borderRadius: '10px'
        }}>
          <i className="fas fa-spinner fa-spin"></i> Loading...
        </div>
      )}
      
      {/* Your existing JSX code here... */}
    </div>
  );
}

export default Dashboard;
```

---

## 🎯 Changes Summary

### في الكود الجديد:
1. ✅ **axios configuration** - بيستخدم الـ token في كل request
2. ✅ **useEffect** - بيجيب الـ appointments لما الصفحة تفتح
3. ✅ **fetchAppointments()** - function تجيب البيانات من API
4. ✅ **handleSubmit()** - بيحفظ appointment في database
5. ✅ **deleteRecord()** - بيحذف appointment من database
6. ✅ **Error handling** - بيتعامل مع auth errors و validation
7. ✅ **Loading state** - بيظهر loader أثناء التحميل

### الـ State Management:
```javascript
const [patientRecords, setPatientRecords] = useState([]); // Empty initially
const [loading, setLoading] = useState(false); // Loading indicator
```

---

## 🔐 Security Notes

1. **Token verification** - كل request محتاج token
2. **Email verification** - لازم email verified عشان تنشئ appointments
3. **User type check** - بس الـ patients يقدروا يستخدموا الـ API
4. **Authorization** - كل user يشوف appointments بتاعته بس

---

## 🧪 Testing Steps

### في Postman أو Thunder Client:

1. **Login:**
```
POST http://127.0.0.1:8000/api/patient/login
Body: {
  "email": "test@example.com",
  "password": "password123"
}
```

2. **Create Appointment:**
```
POST http://127.0.0.1:8000/api/appointments
Headers: Authorization: Bearer {your_token}
Body: {
  "doctor_name": "Dr. Ahmed",
  "doctor_specialty": "Cardiology",
  "appointment_date": "2026-02-20",
  "disease_name": "Hypertension",
  "diagnosis": "High blood pressure",
  "examination_place": "Clinic",
  "medications": [
    {
      "name": "Aspirin",
      "duration": "2 weeks",
      "dosage": "1 tablet daily"
    }
  ]
}
```

3. **Get Appointments:**
```
GET http://127.0.0.1:8000/api/appointments
Headers: Authorization: Bearer {your_token}
```

---

## 📦 Database Structure

```sql
CREATE TABLE appointments (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  doctor_name VARCHAR(255) NOT NULL,
  doctor_specialty VARCHAR(255) NOT NULL,
  appointment_date DATE NOT NULL,
  disease_name VARCHAR(255) NOT NULL,
  diagnosis TEXT NOT NULL,
  examination_place VARCHAR(255) NOT NULL,
  medications JSON NULL,
  attachments JSON NULL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## 🚀 Next Steps

1. **Install axios** في React project:
```bash
npm install axios
```

2. **Update Dashboard.js** بالكود اللي فوق

3. **Test** الـ functionality

4. **(Optional)** إضافة file upload للـ attachments

---

## 💡 Tips

- الـ medications و attachments اختيارية
- الـ appointment_date لازم يكون بصيغة `YYYY-MM-DD`
- الـ API بترجع البيانات بـ `snake_case` (doctor_name)
- React بيستخدم `camelCase` (doctorName)
- الـ transformation في `fetchAppointments()` بيحول البيانات

---

## 🐛 Common Issues

### Issue 1: CORS Error
**Solution:** تأكد من إعدادات CORS في `config/cors.php`

### Issue 2: 401 Unauthorized
**Solution:** تأكد من وجود token في localStorage وإنه صالح

### Issue 3: 403 Email Not Verified
**Solution:** verify email من الـ link اللي في storage/logs/laravel.log

### Issue 4: 422 Validation Error
**Solution:** تأكد من كل الحقول المطلوبة موجودة وصحيحة

---

✅ **All Done! المشروع جاهز للاستخدام!**
