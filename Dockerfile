FROM navikt/pus-decorator

ENV APPLICATION_NAME=innloggingsinfo
ENV CONTEXT_PATH=innloggingsinfo
COPY ./build /app
