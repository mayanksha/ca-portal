import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';

@Component({
	selector: 'app-leaderboard',
	templateUrl: './leaderboard.component.html',
	styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
	referralID = localStorage.getItem('referralID') || '';
	facebookID = localStorage.getItem('facebookID') || '';
	constructor(
		private backend: BackendService
	) {
		const body = {
			'facebookID': this.facebookID
		};
		this.backend.postReq('getReferralID', body)
			.then((refID) => {
				this.referralID = refID;
			})
			.catch(console.error);
	}

	ngOnInit() {
	}

}
