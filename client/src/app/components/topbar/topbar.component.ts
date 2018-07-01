import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
@Component({
	selector: 'app-topbar',
	templateUrl: './topbar.component.html',
	styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {

	search = true;
	logOutPressed = false;
	constructor(
		private router: Router,
		private loginService: LoginService
	) { }

	ngOnInit() {
		if (this.router.url === '/home') {
			this.search = false;
		}
	}
	logOut() {
		this.logOutPressed = true;
		this.loginService.logout().then(e => {
			this.router.navigate(['/login']);
		});
	}
}
