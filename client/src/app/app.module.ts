import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { LoginService } from './services/login.service';
import { FbDataService } from './services/fb-data.service';
import {
	MatIconModule,
	MatToolbarModule,
	MatButtonModule,
	MatAutocompleteModule,
	MatInputModule,
	MatGridListModule,
	MatCardModule,
	MatMenuModule,
	MatSidenavModule,
	MatSelectModule
} from '@angular/material';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FacebookModule } from 'ngx-facebook';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthGuard } from './auth.guard';
import { HomeComponent } from './home/home.component';
import { LogoutComponent } from './logout/logout.component';
import { TopbarComponent } from './topbar/topbar.component';
import { ScriptService } from './services/script.service';
import { FbpostsComponent } from './components/fbposts/fbposts.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { OnLoginComponent } from './components/on-login/on-login.component';
import { RegformComponent } from './components/regform/regform.component';

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		DashboardComponent,
		HomeComponent,
		LogoutComponent,
		TopbarComponent,
		FbpostsComponent,
		SidenavComponent,
		OnLoginComponent,
		RegformComponent,
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		AppRoutingModule,
		HttpClientModule,
		FlexLayoutModule,
		FacebookModule.forRoot(),
		MatIconModule,
		MatToolbarModule,
		MatButtonModule,
		MatAutocompleteModule,
		MatInputModule,
		FormsModule,
		MatGridListModule,
		MatCardModule,
		MatMenuModule,
		MatSidenavModule,
		MatSelectModule,
	],
	providers: [
		LoginService,
		ScriptService,
		FbDataService,
		AuthGuard,
	],
	bootstrap: [AppComponent]
})

export class AppModule {}
