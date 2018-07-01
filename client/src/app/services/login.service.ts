import { Injectable } from '@angular/core';
import {
	FacebookService,
	InitParams,
	LoginResponse,
	LoginOptions,
	LoginStatus} from 'ngx-facebook';

import { ScriptService } from './script.service';

@Injectable()
export class LoginService {
	user: any = {};
	token: string;
	loadPromise: Promise<any>;
	options: LoginOptions = {
		scope:
		'public_profile,email',
		return_scopes: true,
		enable_profile_selector: true
	};
	constructor(private script: ScriptService, private fb: FacebookService) {
		const params: InitParams = {
			appId: '1150994588373515',
			version: 'v3.0',
			xfbml: true,
			cookie: true
		};
		this.loadPromise = this.script
			.loadScript('facebook')
			.then(() => {
				/*if((window as any).FB)
				 *  return Promise.resolve(true);*/
				/*console.log('FB INIT Called inside LoginService');*/
				this.fb.init(params);
			})
			.catch(err => console.error(err));
	}

	performLogin = (): Promise<any> => {
		return this.loadPromise.then(() => {
			return this.fb
				.login(this.options)
				.then((res: LoginResponse) => {
					this.token = res.authResponse.accessToken;
					localStorage.setItem('accessToken', this.token);
					localStorage.setItem('facebookID', res.authResponse.userID);
					return Promise.resolve(res);
				})
				.catch(err => Promise.reject(err));
		});
	}

	checkLogin = (): Promise<boolean> => {
		/*    if(this.user){
		 *
		 *    }*/
		/*if(localStorage.user){
		 *  console.log("User found ", this.user);
		 *  return Promise.resolve(true);
		 *}*/
		return this.loadPromise.then(() =>
			this.fb.getLoginStatus().then((res: LoginStatus) => {
				if (res.status === 'connected') {
					/*console.log(res.authResponse);*/
					this.token = res.authResponse.accessToken;
					localStorage.setItem('accessToken', this.token);
					localStorage.setItem('facebookID', res.authResponse.userID);
					/*localStorage.setItem('user', {
					 *  'userId' : res.authResponse.userID,
					 *  'token' : res.authResponse.accessToken
					 *})
					 *'userId' : res.authResponse.userID,*/
					return Promise.resolve(true);
				} else {
					return Promise.resolve(false);
				}
			})
		);
	}

	getLoginStatus() {
		this.fb
			.getLoginStatus()
			.then(console.log.bind(console))
			.catch(console.error.bind(console));
	}

	logout(): Promise<any> {
		return this.fb.logout().then((res) => {
			/*console.log(res);
			 *console.log('Logged out!');*/
			localStorage.clear();
			Promise.resolve(true);
		});
	}
}
