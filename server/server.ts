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

// Interfaces
import { dbConfig } from './interfaces/dbConfig';
import { Startup, Persons } from './interfaces/startup';
import { Database } from './config/database';

// Config
import { logger } from './config/logger';
import { localConfig as Config } from './config/local_config';

/*import https = require('https');
 *var privkey = fs.readFileSync('/home/msharma/git/intern/server/encryption/localhost.key'); 
 *var cert = fs.readFileSync('/home/msharma/git/intern/server/encryption/localhost.crt');
 *const credentials: https.ServerOptions = {key : privkey, cert: cert};*/
function diff_time(a : Date, b : Date) : string {
	let t1 = a.getTime();
	let t2 = b.getTime();
	let msec = t1 - t2;
	let sec = Math.round(msec / 1000);
	let min = Math.round(sec / 60);
	let hrs = Math.round(min / 60);
	let days = Math.round(hrs / 24);
	return (days.toString())+ ":" + (hrs%24).toString() + ":" + ((min%24)%60).toString();
}

function handleError(error) {
	if (error instanceof Error){
		console.error(error);
	}
}
/*.catch( err => throw err);*/

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
app.get('/api/tasks', (req : express.Request, res : express.Response, next) => {
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
app.post('/api/tasks', (req : express.Request, res : express.Response, next) => {
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
app.post('/register', (req : express.Request, res : express.Response) => {
	assert.ok(req.body.startupName);
	assert.ok(req.body.email);
	assert.ok(req.body.numPersons);
	assert.ok(req.body.contactNo);
	assert.ok(req.body.location);
	assert.ok(req.body.eventName);
	assert.ok(req.body.facebookID);

	const startupName = db.escape(req.body.startupName);
	const email = db.escape(req.body.email);
	const numPersons = db.escape(req.body.numPersons);
	const contactNo = db.escape(req.body.contactNo);
	const location = db.escape(req.body.location);
	const eventName = db.escape(req.body.eventName);
	const facebookID = db.escape(req.body.facebookID);

	const infoTable = 'upstart';
	const mappingTable = 'id_person_mapping';
	const Persons : Persons[] = req.body.allPersons;

	let checkQuery = `SELECT * FROM \`${Config.database}\`.\`${infoTable}\` WHERE facebookID=${facebookID}`;

	let insertQuery = `INSERT INTO \`${Config.database}\`.\`${infoTable}\` ` +
		`(\`startupName\`, \`email\`, \`numPersons\`, \`phone\`, \`location\`, \`eventName\`, \`facebookID\`)` +
		` VALUES (` +
			startupName +  "," +
			email +  "," +
			numPersons +  "," +
			contactNo +  "," +
			location +  "," +
			eventName +  "," +
			facebookID +  ");";

			let updateQuery =
			`UPDATE \`registrations\`.\`upstart\` ` + 
			`SET \`startupName\`=${startupName}, ` + 
			`   \`email\`=${email}, ` + 
			`   \`numPersons\`=${numPersons}, ` +
			`   \`phone\`=${contactNo}, ` +
			`   \`location\`=${location},` +
			`   \`eventName\`=${eventName},` +
			`   \`facebookID\`=${facebookID} WHERE \`facebookID\`=${facebookID};`;

			let mappingQuery = `INSERT INTO \`${Config.database}\`.\`${mappingTable}\` ` +
			`(\`facebookID\`, \`PersonName\`) VALUES `;
			for(let i = 0; i < Persons.length; i++){
				mappingQuery += `(` + facebookID +  "," + db.escape(Persons[i].name) + `)`;
				if(i != Persons.length - 1)
					mappingQuery += ',';
			}
			let insert = false;
			let deleteQuery = `DELETE FROM ${mappingTable} WHERE \`facebookID\`=${facebookID}`;
			console.log(checkQuery);
			db.query(checkQuery)
			.then((res: any) => {
				console.log(res);
				if(Array.from(res).length === 0)
					insert = true;
				return insert; 
			})
			.then((e: boolean) => {
				if (e === true)
					return db.query(insertQuery);
				else
					return db.query(updateQuery);
			})
			.then((result: any) => {
				if(result.affectedRows !== 1)
					throw new Error(infoTable + ' had more than two entries with same facebookID');
				else {
					// Case when persons are already mapped, so remove those by their facebookID

					if(insert === false){
						return db.query(deleteQuery)
							.then(result => {
								console.log(result);
								return db.query(mappingQuery)
									.then(res => res)
									.catch(err => {
										console.log(err);
										res.status(500);
										res.end(JSON.stringify("false"));
									});
							})
							.catch(err => {
								console.log(err);
								res.status(500);
								res.end(JSON.stringify("false"));
							});
					}
					else {
						// New User's fbID has been added, now added the Persons too!
						return db.query(mappingQuery)
							.then(res => res)
							.catch(err => {
								console.log(err);
								res.status(500);
								res.end(JSON.stringify("false"));
							});
					}
				}
			})
			.then((result : any) => {
				if(result.affectedRows === Persons.length)
					res.status(200);
				res.end(JSON.stringify(true));
			})
			.catch(err => {
				console.log(err);
				res.status(500);
				res.end(JSON.stringify("false"));
			})
});
app.get('/', (req, res)=> {
	res.end("HI!");
})
app.post('/postLink', (req : express.Request, res : express.Response) => {
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
		.catch(err => {
			if (err){
				console.error(err);
				res.status(500);
				res.end();
			}
		});
})

/*app.post('/postLink', (req : express.Request, res : express.Response) => {
 *  assert.ok(req.body.facebookID);
 *  assert.ok(req.body.contact);
 *  assert.ok(req.body.name);
 *  assert.ok(req.body.message);
 *})*/
app.use('/*', (req : express.Request, res : express.Response) => {
	res.status(404);
	res.end('404 : Not found');
})
app.use('/*', (err, req, res, next) => {
	// Assertions errors are wrong user inputs
	if(err.name === 'SyntaxError' || err.code === 'ERR_ASSERTION'){
		console.error(err);

		// Bad HTTP Request
		res.status(400);
		res.end();
	}
	else {
		console.error(err.code);

		// Internal Server Error 
		res.status(500);
		res.end('500 - INTERNAL SERVER ERROR!');
	}
});
/*const server = https.createServer(credentials, app);*/
app.listen(9000, (err : express.ErrorRequestHandler) => {
	if(err) throw err;
	else console.log("Server Listening on Port 9000");
})
