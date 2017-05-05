FROM ubuntu:14.04

MAINTAINER Etienne Tr

#git & node
RUN apt-get update \
	&& apt-get -y install git \
	&& apt-get -y install curl && curl -sL https://deb.nodesource.com/setup_6.x | bash - && apt-get install -y nodejs

#mongodb
RUN sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10 \
  && echo "deb http://downloads-distro.mongodb.org/repo/debian-sysvinit dist 10gen" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.0.list \
  && apt-get update && apt-get -y install mongodb-org


# Create the MongoDB data directory
RUN mkdir -p /data/db

COPY ./entrypoint.sh /entrypoint.sh

EXPOSE 3003 27017

RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]