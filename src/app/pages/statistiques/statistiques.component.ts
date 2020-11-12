import { Component, OnInit } from "@angular/core";
import { StatistiquesService } from "src/app/service/statistiques/statistiques.service";
import { UserProfile } from "src/app/models/user.model";
import { ToastrService } from "ngx-toastr";
import { Notification } from "src/app/models";
import { NotificationService } from "src/app/service/notifications/notification.service";
import { RecettesService } from "src/app/service";
import { take } from "rxjs/operators";

@Component({
  selector: "app-statistiques",
  templateUrl: "./statistiques.component.html",
  styleUrls: ["./statistiques.component.css"],
})
export class StatistiquesComponent implements OnInit {
  public nbVuesTot: any;
  public nbCommentairesTot: any;
  public nbUsers: any;
  public nbAbonnes: any;
  public users: UserProfile[];
  public notifs: Notification[];

  constructor(
    private statService: StatistiquesService,
    private toastr: ToastrService,
    public notifService: NotificationService,
    public recetteService: RecettesService
  ) {
    this.notifService.getEnabledNotifs().subscribe((data) => {
      this.notifs = data;
      data.forEach((element) => {
        if (element.type === "vue") {
          this.recetteService
            .getRecipeById(element.idRecette)
            .subscribe((recipe) => {
              this.showInfo(
                "Une nouvelle vue sur la recette " + recipe.nomRecette,
                element.idNotification
              );
            });
        } else if (element.type === "user") {
          this.showSuccess(
            "Un nouvel abonné : " + element.pseudo,
            element.idNotification
          );
        } else if (element.type === "abonne") {
          this.showSuccess(
            "Un nouvel inscrit : " + element.pseudo,
            element.idNotification
          );
        }
      });
    });
  }

  ngOnInit(): void {
    this.statService.getNbVuesTot().subscribe((data) => {
      this.nbVuesTot = data[0].nbVuesTot; //data[0] car donnée récupérée sous format json
    });

    this.statService.getNbCommentairesTot().subscribe((data) => {
      this.nbCommentairesTot = data[0].nbCommentairesTot;
    });

    this.statService.getNbUsers().subscribe((data) => {
      this.nbUsers = data[0].nbUsers;
    });

    this.statService.getNbAbonnes().subscribe((data) => {
      this.nbAbonnes = data[0].nbAbonnes;
    });

    this.statService.getUsers().subscribe((data) => {
      this.users = data;
    });
  }

  showInfo(text, id) {
    this.toastr
      .info(text)
      .onTap.pipe(take(1))
      .subscribe(() => this.cleanNotif(id));
  }

  showSuccess(text, id) {
    this.toastr
      .success(text)
      .onTap.pipe(take(1))
      .subscribe(() => this.cleanNotif(id));
  }

  showWarning(text, id) {
    this.toastr
      .warning(text)
      .onTap.pipe(take(1))
      .subscribe(() => this.cleanNotif(id));
  }

  cleanNotif(id) {
    this.notifService.updateNotif(id).subscribe();
  }
}
