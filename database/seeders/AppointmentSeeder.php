<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Appointment;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;

class AppointmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create two verified users without profiles
        User::create([
            'first_name' => 'Mohamed',
            'last_name' => 'Ahmed',
            'age' => 28,
            'email' => 'mohamed.verified@healx.com',
            'password' => Hash::make('password123'),
            'type' => 'patient',
            'email_verified_at' => now(),
        ]);

        User::create([
            'first_name' => 'Ahmed',
            'last_name' => 'Ali',
            'age' => 32,
            'email' => 'fatima.verified@healx.com',
            'password' => Hash::make('password123'),
            'type' => 'patient',
            'email_verified_at' => now(),
        ]);

        // Appointments seeding commented out for now
          
        $userId = 1;

        $appointments = [
            [
                'user_id' => $userId,
                'doctor_name' => 'Dr. Ahmed Mahmoud',
                'doctor_specialty' => 'Internal Medicine',
                'appointment_date' => Carbon::now()->subDays(90)->format('Y-m-d'),
                'disease_name' => 'Hypertension',
                'diagnosis' => 'Slightly elevated blood pressure, requires lifestyle modifications and monitoring',
                'examination_place' => 'Nile Medical Clinic',
                'medications' => json_encode([
                    ['name' => 'Concor 5mg', 'dosage' => 'One tablet daily', 'duration' => '30 days'],
                    ['name' => 'Aspirin 100mg', 'dosage' => 'One tablet evening', 'duration' => '30 days']
                ]),
                'attachments' => json_encode([
                    ['name' => 'blood_pressure_report.pdf', 'url' => '/storage/attachments/file1.pdf'],
                ])
            ],
            [
                'user_id' => $userId,
                'doctor_name' => 'Dr. Sarah Abdullah',
                'doctor_specialty' => 'Cardiology',
                'appointment_date' => Carbon::now()->subDays(75)->format('Y-m-d'),
                'disease_name' => 'Cardiac Follow-up',
                'diagnosis' => 'Heart is healthy, requires routine follow-up every 6 months',
                'examination_place' => 'Al-Salam International Hospital',
                'medications' => json_encode([
                    ['name' => 'Omega 3', 'dosage' => 'One capsule daily', 'duration' => '90 days']
                ]),
                'attachments' => json_encode([
                    ['name' => 'ecg_report.pdf', 'url' => '/storage/attachments/file2.pdf'],
                    ['name' => 'echo_report.pdf', 'url' => '/storage/attachments/file3.pdf']
                ])
            ],
                [
                    'user_id' => $userId,
                    'doctor_name' => 'Dr. Omar El-Sayed',
                    'doctor_specialty' => 'Endocrinology',
                    'appointment_date' => Carbon::now()->subDays(60)->format('Y-m-d'),
                    'disease_name' => 'Diabetes Mellitus Type 2',
                    'diagnosis' => 'Blood sugar levels are elevated, requires medication and lifestyle changes',
                    'examination_place' => 'Cairo University Hospital',
                    'medications' => json_encode([
                        ['name' => 'Metformin 500mg', 'dosage' => 'One tablet twice daily', 'duration' => '60 days']
                    ]),
                    'attachments' => json_encode([
                        ['name' => 'blood_sugar_report.pdf', 'url' => '/storage/attachments/file4.pdf'],
                    ])
                ],
                [
                    'user_id' => $userId,
                    'doctor_name' => 'Dr. Layla Hassan',
                    'doctor_specialty' => 'Neurology',
                    'appointment_date' => Carbon::now()->subDays(30)->format('Y-m-d'),
                    'disease_name' => 'Migraine',
                    'diagnosis' => 'Frequent migraines, requires preventive medication and lifestyle adjustments',
                    'examination_place' => 'Al-Noor Medical Center',
                    'medications' => json_encode([
                        ['name' => 'Propranolol 40mg', 'dosage' => 'One tablet daily', 'duration' => '30 days']
                    ]),
                    'attachments' => json_encode([
                        ['name' => 'brain_mri_report.pdf', 'url' => '/storage/attachments/file5.pdf'],
                    ])
                ],
                [
                    'user_id' => $userId,
                    'doctor_name' => 'Dr. Mohamed Hassan',
                    'doctor_specialty' => 'Orthopedics',
                    'appointment_date' => Carbon::now()->subDays(50)->format('Y-m-d'),
                    'disease_name' => 'Knee Pain',
                    'diagnosis' => 'Mild inflammation in right knee cartilage, requires physical therapy',
                    'examination_place' => 'Specialized Orthopedic Clinic',
                    'medications' => json_encode([
                        ['name' => 'Voltaren 50mg', 'dosage' => 'One tablet 3 times daily', 'duration' => '10 days'],
                        ['name' => 'Glucosamine', 'dosage' => 'One capsule twice daily', 'duration' => '90 days']
                    ]),
                    'attachments' => json_encode([
                        ['name' => 'knee_xray.pdf', 'url' => '/storage/attachments/file6.pdf']
                    ])
                ],
                [
                    'user_id' => $userId,
                    'doctor_name' => 'Dr. Fatima Ali',
                    'doctor_specialty' => 'ENT',
                    'appointment_date' => Carbon::now()->subDays(45)->format('Y-m-d'),
                    'disease_name' => 'Sinusitis',
                    'diagnosis' => 'Acute sinusitis with severe congestion',
                    'examination_place' => 'ENT Medical Center',
                    'medications' => json_encode([
                        ['name' => 'Amoxicillin 1000mg', 'dosage' => 'One tablet twice daily', 'duration' => '7 days'],
                        ['name' => 'Nasonex Spray', 'dosage' => 'One spray in each nostril', 'duration' => '14 days']
                    ]),
                    'attachments' => null
                ],
                [
                    'user_id' => $userId,
                    'doctor_name' => 'Dr. Khaled Ibrahim',
                    'doctor_specialty' => 'Dermatology',
                    'appointment_date' => Carbon::now()->subDays(40)->format('Y-m-d'),
                    'disease_name' => 'Skin Allergy',
                    'diagnosis' => 'Mild eczema caused by dry skin',
                    'examination_place' => 'Specialized Dermatology Clinic',
                    'medications' => json_encode([
                        ['name' => 'Hydrocortisone Cream', 'dosage' => 'Apply twice daily', 'duration' => '14 days'],
                        ['name' => 'Cetaphil Moisturizer', 'dosage' => 'As needed', 'duration' => '30 days']
                    ]),
                    'attachments' => null
                ],
                [
                    'user_id' => $userId,
                    'doctor_name' => 'Dr. Nora Al-Sayed',
                    'doctor_specialty' => 'Gastroenterology',
                    'appointment_date' => Carbon::now()->subDays(35)->format('Y-m-d'),
                    'disease_name' => 'GERD',
                    'diagnosis' => 'Mild acid reflux, requires treatment and dietary modifications',
                    'examination_place' => 'Gastroenterology Center',
                    'medications' => json_encode([
                        ['name' => 'Omeprazole 20mg', 'dosage' => 'One capsule morning', 'duration' => '30 days'],
                        ['name' => 'Gaviscon', 'dosage' => 'One spoon as needed', 'duration' => '30 days']
                    ]),
                    'attachments' => null
                ],
                [
                    'user_id' => $userId,
                    'doctor_name' => 'Dr. Yasser Ahmed',
                    'doctor_specialty' => 'Dentistry',
                    'appointment_date' => Carbon::now()->subDays(28)->format('Y-m-d'),
                    'disease_name' => 'Dental Cavity',
                    'diagnosis' => 'Cavity in upper right molar, filling completed',
                    'examination_place' => 'Advanced Dental Clinic',
                    'medications' => json_encode([
                        ['name' => 'Chlorhexidine Mouthwash', 'dosage' => 'Twice daily', 'duration' => '7 days'],
                        ['name' => 'Paracetamol 500mg', 'dosage' => 'As needed for pain', 'duration' => '3 days']
                    ]),
                    'attachments' => null
                ],
                [
                    'user_id' => $userId,
                    'doctor_name' => 'Dr. Hoda Othman',
                    'doctor_specialty' => 'Psychiatry',
                    'appointment_date' => Carbon::now()->subDays(25)->format('Y-m-d'),
                    'disease_name' => 'Anxiety & Sleep Disorder',
                    'diagnosis' => 'Mild anxiety with sleep disturbance, requires behavioral therapy sessions',
                    'examination_place' => 'Mental Health Center',
                    'medications' => json_encode([
                        ['name' => 'Citalopram 10mg', 'dosage' => 'One tablet morning', 'duration' => '30 days'],
                        ['name' => 'Melatonin', 'dosage' => 'One tablet before sleep', 'duration' => '30 days']
                    ]),
                    'attachments' => null
                ],
                [
                    'user_id' => $userId,
                    'doctor_name' => 'Dr. Omar Hussein',
                    'doctor_specialty' => 'Urology',
                    'appointment_date' => Carbon::now()->subDays(20)->format('Y-m-d'),
                    'disease_name' => 'Urinary Tract Infection',
                    'diagnosis' => 'Mild UTI requiring antibiotic treatment',
                    'examination_place' => 'Urology Clinic',
                    'medications' => json_encode([
                        ['name' => 'Ciprofloxacin 500mg', 'dosage' => 'One tablet twice daily', 'duration' => '7 days'],
                        ['name' => 'Urosulfin', 'dosage' => 'One tablet 3 times daily', 'duration' => '5 days']
                    ]),
                    'attachments' => json_encode([
                        ['name' => 'urine_analysis.pdf', 'url' => '/storage/attachments/file7.pdf']
                    ])
                ],
                [
                    'user_id' => $userId,
                    'doctor_name' => 'Dr. Rania Hassan',
                    'doctor_specialty' => 'Rheumatology',
                    'appointment_date' => Carbon::now()->subDays(15)->format('Y-m-d'),
                    'disease_name' => 'Joint Pain',
                    'diagnosis' => 'Mild arthritis, requires anti-inflammatory medications',
                    'examination_place' => 'Rheumatology Clinic',
                    'medications' => json_encode([
                        ['name' => 'Celebrex 200mg', 'dosage' => 'One capsule twice daily', 'duration' => '14 days'],
                        ['name' => 'Calcium & Vitamin D', 'dosage' => 'One tablet daily', 'duration' => '90 days']
                    ]),
                    'attachments' => json_encode([
                        ['name' => 'rheumatoid_test.pdf', 'url' => '/storage/attachments/file8.pdf']
                    ])
                ],
                [
                    'user_id' => $userId,
                    'doctor_name' => 'Dr. Hossam Fahmy',
                    'doctor_specialty' => 'Pulmonology',
                    'appointment_date' => Carbon::now()->subDays(12)->format('Y-m-d'),
                    'disease_name' => 'Chest Allergy',
                    'diagnosis' => 'Seasonal chest allergy, requires bronchodilator inhaler',
                    'examination_place' => 'Chest Diseases Center',
                    'medications' => json_encode([
                        ['name' => 'Ventolin Inhaler', 'dosage' => 'One puff as needed', 'duration' => '30 days'],
                        ['name' => 'Cetirizine 10mg', 'dosage' => 'One tablet evening', 'duration' => '30 days']
                    ]),
                    'attachments' => json_encode([
                        ['name' => 'pulmonary_function_test.pdf', 'url' => '/storage/attachments/file9.pdf']
                    ])
                ],
                [
                    'user_id' => $userId,
                    'doctor_name' => 'Dr. Ahmed Reda',
                    'doctor_specialty' => 'Clinical Nutrition',
                    'appointment_date' => Carbon::now()->subDays(10)->format('Y-m-d'),
                    'disease_name' => 'Overweight',
                    'diagnosis' => 'Moderate weight gain, requires balanced diet and regular exercise',
                    'examination_place' => 'Clinical Nutrition Center',
                    'medications' => json_encode([
                        ['name' => 'Multivitamin Supplement', 'dosage' => 'One tablet daily', 'duration' => '90 days']
                    ]),
                    'attachments' => json_encode([
                        ['name' => 'diet_plan.pdf', 'url' => '/storage/attachments/file10.pdf']
                    ])
                ],
                [
                    'user_id' => $userId,
                    'doctor_name' => 'Dr. Samira Fathy',
                    'doctor_specialty' => 'Family Medicine',
                    'appointment_date' => Carbon::now()->subDays(5)->format('Y-m-d'),
                    'disease_name' => 'Common Cold',
                    'diagnosis' => 'Common cold with sore throat',
                    'examination_place' => 'Family Medicine Clinic',
                    'medications' => json_encode([
                        ['name' => 'Comtrex', 'dosage' => 'One tablet 3 times daily', 'duration' => '5 days'],
                        ['name' => 'Throat Lozenges', 'dosage' => 'As needed', 'duration' => '7 days'],
                        ['name' => 'Vitamin C', 'dosage' => 'One tablet daily', 'duration' => '10 days']
                    ]),
                    'attachments' => null
                ]
        ];

         foreach ($appointments as $appointment) {
             Appointment::create($appointment);
         }
        
    }
}
