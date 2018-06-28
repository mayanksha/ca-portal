import { Component } from '@angular/core';
import { ScriptService } from './services/script.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})

export class AppComponent {
	title = 'app';
	constructor(
		private script: ScriptService,
	) {}
}
