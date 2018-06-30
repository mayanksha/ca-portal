import { Injectable } from '@angular/core';
import { ScriptService } from './script.service';
import { LoginService } from './login.service';
import { FacebookService } from 'ngx-facebook';
@Injectable({
	providedIn: 'root'
})
export class FbDataService {

	constructor(
		private fb: FacebookService,
		private loginService: LoginService
	) {

	}

	fetchProfileData = (): Promise<any> => {
		return this.loginService.loadPromise.then(() => {
			return this.fb.api('me?fields=id,name,email', 'get',
				{
					'access_token' : localStorage.getItem('accessToken')
				})
				.then((res) => Promise.resolve(res))
				.catch((err) => Promise.reject(err));
		});
	}
}
