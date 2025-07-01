web: python manage.py migrate && gunicorn reading_app_backend.wsgi:application --workers 2 --forwarded-allow-ips '*' --log-file -
