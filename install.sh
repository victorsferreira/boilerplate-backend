sudo docker stop mongodb
sudo docker rm mongodb
sudo docker run --name mongodb -d -p 27017:27017 -v ~/data:/data/db mongo
sudo docker stop redis-server
sudo docker rm redis-server
sudo docker run --name redis-server -d -p 6379:6379 redis
sudo docker stop rebrow
sudo docker rm rebrow
sudo docker run --name rebrow -d -ti -p 5001:5001 --link redis-server:myredis marian/rebrow
sudo docker stop mongo-express
sudo docker rm mongo-express
sudo docker run --name mongo-express -d -p 8081:8081 --link mongodb:mongo mongo-express
sudo docker build -t app:boilerplate .
sudo docker stop boilerplate
sudo docker rm boilerplate
sudo docker run --name boilerplate -p 8090:8090 app:boilerplate
npm install