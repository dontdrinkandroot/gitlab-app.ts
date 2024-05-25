import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {SecurityService} from "../security/security.service";

export const isLoggedIn: CanActivateFn = async (route, state) => {

    const securityService = inject(SecurityService);
    const router = inject(Router);
    const user = await securityService.findCurrentUser();

    if (null == user) {
        router.navigate(['/login']);
    }

    return user !== null;
};
