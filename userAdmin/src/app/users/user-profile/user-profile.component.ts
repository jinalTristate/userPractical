import { Component, OnInit } from "@angular/core";
import {  ActivatedRoute,Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { CommonService } from "../../shared/services/common.service";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"],
})
export class UserProfileComponent implements OnInit {
  userId: any;
  profileData: any = {};
  profileImage: any;
  constructor(
    private commonService: CommonService,
    private route: ActivatedRoute,
    private router:Router
  ) {}

  ngOnInit() {
    this.userId = this.route.snapshot.params["id"];
    this.getData();
  }
  getData() {
    this.commonService
      .getApiCall("admin/getUserProfile")
      .subscribe(
        (response: any) => {
          if (response.code == 1) {
            console.log("response", response);
            if (response && response.data && response.data.length > 0) {
              this.profileData = response.data[0];
              this.profileImage =
                environment.API_URL +
                "assets/images/" +
                this.profileData.profileImage;
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
  logout(): void{
    this.commonService.deleteCookie('access_token');
    this.router.navigate(['/signin']);
    this.commonService.alert(1,'SUCCESS', 'Logout successfully');
  }
}
