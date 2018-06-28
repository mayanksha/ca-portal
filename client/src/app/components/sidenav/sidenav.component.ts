import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatSidenav } from '@angular/material';
@Component({
	selector: 'app-sidenav',
	templateUrl: './sidenav.component.html',
	styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
	@ViewChild('sidenav') sidenav: MatSidenav;
	dropdownState	= false;
	reason = '';
	
  @Output() profile: EventEmitter<any> = new EventEmitter();

	close(reason: string) {
		this.reason = reason;
		this.sidenav.close();
	}
  clicked() {
    this.dropdownState = !this.dropdownState;
  }

  toggleProfile() {
    this.profile.emit();
  }

  hideDropdown() {
    this.dropdownState = false;
  }

  showDropdown() {
    this.dropdownState = true;
  }
	constructor() { }

	ngOnInit() {
	}

}
