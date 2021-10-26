FROM node:14-alpine
ENV NODE_ENV production

WORKDIR usr/src/app
COPY server server/
COPY build ./build
COPY run-script.sh ./run-script.sh

RUN apk update && apk add bash
RUN chmod +x ./run-script.sh

RUN chown 1069 build/config.js
RUN chmod u+rw build/config.js

WORKDIR server
RUN npm install

ENTRYPOINT ["/bin/bash","-c","../run-script.sh"]

ENV PORT=8080
EXPOSE $PORT
