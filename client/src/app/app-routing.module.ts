import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './auth.guard';
import { HomeComponent } from './components/home/home.component';
import { FbpostsComponent } from './components/fbposts/fbposts.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { OnLoginComponent } from './components/on-login/on-login.component';
import { GuideComponent } from './components/guide/guide.component';
import { RegformComponent } from './components/regform/regform.component';
import { LinkSubmissionComponent } from './components/link-submission/link-submission.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { ContactComponent } from './components/contact/contact.component';
import { ThanksComponent } from './components/thanks/thanks.component';
const routes: Routes = [
	{
		path: 'login',
		component: LoginComponent
	},
	{
		path: 'tasks',
		component: HomeComponent
	},
	// {
	// 	path : 'form',
	// 	component : RegformComponent
	// },
	{
		path: 'fbposts',
		component: FbpostsComponent
	},
	{
		path: 'leaderboard',
		component: LeaderboardComponent
	},
	{
		path: 'contact',
		component: ContactComponent
	},
	// {
	// 	path: 'onFbLogin',
	// 	component: OnLoginComponent
	// },
	// {
	// 	path: 'linkSubmit',
	// 	component: LinkSubmissionComponent
	// },
	{
		path: 'guide',
		component: GuideComponent
	},
	{
		path: 'thanks',
		component: ThanksComponent
	},
	{
		path: '**',
		redirectTo: '/login',
		pathMatch: 'full'
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	providers: [AuthGuard],
	exports: [RouterModule]
})

export class AppRoutingModule {}
