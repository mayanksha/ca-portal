import mysql = require("mysql");
import SqlString = require('sqlstring');
/*import timers = require('timers');*/

import { dbConfig } from "../interfaces/dbConfig";
import { localConfig } from './local_config';
// Singleton Database class, only one instance needed:w
//
export class Database {
	public static getInstance() {
		return this._instance || (this._instance = new this(localConfig, localConfig.database));
	}

	private static _instance: Database;

	/*private connection: mysql.Connection;*/
	private pool: mysql.Pool;

	constructor(config: dbConfig, database: string) {
		config.database = database;
		/*this.connection  = mysql.createConnection(config);*/
		this.pool = mysql.createPool({
			connectionLimit: 10,
			host: localConfig.host,
			port : localConfig.port,
			user: localConfig.user,
			password: localConfig.password,
			database: localConfig.database
		});
		console.log("Connected to Database " + localConfig.database );
		/*this.connection.connect((err) => {
		 *  if (err) {
		 *    throw err;
		 *  }
		 *  [>this.connection.destroy();<]
		 *  setTimeout(() => {
		 *    console.log("Connection ended!");
		 *    process.nextTick(() => {
		 *      this.query("SELECT * FROM test.all_cluster").then(console.log).catch(console.error);
		 *    });
		 *  }, 5000);
		 *  console.log(`Database connected successfully on ${config.user}@${config.host}`);
		 *});*/
	}

	private getPoolConnection(): Promise<mysql.PoolConnection> {
		return new Promise((resolve, reject) => {
			this.pool.getConnection((err, connection) => {
				if (err)
					return reject(err);
				return resolve(connection);
			});
		});
	}

	/*tslint:disable*/
	public query(sql: string, args?: any) {
		return this.getPoolConnection()
			.then((conn) => {
				return new Promise((resolve, reject) => {
					conn.query(sql, args, (err, results, fields) => {
						if(err)
							return reject(err);	
						conn.release();
						return resolve(results)	;
					}) 
				})
			})
			.then(results => results)
			.catch(err => console.error(err));	
	}



	/*
	 *   Below methods were suitable for non-pooled connection, i.e
	 *   directly creating connections using mysql.createConnection
	 */


	/*public query(sql: string, args?: any) {
	 *  return new Promise((resolve, reject) => {
	 *    this.connection.query(sql, args, (err, rows: any) => {
	 *      if (err) {
	 *        return reject(err);
	 *      }
	 *      resolve(rows);
	 *    });
	 *  });
	 *}*/
	/*public closeConnection() {
	 *  return new Promise((resolve, reject) => {
	 *    this.connection.end( (err) => {
	 *      if (err) {
	 *        return reject(err);
	 *      }
	 *      resolve();
	 *    } );
	 *  });
	 *}*/
	public escape(input: any) {
		return SqlString.escape(input);
	}

}
