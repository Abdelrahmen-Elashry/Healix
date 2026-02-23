<?php

return [
    /*
     | Paths that should have CORS enabled (API routes)
     */
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    /*
     | Allowed HTTP methods
     */
    'allowed_methods' => ['*'],

    /*
     | Allowed origins - specify your React app URLs
     | Add your production URL when deploying
     */
    'allowed_origins' => [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:5173',
        // Add your production domain here when deploying:
        // 'https://yourdomain.com',
    ],

    /*
     | Patterns for dynamic origins (optional)
     */
    'allowed_origins_patterns' => [],

    /*
     | Allowed headers
     */
    'allowed_headers' => ['*'],

    /*
     | Headers exposed to the browser
     */
    'exposed_headers' => ['Authorization'],

    /*
     | Cache preflight requests (in seconds)
     */
    'max_age' => 3600,

    /*
     | Allow credentials (cookies, authorization headers)
     | Required for Sanctum authentication
     */
    'supports_credentials' => true,
];