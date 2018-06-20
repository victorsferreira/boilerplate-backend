sudo docker stop app
sudo docker rm app
docker-compose build --no-cache app
sudo docker-compose up --force-recreate