<?php

// Run this file to generate patient IDs for existing users
// Command: php generate_patient_ids.php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;

// Get all patients without patient_id
$users = User::where('type', 'patient')
    ->whereNull('patient_id')
    ->get();

if ($users->isEmpty()) {
    echo "No users need patient_id generation.\n";
    exit(0);
}

echo "Found {$users->count()} users without patient_id.\n";
echo "Generating patient IDs...\n\n";

foreach ($users as $user) {
    $user->patient_id = 'UF' . str_pad($user->id, 4, '0', STR_PAD_LEFT);
    $user->save();
    
    echo "✓ Generated patient_id for {$user->first_name} {$user->last_name} (ID: {$user->id}): {$user->patient_id}\n";
}

echo "\n✅ Done! Generated patient IDs for {$users->count()} users.\n";
