#!/usr/bin/env sh
set -e
python manage.py migrate  --noinput
python manage.py seed_products
python manage.py collectstatic --noinput

# start server
gunicorn config.wsgi:application --bind 0.0.0.0:$PORT
