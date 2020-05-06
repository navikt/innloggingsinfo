FROM navikt/pus-decorator

ENV APPLICATION_NAME=innloggingsinfo
ENV CONTEXT_PATH=innloggingsinfo
ENV FOOTER_TYPE=WITH_ALPHABET
COPY ./build /app

ENV PORT=8080
EXPOSE $PORT
