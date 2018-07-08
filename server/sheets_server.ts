import { google, sheets_v4 } from 'googleapis';
import { Database } from './config/database';
import * as mysql from 'mysql';
import { Startup } from './interfaces/startup'; 
import { localConfig } from './config/local_config';
/*import { sheets }*/
class DatabaseToSheets {

	private sheets: any;
	private db: Database;
	private allStartups: Startup[] = [];
	constructor() {
		this.db = Database.getInstance();	
		this.sheets = google.sheets({
			version: 'v4',
			auth: localConfig.apiToken
		})
	}
	public fetchAllData(): Promise<Startup[]> {
		const query = `SELECT * FROM registrations.upstart`;
		let personsQuery = `SELECT * FROM registrations.id_person_mapping`;
		let startupArray: Startup[] = [];
		let allStartups = [];	
		let allPersons = [];

		let startupsPromise = this.db.query(query)
			.then(rows => Array.from(rows as any))
			.then((arr: any) => allStartups = arr)
			.catch(err => console.error(err));
		let personsPromise = this.db.query(personsQuery)
			.then(rows => Array.from(rows as any))
			.then((arr: any) => allPersons = arr)
			.catch(err => console.error(err));
			
		return Promise.all([startupsPromise, personsPromise])
			.then(() => {
				allStartups.forEach((e: any) => {
					let fbID = e.facebookID;
					let members = (allPersons.filter((elem: any) => elem.facebookID === fbID))
						.map((e: any) => e.PersonName);
					console.log(members);
					startupArray.push({
						startupName: e.startupName,
						numPersons: e.numPersons,
						allPersons: members,
						contactNo: e.phone,
						email: e.email,
						location: e.location,
						eventName: e.eventName,
					})	
				})
				return (this.allStartups = startupArray);
			})
			.catch(err => {
				console.error
				return Promise.reject(err);
			});
	}
	
	public writeToSheet() {
		this.fetchAllData()
			.then(e => {
				let values = [
						['startupName',
						'numPersons',
						'allPersons',
						'contactNo',
						'email',
						'location',
						'eventName',]
				]
				let body = {
					values: values
				}
				this.sheets.spreadsheets.values.update({
					spreadsheetId: localConfig.sheet,
					valueInputOption: "RAW",
					resource: body,
					range: 'A:G',
					key: localConfig.apiToken
				}, (err, result) => {
					if(err)
						console.error(err);
					else 
						console.log(result);
				})
				/*values = values.concat(e as any);
				 *console.log(values);*/
				/*this.sheets.spreadsheets.values.updatee({
				 *  spreadsheetId: localConfig.sheet,
				 *  valueInputOption: "RAW",
				 *  resource: body
				 *})*/
			})
	}
	
}

const DTS = new DatabaseToSheets();
DTS.writeToSheet();


