import { LoginService } from '../services/login.service';
/*import { ScriptService } from '../services/script.service';*/
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FacebookService, InitParams, LoginResponse, LoginOptions, LoginStatus ,UIResponse, UIParams, FBVideoComponent } from 'ngx-facebook';

declare var particlesJS: any;

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css'],
})

export class LoginComponent implements OnInit {
	user : any = {};
	token : string;
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
		private fb : FacebookService,
		/*private script : ScriptService,*/
		private router: Router,
		private loadPromise : Promise<any>
	) {

		const params : InitParams = {
			appId : '1150994588373515',
			version : 'v3.0'
		}
				this.fb.init(params)
		/*this.loadPromise = this.script.loadScript('facebook')
		 *  .then(() => {
		 *    this.fb.init(params)
		 *  })
		 *  .catch(err => console.error(err));*/
	}

	login() {

		const loginOptions: LoginOptions = {
			enable_profile_selector: true,
			return_scopes: true,
			scope: 'public_profile,user_friends,email,pages_show_list'
		};
		this
	}

	/*checkLogin = () : Promise<boolean> => {
	 *  if(this.user){
	 *    console.log("User found ", this.user);
	 *    return Promise.resolve(true);
	 *  }
	 *  return this.loadPromise.then(() => this.fb.getLoginStatus().then((res: LoginStatus) => {
	 *    if (res.status === 'connected') {
	 *      this.token = res.authResponse.accessToken;
	 *      return Promise.resolve(true);
	 *    } else {
	 *      return Promise.reject(false);
	 *    }
	 *  }))
	 *};*/
	getLoginStatus() {
		this.fb.getLoginStatus()
			.then(console.log)
			.catch(console.error.bind(console));
	}
	getProfile() {
		this.fb.api('/me')
			.then((res: any) => {
				console.log('Got the users profile', res);
			})
		/*.catch(this.handleError);*/
	}
	getFriends() {
		this.fb.api('/me/friends')
			.then((res: any) => {
				console.log('Got the users friends', res);
			})
	}
	logout(){
		this.fb.logout()
			.then(console.log)
	}
	/*signInWithFacebook(): void {
	 *  this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
	 *  // this.loginService.signInWithGoogle().then((user) => {
	 *  //   console.log(user);
	 *  // });
	 *}*/

	ngOnInit() {
		// particlesJS.load('particles-js', '../../assets/particlesjs-config.json', null);

		/*this.authService.authState.subscribe(user => {*/
		//   this.userService.setUser(user);
		//   this.loginService.setLoggedIn(user !== null);
		//   console.log(this.userService.getUser);
		//   console.log(this.loginService.isLoggedIn);
		//   if (this.loginService.isLoggedIn) {
		//     this.router.navigate(['home']);
		//     this.loginService.setLoggedIn(true);
		//   }
		/*console.log(user);*/
		/*});*/
	}

}
