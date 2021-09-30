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
RUN npm install react-scripts@3.4.1 -g

# add app
COPY . .


FROM setup as dev
CMD ["npm", "start"]

FROM setup as build
RUN npm run build


FROM nginx:1.19.4-alpine AS prd

WORKDIR /usr/share/nginx/html

COPY --from=build /usr/app/build /usr/share/nginx/html

# Add Bash to make life easier.
RUN apk add --no-cache bash

ENTRYPOINT ["nginx", "-g", "daemon off;"]