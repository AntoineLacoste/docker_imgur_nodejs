#!/bin/bash
cd /tmp

#Clone or pull if exist (auto update on restart container)
if [ -d "docker_imgur_nodejs" ]; then 
	cd docker_imgur_nodejs
	git pull; 
else 
	git clone https://github.com/AntoineLacoste/docker_imgur_nodejs
	cd docker_imgur_nodejs;
fi

#mongo
exec /etc/init.d/mongod start "$@" &
sleep 10

npm install
npm start