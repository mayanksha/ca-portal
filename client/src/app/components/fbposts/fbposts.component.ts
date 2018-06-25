import { Component, OnInit } from '@angular/core';
import { FbFeedService } from '../../services/fb-feed.service';
@Component({
  selector: 'app-fbposts',
  templateUrl: './fbposts.component.html',
  styleUrls: ['./fbposts.component.css'],
	providers : [
		FbFeedService
	]
})
export class FbpostsComponent implements OnInit {
	feeds : any;
	constructor(
		private feed : FbFeedService,
	) { 
	}

  ngOnInit() {
		 this.getAllFeeds();
  }

  getAllFeeds() {
    this.feed.getAllPosts()
      .then((res) => {
        this.feeds = res.data;
        setTimeout(() => (window as any).FB.XFBML.parse(), 0);
        console.log(res);
      });
  }
}
