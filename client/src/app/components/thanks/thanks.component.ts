import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-thanks',
	templateUrl: './thanks.component.html',
	styleUrls: ['./thanks.component.css']
})
export class ThanksComponent implements OnInit {

	constructor() {
		setTimeout(() => {
			window.open('/', '_self').close();
		}, 1000);
	}

	ngOnInit() {
	}

}
