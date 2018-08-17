import httpLogger = require('morgan');
import mysql = require('mysql');
import express = require('express');
import bodyParser = require('body-parser');
import process = require('process');
import crypto = require('crypto');
import session = require('express-session');
import cors = require('cors');
import assert = require('assert');
import winston = require('winston');
import fs = require('fs');
import { DatabaseToSheets } from './sheets_server';

// Interfaces
import { dbConfig } from './interfaces/dbConfig';
import { Database } from './config/database';

import https = require('https');
import { certOptions } from './config/cert';
// Config
import { logger, morganOptions } from './config/logger';
import { localConfig as Config } from './config/local_config';

// Routers 
import { CompetitionRoutes } from './routes/competitions';


var db = Database.getInstance();
var app : express.Application = express();
/*const corsOptions = {
 *  origin: ['https://ecelliitk.org', 'https://ecelliitk.org'],
 *  optionsSuccessStatus: 200
 *}*/
/*const corsOptions = {
 *  origin: 'https://localhost:4200',
 *  optionsSuccessStatus: 200
 *}*/
app.use(httpLogger('combined', morganOptions));
app.use(session({ secret : Config.sessionSecret }));

// Enable Cors
app.use(cors());
// Enable OPTIONS requests
app.options('*', cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false }));

app.get('/task_count', (req : express.Request, res : express.Response, next) => {
	const query = `SELECT COUNT(*) FROM registrations.tasks`;
	db.query(query)
		.then((rows: any) => {
			const count = (rows[0]['COUNT(*)']);
			res.status(200);
			res.header('Content-Type', 'application/json');
			res.send({count: count});
			res.end();
		})
		.catch(err => {
			console.log(err);
			next(err);
		});
})
app.get('/tasks', (req : express.Request, res : express.Response, next) => {
	const query = `SELECT * FROM registrations.tasks ORDER BY ID DESC`;
	db.query(query)
		.then((rows: any) => {
			res.status(200);
			res.header('Content-Type', 'application/json');
			res.send(Array.from(JSON.parse(JSON.stringify(rows))));
			res.end();
		})
		.catch(err => {
			console.log(err);
			next(err);
		});
})
app.post('/tasks', (req : express.Request, res : express.Response, next) => {
	assert.ok(req.body.facebookID);
	assert.ok(req.body.taskID);
	assert.ok(req.body.link);

	const facebookID = db.escape(req.body.facebookID);
	const taskID = db.escape(req.body.taskID);
	const link = db.escape(req.body.link);

	const findQuery = `SELECT * FROM registrations.task_completions 
	WHERE facebookID=${facebookID} AND taskID=${taskID}`;

	const insertQuery = `INSERT INTO \`registrations\`.\`task_completions\` (\`facebookID\`, \`taskID\`, \`link\`)
	VALUES (${facebookID}, ${taskID}, ${link})`;

	const updateQuery = `UPDATE \`registrations\`.\`task_completions\` 
	SET \`link\`=${link} WHERE facebookID=${facebookID} AND taskID=${taskID}`;

	db.query(findQuery)
		.then((rows: any): boolean => {
			if (Array.from(rows).length === 0)
				return true;	
			else return false;
		})
		.then((bool: boolean) => {
			if (bool)
				return db.query(insertQuery)
					.then((rows) => rows)
					.catch((err) => Promise.reject(err))
			else {
				return db.query(updateQuery)
					.then((rows) => rows)
					.catch((err) => Promise.reject(err))
			}
		})
		.then((rows: any) => {
			console.log(rows);
			res.status(200);
			res.send(rows);
			res.end()
		})
		.catch(err => {
			console.error(err);
			next(err);
		})
})
app.use('/register', CompetitionRoutes.createRouter());
app.post('/townscript', (req : express.Request, res : express.Response, next) => {
	assert.ok(req.body.data);
	let body: any;
	// Townscript hands data over in stringified form
	try {
		body = JSON.parse(req.body.data);
	}
	catch {
		body = req.body.data;
	}
	
	let data: any[];
	if (Array.isArray(body)){
		data = body;
	}
	else {
		data = Array.of(body);
	}
	let data_new: any = data.map((e: any) => {
		let obj = {};
		obj['userEmailId'] = db.escape(e['userEmailId']);
		obj['discountCode'] = db.escape(e['discountCode']);
		obj['discountAmount'] = db.escape(e['discountAmount']);
		obj['uniqueOrderId'] = db.escape(e['uniqueOrderId']);
		obj['registrationTimestamp'] = db.escape(e['registrationTimestamp']);
		obj['eventName'] = db.escape(e['eventName']);
		obj['eventCode'] = db.escape(e['eventCode']);
		obj['ticketName'] = db.escape(e['ticketName']);
		return obj;
	})

	const ref_code = data_new[0]['discountCode'];
	console.log(ref_code);
	if (ref_code.match(/CA/) === null){
		logger.info("Not a CA User...Hence, Ignoring...");
		res.status(200);
		res.end();
		return;
	}
	const length = data_new.length;
	const incrementQuery = `UPDATE registrations.\`ca-registrations\` SET points = points + ${length * 50} WHERE referralID=${data_new[0]['discountCode']}`;

	let mappingQuery = `INSERT INTO registrations.referralID_TSreg_mapping` +
		` (\`uniqueOrderId\`, referralID, registrationTimestamp, userEmailId, eventName, eventCode, ticketName) VALUES `;

	for(let i = 0; i < length; i++){
		mappingQuery += `(${data_new[i].uniqueOrderId}, ${data_new[i].discountCode}, ${data_new[i].registrationTimestamp}, ${data_new[i].userEmailId},${data_new[i].eventName}, ${data_new[i].eventCode}, ${data_new[i].ticketName})`;
		if(i != length - 1)
			mappingQuery += ',';
	}
	
	let connection: mysql.PoolConnection;

	db.getPoolConnection()
		.then(conn => connection = conn)
		.then(() => {
			return connection.query(`START TRANSACTION@${ref_code}`);
		})
		.then((query) => {
			logger.info(query.sql, `CaUser = ${ref_code}`);
		})
		.then(() => {
			return db.getQueryResults(connection, incrementQuery)
		})
		.then((rows: any) => {
			logger.info(`incrementQuery@${ref_code}\n ${incrementQuery}`);
			if (rows.affectedRows === 1)
				return db.getQueryResults(connection, mappingQuery)
			else return Promise.reject(new Error('ER_TOWNSCRIPT_TRANSACTION_FAILED'));
		})
		.then((rows) => {
			logger.info(`mappingQuery@${ref_code}\n ${mappingQuery}`);
			return db.getQueryResults(connection, 'COMMIT')
		})
		.then((rows) => {
			res.status(200);
			res.end();
	  })
		.catch((err) => {
			process.nextTick(() => {
				db.getQueryResults(connection, 'ROLLBACK')
					.then((rows) => {
						// Log everything since this is a critical issue
						// either with the MySQL server or with some configuration
						 
						logger.error(`incrementQuery@${ref_code}\n ${incrementQuery}`);
						logger.error(`mappingQuery@${ref_code}\n ${mappingQuery}`);
						logger.error(`CaUser = ${ref_code}`);
						logger.error(`Transaction_Error@${ref_code}`);
						next(err);
					})
					.catch(next)
			})
		})
});

app.post('/checkCaUser', (req : express.Request, res : express.Response, next) => {
	console.log(req.body);
	assert.ok(req.body.facebookID);
	const facebookID = db.escape(req.body.facebookID);
	const query = `SELECT * FROM registrations.\`ca-registrations\` WHERE facebookID=${facebookID}`;

	db.query(query)
		.then((rows: any) => {
			let len = Array.from(rows).length;
			if (len == 0){
				res.status(200);
				res.send(false);
				res.end();
			}
			else if (len == 1){
				res.status(200);
				res.send(true);
				res.end();
			}
			else {
				let err = new Error('');
				err.name = 'ER_DUP_ENTRY';
				err.message = `Critical Problem. More than one CA with same email ID.
					facebookID=${facebookID}
				SQLQuery = ${query}`;
				logger.error([facebookID, query, err]);
				throw err;
			}
		})
		.catch(err => next(err));
})

app.post('/registerCaUser', 
	(req : express.Request, res : express.Response, next) => {
		assert.ok(req.body.email);
		assert.ok(req.body.name);
		assert.ok(req.body.phone);
		assert.ok(req.body.facebookID);

		const facebookID = db.escape(req.body.facebookID);
		const email = db.escape(req.body.email);
		const name = db.escape(req.body.name);
		const phone = db.escape(req.body.phone);
		const query = `INSERT INTO registrations.\`ca-registrations\` (name, email, phone, facebookID) VALUES(${name}, ${email}, ${phone}, ${facebookID})`;

		let connection: mysql.PoolConnection;
		let referralID: string;
		let CAquery: string;
		db.getPoolConnection()
			.then((conn) => connection = conn)
			.then(() => {
				return db.getQueryResults(connection, 'START TRANSACTION')
			})
			.then(() => {
				return db.getQueryResults(connection, query)
					.then((rows: any) => rows.insertId)
					.catch((err) => Promise.reject(err))
			})
			.then((insertID: number) => {
				const referralID = 'CA' + (1000 + 490 + insertID);
				CAquery = `UPDATE registrations.\`ca-registrations\` SET referralID=${db.escape(referralID)}
				WHERE id=${db.escape(insertID)}`;
				return db.getQueryResults(connection, CAquery)
					.then((rows: any) => rows.affectedRows)
					.catch(err => Promise.reject(err))
			})
			.then((affectedRows: any) => {
				if (affectedRows === 1){
					res.send(true);
					res.end();
					return db.getQueryResults(connection, 'COMMIT')
						.then((rows) => rows)
						.catch(err => Promise.reject(err))
				}
				else {
					let err = new Error('ER_DUP_ENTRY');
					err.message = `SQLQuery = ${query}`;
					throw err;
				} 
			})	
			.catch(err => {
				process.nextTick(() => {
					db.getQueryResults(connection, 'ROLLBACK')
						.then(() => {
								logger.error(`insertCaRegQuery = ${query}`);
							if (referralID){
								logger.error(`CAquery@${referralID}\n ${CAquery}`);
								logger.error(`Transaction_Error@${referralID}`);
							}
							next(err);
						})
						.catch(next);
				})
			});
	})

app.post('/getCaInfo', (req : express.Request, res : express.Response, next)=> {
	assert.ok(req.body.facebookID);
	const facebookID = db.escape(req.body.facebookID);
	const query = `SELECT referralID, points FROM registrations.\`ca-registrations\` WHERE facebookID=${facebookID}`;
	db.query(query)
		.then((rows: any) => {
			res.status(200);
			console.log(rows[0].referralID);
			const res_body = {
				referralID: rows[0].referralID,
				points: rows[0].points
			}
			res.send(JSON.stringify(res_body));
			res.end();
		})
		.catch(next);
})
app.post('/postLink', (req : express.Request, res : express.Response, next) => {
	/*console.log(req.body);*/
	assert.ok(req.body.facebookID);
	assert.ok(req.body.link);

	const link = db.escape(req.body.link);
	const facebookID = db.escape(req.body.facebookID);

	// Links must always be a string and less than 1000 chars
	assert.ok(typeof req.body.link === 'string' && req.body.link.toString().length <= 1000);

	const linksTable = 'links';

	// MySQL Queries
	let checkQuery = `SELECT * FROM ${linksTable} WHERE facebookID=` + facebookID + ';';
	let updateQuery = `UPDATE ${linksTable} SET \`link\`=` + 
		link + ` WHERE \`facebookID\`=${facebookID};`; 
	let insertQuery	= `INSERT INTO ${linksTable} (\`facebookID\`, \`link\`) VALUES` + '(' +
		facebookID + ',' +
		link + ');';

	db.query(checkQuery)
		.then((res: any) => {
			console.log(res);
			return Array.from(res).length === 0
		})
		.then((e: boolean) => {
			if (e === true)
				return db.query(insertQuery);
			else
				return db.query(updateQuery);
		})
		.then((result: any) => {
			if(result.affectedRows !== 1)
				throw new Error(linksTable + ' had more than two entries with same facebookID');
			else {
				res.status(200);
				res.end();
			}
		})
		.catch(err => next(err));
})

app.use('/*', (req : express.Request, res : express.Response) => {
	res.status(404);
	res.end('404 : Not found');
})

app.use('/*', (err, req, res, next) => {
	logger.error(err);
	// Assertions errors are wrong user inputs
	if(err.name === 'SyntaxError' || 
		err.code === 'ERR_ASSERTION' || 
		err.code === 'ER_DATA_TOO_LONG'){

		// Bad HTTP Request
		res.status(400);
		res.end('400 - BAD REQUEST');
	}
	else if (err.code === 'ER_DUP_ENTRY') {
		// Bad HTTP Request
		res.status(409);
		res.end('409 - BAD REQUEST');
	}
	else {
		
		// Internal Server Error 
		res.status(500);
		res.end('500 - INTERNAL SERVER ERROR!');
	}
});
let server = https.createServer(certOptions, app);

server.listen(9000, (err : express.ErrorRequestHandler) => {
	if (err) 
		throw err;
	else 
		console.log("Server Listening on Port 9000");
});
