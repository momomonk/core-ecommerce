##Sql 
Intro:
#export
docker exec -t postgres_db pg_dump -U postgres ecommerce > backup.sql
#import
docker exec -i postgres_db psql -U postgres -d ecommerce < backup.sql
##Docker
Intro:dockerignore
#Reconstruccion de solo un servicio
docker compose up --build -d user-service