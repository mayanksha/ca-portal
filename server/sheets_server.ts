import * as mysql from 'mysql';

/*import { logger } from './config/logger';*/
import { google, sheets_v4 } from 'googleapis';
import { Database } from './config/database';
import { Startup } from './interfaces/startup'; 
import { localConfig, sheetsConfig } from './config/local_config';

export class DatabaseToSheets {
	private scopes = ['https://www.googleapis.com/auth/spreadsheets'];
	private sheets: any;
	private db: Database;

	private JWTClient;
	constructor() {
		this.JWTClient = new google.auth.JWT(sheetsConfig.client_email,
			undefined, 
			sheetsConfig.private_key,
			this.scopes,
			undefined);	
		this.db = Database.getInstance();	
		this.sheets = google.sheets('v4');
	}

	private fetchUpstartData(): Promise<any> {
		const query = `SELECT up.id,up.facebookID, up.startupName, up.email, up.numPersons,
		up.phone, up.location, up.eventName, ipm.PersonName, links.link
		FROM registrations.upstart as up inner
		join id_person_mapping as ipm on up.facebookID=ipm.facebookID
		left join links on up.facebookID=links.facebookID order by up.id`;

		let personsQuery = `SELECT * FROM registrations.id_person_mapping`;
		let startupArray: Startup[] = [];
		let allStartups = [];	
		let allPersons = [];

		return this.db.query(query)
		.then(rows => {
			let values: Startup[] = JSON.parse(JSON.stringify(rows));
			values = values.map((elem) => (Object as any).values(elem));
			/*console.log(values);*/
			return values;
		})
		.catch(err => {
			/*logger.log('error', err);*/
			console.error(err);
		})
	}

	private fetchData(tableName: string): Promise<any> {
		let query: string;
		if (tableName !== 'pitch')
			 query = 	
			`SELECT * FROM registrations.${tableName} WHERE id IN (SELECT MAX(id) FROM registrations.${tableName} GROUP BY facebookID)`;
		else query = 
		`SELECT ss.*, li.link FROM registrations.links as li RIGHT JOIN (SELECT * FROM registrations.pitch  as pitch WHERE id IN (SELECT MAX(id) FROM registrations.pitch GROUP BY facebookID)) ss
ON ss.facebookID=li.facebookID`;
		
return this.db.query(query)
		.then(rows => {
			let values: Startup[] = JSON.parse(JSON.stringify(rows));
			values = values.map((elem) => (Object as any).values(elem));
			/*console.log(values);*/
			return values;
		})
		.catch(err => {
			/*logger.log('error', err);*/
			console.error(err);
		})
	}
	private authorize(): Promise<any> {
		return new Promise((resolve, reject) => {
			this.JWTClient.authorize((err, tokens) => {
				if (err)
					return reject(err);
				else return resolve(tokens);
			})
		})
	}

	public updateSheet(event: string): Promise<any> {
		if (event === 'upstart'){
			return this.fetchUpstartData()
				.then((data) => {
					let body = {
						values: data 
					}
					return body;
				})
				.then((sheetBody: any) => {
					return this.authorize()
						.then((tokens) => [tokens, sheetBody])
				})
				.then((TokenSheetBodyArray: any[]) => {
					return new Promise((resolve, reject) => {
						this.sheets.spreadsheets.values.update({
							spreadsheetId: localConfig.events[event].sheetId,
							valueInputOption: "RAW",
							resource: TokenSheetBodyArray[1],
							range: 'A2:L',
							auth: this.JWTClient,
						}, (err, result) => {
							if(err){
								return reject(err);
							}
							else {
								return resolve(result);
							}
						})
					})
						.then((result: any) => result.data)
						.catch((err) => {
							console.error(err);
							return Promise.reject(err);
						})
				})

		}
		else {
			return this.fetchData(localConfig.events[event].table)
				.then((data) => {
					let body = {
						values: data 
					}
					return body;
				})
				.then((sheetBody: any) => {
					return this.authorize()
						.then((tokens) => [tokens, sheetBody])
				})
				.then((TokenSheetBodyArray: any[]) => {
					return new Promise((resolve, reject) => {
						this.sheets.spreadsheets.values.update({
							spreadsheetId: localConfig.events[event].sheetId,
							valueInputOption: "RAW",
							resource: TokenSheetBodyArray[1],
							range: 'A2:Z',
							auth: this.JWTClient,
						}, (err, result) => {
							if(err){
								return reject(err);
							}
							else {
								return resolve(result);
							}
						})
					})
						.then((result: any) => result.data)
						.catch((err) => {
							console.error(err);
							return Promise.reject(err);
						})
				})
				
		}
	}
}
/*const DTS = new DatabaseToSheets();
 *setTimeout(() => {
 *  Object.keys(localConfig.events).forEach(e => {
 *    DTS.updateSheet(e);
 *  })
 *}, 100);*/
/*setInterval(() => {
 *  DTS.writeToSheet();
 *}, 5000);*/
