FROM node:12

WORKDIR /data
COPY *.js package* /data/
COPY src /data/src
RUN npm install && npm run-script build

FROM nginxinc/nginx-unprivileged:stable-alpine
COPY --from=0 /data/dist/ /usr/share/nginx/html/
COPY nginx/ /etc/nginx/conf.d/
