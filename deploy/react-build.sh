#!/bin/bash
for DIR in $(ls -d */); do
  CHALLENGE_NAME=$(echo ${DIR^} | sed 's/\///g')
  cat aws.json | jq -r ".${CHALLENGE_NAME}ApplicationStack" > ./${CHALLENGE_NAME}/src/env.json
  cd $DIR
  echo "Building $DIR"
  npm install
  npm run build
  cd ..
done