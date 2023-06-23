FROM node:18
COPY ./install.sh /install.sh
RUN chmod +x /install.sh
RUN /install.sh
RUN mkdir -p /app
WORKDIR /app