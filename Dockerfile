FROM node:12-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN apk --no-cache add --virtual builds-deps build-base python
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "npm", "start" ]


