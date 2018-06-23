sudo docker stop app
sudo docker rm app
sudo docker-compose build --no-cache app
sudo docker-compose up --force-recreate