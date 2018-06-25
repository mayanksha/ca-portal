import { Injectable } from '@angular/core';
import { FacebookService, InitParams, LoginResponse, LoginOptions, LoginStatus ,UIResponse, UIParams, FBVideoComponent } from 'ngx-facebook';

import { Router } from '@angular/router';
import { ScriptService } from './script.service';

@Injectable()
export class LoginService {
	user : any = {};
	token : string;
	loadPromise : Promise<any>;

	constructor(
		private script : ScriptService,
		private fb : FacebookService
	) {
			const params : InitParams = {
				appId : '1150994588373515',
				version : 'v3.0'
			}
			this.loadPromise = this.script.loadScript('facebook')
				.then(() => {
					this.fb.init(params)
					/*setTimeout(() => {
					 *  var loginButton = document.getElementById('loginButton').parentNode;
					 *  (window as any).FB.XFBML.parse(loginButton);
					 *}, 0);*/
				})
				.catch(err => console.error(err));
				
	}

	checkLogin = () : Promise<boolean> => {
		/*if(localStorage.user){
		 *  console.log("User found ", this.user);
		 *  return Promise.resolve(true);
		 *}*/
		return this.loadPromise.then(() => this.fb.getLoginStatus().then((res: LoginStatus) => {
			if (res.status === 'connected') {
				console.log(res.authResponse);
				this.token = res.authResponse.accessToken;
				return Promise.resolve(true);
			} else {
				return Promise.reject(false);
			}
		}))
	};
	getLoginStatus() {
		this.fb.getLoginStatus()
			.then(console.log.bind(console))
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
	getAccessToken(){
		return this.token;	
	}
	logout(){
		this.fb.logout()
			.then(console.log)
	}
}
