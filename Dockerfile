FROM node:12-alpine
RUN mkdir -p /user/src/app
WORKDIR /usr/src/app
ADD . /usr/src/app
RUN chmod +x /usr/src/app/run.sh
RUN npm install --force && npm cache verify
EXPOSE 5000
CMD ./run.sh