import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Box } from 'src/app/core/models/box.model';
import { SupabaseService } from 'src/app/core/services/supabase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  boxes: Box[] = [];
  lastUrl: SafeResourceUrl;

  constructor(
    private supabaseService: SupabaseService,
    private router: Router,
    private readonly dom: DomSanitizer
  ) {}

  ngOnInit() {
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
    const { data, error } = await this.supabaseService.getBoxes();
    if (error) {
      console.log(error);
      return;
    }

    console.log(data);
    this.boxes = data as Box[];
    this.boxes.forEach(async (box) => {
      if (box.imageUrl) {
        const { data, error } = await this.supabaseService.downloadBoxImage(box.imageUrl);
        if (data) {
          this.lastUrl = this.dom.bypassSecurityTrustResourceUrl(URL.createObjectURL(data))
        }
      }
    })
  }
}
