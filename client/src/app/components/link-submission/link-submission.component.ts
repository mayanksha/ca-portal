import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Component({
	selector: 'app-link-submission',
	templateUrl: './link-submission.component.html',
	styleUrls: ['./link-submission.component.css']
})
export class LinkSubmissionComponent implements OnInit {
	form: FormGroup;
	facebookID: string;
	success = 0;
	/*postLinkEndpoint = 'https://13.126.187.150/api/postLink/';*/
	postLinkEndpoint = 'http://localhost:8000/api/postLink/';
	constructor(private fb: FormBuilder,
							private http: HttpClient
	) {  }

	ngOnInit() {
		this.facebookID = localStorage.getItem('facebookID');
		this.form = this.fb.group({
			'facebookID' : [this.facebookID],
			'link' : ['',
				Validators.compose([Validators.required, Validators.maxLength(1000)])
			]});
	}

	onSubmit() {
		console.log(this.form.value);
		return this.http.post(this.postLinkEndpoint, this.form.value).toPromise().then(val => {
				this.success = 1;
				console.log('Value Posted Successfully');
			}
		)
		.catch(err => {
			this.success = 2;
			/*console.error(err)*/
		});
	}
}
