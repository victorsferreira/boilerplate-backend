FROM node:9
WORKDIR /app
RUN rm -rf /app/*
COPY package.json /app
RUN npm install
COPY . /app
CMD node app.js
EXPOSE 8090