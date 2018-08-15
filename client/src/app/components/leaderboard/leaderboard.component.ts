import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';

@Component({
	selector: 'app-leaderboard',
	templateUrl: './leaderboard.component.html',
	styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
	referralID = 'Fetching...';
	totalScore = 'Fetching...';
	facebookID = localStorage.getItem('facebookID') || '';
	constructor(
		private backend: BackendService
	) {
		const body = {
			'facebookID': this.facebookID
		};
		this.backend.postReq('getCaInfo', body)
			.then(({referralID, points}) => {
				this.referralID = referralID;
				this.totalScore = points;
			})
			.catch(console.error);
	}

	ngOnInit() {
	}

}
