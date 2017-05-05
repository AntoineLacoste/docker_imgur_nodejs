#!/bin/bash
cd /tmp

#Clone or pull if exist (auto update on restart container)
if cd Front_Docker_Angular; then git pull; else git clone https://github.com/EtienneTr/Front_Docker_Angular; fi

#mongo
exec /etc/init.d/mongod start "$@" &
sleep 10

cd Front_Docker_Angular
npm install
npm start