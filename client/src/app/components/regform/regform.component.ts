import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormArray,
	FormGroup,
	FormBuilder,
	Validators,
	ValidatorFn,
	FormControl,
	NgForm,
	FormGroupDirective
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export class MyErrorStateMatcher implements ErrorStateMatcher {
	isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
		const isSubmitted = form && form.submitted;
		return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
	}
}

interface Startup {
	startupName: string;
	persons: number;
	teamMem: object;
	contactNo: string;
	email: string;
	loc: string;
	eventName: string;
}
interface Persons {
	id: number;
	name?: string;
	gender?: string;
}
@Component({
	selector: 'app-regform',
	templateUrl: './regform.component.html',
	styleUrls: ['./regform.component.css'],
})
export class RegformComponent implements OnInit, AfterViewInit {
	constructor (
		public dialogRef: MatDialogRef<RegformComponent>,
		private http: HttpClient,
		private fb: FormBuilder
	) {
		this.matcher = new MyErrorStateMatcher();
		for (let i = 1; i <= this.maxPersons; i++) {
			this.PersonsArray.push({'id': i, 'name' : ''});
		}
	}
	form: FormGroup;
	maxPersons = 5;
	PersonsArray: Persons[] = [];
	nameChangeLog = [];
	eventNames = ['upbiz', 'upstart'];
	matcher: MyErrorStateMatcher;
	emailFormControl = new FormControl('', [
		Validators.email,
		Validators.required,
	]);

	httpOptions = {
		headers : new HttpHeaders({
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': 'http://localhost:8000/*'
		})
	};
	postEndpoint = 'http://localhost:8000/api/register';
	onNoClick(): void {
		this.dialogRef.close();
	}
	ngOnInit() {
		this.form = this.fb.group({
			startupName : ['', Validators.required],
			email : ['',
				[Validators.required,
					Validators.email
				]],
			numPersons : this.PersonsArray[0].id,
			/*allPersons: this.fb.array([this.fb.group(this.PersonsArray[0])]),*/
			allPersons: this.fb.array([
				this.fb.group(this.PersonsArray[0])
			]),
			contactNo: ['',
				Validators.compose([Validators.required, Validators.pattern('[0-9]{10}')])],
			location: ['', Validators.required],
			eventName: ['upbiz']
		});
		this.onSelectChange();
	}

	ngAfterViewInit() {
		setTimeout(() => this.setPersonInputs(this.PersonsArray, 1), 0);
		console.log(this.form.get('allPersons'));
	}

	get PersonsFormArray(): FormArray {
		return this.form.get('allPersons') as FormArray;
	}

	setPersonInputs(persons: Persons[], numPersons: number) {
		const personFGs: FormGroup[] = [];
		for (let i = 0; i < numPersons; i++) {
			personFGs.push(this.fb.group({
				'id' : persons[i].id,
				'name' : [persons[i].name, Validators.required],
			}));
		}
		const personFormArray = this.fb.array(personFGs);
		this.form.setControl('allPersons', personFormArray);
	}

	onSelectChange() {

		// Was meant for PatchValue but it's useless here
		const previousForm = {
			'startupName' : this.form.get('startupName'),
			'email': this.form.get('email'),
			'contactNo': this.form.get('contactNo'),
			'location': this.form.get('location')
		};
		const nameControl = this.form.get('numPersons');
		nameControl.valueChanges.forEach(e =>
			this.setPersonInputs(this.PersonsArray, e));
	}

	onSubmit() {
		console.log(this.form.value);
		return this.http.post(this.postEndpoint, this.form.value).toPromise().then(val =>
			console.log('Value Posted Successfully')
		)
		.catch(err => console.error(err));
	}
	/*  phoneNoValidator(): ValidatorFn {
	 *
	 *  }*/

}

