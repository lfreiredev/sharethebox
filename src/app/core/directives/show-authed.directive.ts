import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from "@angular/core";
import { AuthChangeEvent, Session } from "@supabase/gotrue-js";
import { SupabaseService } from "../services/supabase.service";

@Directive({ selector: '[showAuthed]' })
export class ShowAuthedDirective implements OnInit {
    @Input() set showAuthed(condition: boolean) {
        this.condition = condition;
    }
    private condition: boolean;

    constructor(
        private templateRef: TemplateRef<any>,
        private supabaseService: SupabaseService,
        private viewContainerRef: ViewContainerRef
    ) { }

    ngOnInit() {
        if (this.supabaseService.user) {
            if (this.condition) {
                this.viewContainerRef.createEmbeddedView(this.templateRef);
            } else {
                this.viewContainerRef.clear();
            }
        } else {
            if (this.condition) {
                this.viewContainerRef.clear();
            } else {
                this.viewContainerRef.createEmbeddedView(this.templateRef);
            }
        }

        this.supabaseService.authChanges((event: AuthChangeEvent, session: Session | null) => {
            if (this.supabaseService.user && this.condition) {
                this.viewContainerRef.createEmbeddedView(this.templateRef);
            } else {
                this.viewContainerRef.clear();
            }
        });
    }
}