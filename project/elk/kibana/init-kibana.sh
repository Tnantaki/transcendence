#!/bin/sh

# Wait for Elasticsearch to be available
# -s: silent --cacert: certs, -w %{http_code}: return http code,-u: User, -k bypass SSL (for dev only), -o: output
until [ $(curl -s --cacert config/certs/root-ca.pem -w "%{http_code}" -u elastic:$ELASTIC_PASSWORD -k https://elasticsearch:9200 -o /dev/null) -eq 200 ]
do
  echo "Waiting for connect to elasticsearch..."
  sleep 10
done

echo "Setting kibana_system password";

response=$(curl -s -k -o /dev/null -w "%{http_code}" -u elastic:$ELASTIC_PASSWORD \
  -X POST https://elasticsearch:9200/_security/user/kibana_system/_password \
  -d '{"password":"'"$KIBANA_SYSTEM_PASSWORD"'"}' \
  -H 'Content-Type: application/json')

if [ "$response" -eq 200 ]; then
  echo "set kibana_system succesfully"
else
  echo "Failed set kibana_system: HTTP response code: $response"
fi

# Create an ILM Policy for retention data
# - delete data after 30 days
response=$(curl -s -k -o /dev/null -w "%{http_code}" -u elastic:$ELASTIC_PASSWORD \
  -X PUT "https://elasticsearch:9200/_ilm/policy/logstash-ilm-policy" \
  -H "Content-Type: application/json" \
  -d '{
    "policy": {
      "phases": {
        "hot": {
          "actions": {}
        },
        "delete": {
          "min_age": "30d",
          "actions": {
            "delete": {}
          }
        }
      }
    }
  }')

if [ "$response" -eq 200 ]; then
  echo "Create an ILM Policy successfully"
else
  echo "Failed to create an ILM: HTTP response code: $response"
fi

# Apply the ILM Policy to an Index Template
response=$(curl -s -k -o /dev/null -w "%{http_code}" -u elastic:$ELASTIC_PASSWORD \
  -X PUT "https://elasticsearch:9200/_index_template/backend-logs-template" \
  -H "Content-Type: application/json" \
  -d '{
    "index_patterns": ["backend-logs-*"],
    "template": {
      "settings": {
        "index.lifecycle.name": "logstash-ilm-policy"
      }
    }
  }')

if [ "$response" -eq 200 ]; then
  echo "Apply Policy to index successfully"
else
  echo "Failed to apply the ILM: HTTP response code: $response"
fi


# ------------------------------- KIBANA ------------------------------- #
# Set up signal handling
trap 'kill -TERM $PID' TERM INT

echo "Starting Kibana..."
# Start Kibana in the background
/usr/share/kibana/bin/kibana &

# Capture the PID of the Kibana process
PID=$!

# Wait for Kibana to be available
until [ $(curl -s -k -w "%{http_code}" -o /dev/null -u elastic:$ELASTIC_PASSWORD https://kibana:5601/api/status) -eq 200 ]
do
  echo "Waiting for Kibana server..."
  sleep 5
done

# Import visualizations to Kibana
echo "Set Kibana visualizations from visualization.ndjson..."

response=$(curl -s -k -o /dev/null -w "%{http_code}" -X POST \
  "https://kibana:5601/api/saved_objects/_import?overwrite=true" \
  -H "kbn-xsrf: true" \
  -H "Content-Type: multipart/form-data" \
  -u "elastic:$ELASTIC_PASSWORD" \
  -F file=@visualization.ndjson)

if [ "$response" -eq 200 ]; then
    echo "Visualizations imported successfully."
else
    echo "Failed to import visualizations. HTTP response code: $response"
fi


# Wait for the Kibana process to finish
wait $PID

# Exit with the same status as the Kibana process
exit $?

# Start Kibana
# exec /usr/share/kibana/bin/kibana