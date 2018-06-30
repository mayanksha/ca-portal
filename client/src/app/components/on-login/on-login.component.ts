import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegformComponent } from '../regform/regform.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LoginService } from '../../services/login.service';
import { FbDataService } from '../../services/fb-data.service';
@Component({
	selector: 'app-on-login',
	templateUrl: './on-login.component.html',
	styleUrls: ['./on-login.component.css']
})
export class OnLoginComponent implements OnInit {
	/*heroForm = new FormGroup({
	 *  name: new FormControl()
	 *});*/
	userName: string;
	constructor(public dialog: MatDialog,
		private loginService: LoginService,
		private router: Router,
		private dataService: FbDataService
	) {
		this.loginService.checkLogin()
			.then(e => {
				if (!e) {
					this.router.navigate(['/login']);
				} else {
					console.log('You are successfully logged in!');
				}
			});
		this.userName = localStorage.getItem('name');
		if (!this.userName) {
			this.dataService.fetchProfileData()
				.then((data: any) => {
				localStorage.setItem('name', data.name);
			});
		}
	}
	ngOnInit() {
	}
	openModal(): void {
		const dialogRef = this.dialog.open(RegformComponent, {
		});

		dialogRef.afterClosed().subscribe(result => {
			/*console.log('The dialog was closed');*/
		});
	}
	openUploader() {
		this.dataService.fetchProfileData().then(console.log).catch(console.error);
	}
}
