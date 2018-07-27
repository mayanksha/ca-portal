import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { FbDataService } from '../../services/fb-data.service';

declare var particlesJS: any;
@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
	@Input() private scope: String;
	constructor(
		private router: Router,
		private loginService: LoginService,
		private dataService: FbDataService
	) {
		particlesJS.load('particles-js', '../../assets/particlesjs-config.json', null);
		this.facebookID = localStorage.getItem('facebookID');
	}
	// false : user not logged in,
	// true : trying to log in
	spinnerState = false;
	facebookID: string;
	mode = 'indeterminate';
	error = false;
	login() {
		this.spinnerState = true;
		this.loginService.performLogin()
			.then((res) => {
				/*console.log(res.status);*/
				if (res.status === 'connected') {
					this.router.navigateByUrl('/fbposts');
				} else {
					this.error = true;
				}
			})
			.catch(err => console.error(err));
	}

	ngOnInit() {
		if (this.facebookID) {
			this.spinnerState = true;
			this.loginService.checkLogin()
				.then((status: boolean) => {
					if (status) {
						this.router.navigateByUrl('/fbposts');
					} else {
						this.error = true;
						this.router.navigateByUrl('/login');
					}
				});
		} else { this.spinnerState = false; }
	}

	/*getProfile = () => {
	 *  this.dataService.fetchProfileData()
	 *    .then();
	 *}*/

	/*feedComponent () {
	 *  this.router.navigate(['/fbposts']);
	 *}*/

}
