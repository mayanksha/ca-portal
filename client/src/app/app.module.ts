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
	MatExpansionModule,
	MatCardModule,
	MatMenuModule,
	MatSidenavModule,
	MatSelectModule,
	MatRadioModule,
	MatDialogModule,
	MatProgressSpinnerModule
} from '@angular/material';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FacebookModule } from 'ngx-facebook';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthGuard } from './auth.guard';
import { HomeComponent } from './components/home/home.component';
import { LogoutComponent } from './components/logout/logout.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { ScriptService } from './services/script.service';
import { FbpostsComponent } from './components/fbposts/fbposts.component';
import { OnLoginComponent } from './components/on-login/on-login.component';
import { RegformComponent } from './components/regform/regform.component';
import { ErrorStateMatcher } from '@angular/material/core';
import { TicksComponent } from './components/ticks/ticks.component';
import { LinkSubmissionComponent } from './components/link-submission/link-submission.component';
import { GuideComponent } from './components/guide/guide.component';

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		DashboardComponent,
		HomeComponent,
		LogoutComponent,
		TopbarComponent,
		FbpostsComponent,
		OnLoginComponent,
		RegformComponent,
		TicksComponent,
		LinkSubmissionComponent,
		GuideComponent,
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		ReactiveFormsModule,
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
		MatExpansionModule,
		MatCardModule,
		MatMenuModule,
		MatSidenavModule,
		MatSelectModule,
		MatRadioModule,
		MatDialogModule,
		MatProgressSpinnerModule
	],
	providers: [
		LoginService,
		ScriptService,
		FbDataService,
		AuthGuard,
		ErrorStateMatcher
	],
	bootstrap: [AppComponent]
})

export class AppModule {}
