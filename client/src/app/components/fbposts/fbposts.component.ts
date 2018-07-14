import { Component, OnInit, OnDestroy } from '@angular/core';
import { FbFeedService } from '../../services/fb-feed.service';
import { LoginService } from '../../services/login.service';
import { HtmlPipe } from '../../pipes/html.pipe';

let visited = false;
declare var particlesJS: any;

@Component({
	selector: 'app-fbposts',
	templateUrl: './fbposts.component.html',
	styleUrls: ['./fbposts.component.css'],
	providers : [
		FbFeedService
	]
})

export class FbpostsComponent implements OnInit, OnDestroy {
	feedsReturned: Promise<any>;
	posts: any;
	constructor(
		private feedService: FbFeedService,
		private loginService: LoginService
	) {
		this.feedsReturned = this.getAllFeeds();
		particlesJS.load(
			'particles-js',
			'../../assets/particlesjs-config.json',
			null
		);
	}
	ngOnInit() {
		/*Promise.all([this.feedsReturned, this.loginService.loadPromise])
		 *  .then((a) => {
		 *    let render = document.getElementsByTagName('fb-post')[0].parentNode;
		 *    console.log(render);
		 *    console.log(visited);
		 *    setTimeout(() => {
		 *      (window as any).FB.XFBML.parse();
		 *    }, 0);
		 *  });*/
	}
	ngOnDestroy() {
		visited = true;
	}
	timeDiffCalc = (a, b): number => {
		const diff = b - a;
		const mins = (b - a) / 1000 / 60;
		return mins;
	}
	getAllFeeds =  (): Promise<any> => {
		return this.feedService.getAllPosts()
			.then((res) => {
				this.posts = res;
				/*console.log(this.posts);*/
				return Promise.resolve(this.posts);
			})
			.catch(console.error);
		// null if No posts present
	}
	openPopup(permalink_url) {
		/*tslint:disable*/
		const link =  `https://www.facebook.com/dialog/share?app_id=457343458032910&display=popup&href=${permalink_url}`;
		/*tslint:enable*/

		(window).open(link, 'Share Facebook Post', 'width=626,height=500');
	}
}
