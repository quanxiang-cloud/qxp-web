FROM nginx:1.18-alpine

LABEL qxp="web-nginx"

ADD ./nginx.conf /etc/nginx/nginx.conf
ADD ./conf.d /etc/nginx/conf.d
ADD ./dist /qxp-web/dist
