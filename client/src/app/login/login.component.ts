import { LoginService } from '../services/login.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'angularx-social-login';
import { SocialUser } from 'angularx-social-login';
import { FacebookLoginProvider } from 'angularx-social-login';
declare var particlesJS: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private loginService: LoginService,
    private router: Router
  ) {}

  signInWithFacebook(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    // this.loginService.signInWithGoogle().then((user) => {
    //   console.log(user);
    // });
  }

  ngOnInit() {
    particlesJS.load('particles-js', '../../assets/particlesjs-config.json', null);

    this.authService.authState.subscribe(user => {
    //   this.userService.setUser(user);
    //   this.loginService.setLoggedIn(user !== null);
    //   console.log(this.userService.getUser);
    //   console.log(this.loginService.isLoggedIn);
    //   if (this.loginService.isLoggedIn) {
    //     this.router.navigate(['home']);
    //     this.loginService.setLoggedIn(true);
    //   }
    console.log(user);
    });
  }

}
