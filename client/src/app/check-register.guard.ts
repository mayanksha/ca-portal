import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BackendService } from './services/backend.service';
@Injectable({
	providedIn: 'root'
})
export class CheckRegisterGuard implements CanActivate {
	facebookID: string;
	constructor(
		private router: Router,
		private backend: BackendService
	) {
		this.facebookID = localStorage.getItem('facebookID');
	}
	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
			const body = {
				'facebookID': this.facebookID
			};
			return this.backend.postReq('checkCaUser', body)
				.then((status: boolean) => {
					console.log('Status = ', status);
					if (!status) {
						this.router.navigateByUrl('/initial');
					}
					return Promise.resolve(status);
				})
				.catch(err => Promise.reject(err));
		}
}
