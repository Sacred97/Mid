# FROM node:15.14.0-alpine as development
FROM node:16.13.2-alpine as development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=development
RUN npm install -g @nestjs/cli@7.5.6

COPY . .

RUN npm run build

FROM node:15.14.0-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]
