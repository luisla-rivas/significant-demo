FROM node:20-alpine

WORKDIR significant

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]