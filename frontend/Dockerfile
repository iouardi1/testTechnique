FROM node:20-bullseye AS react

WORKDIR /app

COPY package*.json ./
RUN npm install --force

COPY . .

CMD ["npm", "run", "start"]