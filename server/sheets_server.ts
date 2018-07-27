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

	public JWTClient;
	constructor() {
		this.JWTClient = new google.auth.JWT(sheetsConfig.client_email,
			undefined, 
			sheetsConfig.private_key,
			this.scopes,
			undefined);	
		this.db = Database.getInstance();	
		this.sheets = google.sheets('v4');
	}

	private fetchAllData(): Promise<any> {
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

	private authorize(): Promise<any> {
		return new Promise((resolve, reject) => {
			this.JWTClient.authorize((err, tokens) => {
				if (err)
					return reject(err);
				else return resolve(tokens);
			})
		})
	}

	public writeToSheet(): Promise<any> {
		return this.fetchAllData()
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
					spreadsheetId: localConfig.sheet,
					valueInputOption: "RAW",
					resource: TokenSheetBodyArray[1],
					range: 'A2:J',
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
const DTS = new DatabaseToSheets();
setTimeout(() => {
	DTS.writeToSheet();
}, 100);
/*setInterval(() => {
 *  DTS.writeToSheet();
 *}, 5000);*/
