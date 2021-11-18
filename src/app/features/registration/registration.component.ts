import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/core/services/alert.service';
import { SupabaseService } from 'src/app/core/services/supabase.service';
import * as fathom from 'fathom-client';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  registrationForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private supabaseService: SupabaseService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.registrationForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f() { return this.registrationForm.controls; }

  async onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.registrationForm.invalid) {
      return;
    }

    this.loading = true;
    const { data, error } = await this.supabaseService.signUp(this.f.email.value, this.f.password.value);
    if (data && data['email_confirmed_at']) {
      this.loading = false;
      this.alertService.error('Email already registered');
      return;
    }
    
    if (error) {
      this.loading = false;
      this.alertService.error(error.message);
      return;
    }

    fathom.trackGoal('53CMIQMA', 0);
    this.router.navigate([this.returnUrl]);
  }
}
