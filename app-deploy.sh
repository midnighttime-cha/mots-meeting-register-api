#!/bin/bash
git pull origin master
docker stop mots-meeting-register || true && docker rm mots-meeting-register || true
docker rmi mots-meeting-register || true
docker build -t mots-meeting-register .
docker run -d -p 3007:3000 \
--restart=always \
-v $(pwd)/log:/app/_logfile \
--name mots-meeting-register \
mots-meeting-register