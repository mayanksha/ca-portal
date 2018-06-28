import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl } from '@angular/forms';

interface Startup {
	startupName: string;
	persons: number;
	teamMem: object;
	contactNo: string;
	email: string;
	loc: string;
	eventName: string;
}

@Component({
	selector: 'app-regform',
	templateUrl: './regform.component.html',
	styleUrls: ['./regform.component.css']
})
export class RegformComponent implements OnInit {
	constructor (
		private http: HttpClient,
	) {}

	postResponse: any;
	public startupInstance: Startup;
	public personarr: number[] = [1, 2, 3, 4, 5];
	serverUrl = 'http://13.126.100.70/form-data';
	contactReps = 1;
	contactArr = [1];
	headers = new Headers({
		'Content-Type' : 'application/json',
		'Access-Control-Allow-Origin' : '*',
	});

	logger(val): void {
		this.contactReps = Number(val);
		// console.log(this.contactReps);
		// console.log(`Team member value is ` + val);
	}

	createArr(val): void {
		const arr = [];
		for (let i = 1; i <= val; i++) {
		arr.push(i);
		}
		this.contactArr = arr;
		// console.log(this.contactArr);
	}

	onSubmit(form) {
		// console.log(form);
		return this.http.post(this.serverUrl, form).subscribe(
			(res) => {
				this.postResponse = res;
				console.log('Value Received:  ', res);
				document.write('<h3 style="margin : auto; font-family : Roboto ; text-align : center"></h3>');
			}
		);
	}

	emailValidation(address): boolean {
		/*tslint:disable*/
		const regex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
		return (regex.test(address) ? false : true);
	}
		/*tslint:enable*/

	contactValidation(contact): boolean {
		const regex = new RegExp(/^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/);
		return (regex.test(contact) ? false : true);
	}

	ngOnInit() {
		this.startupInstance = {
			startupName : '',
			persons : this.contactReps,
			teamMem : [' '],
			contactNo : '',
			email : '',
			loc : '',
			eventName : 'upbiz'
		};
	}
}

