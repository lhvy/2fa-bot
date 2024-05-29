FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS openssl
RUN apt-get update && apt-get install -y openssl

FROM openssl AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM openssl AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm npx prisma generate
RUN pnpm run build

FROM openssl
ENV NODE_ENV="production"
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist
RUN apt-get update && apt-get install -y openssl
CMD [ "pnpm", "start:prod" ]
