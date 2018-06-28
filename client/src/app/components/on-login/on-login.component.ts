import { Component, OnInit } from '@angular/core';
import { RegformComponent } from '../regform/regform.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
@Component({
	selector: 'app-on-login',
	templateUrl: './on-login.component.html',
	styleUrls: ['./on-login.component.css']
})
export class OnLoginComponent implements OnInit {
	/*heroForm = new FormGroup({
	 *  name: new FormControl()
	 *});*/

	constructor(public dialog: MatDialog) {
	}
	ngOnInit() {}
	openModal(): void {
		const dialogRef = this.dialog.open(RegformComponent, {
		});

		dialogRef.afterClosed().subscribe(result => {
			console.log('The dialog was closed');
		});
	}
	openUploader() {

	}
}
