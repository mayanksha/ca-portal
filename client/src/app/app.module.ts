import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { FacebookModule } from 'ngx-facebook';
import { LoginService } from './services/login.service';
import {
  MatIconModule,
  MatToolbarModule,
  MatButtonModule,
  MatAutocompleteModule,
  MatInputModule,
  MatGridListModule,
  MatCardModule,
  MatMenuModule,
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FacebookModule } from 'ngx-facebook';
import { SocialLoginModule, FacebookLoginProvider, AuthServiceConfig, LoginOpt } from 'angularx-social-login';

import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthGuard } from './auth.guard';
import { HomeComponent } from './home/home.component';
import { LogoutComponent } from './logout/logout.component';
import { TopbarComponent } from './topbar/topbar.component';
import { ScriptService } from './services/script.service';
import { FbpostsComponent } from './components/fbposts/fbposts.component';
const fbLoginOptions: LoginOpt = {
  scope: 'email,pages_show_list',
  return_scopes: true,
  enable_profile_selector: true
};

const config = new AuthServiceConfig([
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider(
      '457343458032910', fbLoginOptions
    )
  }
]);

export function provideConfig() {
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    LogoutComponent,
    TopbarComponent,
    FbpostsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FlexLayoutModule,
    FacebookModule.forRoot(),
    SocialLoginModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatInputModule,
    FormsModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    FacebookModule.forRoot()
  ],
  providers: [
  	LoginService,
		ScriptService,
    AuthGuard,
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    },
  ],
  bootstrap: [AppComponent]
})

export class AppModule {}
