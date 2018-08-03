import httpLogger = require('morgan');
import mysql = require('mysql');
import express = require('express');
import bodyParser = require('body-parser');
import process = require('process');
import crypto = require('crypto');
import session = require('express-session');
import cors = require('cors');
import assert = require('assert');
import fs = require('fs');

import { DatabaseToSheets } from './sheets_server';

// Interfaces
import { dbConfig } from './interfaces/dbConfig';
import { Database } from './config/database';

// Config
import { logger } from './config/logger';
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
app.use(httpLogger('combined'));
app.use(session({ secret : Config.sessionSecret }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false }));

app.use(cors());

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
	const query = `SELECT * FROM registrations.tasks`;
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
	// Assertions errors are wrong user inputs
	if(err.name === 'SyntaxError' || 
		err.code === 'ERR_ASSERTION' || 
		err.code === 'ER_DATA_TOO_LONG'){
		console.error(err);

		// Bad HTTP Request
		res.status(400);
		res.end();
	}
	else {
		console.error(err);

		// Internal Server Error 
		res.status(500);
		res.end('500 - INTERNAL SERVER ERROR!');
	}
});
/*let server = https.createServer(credentials, app);*/

app.listen(9000, (err : express.ErrorRequestHandler) => {
	if (err) 
		throw err;
	else 
			console.log("Server Listening on Port 9000");
});
