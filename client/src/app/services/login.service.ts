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
			appId: '457343458032910',
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
		return this.loadPromise.then(() =>
					/*
					* Status Codes
					* (Normal)
					* 1 -- User's login status was 'connected', no automatic forced logins
					* 2 -- Token expired, so automatically logged the user in
					* 3 -- Not authorized, Neither accessToken nor fbId present
					*
					* (Errors)
					* 4 -- res.status == 'unknown'
					* 5 -- res.status !== 'connected' while trying to re-login the
					* 			user in performLogin (auth_expired)
					*
					*/

			this.fb.getLoginStatus().then((res: LoginStatus) => {
				if (res.status === 'connected') {
					this.token = res.authResponse.accessToken;
					localStorage.setItem('accessToken', this.token);
					localStorage.setItem('facebookID', res.authResponse.userID);

					// Status Code 1
					return Promise.resolve(!0);
				} else if (res.status === 'authorization_expired') {
					// Auth Expired, for this case the best is to not let the user know that his auth expired and performLogin again
					return this.performLogin()
						.then((s) => {
							if (s.status === 'connected') {
								return Promise.resolve(!2);
							} else {
								return Promise.resolve(!5);
							}
						});
				} else if (res.status === 'not_authorized') {
					localStorage.clear();
					// Isn't authorized at all.
					return Promise.resolve(!3);
				} else if (!res || res.status === 'unknown') {
					localStorage.clear();
					return Promise.resolve(!4);
				}
			})
			.catch(err => {
				return Promise.reject(err);
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
		localStorage.clear();
		return this.fb.logout().then((res) => {
			/*console.log(res);
			 *console.log('Logged out!');*/
			Promise.resolve(true);
		})
		.catch(console.error);
	}
}
