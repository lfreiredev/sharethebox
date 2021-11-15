import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router } from "@angular/router";
import { SupabaseService } from 'src/app/core/services/supabase.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private supabaseService: SupabaseService, private router: Router) { }

    async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
        const user = this.supabaseService.user;

        if (!user && !route.data.needAuth) {
            this.router.navigate(['login']);
            return false;
        }

        // if we're trying to go to any page other than the profile
        // and if the profile has not been set yet
        // redirect to the profile
        if (!route.data.isProfile) {
            const result = await this.supabaseService.profile;
            if (result.status >= 400 && result.status < 500) {
                this.router.navigate(['profile']);
                return false;
            }
        }

        // if we're trying to go to the profile page
        // and if the profile has already been set
        // redirect to the home
        if (route.data.isProfile) {
            const result = await this.supabaseService.profile;
            if (result.status === 200) {
                this.router.navigate(['home']);
                return false;
            }
        }

        return true;
    }
}