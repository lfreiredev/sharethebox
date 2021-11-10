import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Box, BoxWithImage } from 'src/app/core/models/box.model';
import { SupabaseService } from 'src/app/core/services/supabase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  boxes: BoxWithImage[] = [];
  form: FormGroup;

  private lat: number = null;
  private lng: number = null;

  constructor(
    private supabaseService: SupabaseService,
    private router: Router,
    private formBuilder: FormBuilder,
    private readonly dom: DomSanitizer,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      hasImage: [true],
      minAmount: [],
      maxAmount: [],
      minWidth: [],
      maxWidth: [],
      minHeight: [],
      maxHeight: [],
      minLength: [],
      maxLength: [],
      location: [''],
      radius: [1000]
    });

    this.getBoxes();
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
    }, (reason) => {
    });
  }

  handleAddressChange(address: any) {
    this.lat = address.geometry.location.lat();
    this.lng = address.geometry.location.lng();
  }

  getUser() {
    console.log(this.supabaseService.user);
  }

  async getProfile() {
    const { data, error, status } = await this.supabaseService.profile;
    if (error) {
      console.log(error);
      console.log(status);
    }

    console.log(data);
  }

  async signout() {
    await this.supabaseService.signOut();
    this.router.navigate(['login']);
  }

  async addBox() {
    this.router.navigate(['add-box']);
  }

  async getBoxes() {
    const { data, error } = await this.supabaseService.searchBoxes({
      hasImage: this.form.controls.hasImage.value,
      minAmount: this.form.controls.minAmount.value,
      maxAmount: this.form.controls.maxAmount.value,
      minWidth: this.form.controls.minWidth.value,
      maxWidth: this.form.controls.maxWidth.value,
      minHeight: this.form.controls.minHeight.value,
      maxHeight: this.form.controls.maxHeight.value,
      minLength: this.form.controls.minLength.value,
      maxLength: this.form.controls.maxLength.value,
      lat: this.lat,
      lng: this.lng,
      radius: this.form.controls.radius.value
    });

    if (error) {
      console.log(error);
      return;
    }

    console.log(data);
    this.boxes = data as BoxWithImage[];
    if (this.supabaseService.user) {
      this.boxes.forEach(async (box) => {
        if (box.imageUrl) {
          const { data, error } = await this.supabaseService.downloadBoxImage(box.imageUrl);
          if (data) {
            box.image = this.dom.bypassSecurityTrustResourceUrl(URL.createObjectURL(data))
          }
        }
      });
    }
  }

  goToRegistration() {
    this.router.navigate(['register']);
  }

  goToLogin() {
    this.router.navigate(['login']);
  }
}
