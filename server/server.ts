import httpLogger = require('morgan');
import mysql = require('mysql');
import express = require('express');
import bodyParser = require('body-parser');
import process = require('process');
import crypto = require('crypto');
import session = require('express-session');
import cors = require('cors');

import assert = require('assert');
//Interfaces
import { dbConfig } from './interfaces/dbConfig';
import { Startup, Persons } from './interfaces/startup';
//Config
import { logger } from './config/logger';
import { localConfig as Config } from './config/local_config';

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
function enclose(val : any) {
	return `'` + val.toString() + `'`;
}
class Database {
	private connection : mysql.Connection;
	constructor(config : dbConfig, public database : string){
		config.database = database;
		this.connection  = mysql.createConnection(config);
		this.connection.connect(err => {
			if(err)
				throw new Error(JSON.stringify({ "SQL service isn't running. Error : \n" : err }));
		})
	}
	//Handle the Errors properly below
	query(sql : string, args? : any){
		return new Promise((resolve, reject) => {
			this.connection.query(sql, args, (err, rows : any) => {
				if (err) 
					return reject(err);
				resolve(rows);
			})
		})		
	}
	closeConnection(){
		return new Promise((resolve, reject) => {
			this.connection.end( err => {
				if (err) 
					return reject(err);
				resolve();
			} )
		})
	}
	escape(val: string){
		return this.connection.escape(val);
	}
}
/*.catch( err => throw err);*/

var db = new Database(Config, 'registrations');
var app : express.Application = express();
app.use(httpLogger('dev'));
app.use(session({ secret : Config.sessionSecret }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false }));

app.use(cors());
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

	let checkQuery = `SELECT * FROM \`${db.database}\`.\`${infoTable}\` WHERE facebookID=${facebookID}`;

	let insertQuery = `INSERT INTO \`${db.database}\`.\`${infoTable}\` ` +
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

			let mappingQuery = `INSERT INTO \`${db.database}\`.\`${mappingTable}\` ` +
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
/*app.get('/', (req, res)=> {
 *  const query = 'select * from registrations.upstart';
 *  db.query(query).then((e : any) => {
 *    console.log(Array.from(e).length);
 *  });
 *})*/
app.post('/postLink', (req : express.Request, res : express.Response) => {
	console.log(req.body);
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
		res.end();
	}
})
app.listen(8000, (err : express.ErrorRequestHandler) => {
	if(err) throw err;
	else console.log("server listending on 8000");
})
