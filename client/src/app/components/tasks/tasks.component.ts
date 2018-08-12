import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';
declare var particlesJS: any;

@Component({
	selector: 'app-tasks',
	templateUrl: './tasks.component.html',
	styleUrls: ['./tasks.component.css']
})

export class TasksComponent implements OnInit {
	tasks: any[];

	checked_0 = false;
	form: any = null;
	facebookID: string;
	constructor(
		private back: BackendService
	) {
		this.back.getReq('/tasks')
			.then((value) => {
				/*console.log(value);*/
				this.tasks = value;
			})
			.catch(err => console.error(err));
		this.facebookID = localStorage.getItem('facebookID');
	}
	ngOnInit() {
		particlesJS.load('particles-js', '../../assets/particlesjs-config.json', null);
	}

	onSubmit(form_value, task_id) {
		const link = (Object.values(form_value))[1];
		const form = {
			facebookID: this.facebookID,
			taskID: task_id,
			link: link
		};
		/*console.log(form);*/
		const submittedTask = this.tasks.find((e) => e.id === task_id);
		this.back.postReq('/tasks', form)
			.then((rows) => {
				/*console.log(rows);*/
				submittedTask.submitStatus = 1;
			})
			.catch((err) => {
				/*console.log(err);*/
				submittedTask.submitStatus = 2;
			});
	}
}
