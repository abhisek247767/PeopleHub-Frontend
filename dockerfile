FROM node:23-alpine3.20 as build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --frozen-lockfile

COPY . .

RUN npm run build --prod

FROM nginx:alpine

COPY --from=build /dist/employee /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
