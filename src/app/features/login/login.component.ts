import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Constants } from 'src/app/core/constants';
import { AlertService } from 'src/app/core/services/alert.service';
import { SupabaseService } from 'src/app/core/services/supabase.service';
import * as fathom from 'fathom-client';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private supabaseService: SupabaseService,
    private alertService: AlertService,
    private constants: Constants
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  async onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    const { data, error } = await this.supabaseService.signIn(this.f.email.value, this.f.password.value);
    if (error) {
      this.loading = false;
      this.alertService.error(error.message);
      return;
    }

    localStorage.setItem('data', JSON.stringify(data));
    fathom.trackGoal('MADXDDVO', 0);

    this.router.navigate([this.returnUrl]);
  }
}
