@echo off
echo Starting Laravel Queue Worker...
echo ================================
php artisan queue:work --tries=3 --timeout=90
