FROM node

RUN useradd --user-group --create-home --shell /bin/false app &&\
    npm install --global npm

ENV HOME=/home/app



COPY package.json $HOME/web/
COPY yarn.lock $HOME/web/

RUN chown -R app:app $HOME/*

USER app
WORKDIR $HOME/web

RUN yarn install

COPY . .
EXPOSE 8001