FROM alpine:3.9

LABEL qxp="web-portal"

ADD ./portal /qxp-web/bin/portal
ADD ./dist /qxp-web/dist

VOLUME "/var/log/qxp-web"

CMD ["/qxp-web/bin/portal", "-c", "/qxp-web/etc/config.yaml"]
