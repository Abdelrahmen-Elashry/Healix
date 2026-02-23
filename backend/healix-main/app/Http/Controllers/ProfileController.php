<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProfileResource;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProfileController extends Controller
{
    /**
     * Get authenticated user's profile
     */
    public function myProfile(Request $request)
    {
        $user = $request->user();
        
        // Ensure user is a patient
        if ($user->type !== 'patient') {
            return response()->json([
                'success' => false,
                'message' => 'Access denied. This endpoint is for patients only.'
            ], 403);
        }
        
        $profile = $user->profile;

        if (!$profile) {
            return response()->json([
                'success' => false,
                'message' => 'Profile not found. Please complete your profile.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Profile retrieved successfully',
            'data' => new ProfileResource($profile)
        ], 200);
    }

    /**
     * Create or update profile
     */
    public function createOrUpdate(Request $request)
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
            'date_of_birth' => 'nullable|date|before:today',
            'city' => 'nullable|string|max:255',
            'gender' => 'nullable|string|in:Male,Female',
            'height' => 'required|numeric|min:50|max:300',
            'weight' => 'required|numeric|min:20|max:500',
            'blood_group' => 'required|string|in:O+,O-,A+,A-,B+,B-,AB+,AB-',
            'drug_allergies' => 'nullable|string|max:1000',
            'chronic_diseases' => 'nullable|array',
            'chronic_diseases.*' => 'string',
            'one_time_medications' => 'nullable|array',
            'one_time_medications.*.name' => 'required|string',
            'one_time_medications.*.dosage' => 'nullable|string',
            'long_term_medications' => 'nullable|array',
            'long_term_medications.*.name' => 'required|string',
            'long_term_medications.*.dosage' => 'nullable|string',
            'long_term_medications.*.frequency' => 'nullable|string',
            'past_surgeries' => 'nullable|string|max:2000',
            'emergency_contact' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        // Update or create profile
        $profile = $user->profile()->updateOrCreate(
            ['user_id' => $user->id],
            [
                'date_of_birth' => $request->date_of_birth,
                'city' => $request->city,
                'gender' => $request->gender,
                'height' => $request->height,
                'weight' => $request->weight,
                'blood_group' => $request->blood_group,
                'drug_allergies' => $request->drug_allergies,
                'chronic_diseases' => $request->chronic_diseases,
                'one_time_medications' => $request->one_time_medications,
                'long_term_medications' => $request->long_term_medications,
                'past_surgeries' => $request->past_surgeries,
                'emergency_contact' => $request->emergency_contact,
            ]
        );

        return response()->json([
            'success' => true,
            'message' => $profile->wasRecentlyCreated ? 'Profile created successfully' : 'Profile updated successfully',
            'data' => new ProfileResource($profile)
        ], $profile->wasRecentlyCreated ? 201 : 200);
    }

    /**
     * Check if user has completed profile
     */
    public function checkProfile(Request $request)
    {
        $user = $request->user();
        
        // Ensure user is a patient
        if ($user->type !== 'patient') {
            return response()->json([
                'success' => false,
                'message' => 'Access denied. This endpoint is for patients only.'
            ], 403);
        }
        
        $hasProfile = $user->profile()->exists();

        return response()->json([
            'success' => true,
            'has_profile' => $hasProfile,
            'message' => $hasProfile ? 'Profile completed' : 'Profile not completed'
        ], 200);
    }
}
