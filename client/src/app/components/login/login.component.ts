import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { FbDataService } from '../../services/fb-data.service';

declare var particlesJS: any;
declare var FB: any;
const visited = false;
@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	@Input() private scope: String;
	constructor(
	private router: Router,
	private loginService: LoginService,
	private dataService: FbDataService
	) {
	particlesJS.load(
		'particles-js',
		'../../assets/particlesjs-config.json',
		null
	);
	this.facebookID = localStorage.getItem('facebookID');
	}
	// false : user not logged in,
	// true : trying to log in
	spinnerState = false;
	facebookID: string;
	mode = 'indeterminate';
	login() {
	this.spinnerState = true;
	this.loginService
		.performLogin()
		.then(res => {
		/*console.log(res.status);*/
		if (res.status === 'connected') {
			this.router.navigate(['/fbposts']);
		}
		})
		.catch(err => console.error(err));
	}

	getProfile = () => {
	this.dataService.fetchProfileData().then();
	}

	feedComponent() {
	/*this.router.navigate(['/fbposts']);*/
	}

	ngOnInit() {
	if (this.facebookID) {
		this.spinnerState = true;
		this.loginService.checkLogin().then(a => {
		if (a) {
			/*console.log('User present!');*/
			this.router.navigate(['/fbposts']);
		} else {
			// The parent node of the element to be re-parsed has to be sent as argument
			/*let loginButton = document.getElementById('loginButton');
						 *if (!visited) {
						 *  (window as any).FB.XFBML.parse(loginButton.parentNode);
						 *}*/
			console.log('User wasn\'t logged in!');
		}
		});
	} else {
		this.spinnerState = false;
	}
	}
}
