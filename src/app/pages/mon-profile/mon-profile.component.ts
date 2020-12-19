import { Component, OnInit } from "@angular/core";
import { AuthentificationService } from "../../service";
import { Router, ActivatedRoute } from "@angular/router";
import { __param } from "tslib";
import { UserProfile } from "src/app/models/user.model";
import { Notification } from "src/app/models";
import { NotificationService } from "src/app/service/notifications/notification.service";

@Component({
  selector: "app-mon-profile",
  templateUrl: "./mon-profile.component.html",
  styleUrls: ["./mon-profile.component.scss"],
})
export class MonProfileComponent implements OnInit {
  credentials: UserProfile = {
    pseudo: "",
    email: "",
    abonneNews: true,
    success: "",
  };

  constructor(
    private auth: AuthentificationService,
    private router: Router,
    private route: ActivatedRoute,
    private notifService: NotificationService
  ) {}

  ngOnInit() {
    this.auth.profile().subscribe(
      (user) => {
        this.credentials = user;
      },
      (err) => {
        console.error(err);
      }
    );
    if (this.route.queryParams) {
      this.route.queryParams.subscribe((params) => {
        this.credentials.success = params.success;
      });
    }
  }

  updateProfile() {
    this.auth.updateProfile(this.credentials).subscribe(
      (res: any) => {
        this.credentials.success = res.success;
        this.router.navigateByUrl("/profile").then(() => {
          if (this.credentials.abonneNews) {
            this.notificationAbonne(this.credentials.pseudo);
          }
          // tslint:disable-next-line: deprecation
          setTimeout(window.location.reload.bind(window.location), 2500);
        });
      },
      (err: any) => {
        console.error(err);
      }
    );
  }

  //notification abonné
  notificationAbonne(pseudo) {
    let notif: Notification = {
      pseudo: pseudo,
      idRecette: null,
      type: "abonne",
    };
    this.notifService.addNotification(notif).subscribe();
  }

  deleteProfile(pseudo: any) {
    this.auth.logout();
    this.auth.deleteProfile(pseudo).subscribe(
      (res) => {
        this.router.navigate(["/"]);
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
