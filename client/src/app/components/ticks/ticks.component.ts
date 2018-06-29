import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
	selector: 'app-ticks',
	templateUrl: './ticks.component.html',
	styleUrls: ['./ticks.component.css']
})
export class TicksComponent implements OnInit {
	@Input('success') greenOrRed: number;
	green = '../../../assets/green.png';
	red = '../../../assets/red.png';
	successString = 'Thanks for Registering with us!';
	failureString = 'Oops! There was some error on our side. Please contact the webmasters of Ecell!';
	constructor(
		public dialogRef: MatDialogRef<TicksComponent>,
	) { }

	ngOnInit() {
	}
	onNoClick(): void {
		this.dialogRef.close();
	}
}
