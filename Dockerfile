FROM eyevinntechnology/ffmpeg-base:0.2.2
RUN apt-get update
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get install -y nodejs
RUN apt-get install -y fonts-freefont-ttf

ADD . /app
WORKDIR /app
RUN npm install
RUN npm install sass-loader -D
RUN npm install node-sass -D
RUN npm run build

CMD [ "node", "index.js" ]
