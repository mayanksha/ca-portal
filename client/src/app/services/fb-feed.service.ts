import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {
	FacebookService,
	UIParams,
	UIResponse,
	InitParams
} from 'ngx-facebook';
import { LoginService } from './login.service';
import { ScriptService } from './script.service';
@Injectable()
export class FbFeedService {
	constructor(
		private fb: FacebookService,
		private loginService: LoginService,
		private script: ScriptService
	) {}

	postsPromise: Promise<any>;
	posts: {
		data: any;
		timeStamp: any;
	};
	timeDiffCalc = (a, b): number => {
		const diff = b - a;
		const mins = (b - a) / 1000 / 60;
		return mins;
	}

	getAllPosts = (): Promise<any> => {
		// null if No posts present
		this.posts = JSON.parse(localStorage.getItem('posts'));
		if (
			!this.posts ||
			this.timeDiffCalc(new Date().getTime(), this.posts.timeStamp > 10)
		) {
			return this.loginService.loadPromise.then(() => {
				return this.fb
					.api(
						'ecelliitk?fields=posts.limit(5){message,permalink_url,id,full_picture}',
						'get',
						{
							// This is my page's access_token
							'access_token' : localStorage.getItem('accessToken')
						}
					)
					.then(res => {
						this.posts = res.posts;
						this.posts['timeStamp'] = new Date().getTime();
						localStorage.setItem('posts', JSON.stringify(this.posts));
						console.log('Got from fb Feed Service', this.posts);
						return Promise.resolve(this.posts.data);
					});
			});
		} else {
			return Promise.resolve(this.posts.data);
		}
	}

	sharePost(link: string): Promise<boolean> {
		const params: UIParams = {
			href: link,
			method: 'share'
		};
		return this.fb.ui(params).then((res: UIResponse) => {
			if (res.error_message) {
				return false;
			} else if (res.post_id) {
			}
			return false;
		});
	}
}
