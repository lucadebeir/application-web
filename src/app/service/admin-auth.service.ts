import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthentificationService } from './authentification.service';

@Injectable()
export class AdminAuthService implements CanActivate {
    constructor(private auth: AuthentificationService, private router: Router) { }

    canActivate() {
        if (!this.auth.isAdmin()) {
            this.router.navigateByUrl('/');
            return false;
        }
        return true;
    }
}
