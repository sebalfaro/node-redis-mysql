FROM node:current-alpine3.20 as dev
RUN mkdir -p /app
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --no-optional && npm cache clean --force
COPY . ./
EXPOSE 3000
CMD [ "npm","start" ]
