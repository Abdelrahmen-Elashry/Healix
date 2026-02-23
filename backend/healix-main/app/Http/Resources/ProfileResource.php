<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProfileResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            
            // User information
            'patient_id' => $this->user->patient_id ?? null,
            'name' => ($this->user->first_name ?? '') . ' ' . ($this->user->last_name ?? ''),
            'first_name' => $this->user->first_name ?? null,
            'last_name' => $this->user->last_name ?? null,
            'email' => $this->user->email ?? null,
            
            // Personal information
            'date_of_birth' => $this->date_of_birth ? $this->date_of_birth->format('Y-m-d') : null,
            'age' => $this->date_of_birth ? Carbon::parse($this->date_of_birth)->age : null,
            'city' => $this->city,
            'gender' => $this->gender,
            
            // Measurements
            'height' => (float) $this->height,
            'weight' => (float) $this->weight,
            'blood_group' => $this->blood_group,
            
            // Medical information
            'drug_allergies' => $this->drug_allergies,
            'chronic_diseases' => $this->chronic_diseases ?? [],
            'one_time_medications' => $this->one_time_medications ?? [],
            'long_term_medications' => $this->long_term_medications ?? [],
            'past_surgeries' => $this->past_surgeries,
            
            // Emergency contact
            'emergency_contact' => $this->emergency_contact,
            
            // Timestamps
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
