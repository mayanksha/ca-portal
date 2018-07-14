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
	posts: any;
	/*posts: {
	 *  data: any;
	 *  timeStamp: any;
	 *};*/
	timeDiffCalc = (a, b): number => {
		const diff = b - a;
		const mins = (b - a) / 1000 / 60;
		return mins;
	}

	getAllPosts = (): Promise<any> => {
		// null if No posts present
		/*this.posts = JSON.parse(localStorage.getItem('posts'));*/
		/*tslint:disable*/
		this.posts = {  
   "data":[  
			{
        "permalink_url": "https://www.facebook.com/143082049043150/posts/2289843877700279/",
        "id": "143082049043150_2289843877700279",
        "full_picture": "https://scontent.xx.fbcdn.net/v/t1.0-9/s720x720/36925702_2289843851033615_2515049251294150656_o.jpg?_nc_cat=0&oh=c0e9ef74498028690e418385527eac7c&oe=5BEC3235",
        "message": `“<i>Hard work will always overcome natural talent when natural talent does not work hard enough.</i>” - <strong>Sir Alex Ferguson</strong>.
        No idea, however brilliant it might be, turns to reality without hard work and perseverance. All multi-billion-dollar companies which started out as humble startups didn’t get to where they are without the long, patient hours put in by their founders. <br> #E_Lesson #FIFAWC #eSummit2k18`
      },
      {  
         "message":"Come step into the world of entrepreneurship with E-Cell, IITK.<br>With 'Transcending Ideas' as the main motif, esummit'18 aims to go beyond mere ideas into actuality.<br>#eSummit2k18 ‪#ECell_IITK",
         "permalink_url":"https://www.facebook.com/143082049043150/posts/2280736018611065/",
         "id":"143082049043150_2280736018611065",
         "full_picture":"https://scontent.xx.fbcdn.net/v/t1.0-9/s720x720/36777493_2280733811944619_555942254716387328_o.jpg?_nc_cat=0&oh=96966aef67c465d8b2259e7a03b30d59&oe=5BA4F4C4"
      },
      {  
         "message":"Thought nothing could top an edition of UPSTART at IIT Kanpur? <br>We unveil to you UPSTART Delhi!!<br><br>Living up to its thriving legacy, UPSTART, a pitching event like none other with mentoring by revered VCs and Investors and funding opportunities up to Rs. 1 crore, is here again to provide the boost your startup needs.<br>Prizes worth 7.5 Lakhs at stake!!<br>Register now at https://www.ecelliitk.org/upstart18/delhi.html<br>#StartUpIndia #eSummit2k18 ‪#ECell_IITK #UpStart18",
         "permalink_url":"https://www.facebook.com/143082049043150/posts/2269931179691549/",
         "id":"143082049043150_2269931179691549",
         "full_picture":"https://scontent.xx.fbcdn.net/v/t1.0-9/s720x720/36421866_2269916879692979_1228440812220579840_n.jpg?_nc_cat=0&oh=bab784b9450ffb4dd0a6017cd1d6d343&oe=5BA1367F"
      },
      {  
         "message":"\"Though there is 1% chance we'll have 99% hope.\" - Neymar Jr. after F.C. Barcelona's 0-4 loss in the first leg of Champions League quarter finals. Contrary to critics verdict Barca beat PSG 6-1 in second leg to advance to the semi finals.<br>Setbacks are inevitable in the idea to reality progression of a startup. What counts is that you tenaciously face every trial!<br>#FootballLessons #E_Lesson #FifaWC<br>#eSummit2k18",
         "permalink_url":"https://www.facebook.com/143082049043150/posts/2268386766512657/",
         "id":"143082049043150_2268386766512657",
         "full_picture":"https://scontent.xx.fbcdn.net/v/t1.0-9/s720x720/36367184_2268386726512661_8592264701952393216_o.jpg?_nc_cat=0&oh=119da1a6b79fc71e8ae8af56d6ec13ce&oe=5BA2DB11"
      },
      {  
         "message":"Its the first time in last 80 years that Germany, the defending champions, failed to qualify for the knockout stage.<br>'No matter how great you are, you are only one mistake away from losing everything.'<br>Entrepreneurs need to keep on adapting and outdoing past performances to stay relevant.<br>#eSummit2k18 #FootballLessons #E_Lesson #FifaWC",
         "permalink_url":"https://www.facebook.com/143082049043150/posts/2264698886881445/",
         "id":"143082049043150_2264698886881445",
         "full_picture":"https://scontent.xx.fbcdn.net/v/t1.0-9/s720x720/36374545_2264698870214780_4336441853852254208_o.jpg?_nc_cat=0&oh=bbeac5074f98be7bdc0b72e7dd29002c&oe=5BA7DF11"
      },
      {  
         "message":"With PayPal, SpaceX, Tesla Motors, Hyperloop One, The boring company and now even contemplating ET colonization. We wish @elonmusk another year of making the impossible happen.<br><br>#elonmusk #tesla #spacex #hyperloop #hyperloopone #theboringcompany #neuralink #openai #ai",
         "permalink_url":"https://www.facebook.com/143082049043150/posts/2263913770293290/",
         "id":"143082049043150_2263913770293290",
         "full_picture":"https://scontent.xx.fbcdn.net/v/t1.0-9/s720x720/36420381_2263913776959956_906545138078056448_o.jpg?_nc_cat=0&oh=c227eb603794ea3ef8c2bcc9e5d2d683&oe=5BDD677A"
      }
   ],
   /*"paging":{  
    *   "cursors":{  
    *      "before":"Q2c4U1pXNTBYM0YxWlhKNVgzTjBiM0o1WDJsa0R5UXhORE13T0RJd05Ea3dORE14TlRBNkxUSTRNak0wTmpjeE16ZA3dOVFF3TWpVeE9EUVBER0ZA3YVY5emRHOXllVjlwWkE4ZA01UUXpNRGd5TURRNU1EUXpNVFV3WHpJeU9EQTNNell3TVRnMk1URXdOalVQQkhScGJXVUdXeitxdFFFPQZDZD",
    *      "after":"Q2c4U1pXNTBYM0YxWlhKNVgzTjBiM0o1WDJsa0R5TXhORE13T0RJd05Ea3dORE14TlRBNk5Ua3lOall5TVRZAMU5UY3dORFkyTmpRME5BOE1ZAWEJwWDNOMGIzSjVYMmxrRHlBeE5ETXdPREl3TkRrd05ETXhOVEJmTWpJMk16a3hNemMzTURJNU16STVNQThFZAEdsdFpRWmJOSVFPQVE9PQZDZD"
    *   },
    *   "next":"https://graph.facebook.com/v3.0/143082049043150/posts?access_token=EAAGf85JbPQ4BANHzFjbljmXEIRT5t2bi6bNejkZCYgU4PRrZBHlbAL0uzq3ahkrVQaKnWXL9XQrJKPNozvhMdHVxS5YTs5PdQ93ryraVaNlZADP8jGUNaJWp4lXNGMnMpg4E5uxt2ZBQG47ACp3iypFXwfqT5vQy3KxXEjcDidqBrWB1ePuOskGSFJk2sbzuFQR3GyXIXgZDZD&pretty=0&fields=message%2Cpermalink_url%2Cid%2Cfull_picture&limit=5&after=Q2c4U1pXNTBYM0YxWlhKNVgzTjBiM0o1WDJsa0R5TXhORE13T0RJd05Ea3dORE14TlRBNk5Ua3lOall5TVRZAMU5UY3dORFkyTmpRME5BOE1ZAWEJwWDNOMGIzSjVYMmxrRHlBeE5ETXdPREl3TkRrd05ETXhOVEJmTWpJMk16a3hNemMzTURJNU16STVNQThFZAEdsdFpRWmJOSVFPQVE9PQZDZD"
    *},*/
   "timeStamp":1531128398173
}
		if (
			!this.posts ||
			this.timeDiffCalc(new Date().getTime(), this.posts.timeStamp > 10)
		) {
			return this.loginService.loadPromise.then(() => {
				return Promise.resolve(this.posts.data);
			})

			/*return this.loginService.loadPromise.then(() => {
			 *  return this.fb
			 *    .api(
			 *      'ecelliitk?fields=posts.limit(5){message,permalink_url,id,full_picture}',
			 *      'get',
			 *      {
			 *        // This is my page's access_token
			 *        'access_token' : localStorage.getItem('accessToken')
			 *      }
			 *    )
			 *    .then(res => {
			 *      this.posts = res.posts;
			 *      this.posts['timeStamp'] = new Date().getTime();
			 *      console.log(this.posts);
			 *      localStorage.setItem('posts', JSON.stringify(this.posts));
			 *      console.log('Got from fb Feed Service', this.posts);
			 *      return Promise.resolve(this.posts.data);
			 *    });
			 *});*/
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
