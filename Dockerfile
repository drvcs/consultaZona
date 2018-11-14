FROM node:alpine

COPY . /var/app

WORKDIR /var/app

ENV TZ=America/Bogota
ENV NODE_ENV=production

RUN npm install 

## Original de template ck-template
# 
# npm install --unsafe-perm || \
#  ((if [ -f npm-debug.log ]; then \ 
#                cat npm-debug.log; \
#   fi) && false)

CMD ["npm","start"]



