import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { CommonService } from 'src/app/shared/services/common.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  imagesLimit = 1;
  images = [];
  imagesPreview = [];
  constructor(private formBuilder: FormBuilder,private commonService:CommonService,private router: Router) { }


  ngOnInit() {
    this.createForm()
  }
  createForm(){
    this.signupForm = this.formBuilder.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone_number: ['', [Validators.required, Validators.minLength(10)]]
    });
  }
  get f() { return this.signupForm.controls; }
  onImageFile(files) {
    if (files.length == 0) {
      return;
    }
    if (files.length > 0) {
      this.images = [];
      this.imagesPreview = [];
      for (let f of files) {
        if (this.images.length < this.imagesLimit && f.type.includes('image')) {
          this.images.push(f)
          var reader = new FileReader();
          reader.onload = (event: any) => {
            this.imagesPreview.push(event.target.result);
          }
          reader.readAsDataURL(f);
        }else{
          this.commonService.alert(0,'Error','Please select valid image.')
        }
      }
    } 
  }
  onUserSignUp(){
    console.log("valid==========",this.signupForm.valid)
    let requestData = new FormData();
    for (let img of this.images) {
      requestData.append('profileImage', img)
    }
    requestData.append('first_name', this.f.first_name.value)
    requestData.append('last_name', this.f.last_name.value)
    requestData.append('email', this.f.email.value)
    requestData.append('phone_number', this.f.phone_number.value)
    requestData.append('password', this.f.password.value)
    console.log("getData",requestData)
    this.commonService
      .postApiCall("admin/signup", requestData)
      .subscribe(
        (response: any) => {
          if (response.code == 1) { 
            console.log("response", response);
            this.router.navigate([`/signin`])
            this.commonService.alert(response.code,"Success",response.message)
          } else {
            this.commonService.alert(0, "Error", response.message);
          }
        },
        (error: any) => {
          console.log(error);
        }
      );
  }
  numberOnly(event): boolean {
    return this.commonService.numberOnly(event);
  }
}
