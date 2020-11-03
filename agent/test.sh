#!/usr/bin/env sh

cd ./msg_broker

echo "Installing dependencies"
npm i

echo "Running tests"
npm test
