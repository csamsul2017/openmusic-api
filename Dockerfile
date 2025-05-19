FROM node@sha256:f12d34408955b2081f82078e8f96c3299ca0f38d11e76086cb9b9b1b669977e4
WORKDIR /openmusic-api
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
