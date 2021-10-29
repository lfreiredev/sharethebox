import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router } from "@angular/router";
import { SupabaseService } from 'src/app/core/services/supabase.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private supabaseService: SupabaseService, private router: Router) { }

    async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
        const user = this.supabaseService.user;

        if (!user) {
            this.router.navigate(['login']);
            return false;
        }

        if (!route.data.isProfile) {
            const result = await this.supabaseService.profile;
            if (result.status >= 400 && result.status < 500) {
                this.router.navigate(['profile']);
                return false;
            }
        }

        return true;
    }
}