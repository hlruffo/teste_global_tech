#!/bin/sh
set -e

echo "Aguardando banco de dados..."
python manage.py migrate --noinput

echo "Iniciando servidor..."
exec python manage.py runserver 0.0.0.0:8000
