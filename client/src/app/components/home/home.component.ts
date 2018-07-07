import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
declare var particlesJS: any;

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
	tasks = [{
			id : '123',
			task: 'Some Task HERE'
		},
		{
			id : '124',
			task: 'Some Task HERE'
		},
		{
			id : '125',
			task: 'Some Task HERE'
		}];

	checked_0 = false;
	form: any = null;
	facebookID: string;
	constructor(
		private fb: FormBuilder
	) {
		this.facebookID = localStorage.getItem('facebookID');
	}
	ngOnInit() {
		particlesJS.load('particles-js', '../../assets/particlesjs-config.json', null);
		this.form = this.fb.group({
			'facebookID' : [this.facebookID],
			'link' : ['',
				Validators.compose([Validators.required, Validators.maxLength(1000)])
			]});
	}

}
