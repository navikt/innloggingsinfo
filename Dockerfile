FROM docker.adeo.no:5000/pus/decorator

ENV APPLICATION_NAME=innloggingsinfo
ENV CONTEXT_PATH=innloggingsinfo
COPY ./build /app
