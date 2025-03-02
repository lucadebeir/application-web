import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthentificationService } from "src/app/service";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-response-reset",
  templateUrl: "./response-reset.component.html",
  styleUrls: ["./response-reset.component.scss"],
})
export class ResponseResetComponent implements OnInit {
  ResponseResetForm: FormGroup;
  errorMessage: string;
  successMessage: string;
  resetToken: null;
  CurrentState: any;
  IsResetFormValid = true;
  constructor(
    private authService: AuthentificationService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.CurrentState = "Wait";
    this.route.params.subscribe((params) => {
      this.resetToken = params.token;
      this.VerifyToken();
    });
  }

  ngOnInit() {
    this.Init();
  }

  VerifyToken() {
    this.authService
      .ValidPasswordToken({ resettoken: this.resetToken })
      .subscribe(
        (data) => {
          this.CurrentState = "Verified";
        },
        (err) => {
          this.CurrentState = "NotVerified";
        }
      );
  }

  Init() {
    this.ResponseResetForm = this.fb.group({
      resettoken: [this.resetToken],
      newPassword: ["", [Validators.required, Validators.minLength(4)]],
      confirmPassword: ["", [Validators.required, Validators.minLength(4)]],
    });
  }

  Validate(passwordFormGroup: FormGroup) {
    const newPassword = passwordFormGroup.controls.newPassword.value;
    const confirmPassword = passwordFormGroup.controls.confirmPassword.value;

    if (confirmPassword.length <= 0) {
      return null;
    }

    if (confirmPassword !== newPassword) {
      return {
        doesNotMatch: true,
      };
    }

    return null;
  }

  ResetPassword(form) {
    if (form.valid) {
      this.IsResetFormValid = true;
      this.authService.newPassword(this.ResponseResetForm.value).subscribe(
        (data) => {
          this.ResponseResetForm.reset();
          this.successMessage = data.message;
          setTimeout(() => {
            this.successMessage = null;
            this.router.navigate(["login"]);
          }, 3000);
        },
        (err) => {
          if (err.error.message) {
            this.errorMessage = err.error.message;
          }
        }
      );
    } else {
      this.IsResetFormValid = false;
    }
  }
}
