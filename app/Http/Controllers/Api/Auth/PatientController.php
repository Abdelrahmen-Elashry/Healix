<?php
namespace App\Http\Controllers\Api\Auth;
use App\Http\Controllers\Controller;
use App\Http\Resources\PatientResource;
use App\Models\User;
use Hash;
use Illuminate\Http\Request;
use Illuminate\Auth\Events\Verified;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class PatientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function register(Request $request)
    {
        $data=$request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'age' => 'nullable|integer|min:1|max:150',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);
        
        $data['password']=Hash::make($data['password']);
        $user=User::create([
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'age' => $data['age'],
            'email' => $data['email'],
            'password' => $data['password'],
            'type' => 'patient',
        ]);

        // Send email verification notification
        $user->sendEmailVerificationNotification();

        return response()->json([
            'message' => 'Patient registered successfully. Please check your email to verify your account.',
            'user' => new PatientResource($user),
        ], 201);
    }

    
    public function login(Request $request)
    {
        $data=$request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);
        
        $user=User::where('email',$data['email'])->where('type', 'patient')->first();
        
        if(!$user || !Hash::check($data['password'],$user->password)){
            return response()->json([
                'message' => 'Invalid credentials'
            ], 401);
        }

        // Check if email is verified
        if (!$user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Please verify your email address before logging in. Check your inbox for the verification email.'
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json([
            'message' => 'Patient logged in successfully',
            'user' => new PatientResource($user),
            'token' => $token,
        ], 200);
    }

    
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            'message' => 'Patient logged out successfully'
        ], 200);
    }

   
    public function profile(Request $request)
    {
        return response()->json([
            'message' => 'Patient profile retrieved successfully',
            'user' => new PatientResource($request->user())
        ], 200);
    }

    /**
     * Verify email address
     */
    public function verify(Request $request)
    {
        $user = User::find($request->route('id'));

        if (!$user || $user->type !== 'patient') {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        if (!hash_equals((string) $request->route('hash'), sha1($user->getEmailForVerification()))) {
            return response()->json([
                'message' => 'Invalid verification link'
            ], 403);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Email already verified'
            ], 200);
        }

        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        return response()->json([
            'message' => 'Email verified successfully'
        ], 200);
    }

    /**
     * Resend email verification notification
     */
    public function resendVerification(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->where('type', 'patient')->first();

        if (!$user) {
            return response()->json([
                'message' => 'No patient account found with this email'
            ], 404);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Email already verified'
            ], 200);
        }

        $user->sendEmailVerificationNotification();

        return response()->json([
            'message' => 'Verification email resent successfully'
        ], 200);
    }

    /**
     * Send password reset link
     */
    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->where('type', 'patient')->first();

        if (!$user) {
            return response()->json([
                'message' => 'No patient account found with this email'
            ], 404);
        }

        // Generate a 6-digit token
        $token = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        
        // Delete any existing tokens for this email
        DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->delete();

        // Store the new token
        DB::table('password_reset_tokens')->insert([
            'email' => $request->email,
            'token' => Hash::make($token),
            'created_at' => now(),
        ]);

        // Send the notification with the plain token
        $user->sendPasswordResetNotification($token);

        return response()->json([
            'message' => 'Password reset code sent to your email'
        ], 200);
    }

    /**
     * Reset password using token
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required|string|size:6',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::where('email', $request->email)->where('type', 'patient')->first();

        if (!$user) {
            return response()->json([
                'message' => 'No patient account found with this email'
            ], 404);
        }

        // Find the token record
        $resetRecord = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->first();

        if (!$resetRecord) {
            return response()->json([
                'message' => 'Invalid or expired reset code'
            ], 400);
        }

        // Check if token is expired (60 minutes)
        if (now()->diffInMinutes($resetRecord->created_at) > 60) {
            DB::table('password_reset_tokens')
                ->where('email', $request->email)
                ->delete();

            return response()->json([
                'message' => 'Reset code has expired'
            ], 400);
        }

        // Verify the token
        if (!Hash::check($request->token, $resetRecord->token)) {
            return response()->json([
                'message' => 'Invalid reset code'
            ], 400);
        }

        // Update the password
        $user->password = Hash::make($request->password);
        $user->save();

        // Delete the token
        DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->delete();

        // Revoke all existing tokens
        $user->tokens()->delete();

        return response()->json([
            'message' => 'Password reset successfully'
        ], 200);
    }

    /**
     * Get public patient records by patient ID (for QR code scanning)
     * Public endpoint - no authentication required
     */
    public function publicRecords($patient_id)
    {
        $user = User::where('patient_id', $patient_id)->where('type', 'patient')->first();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Patient not found'
            ], 404);
        }
        
        // Get patient profile
        $profile = $user->profile;
        
        // Get recent appointments
        $appointments = $user->appointments()
            ->latest('appointment_date')
            ->limit(10)
            ->get();
        
        return response()->json([
            'success' => true,
            'patient' => [
                'patient_id' => $user->patient_id,
                'name' => $user->first_name . ' ' . $user->last_name,
                'gender' => $profile->gender ?? 'N/A',
                'blood_type' => $profile->blood_group ?? 'N/A',
                'age' => $profile->date_of_birth ? \Carbon\Carbon::parse($profile->date_of_birth)->age : null,
                'city' => $profile->city ?? 'N/A',
            ],
            'medical_info' => [
                'allergies' => $profile->drug_allergies ?? 'None',
                'chronic_diseases' => $profile->chronic_diseases ?? [],
                'current_medications' => $profile->long_term_medications ?? [],
                'height' => $profile->height ?? null,
                'weight' => $profile->weight ?? null,
            ],
            'appointments' => $appointments->map(function($apt) {
                return [
                    'date' => $apt->appointment_date,
                    'doctor_name' => $apt->doctor_name,
                    'specialty' => $apt->doctor_specialty,
                    'diagnosis' => $apt->diagnosis,
                    'disease' => $apt->disease_name,
                ];
            }),
            'emergency_contact' => $profile->emergency_contact ?? 'N/A',
        ], 200);
    }
 
}
