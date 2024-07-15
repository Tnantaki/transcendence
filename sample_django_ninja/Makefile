all:
	@echo "No Default"

drop-table:
	psql "dbname=postgres host=localhost port=5432 user=postgres password=postgres" -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
