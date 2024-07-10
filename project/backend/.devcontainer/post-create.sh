#! /bin/bash

PRE='export $(cat '
POST='/.env.local | xargs)'
CMD=$PRE$1$POST
echo $CMD >> ~/.bashrc

openssl genrsa -out oidc_rsa.key 4096
echo 'export OIDC_RSA_PRIVATE_KEY=`cat oidc_rsa.key`' >> ~/.bashrc

apt update && apt install -y postgresql-client redis-tools
poetry config virtualenvs.in-project true
poetry install
