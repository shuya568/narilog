# narilog-api/Dockerfile

FROM node:24-bullseye

# work directory
WORKDIR /usr/src/app

# dependencies
COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
COPY prisma.config.ts ./prisma.config.ts
COPY tsconfig*.json nest-cli.json ./
COPY src ./src

RUN npm run build

# launch settings
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD [ "sh", "-c", "npx prisma migrate deploy && node dist/main.js" ]