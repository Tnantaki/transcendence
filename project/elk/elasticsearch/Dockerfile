# syntax=docker/dockerfile:1
ARG ELASTIC_VERSION

FROM docker.elastic.co/elasticsearch/elasticsearch:${ELASTIC_VERSION}

COPY --chmod=755 generate-certs.sh .

RUN sh generate-certs.sh

COPY elasticsearch.yml /usr/share/elasticsearch/config/

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
