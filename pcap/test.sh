#!/usr/bin/env sh

cd ./msg_broker

echo "Installing dependencies"
npm i

echo "Building"
npm run build

echo "Running tests"
npm test