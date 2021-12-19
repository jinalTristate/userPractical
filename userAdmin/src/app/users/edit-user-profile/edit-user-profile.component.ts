import { Component, OnInit } from "@angular/core";
import { ActivatedRoute,Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { CommonService } from "../../shared/services/common.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
@Component({
  selector: "app-edit-user-profile",
  templateUrl: "./edit-user-profile.component.html",
  styleUrls: ["./edit-user-profile.component.css"],
})
export class EditUserProfileComponent implements OnInit {
  userId: any;
  profileData: any = {};
  profileImage: any;
  logEmail: any;
  imagesLimit = 1;
  images = [];
  imagesPreview = [];
  hide: boolean = true;

  editProfileForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private router:Router
  ) {}

  ngOnInit() {
    this.createForm();
    this.getData();
  }
  createForm() {
    this.editProfileForm = this.formBuilder.group({
      first_name: ["", [Validators.required]],
      last_name: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      phone_number: ["", [Validators.required, Validators.minLength(10)]],
    });
  }
  get f() {
    return this.editProfileForm.controls;
  }
  getData() {
    this.commonService.getApiCall("admin/getUserProfile").subscribe(
      (response: any) => {
        if (response.code == 1) {
          console.log("response", response);
          if (response && response.data && response.data.length > 0) {
            this.profileData = response.data[0];
            this.profileImage =
            environment.API_URL +
            "assets/images/" +this.profileData.profileImage;
            this.images.push(this.profileImage);
            this.imagesPreview.push(this.profileImage);
              
            this.editProfileForm.patchValue({
              first_name: this.profileData.first_name,
              last_name: this.profileData.last_name,
              email: this.profileData.email,
              phone_number: this.profileData.phone_number,
            });
          }
        } else {
          this.commonService.alert(0, "Error", response.message);
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
  onImageFile(files) {
    if (files.length == 0) {
      return;
    }
    if (files.length > 0) {
      this.images = [];
      this.imagesPreview = [];
      for (let f of files) {
        if (this.images.length < this.imagesLimit && f.type.includes("image")) {
          this.images.push(f);
          var reader = new FileReader();
          reader.onload = (event: any) => {
            this.imagesPreview.push(event.target.result);
          };
          reader.readAsDataURL(f);
        }
      }
    } else {
      this.images.push(this.profileData.profileImage);
      this.imagesPreview.push(this.profileData.profileImage);
    }
  }
  updateProfile() {
    let requestData = new FormData();
    if(this.images&&this.images.length>0&&typeof(this.images[0])=='object'){
      for (let img of this.images) {
        requestData.append("profileImage", img);
      }
    }
    requestData.append("first_name", this.f.first_name.value);
    requestData.append("last_name", this.f.last_name.value);
    requestData.append("phone_number", this.f.phone_number.value);
    this.commonService
      .postApiCallWithToken("admin/updateProfile", requestData)
      .subscribe(
        (response: any) => {
          if (response.code == 1) {
            console.log("response", response);
            this.router.navigate(['/user-profile'])
            this.commonService.alert(
              response.code,
              "Success",
              response.message
            );
          } else {
            this.commonService.alert(0, "Error", response.message);
          }
        },
        (error: any) => {
          console.log(error);
        }
      );
  }
  hideShowPassword() {
    this.hide = !this.hide;
  }
}
