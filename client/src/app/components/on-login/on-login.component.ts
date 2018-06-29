import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegformComponent } from '../regform/regform.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LoginService } from '../../services/login.service';
@Component({
	selector: 'app-on-login',
	templateUrl: './on-login.component.html',
	styleUrls: ['./on-login.component.css']
})
export class OnLoginComponent implements OnInit {
	/*heroForm = new FormGroup({
	 *  name: new FormControl()
	 *});*/

	constructor(public dialog: MatDialog,
		private loginService: LoginService,
		private router: Router
	) {
		this.loginService.checkLogin()
			.then(e => {
				if (!e) {
					this.router.navigate(['/login']);
				} else {
					console.log('You are successfully logged in!');
				}
			});
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

	}
}
