FROM node:latest
COPY . /chucar
WORKDIR /chucar
RUN npm install
EXPOSE 3000
CMD cd main && node index.js