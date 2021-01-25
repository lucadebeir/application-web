import { Component, OnInit } from "@angular/core";
import { RecettesService, CategoriesService } from "../../service";
import { RecipeDetails, Menu, CategoryDetails } from "../../models";
import { Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import { OwlOptions } from "ngx-owl-carousel-o";
import { Notification } from "src/app/models";
import { NotificationService } from "src/app/service/notifications/notification.service";
import { Title } from "@angular/platform-browser";
import { SwiperOptions } from "swiper";

@Component({
  selector: "app-accueil",
  templateUrl: "./accueil.component.html",
  styleUrls: ["./accueil.component.scss"],
})
export class AccueilComponent implements OnInit {
  title = "Marine's Recipes";

  public condition: boolean = true;

  public mostPopularRecipes: RecipeDetails[];
  public latestRecipes: RecipeDetails[];

  public menu: Menu = {
    petitDej: null,
    repas: null,
    douceur: null,
  };

  public petitDej: RecipeDetails = null;
  public repas: RecipeDetails = null;
  public douceur: RecipeDetails = null;

  public recettes: RecipeDetails[];

  public categories: CategoryDetails[];

  customOptions: OwlOptions = {
    autoplay: true,
    autoplayTimeout: 5000,
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ["Previous", "Next"],
    responsive: {
      0: {
        items: 2,
      },
      430: {
        items: 3,
      },
      640: {
        items: 4,
      },
      850: {
        items: 5,
      },
      1055: {
        items: 6,
      },
      1250: {
        items: 7,
      },
      1450: {
        items: 8,
      },
      1600: {
        items: 9,
      },
    },
    nav: false,
    // autoWidth: true,
    // autoHeight: true
  };

  myCarouselOptions = {
    items: 3,
    dots: true,
    navigation: true,
    autoplay: true,
    loop: true,
    margin: 10,
    responsiveClass: true,
    responsive: {
      0: {
        items: 1,
        autoWidth: false,
      },
      768: {
        items: 2,
        autoWidth: false,
      },
      992: {
        items: 3,
        autoWidth: false,
      },
      1310: {
        items: 3,
        autoWidth: false,
        margin: 30,
      },
    },
  };

  config: SwiperOptions = {
    slidesPerView: 3,
    spaceBetween: 30,
    // init: false,
    watchSlidesProgress: true,
    navigation: true,
    loop: true,
    autoplay: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      0: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 2,
      },
      992: {
        slidesPerView: 3,
      },
      1310: {
        slidesPerView: 3,
        spaceBetween: 50,
      },
    },
  };

  constructor(
    private recetteService: RecettesService,
    private router: Router,
    private categoriesService: CategoriesService,
    private notifService: NotificationService,
    private titleService: Title
  ) {
    this.titleService.setTitle(this.title);
    this.getMostPopularRecipes();
    this.getLatestReceipes();

    this.categoriesService.getAllCategory().subscribe((data) => {
      this.categories = data;
    });

    this.recetteService.getAllRecipes().subscribe((data) => {
      this.recettes = data;
    });

    this.recetteService.getPetitDej().subscribe((data) => {
      this.petitDej = data;
    });

    this.recetteService.getRepas().subscribe((data) => {
      this.repas = data;
    });

    this.recetteService.getDouceur().subscribe((data) => {
      this.douceur = data;
    });
  }

  ngOnInit(): void {
    window.onresize = () => (this.condition = window.innerWidth <= 500);
    window.onresize = () => (this.condition = window.innerWidth > 500);
  }

  getMenu() {
    this.recetteService.getMenu().subscribe(
      (menu: any) => {
        menu.forEach((element) => {
          if (element.idMenu === 1) {
            this.menu.petitDej = element;
          } else if (element.idMenu === 2) {
            this.menu.repas = element;
          } else if (element.idMenu === 3) {
            this.menu.douceur = element;
          }
        });
      },
      (err) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 402) {
            console.log("Il n'y a pas encore de recettes.");
          }
        }
      }
    );
  }

  goToCategory(idCategorie: number) {
    this.router.navigate(["/allRecipes", { id: idCategorie }]);
  }

  getMostPopularRecipes() {
    this.recetteService.getMostPopularRecipes().subscribe(
      (mostPopularRecipes: RecipeDetails[]) => {
        this.mostPopularRecipes = mostPopularRecipes;
      },
      (err) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 402) {
            console.log("Il n'y a pas encore de recettes.");
          }
        }
      }
    );
  }

  getLatestReceipes() {
    this.recetteService.getLatestReceipes().subscribe(
      (latestRecipes: RecipeDetails[]) => {
        this.latestRecipes = latestRecipes;
      },
      (err) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 402) {
            console.log("Il n'y a pas encore de recettes.");
          }
        }
      }
    );
  }

  updateNbView(recette: any) {
    this.recetteService.updateNbView(recette).subscribe(
      (res) => {
        this.notificationVue(recette.idRecette);
        this.router.navigate(["/recipe", recette.idRecette]).then(() => {
          window.location.reload();
        });
      },
      (err) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 402) {
            console.log("Cette recette n'existe pas !");
          }
        }
      }
    );
  }

  //notification vue
  notificationVue(idRecette) {
    let notif: Notification = {
      pseudo: null,
      idRecette: idRecette,
      type: "vue",
    };
    this.notifService.addNotification(notif).subscribe();
  }
}
