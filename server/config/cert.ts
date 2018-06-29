import fs = require('fs');
var key = fs.readFileSync('./encryption/localhost.key');
var cert = fs.readFileSync('./encryption/localhost.crt');
var ca = fs.readFileSync('./encryption/localhost.csr');

export const certOptions = {
	key : key,
	cert : cert,
	ca : ca,
}

