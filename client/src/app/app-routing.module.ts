import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './auth.guard';
import { CheckRegisterGuard } from './check-register.guard';
import { TasksComponent } from './components/tasks/tasks.component';
import { FbpostsComponent } from './components/fbposts/fbposts.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { OnLoginComponent } from './components/on-login/on-login.component';
import { GuideComponent } from './components/guide/guide.component';
import { RegformComponent } from './components/regform/regform.component';
import { ContactComponent } from './components/contact/contact.component';
import { LinkSubmissionComponent } from './components/link-submission/link-submission.component';
import { OnetimeRegisterComponent } from './components/onetime-register/onetime-register.component';
const routes: Routes = [
	{
		path: 'login',
		component: LoginComponent
	},
	{
		path: 'tasks',
		canActivate: [AuthGuard, CheckRegisterGuard],
		component: TasksComponent
	},
	{
		path : 'form',
		canActivate: [AuthGuard, CheckRegisterGuard],
		component : RegformComponent
	},
	{
		path : 'initial',
		canActivate: [],
		component : OnetimeRegisterComponent
	},
	{
		path: 'fbposts',
		canActivate: [CheckRegisterGuard],
		component: FbpostsComponent
	},
	{
		path: 'leaderboard',
		canActivate: [CheckRegisterGuard, AuthGuard],
		component: LeaderboardComponent
	},
	/*{
	 *  path: 'dashboard',
	 *  component: DashboardComponent
	 *},*/
	{
		path: 'linkSubmit',
		/*canActivate: [AuthGuard, CheckRegisterGuard],*/
		component: LinkSubmissionComponent
	},
	{
		path: 'guidelines',
		canActivate: [CheckRegisterGuard, AuthGuard],
		component: GuideComponent
	},
	{
		path: 'contact',
		canActivate: [CheckRegisterGuard, AuthGuard],
		component: ContactComponent
	},
	{
		path: '**',
		redirectTo: '/login',
		pathMatch: 'full'
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	providers: [AuthGuard, CheckRegisterGuard],
	exports: [RouterModule]
})

export class AppRoutingModule {}
