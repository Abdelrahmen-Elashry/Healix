<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Basic measurements
            $table->decimal('height', 5, 2); // e.g. 168.50 cm
            $table->decimal('weight', 5, 2); // e.g. 62.50 kg
            
            // Blood type
            $table->string('blood_group', 5); // e.g. O+, A-, AB+
            
            // Allergies
            $table->text('drug_allergies')->nullable(); // e.g. "penicillin, sulfa"
            
            // Chronic diseases (stored as JSON array)
            $table->json('chronic_diseases')->nullable(); // ["diabetes", "hypertension"]
            
            // Medications (stored as JSON arrays)
            $table->json('one_time_medications')->nullable(); // [{"name": "...", "dosage": "..."}]
            $table->json('long_term_medications')->nullable(); // [{"name": "...", "dosage": "..."}]
            
            // Medical history
            $table->text('past_surgeries')->nullable(); // e.g. "appendectomy 2018"
            
            // Emergency contact
            $table->string('emergency_contact'); // e.g. "John Doe - 01234567890"
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profiles');
    }
};
