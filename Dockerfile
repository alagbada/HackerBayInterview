FROM node:10.13.0

WORKDIR /usr/src/hackerbay

COPY ./ ./

RUN npm install


CMD ["/bin/bash"]
