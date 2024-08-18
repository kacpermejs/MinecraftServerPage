#!/bin/bash -e

#Check for the ENVIRONMENT variable and replace the file based on that
if [[ $ENVIRONMENT = "Dev" ]]; then
   cp /usr/src/app/src/config/app-config.dev.json /usr/src/app/src/app-config.json
fi

if [[ $ENVIRONMENT = "Production" ]]; then
   cp /usr/src/app/src/config/app-config.prod.json /usr/src/app/src/app-config.json
fi

ng serve --host "0.0.0.0" --disable-host-check --poll 2000