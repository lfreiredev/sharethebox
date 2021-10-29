import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/core/services/supabase.service';

@Component({
  selector: 'app-add-box',
  templateUrl: './add-box.component.html',
  styleUrls: ['./add-box.component.scss']
})
export class AddBoxComponent implements OnInit {
  boxForm: FormGroup;
  loading = false;
  submitted = false;

  fileName: string;
  file: File;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private supabaseService: SupabaseService,
    // private alertService: AlertService
  ) { }

  ngOnInit() {
    this.boxForm = this.formBuilder.group({
      amount: [1, Validators.required],
      width: [1, Validators.required],
      height: [1, Validators.required],
      length: [1, Validators.required],
      imageUrl: ['']
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.boxForm.controls; }

  async onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.boxForm.invalid) {
      return;
    }

    this.loading = true;
    const { data: imgData, error: imgError } = await this.supabaseService.uploadBoxImage(this.fileName, this.file);
    if (imgError) {
      console.log(imgError);
      return;
    }

    console.log(imgData);
    const { data, error } = await this.supabaseService.addBox({
      user_id: this.supabaseService.user?.id,
      amount: this.f.amount.value,
      width: this.f.width.value,
      height: this.f.height.value,
      length: this.f.length.value,
      imageUrl: imgData.Key,
    });

    if (error) {
      this.loading = false;
      console.log(error);
      return;
    }

    this.router.navigate(['/home']);
  }

  onFileChanged(files: FileList) {
    try {
      const file = files[0];
      const fileExt = file.name.split('.').pop();
      this.fileName = `${Math.random()}.${fileExt}`;
      this.file = file;
    } catch (error) {
      alert(error.message);
    }
  }
}
