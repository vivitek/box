#!/usr/bin/env python3

python3 manage.py db init
python3 manage.py db migrate
python3 manage.py db upgrade

python3 manage.py run 