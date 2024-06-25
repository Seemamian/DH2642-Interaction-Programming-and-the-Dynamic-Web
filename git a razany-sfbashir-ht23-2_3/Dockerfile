# In case you have problems with node, npm, webpack, you can use docker to make a separate "machine"
# https://docs.docker.com/get-docker/

# Run this command:
# docker-compose up

FROM node:17-alpine

WORKDIR /dh2642-lab

COPY package.json ./
RUN npm install

CMD ["npm", "run", "dev"]
