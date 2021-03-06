import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { BackendService } from '../../services/backend.service';

@Component({
	selector: 'app-topbar',
	templateUrl: './topbar.component.html',
	styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {

	search = true;
	logOutPressed = false;
	taskCount = 0;
	constructor(
		private router: Router,
		private loginService: LoginService,
		private back: BackendService
	) {
		this.loginService.checkLogin()
			.then(e => {
				if (!e) {
					this.router.navigate(['/login']);
				} else {
					console.log('You are successfully logged in!');
				}
			});
		this.back.getReq('/task_count')
			.then((val) => {
				this.taskCount = val.count;
			})
			.catch(err => console.error(err));
	}

	ngOnInit() {
		/*if (this.router.url === '/tasks') {
		 *  this.search = false;
		 *}*/
	}
	logOut() {
		this.logOutPressed = true;
		this.loginService.logout().then(e => {
			this.router.navigate(['/login']);
		});
	}
}
