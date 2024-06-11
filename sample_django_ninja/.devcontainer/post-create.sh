#! /bin/bash

PRE='export $(cat '
POST='/.env.local | xargs)'
CMD=$PRE$1$POST
echo $CMD >> ~/.bashrc

poetry config virtualenvs.in-project true
poetry install
