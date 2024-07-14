#!/bin/bash

DB_NAME=postgres
DB_HOSTNAME=db
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres

# COLOR
RED='\033[0;31m'
NC='\033[0m' # No Color

# $1 = input
# $2 expect value 
function check_item() {
  if [ "$1" != "$2" ]; then
    printf "You are delete $3 ${RED} $1 ${NC}\n"
    read -p "Enter Y to confirm dropping all tables: " confirm;
    if [ $confirm != "Y" ]; then
      echo "Cancel Donforget to change ENV"
      exit
    else
      printf "You wll delete  $3 ${RED} $1 ${NC} \n"
    fi
  fi
}

# Check default Credential
check_item $DB_NAME "postgres" "datebase name";
check_item $DB_HOSTNAME "db" "host";
check_item $DB_PORT "5432" "port";
check_item $DB_USER "postgres" "user";
check_item $DB_PASSWORD "postgres" "password";

# Check
printf ${RED}"dbname=${DB_NAME} host=${DB_HOSTNAME} port=${DB_PORT} user=${DB_USER} password=${DB_PASSWORD}${NC}\n"
read -p "Enter Y to confirm dropping all tables: " confirm; 
if [ $confirm = "Y" ]; 
then 
  psql "dbname=${DB_NAME} host=${DB_HOSTNAME} port=${DB_PORT} user=${DB_USER} password=${DB_PASSWORD}" -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;" ;\
  exit 0; 
fi; 