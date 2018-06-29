import httpLogger = require('morgan');
import mysql = require('mysql');
import express = require('express');
import bodyParser = require('body-parser');
import process = require('process');
import crypto = require('crypto');
import session = require('express-session');
import cors = require('cors');
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


var db = new Database(Config, 'ca-portal');
var app : express.Application = express();
app.use(httpLogger('dev'));
app.use(session({ secret : Config.sessionSecret }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false }));

app.use(cors());
app.get('/', (req : express.Request, res : express.Response) => {
	res.end("Working!");	
})

app.post('/api/register', (req : express.Request, res : express.Response) => {
	const mainDb = 'upstart';
	const mappingTable = 'id_person_mapping';
	const Persons : Persons[] = req.body.allPersons;

	let insertQuery = `INSERT INTO \`${db.database}\`.\`${mainDb}\` ` +
		`(\`startupName\`, \`email\`, \`numPersons\`, \`phone\`, \`location\`, \`eventName\`)` +
		` VALUES (` +
			/*db.escape('') + "," +*/
			db.escape(req.body.startupName) +  "," +
			db.escape(req.body.email) +  "," +
			db.escape(req.body.numPersons) +  "," +
			db.escape(req.body.contactNo) +  "," +
			db.escape(req.body.location) +  "," +
			db.escape(req.body.eventName) +  "," +
			db.escape(req.body.facebookID) +  ");";

			db.query(insertQuery)
			.then((res : any) => {
				return res.insertId
			})
			.then(id => {
				let mappingQuery = `INSERT INTO \`${db.database}\`.\`${mappingTable}\` ` +
					`(\`id\`, \`PersonName\`) VALUES `;
				for(let i = 0; i < Persons.length; i++){
					mappingQuery += `(` + db.escape(id) +  "," + db.escape(Persons[i].name) + `)`;
					if(i != Persons.length - 1)
						mappingQuery += ',';
				}

				return db.query(mappingQuery)
					.then(res => res)
					.catch(console.error);
			})
			.then((result : any) => {
				if(result.affectedRows == Persons.length)
					res.status(200);
					res.end(JSON.stringify(true));
			})
			.catch(err => console.log(err));
		})
	app.use('/*', (req : express.Request, res : express.Response) => {
		res.status(404);
		res.end('404 : Not found');
	})
	app.listen(8000, (err : express.ErrorRequestHandler) => {
		if(err) throw err;
		else console.log("server listending on 8000");
	})
