import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
	selector: 'app-ticks',
	templateUrl: './ticks.component.html',
	styleUrls: ['./ticks.component.css']
})
export class TicksComponent implements OnInit {
	@Input() greenOrRed = 0;
	green = '../../../assets/green.png';
	red = '../../../assets/red.png';
	successString = 'Thanks for Registering with us!';
	failureString = `Oops! There was some error on our side. Try Logging Out and Logging Back in, and then re-submit the form. If it still fails, mail your issue at admin@ecelliitk.org and we'll get back to you!` ;
	constructor(
		public dialogRef: MatDialogRef<TicksComponent>,
	) { }

	ngOnInit() {
	}
	onNoClick(): void {
		this.dialogRef.close();
	}
}
