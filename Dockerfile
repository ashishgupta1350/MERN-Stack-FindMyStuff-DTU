# Pull base image
FROM node:8.10.0

# Create app directory
WORKDIR /usr/local/app

ADD . .

RUN npm i --production

RUN npm i -g nodemon@latest

# Machine cleanup
RUN npm cache clean --force

# Expose WS Port
EXPOSE 4004

# Run server
CMD ["nodemon", "app.js"]
