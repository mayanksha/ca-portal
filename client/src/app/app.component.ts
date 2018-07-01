import { Component } from '@angular/core';
import { ScriptService } from './services/script.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})

export class AppComponent {
	title = 'E-Summit 2018 Registration Portal';
	constructor(
		private script: ScriptService,
	) {}
}
