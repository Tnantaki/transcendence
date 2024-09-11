#!/bin/sh

# Create a directory for certificates
mkdir -p config/certs

# Generate a root CA key
openssl genrsa -out config/certs/root-ca-key.pem 2048

# Generate a root CA certificate
openssl req -x509 -new -nodes -key config/certs/root-ca-key.pem -days 3650 -out config/certs/root-ca.pem -subj "/C=TH/ST=None/L=Bangkok/O=42/CN=ELK-CA"

# Generate a key for Elasticsearch
openssl genrsa -out config/certs/elasticsearch-key.pem 2048

# Generate a Certificate Signing Request (CSR) for Elasticsearch
openssl req -new -key config/certs/elasticsearch-key.pem -out config/certs/elasticsearch.csr -subj "/C=TH/ST=None/L=Bangkok/O=42/CN=elasticsearch"

# Generate the certificate for Elasticsearch
openssl x509 -req -in config/certs/elasticsearch.csr -CA config/certs/root-ca.pem -CAkey config/certs/root-ca-key.pem -CAcreateserial -out config/certs/elasticsearch.pem -days 365

# Generate a key for Kibana
openssl genrsa -out config/certs/kibana-key.pem 2048

# Generate a Certificate Signing Request (CSR) for Kibana
openssl req -new -key config/certs/kibana-key.pem -out config/certs/kibana.csr -subj "/C=TH/ST=None/L=Bangkok/O=42/CN=kibana"

# Generate the certificate for Kibana
openssl x509 -req -in config/certs/kibana.csr -CA config/certs/root-ca.pem -CAkey config/certs/root-ca-key.pem -CAcreateserial -out config/certs/kibana.pem -days 365

# Set appropriate permissions
chmod 644 config/certs/*