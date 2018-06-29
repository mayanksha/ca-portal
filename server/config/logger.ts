import winston = require('winston');

export const logger : winston.LoggerInstance = new winston.Logger({
	level : 'info',
	transports: [
		new (winston.transports.Console)()
	]
})
