import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService } from 'src/app/core/services/supabase.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  loading = false;
  submitted = false;

  address: string = ''
  lat: string = ''
  lng: string = ''

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private supabaseService: SupabaseService,
    // private alertService: AlertService
  ) { }

  ngOnInit() {
    this.profileForm = this.formBuilder.group({
      name: ['', Validators.required],
      location: ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.profileForm.controls; }

  handleAddressChange(address: any) {
    console.log(address);
    this.address = address.formatted_address;
    this.lat = address.geometry.location.lat();
    this.lng = address.geometry.location.lng();
  }

  async onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.profileForm.invalid) {
      return;
    }

    this.loading = true;
    const { data, error } = await this.supabaseService.updateProfile({
      name: this.f.name.value,
      address: this.address,
      lat: this.lat,
      lng: this.lng
    });

    if (error) {
      this.loading = false;
      console.log(error);
      return;
    }

    this.router.navigate(['/home']);
  }
}
