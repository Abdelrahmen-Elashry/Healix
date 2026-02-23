<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class Cors
{
    public function handle(Request $request, Closure $next)
    {
        // لو الـ request نوعه OPTIONS (preflight) رجع مباشرة
        if ($request->getMethod() === "OPTIONS") {
            $response = response('', 200);
        } else {
            $response = $next($request);
        }

        // إعدادات CORS
        $response->headers->set('Access-Control-Allow-Origin', '*'); // السماح لأي دومين
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
        $response->headers->set('Access-Control-Expose-Headers', 'Authorization');

        return $response;
    }
}
