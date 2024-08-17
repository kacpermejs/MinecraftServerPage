FROM node:lts AS build

ADD ./package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /usr/local/app && cp -a /tmp/node_modules /usr/local/app/

WORKDIR /usr/local/app
COPY ./ /usr/local/app/
RUN npm run build

# Stage 2
FROM nginx:latest
COPY --from=build /usr/local/app/dist/frontend/browser /usr/share/nginx/html

# script for environment configuration loading
COPY ./entrypoint.sh /usr/local/app/entrypoint.sh

COPY ./nginx.conf  /etc/nginx/conf.d/default.conf
EXPOSE 80 443 6006 4200

RUN chmod +x /usr/local/app/entrypoint.sh
ENTRYPOINT [ "/usr/local/app/entrypoint.sh" ]
