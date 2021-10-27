#!/bin/bash
echo "Running run-script.sh"

if [ -z "$INNLOGGINGSINFO_API_URL" ]; then
  echo "INNLOGGINGSINFO_API_URL is not set, exporting"
  export $(var/run/secrets/nais.io/vault/innloggingsinfo_api.env | xargs)
else
  echo "INNLOGGINGSINFO_API_URL already set"
fi

echo "window.env={};" > ../build/config.js
echo "window.env.INNLOGGINGSINFO_API_URL=\"$INNLOGGINGSINFO_API_URL\";" >> ../build/config.js

node ./server.js