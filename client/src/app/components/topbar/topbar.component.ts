import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {

  search = true;

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
    if (this.router.url === '/home') {
      this.search = false;
    }
  }

}
