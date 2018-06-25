import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { FacebookService, UIParams, UIResponse, InitParams } from 'ngx-facebook';
import { LoginService } from './login.service';
import { ScriptService } from './script.service';
@Injectable()
export class FbFeedService {
	loadPromise : Promise<any>;
  constructor(private fb: FacebookService,
              private loginService: LoginService,
  						private script: ScriptService) { 
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

  getAllPosts(): Promise<any> {
    // return this.fb.api('antaragni.iitk?fields=posts{message,full_picture,link,permalink_url}', 'get');
		return this.loadPromise.then(() => {
			/*return this.fb.api('ecelliitk/posts?fields=message,full_picture,link,permalink_url.limit(10)', 'get');*/
			return this.fb.api('ecelltestingpage/posts?fields=message,full_picture,link,permalink_url.limit(10)', 'get');
		})
  }

  sharePost(link: string): Promise<boolean> {
    const params: UIParams = {
      href: link,
      method: 'share'
    };
    return this.fb.ui(params)
      .then((res: UIResponse) => {
        if (res.error_message) {
          return false;
        } else if (res.post_id) {}
        return false;
      });
  }

}
