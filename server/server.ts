import httpLogger = require('morgan');
import mysql = require('mysql');
import express = require('express');
import bodyParser = require('body-parser');
import process = require('process');
import crypto = require('crypto');
import passport = require('passport');
import session = require('express-session');

//Interfaces
import { dbConfig } from './interfaces/dbConfig';

//Config
import { logger } from './config/logger';
import { Config } from './config/local_config';


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
class Database {
	private connection : mysql.Connection;
	constructor(config : dbConfig, database : string){
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
}
	/*.catch( err => throw err);*/

var db = new Database(Config, 'earlysalary');
var app : express.Application = express();
app.use(httpLogger('dev'));
app.use(session({ secret : Config.sessionSecret }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req : express.Request, res : express.Response) => {
	res.end("Working!");	
})

app.use('/*', (req : express.Request, res : express.Response) => {
	res.status(404);
	res.end('404 : Not found');
})
app.listen(8000, (err : express.ErrorRequestHandler) => {
	if(err) throw err;
	else console.log("server listending on 8000");
})
