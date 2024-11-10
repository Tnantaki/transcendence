# syntax=docker/dockerfile:1
ARG ELASTIC_VERSION

FROM docker.elastic.co/kibana/kibana:${ELASTIC_VERSION}

COPY kibana.yml /usr/share/kibana/config/

COPY init-kibana.sh visualization.ndjson /usr/share/kibana/

ENTRYPOINT ["/usr/share/kibana/init-kibana.sh"]
