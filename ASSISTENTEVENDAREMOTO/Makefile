install:
	./install.sh

qrcode:
	node ./src/qrcode.js

start:
	pm2 start index.js 
	
stop:
	pm2 stop index.js 

logout:
	rm -r .wwebjs_auth

log:
	cat ${HOME}/.pm2/logs/index-error.log > ./assistent-error.log
