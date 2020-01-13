FROM eyevinntechnology/ffmpeg-base:0.2.2
MAINTAINER Eyevinn Technology <info@eyevinn.se>

RUN apt-get install -y --force-yes curl
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get install -y --force-yes nodejs

ADD . /app
WORKDIR /app

CMD [ "node", "index.js" ]