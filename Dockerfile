FROM node:14-buster-slim
ARG HOST_NETWORK=0.0.0.0
ENV HOST_NETWORK ${HOST_NETWORK}
RUN apt update && apt install -yq dnsutils
ADD src/ /src
ADD tsconfig.json /
ADD package.json /
ADD package-lock.json /
RUN npm install
RUN npm run build
ADD run.sh /
RUN chmod +x run.sh
ENTRYPOINT ["/run.sh"]
