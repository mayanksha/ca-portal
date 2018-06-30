import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TopbarComponent } from '../topbar/topbar.component';
import { FbpostsComponent } from '../fbposts/fbposts.component';
import { FbDataService } from '../../services/fb-data.service';
import { LoginService } from '../../services/login.service';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
	private loggedIn: boolean;
	userData: any;
	posts: any[];
	constructor(
		private loginService: LoginService,
		private dataService: FbDataService,
		private router: Router
	) {}
	ngOnInit() {
		/*this.dataService.fetchProfileData()
		 *  .then((res) => {
		 *    this.posts = res.posts;
		 *    console.log(this.posts);
		 *  })
		 *  .catch((err) => {
		 *    console.log('YOU DONT HAVE ENOUGH PRIVILEDGE')
		 *    console.error(err);
		 *    this.router.navigate(['/login']);
		 *  })*/
	}
}
