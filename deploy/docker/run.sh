#!/bin/bash

sudo docker run \
  --name rbs34 \
  --net=host \
  -v /etc/localtime:/etc/localtime:ro \
  -v /etc/timezone:/etc/timezone:ro \
  -v /opt/openhab/rbs34/addons:/openhab/addons \
  -v /opt/openhab/rbs34/conf:/openhab/conf \
  -v /opt/openhab/rbs34/userdata:/openhab/userdata \
  -e "EXTRA_JAVA_OPTS=-Duser.timezone=Europe/Berlin" \
  -e "CRYPTO_POLICY=unlimited" \
  -e "OPENHAB_HTTP_ADDRESS=127.0.0.1" \
  -d \
  --restart=always \
  openhab/openhab:milestone
