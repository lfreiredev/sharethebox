import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from 'src/app/features/login/login.component';
import { RegistrationComponent } from 'src/app/features/registration/registration.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './features/home/home.component';
import { AuthGuard } from './core/guards/auth.guard';
import { ProfileComponent } from './features/profile/profile.component';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { AddBoxComponent } from './features/add-box/add-box.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ShowAuthedDirective } from './core/directives/show-authed.directive';
import { AlertComponent } from './shared/components/alert/alert.component';
import { Constants } from './core/constants';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    HomeComponent,
    ProfileComponent,
    AddBoxComponent,
    AlertComponent,
    ShowAuthedDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    GooglePlaceModule,
    NgbModule
  ],
  providers: [AuthGuard, Constants],
  bootstrap: [AppComponent]
})
export class AppModule { }
