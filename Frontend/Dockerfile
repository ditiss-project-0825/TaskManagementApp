FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

# Expose port
EXPOSE 3000

ENV REACT_APP_BACKEND_URL=http://localhost:8082

CMD npm start
