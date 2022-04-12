# pull official base image
FROM node:13.12.0-alpine as setup

# set working directory
WORKDIR /usr/app

# add `/usr/app/node_modules/.bin` to $PATH
ENV PATH /usr/app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json .
COPY package-lock.json .
RUN npm install

RUN mkdir -p node_modules/.cache && chmod -R 777 node_modules/.cache

RUN npm install react-scripts@3.4.1 -g

# add app
COPY . .

FROM setup as dev
CMD ["npm", "start"]

FROM setup as build
RUN npm run build

# Download and build our environment injector
# https://www.nrmitchi.com/2020/12/building-environment-friendly-react-apps/?utm_source=reddit&utm_medium=r%2Fdocker&utm_campaign=direct-post
FROM golang:1.15.6-alpine3.12 as go-downloader
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh
RUN go get github.com/nrmitchi/runtime-js-env

FROM nginx:stable-alpine AS prod

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/app/build /usr/share/nginx/html
# Copy the runtime-js-env binary
COPY --from=go-downloader /go/bin/runtime-js-env /

EXPOSE 80

# Add Bash to make life easier.
RUN apk add --no-cache bash

COPY entrypoint.sh .

ENTRYPOINT ["./entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
