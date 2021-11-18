import { Component, ElementRef, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Box, BoxWithImage } from 'src/app/core/models/box.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { SupabaseService } from 'src/app/core/services/supabase.service';
import { AddBoxComponent } from '../add-box/add-box.component';
import * as fathom from 'fathom-client';

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
    private modalService: NgbModal,
    private alertService: AlertService
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
      radius: []
    });

    this.getBoxes();
  }

  currentName: string;
  currentEmail: string;

  async open(content: TemplateRef<any>, box: Box) {
    fathom.trackGoal('IKXUUASE', 0);
    const { data, error } = await this.supabaseService.searchProfile(box.user_id);
    if (error) {
      console.log(error);
      return;
    }

    this.currentName = data.name;
    this.currentEmail = data.email;
    
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  handleAddressChange(address: any) {
    this.lat = address.geometry.location.lat();
    this.lng = address.geometry.location.lng();
  }

  async signout() {
    await this.supabaseService.signOut();
    fathom.trackGoal('XRSMIWED', 0);
    this.router.navigate(['home']);
  }

  async addBox() {
    const { data, error } = await this.supabaseService.countOwnBoxes();
    if (data.length >= 5) {
      fathom.trackGoal('BK7GWRZ6', 0);
      this.alertService.error('Can\'t add more boxes. Please talk to the team for further upgrades');
      return;
    }

    this.modalService
      .open(AddBoxComponent, { ariaLabelledBy: 'modal-basic-title' })
      .result
      .then(success => {
        if (success) {
          fathom.trackGoal('OAPWNJRZ', 0);
          this.getBoxes();
        }
      });
  }

  async getBoxes() {
    const user = await this.supabaseService.user;
    if (user) {
      fathom.trackGoal('LRWTT0RL', 0);
    } else {
      fathom.trackGoal('TQFQQTLU', 0);
    }
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
