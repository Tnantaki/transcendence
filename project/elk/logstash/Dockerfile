# syntax=docker/dockerfile:1
ARG ELASTIC_VERSION

FROM docker.elastic.co/logstash/logstash:${ELASTIC_VERSION}

COPY logstash.conf /usr/share/logstash/pipeline/

COPY logstash.yml /usr/share/logstash/config/

COPY postgresql-42.2.29.jre7.jar /usr/share/logstash/

ENTRYPOINT ["/usr/local/bin/docker-entrypoint"]
