import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';
import { FbDataService } from '../../services/fb-data.service';
import { BackendService } from '../../services/backend.service';
import { FormArray, FormGroup, FormBuilder, Validators, ValidatorFn,
	FormControl, NgForm, FormGroupDirective, AbstractControl } from '@angular/forms';

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
	/*checkEndpoint = 'https://localhost:9000/api/checkCaUser';*/

	red = '../../../assets/red.png';
	failureString = `Oops! There was some error on our side. Try it back after some time.
		If it still fails, mail your issue at admin@ecelliitk.org or contact the Webmasters and we'll get back to you!` ;
	emailExists = true;
	// 0 = showForm, 1 = Success, 2 = Failure
	success = 0;
	errorStrings = ['This field is required.', 'This email is already linked to your Facebook ID in our Database.'];
	showString = this.errorStrings[0];
	validateEmail = (): ValidatorFn => {
		return (control: AbstractControl): {[key: string]: any} => {
			return {'emailExists' : this.emailExists};
		};
		/*return (control: AbstractControl): {[key: string]: any} => {
		 *  const body = {
		 *    'facebookID' : this.facebookID,
		 *    'email': this.form.controls['email'].value
		 *  };
		 *  return this.http.post(this.checkEndpoint, body)
		 *    .subscribe(data => {
		 *      console.log(data);
		 *      return {
		 *        'emailExists' : true
		 *      };
		 *    },
		 *      err => {
		 *        console.error(err);
		 *        return null;
		 *      });
		 *};*/
	}
	emailFormControl = new FormControl('', [
		Validators.email,
		Validators.required,
		this.validateEmail
	]);
	constructor (
		private http: HttpClient,
		private fb: FormBuilder,
		private router: Router,
		private dataService: FbDataService,
		public snackBar: MatSnackBar
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

	openSnackBar() {
		this.snackBar.open(this.errorStrings[1], null, {
			duration: 4000
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
			this.router.navigateByUrl('/fbposts');
			/*console.log('Value Posted Successfully');*/
		})
			.catch(err => {
					console.error(err);
				// Email already exists
				if (err.status === 409) {
					this.openSnackBar();
				} else {
					this.success = 2;
				// Other Internal Server Error or Bad Request Error

				}
			});
	}
}
