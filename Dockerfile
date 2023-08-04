FROM node

WORKDIR /usr/app

COPY package.json .

RUN npm i

COPY . .

EXPOSE 3000

CMD ["node", "app.js"]