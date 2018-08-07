import assert 		= require('assert');
import mysql 		 	= require('mysql');
import SqlString	= require('sqlstring');

import { NextFunction, Request, Response, Router } from 'express';
import { Database } from '../config/database';
import { DatabaseToSheets } from '../sheets_server';
import { Startup, Persons } from '../interfaces/startup';

import { localConfig } from '../config/local_config';

export class CompetitionControl {
	db: any;
	dbToSheet: any;
	constructor() {
		var dbToSheet = new DatabaseToSheets();
		this.db = Database.getInstance();
		this.dbToSheet = new DatabaseToSheets();
	}

	/*
	 *    @param
	 *
	 **/
	public upstartHandler = (req : Request, res : Response, next : NextFunction) => {
		assert.ok(req.body.startupName);
		assert.ok(req.body.email);
		assert.ok(req.body.numPersons);
		assert.ok(req.body.contactNo);
		assert.ok(req.body.location);
		assert.ok(req.body.eventName);
		assert.ok(req.body.facebookID);

		const startupName = this.db.escape(req.body.startupName);
		const email = this.db.escape(req.body.email);
		const numPersons = this.db.escape(req.body.numPersons);
		const contactNo = this.db.escape(req.body.contactNo);
		const location = this.db.escape(req.body.location);
		const eventName = this.db.escape(req.body.eventName);
		const facebookID = this.db.escape(req.body.facebookID);

		const infoTable = 'upstart';
		const mappingTable = 'id_person_mapping';
		const Persons : Persons[] = req.body.allPersons;

		let checkQuery = `SELECT * FROM \`${localConfig.database}\`.\`${infoTable}\` WHERE facebookID=${facebookID}`;

		let insertQuery = `INSERT INTO \`${localConfig.database}\`.\`${infoTable}\` ` +
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

				let mappingQuery = `INSERT INTO \`${localConfig.database}\`.\`${mappingTable}\` ` +
				`(\`facebookID\`, \`PersonName\`) VALUES `;
				for(let i = 0; i < Persons.length; i++){
					mappingQuery += `(` + facebookID +  "," + this.db.escape(Persons[i].name) + `)`;
					if(i != Persons.length - 1)
						mappingQuery += ',';
				}
				let insert = false;
				let deleteQuery = `DELETE FROM ${mappingTable} WHERE \`facebookID\`=${facebookID}`;
				/*console.log(checkQuery);*/
				this.db.query(checkQuery)
				.then((res: any) => {
					if(Array.from(res).length === 0)
						insert = true;
					return insert; 
				})
				.then((e: boolean) => {
					if (e === true)
						return this.db.query(insertQuery);
					else
						return this.db.query(updateQuery);
				})
				.then((result: any) => {
					if(result.affectedRows !== 1)
						throw new Error(infoTable + ' had more than two entries with same facebookID');
					else {
						// Case when persons are already mapped, so remove those by their facebookID

						if(insert === false){
							return this.db.query(deleteQuery)
								.then(result => {
									console.log(result);
									return this.db.query(mappingQuery)
										.then(res => res)
										.catch(err => Promise.reject(err));
								})
								.catch(err => Promise.reject(err));
						}
						else {
							// New User's fbID has been added, now added the Persons too!
							return this.db.query(mappingQuery)
								.then(res => res)
								.catch(err => Promise.reject(err));
						}
					}
				})
				.then((result : any) => {
					if(result.affectedRows === Persons.length){
						res.status(200);
						res.end(JSON.stringify(true));
						return this.dbToSheet.updateSheet('upstart')
							.then((data) => data)
							.catch(err => Promise.reject(err))	
					}
					else {
						console.log("Some severe error!");
						res.status(500);
						res.end(JSON.stringify(false));
					}
				})
				.then((data) => console.log(data))
				.catch(err => {
					console.log(err);
					res.status(500);
					res.end(JSON.stringify("false"));
				})
	}

	public stockTheStockHandler = (req: Request, res: Response, next : NextFunction) => {
		assert.ok(req.body.teamName);
		assert.ok(req.body.leaderName);
		assert.ok(req.body.collegeName);
		assert.ok(req.body.leaderPhone);
		assert.ok(req.body.leaderEmail);
		assert.ok(req.body.name2);
		assert.ok(req.body.phone2);
		assert.ok(req.body.facebookID);

		const teamName = this.db.escape(req.body.teamName);
		const collegeName = this.db.escape(req.body.collegeName);
		const leaderPhone = this.db.escape(req.body.leaderPhone);
		const phone2 = this.db.escape(req.body.phone2);
		const leaderEmail = this.db.escape(req.body.leaderEmail);
		const leaderName = this.db.escape(req.body.leaderName);
		const name2 = this.db.escape(req.body.name2);
		const name3 = this.db.escape(req.body.name3);
		const name4 = this.db.escape(req.body.name4);
		const name5 = this.db.escape(req.body.name5);
		const facebookID = this.db.escape(req.body.facebookID);


		let insertQuery = `INSERT INTO registrations.stock
		(teamName, collegeName, leaderPhone, phone2, leaderEmail, leaderName, name2, name3, name4, name5, facebookID, last_update)
		VALUES(${teamName},${collegeName}, ${leaderPhone}, ${phone2},
			${leaderEmail},
			${leaderName}, ${name2}, ${name3}, ${name4}, ${name5},
			${facebookID}, CURRENT_TIMESTAMP);`

		this.db.query(insertQuery)
			.then((rows: any) => {
				res.status(200);
				res.end(JSON.stringify(true));
				return rows;
			})
			.then(() => {
				return this.dbToSheet.updateSheet('stock')
					.then((data) => data)
					.catch(err => Promise.reject(err))	
			})
			.catch((err) => next(err));
	}

	public pitchHandler = (req: Request, res: Response, next : NextFunction) => {
		assert.ok(req.body.teamName);
		assert.ok(req.body.name1);
		assert.ok(req.body.phone1);
		assert.ok(req.body.institute);
		assert.ok(req.body.industry);
		assert.ok(req.body.patent);
		assert.ok(req.body.prodAnalysis);
		assert.ok(req.body.scope);
		assert.ok(req.body.whyLaunch);
		assert.ok(req.body.seedFund);
		assert.ok(req.body.facebookID);

		let teamName = this.db.escape(req.body.teamName);
		let name1 = this.db.escape(req.body.name1);
		let name2 = this.db.escape(req.body.name2);
		let name3 = this.db.escape(req.body.name3);
		let name4 = this.db.escape(req.body.name4);
		let name5 = this.db.escape(req.body.name5);
		let institute = this.db.escape(req.body.institute);
		let email = this.db.escape(req.body.email);
		let phone1 = this.db.escape(req.body.phone1);
		let phone2 = this.db.escape(req.body.phone2);
		let industry = this.db.escape(req.body.industry);
		let prodAnalysis = this.db.escape(req.body.prodAnalysis);
		let scope = this.db.escape(req.body.scope);
		let patent = this.db.escape(req.body.patent);
		let whyLaunch = this.db.escape(req.body.whyLaunch);
		let seedFund = this.db.escape(req.body.seedFund);
		let facebookID = this.db.escape(req.body.facebookID);

		let insertQuery = 
`INSERT INTO registrations.pitch
		(teamName, name1, name2, name3, name4, name5, institute, email, phone1, phone2, industry, prodAnalysis, \`scope\`, patent, whyLaunch, seedFund, facebookID, last_update)
		VALUES(${teamName}, ${name1}, ${name2}, ${name3}, ${name4}, ${name5}, ${institute}, ${email}, ${phone1}, ${phone2}, ${industry}, ${prodAnalysis}, ${scope}, ${patent}, ${whyLaunch}, ${seedFund}, ${facebookID}, CURRENT_TIMESTAMP);`

		this.db.query(insertQuery)
			.then((rows: any) => {
				res.status(200);
				res.end(JSON.stringify(true));
				return rows;
			})
			.then(() => {
				return this.dbToSheet.updateSheet('pitch')
					.then((data) => data)
					.catch(err => Promise.reject(err))	
			})
			.catch((err) => next(err));
	}

	public decryptHandler = (req: Request, res: Response, next : NextFunction) => {
		assert.ok(req.body.teamName);
		assert.ok(req.body.email);
		assert.ok(req.body.name1);
		assert.ok(req.body.phone1);
		assert.ok(req.body.mode);
		assert.ok(req.body.facebookID);

		let teamName = this.db.escape(req.body.teamName);
		let email = this.db.escape(req.body.email);
		let name1 = this.db.escape(req.body.name1);
		let name2 = this.db.escape(req.body.name2);
		let name3 = this.db.escape(req.body.name3);
		let phone1 = this.db.escape(req.body.phone1);
		let phone2 = this.db.escape(req.body.phone2);
		let mode = this.db.escape(req.body.mode);
		let facebookID = this.db.escape(req.body.facebookID);

		let insertQuery = `INSERT INTO registrations.decrypt
		(teamName, email, phone1, phone2, name1, name2, name3, mode, facebookID, last_update)
		VALUES(${teamName}, ${email}, ${phone1}, ${phone2}, ${name1}, ${name2}, ${name3}, ${mode}, ${facebookID}, CURRENT_TIMESTAMP)`;

		this.db.query(insertQuery)
			.then((rows: any) => {
				res.status(200);
				res.end(JSON.stringify(true));
				return rows;
			})
			.then(() => {
				return this.dbToSheet.updateSheet('decrypt')
					.then((data) => data)
					.catch(err => Promise.reject(err))	
			})
			.catch((err) => next(err));
	}

	public bizquizHandler = (req: Request, res: Response, next : NextFunction) => {
		assert.ok(req.body.teamName);
		assert.ok(req.body.name1);
		assert.ok(req.body.phone1);
		assert.ok(req.body.email);
		assert.ok(req.body.facebookID);

		let teamName = this.db.escape(req.body.teamName);
		let email = this.db.escape(req.body.email);
		let name1 = this.db.escape(req.body.name1);
		let name2 = this.db.escape(req.body.name2);
		let name3 = this.db.escape(req.body.name3);
		let phone1 = this.db.escape(req.body.phone1);
		let phone2 = this.db.escape(req.body.phone2);
		let facebookID = this.db.escape(req.body.facebookID);

		let insertQuery = `INSERT INTO registrations.bizquiz
		(teamName, email, phone1, phone2, name1, name2, name3, facebookID, last_update)
		VALUES(${teamName}, ${email}, ${phone1}, ${phone2}, ${name1}, ${name2}, ${name3}, ${facebookID}, CURRENT_TIMESTAMP)`;

		this.db.query(insertQuery)
			.then((rows: any) => {
				res.status(200);
				res.end(JSON.stringify(true));
				return rows;
			})
			.then(() => {
				return this.dbToSheet.updateSheet('bizquiz')
					.then((data) => data)
					.catch(err => Promise.reject(err))	
			})
			.catch((err) => next(err));
	}
}
