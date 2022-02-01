FROM node:15.14.0-alpine as development

WORKDIR /usr/src/app

RUN npm i -g @angular/cli@11.2.6

RUN npm install -g http-server

COPY package*.json ./

RUN npm install

COPY . .

RUN ng build --prod

#CMD ng serve --host 0.0.0.0 --disable-host-check

#CMD ['node', 'dist/midkam-frontend/main']

FROM nginx:alpine AS production

COPY --from=development /usr/src/app/dist/midkam-frontend /usr/share/nginx/html

COPY ./.nginx/nginx.conf /etc/nginx/nginx.conf

ENTRYPOINT ["nginx", "-g", "daemon off;"]

