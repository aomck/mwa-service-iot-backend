FROM node:boron

RUN mkdir -p /usr/src/app

WORKDIR /use/src/app

COPY package.json /use/src/app/

RUN npm install

COPY . /use/src/app/

EXPOSE 7000

CMD ["npm","run","serve"]
