FROM node:16.13.2-alpine as development

WORKDIR /usr/src/app

RUN npm i -g @angular/cli@11.2.6

RUN npm install -g http-server

COPY package*.json ./

RUN npm install

COPY . .

# FOR PRODUCTION
#RUN ng build --prod

FROM nginx:alpine AS production

COPY --from=development /usr/src/app/dist/midkam-frontend /usr/share/nginx/html

COPY ./.nginx/nginx.conf /etc/nginx/nginx.conf

ENTRYPOINT ["nginx", "-g", "daemon off;"]

