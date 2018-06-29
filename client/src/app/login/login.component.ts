import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { FbDataService } from '../services/fb-data.service';

declare var particlesJS: any;
declare var FB: any;
const visited = false;
@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
	@Input() private scope: String;
	/*  constructor(
	 *    private fb: FacebookService
	 *  ) {
	 *
	 *    console.log('Initializing Facebook');
	 *
	 *    fb.init({
	 *      appId: '1927971220769787',
	 *      version: 'v2.9'
	 *    });
	 *
	 *  }*/
	constructor(
		private router: Router,
		private loginService: LoginService,
		private dataService: FbDataService
	) {}

	login() {
		this.loginService.performLogin()
			.then((res) => {
				/*console.log(res.status);*/
				if (res.status === 'connected') {
					this.router.navigate(['/onFbLogin']);
				}
			})
			.catch(err => console.error(err));
	}

	getProfile = () => {
		this.dataService.fetchProfileData()
			.then(console.log);
	}

	logout() {
		this.loginService.logout();
	}

	feedComponent () {
		/*this.router.navigate(['/fbposts']);*/
	}

	ngOnInit() {
		this.loginService.checkLogin()
			.then((a) => {
				if (a) {
					/*console.log('User present!');*/
					this.router.navigate(['/onFbLogin']);
				} else {
					// The parent node of the element to be re-parsed has to be sent as argument
					/*let loginButton = document.getElementById('loginButton');
					 *if (!visited) {
					 *  (window as any).FB.XFBML.parse(loginButton.parentNode);
					 *}*/
					console.log('User wasn\'t logged in!');
				}
			});
		particlesJS.load('particles-js', '../../assets/particlesjs-config.json', null);
	}
}
