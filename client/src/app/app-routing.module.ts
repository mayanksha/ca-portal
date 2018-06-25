import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { HomeComponent } from './home/home.component';
import { FbpostsComponent } from './components/fbposts/fbposts.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  /*{
   *  path: '**',
   *  redirectTo: '/login',
   *  pathMatch: 'full'
   *},*/
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
	{
		path: 'fbposts',
		component: FbpostsComponent 
	}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [AuthGuard],
  exports: [RouterModule]
})

export class AppRoutingModule {}
