FROM eyevinntechnology/ffmpeg-base:0.2.2
MAINTAINER Eyevinn Technology <info@eyevinn.se>

RUN apt-get install -y --force-yes curl
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get install -y --force-yes nodejs
RUN apt-get install -y --force-yes fonts-freefont-ttf

ADD . /app
WORKDIR /app
RUN npm install
RUN npm run build

CMD [ "node", "index.js" ]
