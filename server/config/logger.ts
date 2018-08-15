import winston = require('winston');
import stream = require('stream');
import morgan = require('morgan');
const tsFormat = () => (new Date()).toLocaleTimeString();
export var logger= winston.createLogger({
	/*levels: {
	 *  info: 0,
	 *  ok : 1,
	 *  error: 2
	 *},*/
	transports: [
		/*new winston.transports.Console({
		 *  stderrLevels: ['error'],
		 *  colorize: true,
		 *  timestamp: tsFormat
		 *}),*/
		new winston.transports.File({
			filename: '../logs/error.log',
			level: 'error',
			handleExceptions: true,
		}),
		new winston.transports.File({
			filename: '../logs/console.log',
			level: 'info',
		}),
		new (winston.transports.Console as any)({
			level: 'info',
			timestamp: tsFormat(),
			handleExceptions: true,
			showLevel : false,
			prettyPrint: true,
			colorize: true 
		})
	],
	exitOnError: false
	/*exceptionHandlers: [
	 *  new winston.transports.File({
	 *    filename: '../logs/exceptions.log'
	 *  })
	 *]*/
});
export const morganOptions: morgan.Options = {
	stream: {
		write: function (message: string) {
			logger.info(message);
		}
	}
}
