echo "Applying database migrations..."
python manage.py makemigrations prompts
python manage.py migrate

echo "Starting server..."
exec "$@"
