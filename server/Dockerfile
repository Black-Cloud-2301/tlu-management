FROM node:18 as builder

WORKDIR /app

COPY ["package.json","./"]
COPY prisma ./prisma/

RUN yarn add global @nestjs/cli
RUN yarn install
COPY . .

RUN npx prisma generate
RUN yarn build

FROM node:18
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 5000

CMD ["yarn","start:migrate:prod"]