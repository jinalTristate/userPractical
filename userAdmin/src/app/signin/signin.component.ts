import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../shared/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})

export class SigninComponent implements OnInit {
  signInForm: FormGroup;
  email:any
  password:any
  constructor(private fb: FormBuilder,private router: Router,
    private commonService: CommonService) { }

  async ngOnInit() {
   this.createForm()
  }
  createForm(){
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  get f() { return this.signInForm.controls; }
 
  submit() {
    if(this.signInForm.valid){
      this.commonService.postApiCall('admin/login', this.signInForm.value)
        .subscribe(
          (response: any) => {
            if (response.code == 1) {
              this.commonService.setCookie('access_token', response.data.auth_token);
              this.commonService.alert(1,'Success','Login Successful')
              this.router.navigate([`/user-profile`])
            } else {
              this.commonService.alert(0, 'Error', response.message)
            }
          },
          (error: any) => {
            console.log(error);
          }
        )
    }
  }

}
