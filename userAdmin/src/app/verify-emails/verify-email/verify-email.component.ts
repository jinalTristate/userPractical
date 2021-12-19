import { Component, OnInit } from "@angular/core";
import { CommonService } from "src/app/shared/services/common.service";
import { ActivatedRoute } from "@angular/router";
@Component({
  selector: "app-verify-email",
  templateUrl: "./verify-email.component.html",
  styleUrls: ["./verify-email.component.css"],
})
export class VerifyEmailComponent implements OnInit {
  params: any;
  type: any;
  msg: any;
  constructor(
    private commonService: CommonService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.params = params;
      console.log(this.params);
      this.onSubmit();
    });
  }

  onSubmit() {
    let methodName = `admin/verify-email`;
    this.commonService
      .postApiCall(methodName, {
        email: this.params.email ? this.params.email : "skdnfdsf@ksnrf.com",
        verification_code: this.params.verification_code
          ? this.params.verification_code
          : "sdkfnmsdklf",
      })
      .subscribe(
        (result: any) => {
          this.msg = result.message;
        },
        (error: Response) => {
          console.log(error);
        }
      );
  }
}
