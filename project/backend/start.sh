#!/bin/bash
python ./app/manage.py migrate

echo "Migrations complete, starting"

python ./app/manage.py runserver 0.0.0.0:8000
