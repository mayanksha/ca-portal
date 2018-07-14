import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
	providedIn: 'root'
})
export class BackendService {
	facebookID: string;
	private endPoint = 'https://msharma.me/api';
	/*private endPoint = 'https://localhost:8000';*/
	constructor(
		private http: HttpClient
	) {
		this.facebookID = localStorage.getItem('facebookID');
	}

	getReq = (uri: string): Promise<any> => {
		const url = `${this.endPoint}${uri}/`;
		return this.http.get(url).toPromise()
			.then(value => value)
			.catch(err => Promise.reject(err));
	}

	postReq = (uri: string, body: any): Promise<any> => {
		const url = `${this.endPoint}${uri}/`;
		const headers = new HttpHeaders({
			'Content-Type': 'application/json'
		});
		const options = { headers: headers };
		return this.http.post(url, body, options)
			.toPromise()
			.then((val) => val)
			.catch(err => Promise.reject(err));
	}
}
