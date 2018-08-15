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
        "permalink_url": "https://www.facebook.com/143082049043150/posts/2345728865445113/",
        "full_picture": "https://scontent.xx.fbcdn.net/v/t1.0-9/s720x720/38676787_2345719165446083_7928250169441648640_o.jpg?_nc_cat=0&oh=2ba8bbf56543548217bb63a7a3bbf896&oe=5BF8BA42",
        "message": `The first step, is enough to embark on the expedition to the 'Summit'. Put one foot closer to triumph and opportunities would walk 10 feet closer to you.
This eSummit'18 a plethora of opportunities are knocking at your door. All you have to do is just take the first step. 
Registrations are now officially open. 
Register now at <a href="https://bit.do/esummit18reg">http://bit.do/esummit18reg</a>
For more information,visit  <a href="https://ecelliitk.org/esummit18">https://ecelliitk.org/esummit18</a> 
	<br><br> #StartUpIndia #eSummit2k18 #ECell_IITK #TranscendingIDEAS`,
        "link": "https://www.facebook.com/ecelliitk/photos/a.145084105509611.22953.143082049043150/2345719155446084/?type=3",
        "id": "143082049043150_2345728865445113"
      },
{
        "permalink_url": "https://www.facebook.com/143082049043150/posts/2360408347310498/",
        "full_picture": "https://scontent.xx.fbcdn.net/v/t1.0-9/s720x720/38992274_2360392193978780_3693926475926339584_o.jpg?_nc_cat=0&oh=4b4da608f7ebc44e9f93b259a5afaa8c&oe=5BC880F3",
        "message": "Director of the Emami Group. He has spearheaded the edible oil arm of the Group for it to become the largest edible oil refinery in Eastern India and the third largest in India within just 5 years of its inception. #eSummit2k18 #TranscendingIDEAS",
        "link": "https://www.facebook.com/ecelliitk/photos/a.145084105509611.22953.143082049043150/2360392190645447/?type=3",
        "id": "143082049043150_2360408347310498"
      },
      {
        "permalink_url": "https://www.facebook.com/143082049043150/posts/2358393924178607/",
        "full_picture": "https://scontent.xx.fbcdn.net/v/t1.0-9/s720x720/38872757_2358393180845348_4445146556991012864_o.png?_nc_cat=0&oh=b8efc30fdd5097ab8252fa7a578d67a5&oe=5BC960B4",
        "message": "#BuzzWordOfTheDay #TranscendingIDEAS",
        "link": "https://www.facebook.com/ecelliitk/photos/a.145084105509611.22953.143082049043150/2358393174178682/?type=3",
        "id": "143082049043150_2358393924178607"
      },
      {
        "permalink_url": "https://www.facebook.com/143082049043150/posts/2356978047653528/",
        "full_picture": "https://scontent.xx.fbcdn.net/v/t1.0-9/s720x720/38828237_2356955834322416_1849289643506270208_o.jpg?_nc_cat=0&oh=3773020b0d33f431d27952592adae316&oe=5C071C34",
        "message": "Group President - Strategic HR, Chairman's Office, Reliance Industries Limited. He strongly believes that education can change the destiny and direction of life, who has been contributing to many skill development programs will be with us this Summit as one of our main speakers for the event. #eSummit2k18 #TranscendingIDEAS",
        "link": "https://www.facebook.com/ecelliitk/photos/a.145084105509611.22953.143082049043150/2356955827655750/?type=3",
        "id": "143082049043150_2356978047653528"
      },
      {
        "permalink_url": "https://www.facebook.com/143082049043150/posts/2356161891068477/",
        "full_picture": "https://external.xx.fbcdn.net/safe_image.php?d=AQC-_LF_JsdMAZ22&url=https%3A%2F%2Ftechstory.in%2Fwp-content%2Fuploads%2F2018%2F08%2Fplanning6-1-1024x370.jpg&_nc_hash=AQB2P73soYDl9Toa",
        "message": "#TranscendingIDEAS #eSummit2k18 #eSummit_In_News",
        "link": "https://techstory.in/esummit-18-by-iit-kanpur/",
        "id": "143082049043150_2356161891068477"
      },
      {
        "permalink_url": "https://www.facebook.com/143082049043150/posts/2354331107918222/",
        "full_picture": "https://scontent.xx.fbcdn.net/v/t1.0-9/s720x720/38774907_2354321711252495_2395363175772979200_o.jpg?_nc_cat=0&oh=2f28012095867c02897c7be3534a08cb&oe=5C06DF23",
        "message": `With the entrepreneurial fever at a high in the campus. Be a part of our wave and spread the entrepreneurial spirit in the campus. Be a part of team E-Cell!

We present you the first product of our annual merchandise.

Purchase the official T-Shirt now, at http://bit.do/ecellmerch"`,
        "link": "https://www.facebook.com/ecelliitk/photos/a.145084105509611.22953.143082049043150/2354321701252496/?type=3",
        "id": "143082049043150_2354331107918222"
      },
      {
        "permalink_url": "https://www.facebook.com/143082049043150/posts/2352430154774984/",
        "full_picture": "https://scontent.xx.fbcdn.net/v/t1.0-9/s720x720/38732734_2352430128108320_6132564896065257472_o.jpg?_nc_cat=0&oh=39d1934c6aa4aae95f33b3e4057f001b&oe=5C0E479C",
        "message": "#BuzzWordOfTheDay #TranscedingIDEAS",
        "link": "https://www.facebook.com/ecelliitk/photos/a.987642094587137.1073741835.143082049043150/2352430118108321/?type=3",
        "id": "143082049043150_2352430154774984"
      },
      {
        "permalink_url": "https://www.facebook.com/143082049043150/posts/2350834501601216/",
        "full_picture": "https://external.xx.fbcdn.net/safe_image.php?d=AQB9x9jvGY14sjQh&url=https%3A%2F%2Fi0.wp.com%2Finc42.com%2Fwp-content%2Fuploads%2F2018%2F08%2Ffeature-startup-india.jpg%3Ffit%3D1360%252C1020%26ssl%3D1&_nc_hash=AQAQvcqWsExqjhEF",
        "message": "For all those who want to pursue entrepreneurship, get to work on Transcending your Idea. Startup Academia Alliance Programme Launched To Promote Entrepreneurship. #eSummit2k18 #TranscendingIDEAS",
        "link": "https://inc42.com/buzz/startup-academia-alliance-programme-launched-to-promote-entrepreneurship/",
        "id": "143082049043150_2350834501601216"
      },
      {
        "permalink_url": "https://www.facebook.com/143082049043150/posts/2348789228472410/",
        "full_picture": "https://scontent.xx.fbcdn.net/v/t1.0-9/s720x720/38731175_2348788515139148_1272371155063275520_o.png?_nc_cat=0&oh=cfb1e554e3febba79af9c6f2447b722b&oe=5BF8E298",
        "message": "#BuzzWordOfTheDay #TranscendingIDEAS",
        "link": "https://www.facebook.com/ecelliitk/photos/a.145084105509611.22953.143082049043150/2348788508472482/?type=3",
        "id": "143082049043150_2348789228472410"
      },
      {
        "permalink_url": "https://www.facebook.com/143082049043150/posts/2344767532207913/",
        "full_picture": "https://scontent.xx.fbcdn.net/v/t1.0-9/s720x720/38465842_2344767502207916_8827893355204575232_o.jpg?_nc_cat=0&oh=ee1a66869ff443de8a58aac0cc62b33e&oe=5C06265C",
        "message": "#BuzzWordOfTheDay #TranscendingIDEAS",
        "link": "https://www.facebook.com/ecelliitk/photos/a.987642094587137.1073741835.143082049043150/2344767492207917/?type=3",
        "id": "143082049043150_2344767532207913"
      },
      {
        "permalink_url": "https://www.facebook.com/143082049043150/posts/2343451269006206/",
        "full_picture": "https://scontent.xx.fbcdn.net/v/t1.0-9/s720x720/38446388_2343446039006729_8664407173134024704_o.jpg?_nc_cat=0&oh=5770137e3164f892608a684dedd582e0&oe=5BC58159",
        "message": `An apropos opportunity to question your analytical and strategic abilities.
Brainstorming, research, problem-solving, data analysis 'Decrypt' has all this and more in store for you.
Register Now: Register at: https://ecelliitk.org/esummit18/register/ #StartUpIndia #eSummit2k18 ‪#ECell_IITK #TranscendingIDEAS`,
        "link": "https://www.facebook.com/ecelliitk/photos/a.145084105509611.22953.143082049043150/2343446032340063/?type=3",
        "id": "143082049043150_2343451269006206"
      },
      {
        "permalink_url": "https://www.facebook.com/143082049043150/posts/2342853049066028/",
        "full_picture": "https://scontent.xx.fbcdn.net/v/t1.0-9/s720x720/38297966_2342838779067455_7457468719543877632_o.png?_nc_cat=0&oh=cff23e94f1ea79da45e314f760da218f&oe=5C0EE201",
        "message": "For all the new entrepreneurial enthusiasts who get confused with all the entrepreneurial jargon. #BuzzWordOfTheDay #TranscendingIdeas",
        "link": "https://www.facebook.com/ecelliitk/photos/a.145084105509611.22953.143082049043150/2342838769067456/?type=3",
        "id": "143082049043150_2342853049066028"
      },
      {
        "permalink_url": "https://www.facebook.com/143082049043150/posts/2342664749084858/",
        "full_picture": "https://scontent.xx.fbcdn.net/v/t1.0-9/s720x720/38392380_2342661635751836_7465799066312507392_o.jpg?_nc_cat=0&oh=4c000c406a79bf616b01bc678e1070c7&oe=5C0E398A",
        "message": `A live stock trading competition like none other. Stock the Stock @eSummit'18 gives you a chance to employ your aptitude, probe the market fluctuations, and create a profitable bidding. 
Don't fail to experience the powerful spirit of competing with the best brains and take home exciting prizes.
Register at: https://ecelliitk.org/esummit18/register/
#StockTheStock
#TimeToTrade
#eSummit2k18
#TranscendingIDEAS`,
        "link": "https://www.facebook.com/ecelliitk/photos/a.145084105509611.22953.143082049043150/2342661622418504/?type=3",
        "id": "143082049043150_2342664749084858"
      },
      {
        "permalink_url": "https://www.facebook.com/143082049043150/posts/2340939969257336/",
        "full_picture": "https://scontent.xx.fbcdn.net/v/t1.0-9/s720x720/38391181_2340939899257343_982380456500527104_n.jpg?_nc_cat=0&oh=21ebda2542190f9db4934b59c43a15ed&oe=5BC5524E",
        "message": `Test your StartUp knowledge in the annual quiz event of our eSummit. Biz Quiz offers a great chance to widen your knowledge regarding startups and a massive opportunity for Quiz enthusiasts to win Cash Prizes.
Register Now: https://ecelliitk.org/esummit18/register
#eSummit2k18 #ECell_IITK`,
        "link": "https://www.facebook.com/ecelliitk/photos/a.987642094587137.1073741835.143082049043150/2340939885924011/?type=3",
        "id": "143082049043150_2340939969257336"
      },
      {
        "permalink_url": "https://www.facebook.com/143082049043150/posts/2340335715984428/",
        "full_picture": "https://scontent.xx.fbcdn.net/v/t1.0-9/s720x720/38472426_2340333915984608_6929487741306535936_o.jpg?_nc_cat=0&oh=d84ee8c6baef856f6a5525e49ca28429&oe=5C120F58",
        "message": `Wish to venture your own entrepreneurial conception in vogue in the Startup world?
Pitch Your Product @eSummit'18 has to be the next step for your project.
Put your brains to evaluate the market, gauge customer needs, and test product usability. Come Participate.
Register at: https://ecelliitk.org/esummit18/register
#eSummit2k18 #ECell_IITK`,
        "link": "https://www.facebook.com/ecelliitk/photos/a.145084105509611.22953.143082049043150/2340333909317942/?type=3",
        "id": "143082049043150_2340335715984428"
      },
/*,{
 *        "permalink_url": "https://www.facebook.com/143082049043150/posts/2319631154721551/",
 *        "id": "143082049043150_2319631154721551",
 *        "full_picture": "https://scontent.xx.fbcdn.net/v/t1.0-9/s720x720/37778279_2319621138055886_8232713116790554624_o.jpg?_nc_cat=0&oh=d590cbbec2c3fb6a3348c91ce1139b48&oe=5C0DEE1E",
 *        "message": `'The product that wins is the one that bridges customers to the future, not the one that requires a giant leap' - Aaron Levie, Co-founder of BOX
 *Looking for one stop solution for funding, incubation, and mentorship for your Startup?<br><br>
 *Upstart'18 is here to cater!
 *Don't miss out on the chance to get funding opportunities upto 3 Crores.
 *Register at <a href="https://ecelliitk.org/upstart18">ecelliitk.org/upstart18</a><br><br>
 *#StartUpIndia #eSummit2k18 #ECell_IITK #UpStart18"`
 *      },
 *      {
 *        "permalink_url": "https://www.facebook.com/143082049043150/posts/2289843877700279/",
 *        "id": "143082049043150_2289843877700279",
 *        "full_picture": "https://scontent.xx.fbcdn.net/v/t1.0-9/s720x720/36925702_2289843851033615_2515049251294150656_o.jpg?_nc_cat=0&oh=c0e9ef74498028690e418385527eac7c&oe=5BEC3235",
 *        "message": `“<i>Hard work will always overcome natural talent when natural talent does not work hard enough.</i>” - <strong>Sir Alex Ferguson</strong>.
 *        No idea, however brilliant it might be, turns to reality without hard work and perseverance. All multi-billion-dollar companies which started out as humble startups didn’t get to where they are without the long, patient hours put in by their founders. <br> #E_Lesson #FIFAWC #eSummit2k18`
 *      },
 *      {  
 *         "message":"Come step into the world of entrepreneurship with E-Cell, IITK.<br>With 'Transcending Ideas' as the main motif, esummit'18 aims to go beyond mere ideas into actuality.<br>#eSummit2k18 ‪#ECell_IITK",
 *         "permalink_url":"https://www.facebook.com/143082049043150/posts/2280736018611065/",
 *         "id":"143082049043150_2280736018611065",
 *         "full_picture":"https://scontent.xx.fbcdn.net/v/t1.0-9/s720x720/36777493_2280733811944619_555942254716387328_o.jpg?_nc_cat=0&oh=96966aef67c465d8b2259e7a03b30d59&oe=5BA4F4C4"
 *      },
 *      {  
 *         "message":"Thought nothing could top an edition of UPSTART at IIT Kanpur? <br>We unveil to you UPSTART Delhi!!<br><br>Living up to its thriving legacy, UPSTART, a pitching event like none other with mentoring by revered VCs and Investors and funding opportunities up to Rs. 1 crore, is here again to provide the boost your startup needs.<br>Prizes worth 7.5 Lakhs at stake!!<br>Register now at https://www.ecelliitk.org/upstart18/delhi.html<br>#StartUpIndia #eSummit2k18 ‪#ECell_IITK #UpStart18",
 *         "permalink_url":"https://www.facebook.com/143082049043150/posts/2269931179691549/",
 *         "id":"143082049043150_2269931179691549",
 *         "full_picture":"https://scontent.xx.fbcdn.net/v/t1.0-9/s720x720/36421866_2269916879692979_1228440812220579840_n.jpg?_nc_cat=0&oh=bab784b9450ffb4dd0a6017cd1d6d343&oe=5BA1367F"
 *      },*/
			/*{  
			 *   "message":"\"Though there is 1% chance we'll have 99% hope.\" - Neymar Jr. after F.C. Barcelona's 0-4 loss in the first leg of Champions League quarter finals. Contrary to critics verdict Barca beat PSG 6-1 in second leg to advance to the semi finals.<br>Setbacks are inevitable in the idea to reality progression of a startup. What counts is that you tenaciously face every trial!<br>#FootballLessons #E_Lesson #FifaWC<br>#eSummit2k18",
			 *   "permalink_url":"https://www.facebook.com/143082049043150/posts/2268386766512657/",
			 *   "id":"143082049043150_2268386766512657",
			 *   "full_picture":"https://scontent.xx.fbcdn.net/v/t1.0-9/s720x720/36367184_2268386726512661_8592264701952393216_o.jpg?_nc_cat=0&oh=119da1a6b79fc71e8ae8af56d6ec13ce&oe=5BA2DB11"
			 *},
			 *{  
			 *   "message":"Its the first time in last 80 years that Germany, the defending champions, failed to qualify for the knockout stage.<br>'No matter how great you are, you are only one mistake away from losing everything.'<br>Entrepreneurs need to keep on adapting and outdoing past performances to stay relevant.<br>#eSummit2k18 #FootballLessons #E_Lesson #FifaWC",
			 *   "permalink_url":"https://www.facebook.com/143082049043150/posts/2264698886881445/",
			 *   "id":"143082049043150_2264698886881445",
			 *   "full_picture":"https://scontent.xx.fbcdn.net/v/t1.0-9/s720x720/36374545_2264698870214780_4336441853852254208_o.jpg?_nc_cat=0&oh=bbeac5074f98be7bdc0b72e7dd29002c&oe=5BA7DF11"
			 *},
			 *{  
			 *   "message":"With PayPal, SpaceX, Tesla Motors, Hyperloop One, The boring company and now even contemplating ET colonization. We wish @elonmusk another year of making the impossible happen.<br><br>#elonmusk #tesla #spacex #hyperloop #hyperloopone #theboringcompany #neuralink #openai #ai",
			 *   "permalink_url":"https://www.facebook.com/143082049043150/posts/2263913770293290/",
			 *   "id":"143082049043150_2263913770293290",
			 *   "full_picture":"https://scontent.xx.fbcdn.net/v/t1.0-9/s720x720/36420381_2263913776959956_906545138078056448_o.jpg?_nc_cat=0&oh=c227eb603794ea3ef8c2bcc9e5d2d683&oe=5BDD677A"
       *}*/
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
