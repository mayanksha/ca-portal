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

/*import https = require('https');
 *var privkey = fs.readFileSync('/home/msharma/.ssh/localhost.key'); 
 *var cert = fs.readFileSync('/home/msharma/.ssh/localhost.crt');
 *const credentials: https.ServerOptions = {key : privkey, cert: cert};*/
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

app.get('/api/task_count', (req : express.Request, res : express.Response, next) => {
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
				let err = new Error('Critical Problem. More than one CA with same email ID.');
				err.name = 'ER_DUPE_ENTRIES';
				throw err;
			}
		})
		.catch(err => next(err));
})

app.post('/registerCaUser', (req : express.Request, res : express.Response, next) => {
	assert.ok(req.body.email);
	assert.ok(req.body.name);
	assert.ok(req.body.phone);
	assert.ok(req.body.facebookID);

	const facebookID = db.escape(req.body.facebookID);
	const email = db.escape(req.body.email);
	const name = db.escape(req.body.name);
	const phone = db.escape(req.body.phone);
	const query = `INSERT INTO registrations.\`ca-registrations\` (name, email, phone, facebookID) VALUES(${name}, ${email}, ${phone}, ${facebookID})`;

	db.query('START TRANSACTION')
		.then(() => {
			return db.query(query)
		})
		.then((rows: any) => {
			const insertID = rows.insertId;
			res.end();
			return insertID;
			/*}
			 *else if (len == 1){
			 *  res.status(200);
			 *  res.send(true);
			 *  res.end();
			 *}
			 *else {
			 *  let err = new Error('Critical Problem. More than one CA with same email ID.');
			 *  err.name = 'ER_DUPE_ENTRIES';
			 *  throw err;
			 *}*/
		})
		.then((insertID: number) => {
			const referralID = 'CA' + (1000 + insertID);
			console.log(referralID);
			const CAquery = `UPDATE registrations.\`ca-registrations\` SET referralID=${db.escape(referralID)}
WHERE id=${db.escape(insertID)}`;
			return db.query(CAquery)
		})
		.then((rows: any) => {
			if (rows.affectedRows === 1){
				return db.query('COMMIT')
			}
			else throw new Error('ER_WRONG_CA_INSERTION')
		})	
		.catch(err => {
			db.query('ROLLBACK')
				.then(console.log)
				.catch(console.error);
			next(err)
		});
})

app.post('/getReferralID', (req : express.Request, res : express.Response, next)=> {
	assert.ok(req.body.facebookID);
	const facebookID = db.escape(req.body.facebookID);
	const query = `SELECT referralID FROM registrations.\`ca-registrations\` WHERE facebookID=${facebookID}`;
	db.query(query)
		.then((rows: any) => {
			res.status(200);
			console.log(rows[0].referralID);
			res.send(JSON.stringify(rows[0].referralID));
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
