<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AppointmentController extends Controller
{
    /**
     * Get all appointments for authenticated user
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Ensure user is a patient
        if ($user->type !== 'patient') {
            return response()->json([
                'success' => false,
                'message' => 'Access denied. This endpoint is for patients only.'
            ], 403);
        }
        
        $appointments = $user->appointments()
            ->orderBy('appointment_date', 'desc')
            ->get();
        
        return response()->json([
            'success' => true,
            'message' => 'Appointments retrieved successfully',
            'data' => $appointments
        ], 200);
    }

    /**
     * Store a new appointment
     */
    public function store(Request $request)
    {
        $user = $request->user();
        
        // Ensure user is a patient
        if ($user->type !== 'patient') {
            return response()->json([
                'success' => false,
                'message' => 'Access denied. This endpoint is for patients only.'
            ], 403);
        }
        
        $validator = Validator::make($request->all(), [
            'doctor_name' => 'required|string|max:255',
            'doctor_specialty' => 'required|string|max:255',
            'appointment_date' => 'required|date',
            'disease_name' => 'required|string|max:255',
            'diagnosis' => 'required|string',
            'examination_place' => 'required|string|max:255',
            'medications' => 'nullable|array',
            'medications.*.name' => 'required_with:medications|string',
            'medications.*.duration' => 'nullable|string',
            'medications.*.dosage' => 'nullable|string',
            'attachments' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $appointment = $user->appointments()->create([
            'doctor_name' => $request->doctor_name,
            'doctor_specialty' => $request->doctor_specialty,
            'appointment_date' => $request->appointment_date,
            'disease_name' => $request->disease_name,
            'diagnosis' => $request->diagnosis,
            'examination_place' => $request->examination_place,
            'medications' => $request->medications,
            'attachments' => $request->attachments ?? [],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Appointment created successfully',
            'data' => $appointment
        ], 201);
    }

    /**
     * Get a single appointment
     */
    public function show(Request $request, $id)
    {
        $user = $request->user();
        
        $appointment = $user->appointments()->find($id);
        
        if (!$appointment) {
            return response()->json([
                'success' => false,
                'message' => 'Appointment not found'
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'message' => 'Appointment retrieved successfully',
            'data' => $appointment
        ], 200);
    }

    /**
     * Delete an appointment
     */
    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        
        $appointment = $user->appointments()->find($id);
        
        if (!$appointment) {
            return response()->json([
                'success' => false,
                'message' => 'Appointment not found'
            ], 404);
        }
        
        $appointment->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Appointment deleted successfully'
        ], 200);
    }
}
