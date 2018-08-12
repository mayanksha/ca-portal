import { Component, OnInit } from '@angular/core';
/*import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';*/
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';
import { FbDataService } from '../../services/fb-data.service';
import { FormArray, FormGroup, FormBuilder, Validators, ValidatorFn, FormControl, NgForm, FormGroupDirective } from '@angular/forms';

export class MyErrorStateMatcher implements ErrorStateMatcher {
	isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
		const isSubmitted = form && form.submitted;
		return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
	}
}
@Component({
	selector: 'app-onetime-register',
	templateUrl: './onetime-register.component.html',
	styleUrls: ['./onetime-register.component.css']
})
export class OnetimeRegisterComponent implements OnInit {

	facebookID: string;
	userName = '';
	matcher: MyErrorStateMatcher;
	form: FormGroup;
	/*postEndpoint = 'https://msharma.me/api/register/oneTime';*/
	postEndpoint = 'https://localhost:9000/api/registerCaUser';

	// 0 = showForm, 1 = Success, 2 = Failure
	success = 0;

	emailFormControl = new FormControl('', [
		Validators.email,
		Validators.required,
	]);
	constructor (
		private http: HttpClient,
		private fb: FormBuilder,
		private router: Router,
		private dataService: FbDataService
	) {
		this.facebookID = localStorage.getItem('facebookID');
		this.matcher = new MyErrorStateMatcher();
		this.dataService.fetchProfileData()
			.then(({id, name, email}) => {
				this.userName = name.replace(/(.*) .*/, '$1');
			})
			.catch(err => {
				console.log(err);
			});
	}

	ngOnInit() {
		this.form = this.fb.group({
			name: ['', Validators.required],
			email: ['', [Validators.required, Validators.email]],
			phone: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]{10}')])],
			facebookID : [this.facebookID]
		});
	}

	onSubmit() {
		console.log(this.form.value);
		return this.http.post(this.postEndpoint, this.form.value).toPromise().then(val => {
			this.success = 1;
			this.router.navigateByUrl('/fbposts');
			/*console.log('Value Posted Successfully');*/
		})
			.catch(err => {
				this.success = 2;
				console.error(err);
			});
	}
}
