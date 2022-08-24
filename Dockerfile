# ----- Stage 1: build the Web site ----- 

# Use a node docker image:
FROM node:16-stretch AS src-build

WORKDIR /usr/src/app

COPY package.json .
COPY ./.yarnrc.yml ./.yarnrc.yml
COPY ./yarn.lock ./yarn.lock
COPY ./.yarn/releases/ ./.yarn/releases/
COPY ./.yarn/plugins/ ./.yarn/plugins/

RUN yarn

COPY ./index.html .
COPY ./tsconfig.json .
COPY ./vite.config.ts .
COPY ./tailwind.config.js .
COPY ./postcss.config.js .
COPY ./src ./src
COPY ./public ./public

RUN yarn build

# ----- Stage 2: create the final nginx docker image ----- 

FROM nginx:1.20

# Copy the built Web pages into it:
COPY --from=src-build /usr/src/app/dist /usr/share/nginx/html/

# Copy the nginx config files:
COPY nginx /etc/nginx

EXPOSE 80/tcp
