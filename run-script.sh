#!/bin/bash
echo "Running run-script.sh"

if [ -z "$INNLOGGINGSINFO_API_URL" ]; then
  echo "INNLOGGINGSINFO_API_URL is not set, exporting"
  export $(cat /var/run/secrets/nais.io/vault/innloggingsinfo_api_url.env | xargs)
else
  echo "INNLOGGINGSINFO_API_URL already set"
fi

if [ -z "$ALLOW_LOGIN" ]; then
  echo "ALLOW_LOGIN is not set, exporting"
  export $(cat /var/run/secrets/nais.io/vault/allow_login.env | xargs)
else
  echo "ALLOW_LOGIN already set"
fi

VARS_BLOCK="window.env={};
window.env.INNLOGGINGSINFO_API_URL=\"$INNLOGGINGSINFO_API_URL\";
window.env.ALLOW_LOGIN=\"$ALLOW_LOGIN\";"

VARS_BLOCK=$(echo $VARS_BLOCK | tr -d '\n')

printf '%s\n%s\n' "$VARS_BLOCK" "$(cat ../build/js/index.js)" > ../build/js/index.js

node ./server.js
