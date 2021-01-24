import { Component, HostListener, ViewChild } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { filter, map, take } from "rxjs/operators";
import { Notification } from "./models";
import { RecettesService } from "./service";
import { AuthentificationService } from "./service/authentification.service";
import { NotificationService } from "./service/notifications/notification.service";
import { decoder } from "./utils/Codage";

// declare ga as a function to set and sent the events
declare let gtag: Function;

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  notifs: Notification[];

  constructor(
    public auth: AuthentificationService,
    public notifService: NotificationService,
    public recetteService: RecettesService,
    private toastr: ToastrService,
    public router: Router,
    private titleService: Title,
    private activatedRoute: ActivatedRoute
  ) {
    this.loadData();

    // subscribe to router events and send page views to Google Analytics
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        gtag("config", "G-BBQGRC1NTT", {
          page_path: event.urlAfterRedirects,
        });
      }
    });
  }

  ngOnInit() {
    const appTitle = this.titleService.getTitle();
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          const child = this.activatedRoute.firstChild;
          if (child.snapshot.data["title"]) {
            return child.snapshot.data["title"];
          }
          return appTitle;
        })
      )
      .subscribe((ttl: string) => {
        this.titleService.setTitle(ttl);
      });
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
                "La recette: " + decoder(recipe.nomRecette) + " a été consulté",
                element.idNotification,
                "view-class"
              );
            });
        } else if (element.type === "user") {
          this.showInfo(
            element.pseudo + " vient de s'inscrire.",
            element.idNotification,
            "user-class"
          );
        } else if (element.type === "abonne") {
          this.showInfo(
            element.pseudo + " est maintenant abonné à la newsletter.",
            element.idNotification,
            "toast-success"
          );
        } else if (element.type === "commentaire") {
          this.recetteService
            .getRecipeById(element.idRecette)
            .subscribe((recipe) => {
              this.showInfo(
                element.pseudo +
                  " a commenté la recette: " +
                  decoder(recipe.nomRecette),
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
                  decoder(recipe.nomRecette),
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

  @HostListener("window:onbeforeunload", ["$event"])
  clearLocalStorage(event) {
    localStorage.clear();
  }
}
