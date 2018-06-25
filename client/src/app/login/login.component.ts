import { ScriptService } from '../services/script.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';

declare var particlesJS: any;

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css'],
})

export class LoginComponent implements OnInit {
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
			private login : LoginService
		) {}

	
	getProfile() {
		this.login.getProfile();
	}
	getFriends() {
		this.login.getFriends();
	}
	getAccessToken() {
		this.login.getAccessToken();
	}

	feedComponent (){
		this.router.navigate(['/fbposts']);
	}
	ngOnInit() {
		this.login.checkLogin();
		// particlesJS.load('particles-js', '../../assets/particlesjs-config.json', null);

	}

}
