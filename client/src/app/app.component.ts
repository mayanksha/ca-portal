import { Component } from '@angular/core';
import { FacebookService, InitParams } from 'ngx-facebook';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'app';
  constructor(private fb: FacebookService) {

    const initParams: InitParams = {
      appId: '457343458032910',
      xfbml: true,
      version: 'v2.8'
    };

    fb.init(initParams);

  }
}
