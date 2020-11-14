import { Component, ViewChild } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { take } from "rxjs/operators";
import { Notification } from "./models";
import { RecettesService } from "./service";
import { AuthentificationService } from "./service/authentification.service";
import { NotificationService } from "./service/notifications/notification.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  notifs: Notification[];

  constructor(
    public auth: AuthentificationService,
    public notifService: NotificationService,
    public recetteService: RecettesService,
    private toastr: ToastrService
  ) {
    this.loadData();
  }

  loadData() {
    this.notifService.getEnabledNotifs().subscribe((data) => {
      this.notifs = data;
    });
  }

  showInfo(text, id, css) {
    this.toastr
      .show(text, null, {
        toastClass: css + " ngx-toastr",
      })
      .onTap.pipe(take(1))
      .subscribe(() => this.cleanNotif(id));
  }

  cleanNotif(id) {
    this.notifService.updateNotif(id).subscribe(() => {
      this.loadData();
    });
  }

  showNotif() {
    if (this.toastr.currentlyActive == 0) {
      this.notifs.forEach((element) => {
        if (element.type === "vue") {
          this.recetteService
            .getRecipeById(element.idRecette)
            .subscribe((recipe) => {
              this.showInfo(
                "La recette: "+recipe.nomRecette + " a été consulté",
                element.idNotification,
                "view-class"
              );
            });
        } else if (element.type === "user") {
          this.showInfo(
           element.pseudo + " est maintenant abonné à la newsletter.",
            element.idNotification,
            "user-class"
          );
        } else if (element.type === "abonne") {
          this.showInfo(
            element.pseudo + " vient de s'inscrire.",
            element.idNotification,
            "toast-success"
          );
        } else if (element.type === "commentaire") {
          this.recetteService
            .getRecipeById(element.idRecette)
            .subscribe((recipe) => {
              this.showInfo(
             
                  element.pseudo + " a commenté la recette: " +    recipe.nomRecette ,
                element.idNotification,
                "toast-info"
              );
            });
        } else if (element.type === "favori") {
          this.recetteService
            .getRecipeById(element.idRecette)
            .subscribe((recipe) => {
              this.showInfo(
                element.pseudo +
                  " a rajouté une nouvelle recette dans ses favoris : " +
                  recipe.nomRecette,
                element.idNotification,
                "toast-error"
              );
            });
        }
      });
      /*this.toastr
        .show("Cliquez ici pour enlever toutes les notifs !")
        .onTap.pipe(take(1))
        .subscribe(() => this.toastr.clear());*/
    } else {
      this.toastr.clear();
    }
    this.loadData();
  }
}
