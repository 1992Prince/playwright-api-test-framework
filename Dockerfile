FROM mcr.microsoft.com/playwright:v1.57.0-noble
# all necessary dependencies are included in the base image like browsers, nodejs, etc.

RUN mkdir /app
WORKDIR /app

COPY . /app/

RUN npm install --force
RUN npx playwright install --with-deps