import { Component, OnInit } from '@angular/core';

export interface Section {
	name: string;
	updated: Date;
}
@Component({
	selector: 'app-guide',
	templateUrl: './guide.component.html',
	styleUrls: ['./guide.component.css']
})
export class GuideComponent implements OnInit {

	constructor() { }

	ngOnInit() {
	}
	step = 0;
	points: any[] = [
		{
			gist: 'Mandatory',
			details : `Please Fill in the form completely.
			Mention each and every detail.`
		},
		{
			gist : 'Link Submission',
			details : 'To submit the pitch deck, you must upload it on your google drive and share the link in the space given.'
		},
		/*{
		 *  gist : 'Sample Pitch',
		 *  details : 'The sample pitch deck and be found at http://bit.do/UpstartPitchDeck'
		 *},*/
		{
			gist : 'Re-Submissions of Form/Link',
			details :	`If in case you want to make changes to the pitch deck,
			Just log in and submit the pitch deck again. The
			new file would replace the previous one.
			You could also change the details of the form anytime, just by logging in and re-filling the form.`
		},
		/*{
		 *  gist : 'Need More Help, Contact Us!',
		 *  details : `If you have any doubt regarding filling up the form, please message on the following : +91 831 982 9976.`
		 *}*/
	];

	setStep(index: number) {
		this.step = index;
	}

	nextStep() {
		this.step++;
	}

	prevStep() {
		this.step--;
	}
}
