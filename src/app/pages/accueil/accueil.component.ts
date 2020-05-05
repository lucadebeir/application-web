import { Component, OnInit } from '@angular/core';
import { RecettesService, CategoriesService } from '../../service';
import { RecipeDetails, Menu, CategoryDetails } from '../../models';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss']
})
export class AccueilComponent implements OnInit {

  public mostPopularRecipes: RecipeDetails[];
  public latestRecipes: RecipeDetails[];

  public menu: Menu = {
    petitDej : null,
    repas : null,
    douceur : null
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
    navText: ['Previous', 'Next'],
    responsive: {
      0: {
        items: 2
      },
      430: {
        items: 3
      },
      640: {
        items: 4
      },
      850: {
        items: 5
      },
      1055: {
        items: 6
      },
      1250: {
        items: 7
      },
      1450: {
        items: 8
      },
      1600: {
        items: 9
      }
    },
    nav: false,
    // autoWidth: true,
    // autoHeight: true
  };

  constructor(private recetteService: RecettesService, private router: Router, private categoriesService: CategoriesService) {
    this.getMostPopularRecipes();
    this.getLatestReceipes();

    this.categoriesService.getAllCategory().subscribe(data => {
      this.categories = data;
    });

    this.recetteService.getAllRecipes().subscribe(data => {
      this.recettes = data;
    });

    this.recetteService.getPetitDej().subscribe(data => {
      this.petitDej = data;
    });

    this.recetteService.getRepas().subscribe(data => {
      this.repas = data;
    });

    this.recetteService.getDouceur().subscribe(data => {
      this.douceur = data;
    });

  }

  ngOnInit(): void {
  }

  getMenu() {

    this.recetteService.getMenu().subscribe(
      (menu: any) => {
        menu.forEach(element => {
          if (element.idMenu === 1) {
            this.menu.petitDej = element;
          } else if (element.idMenu === 2) {
            this.menu.repas = element;
          } else if (element.idMenu === 3) {
            this.menu.douceur = element;
          }
        });
      }, err => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 402) {
            console.log('Il n\'y a pas encore de recettes.');
          }
        }
      });
  }

  goToCategory(idCategorie: number) {
    this.router.navigate(['/allRecipes', { id: idCategorie }]);
  }

  getMostPopularRecipes() {

    this.recetteService.getMostPopularRecipes().subscribe(
      (mostPopularRecipes: RecipeDetails[]) => {
        this.mostPopularRecipes = mostPopularRecipes;
      }, err => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 402) {
            console.log('Il n\'y a pas encore de recettes.');
          }
        }
      });
  }

  getLatestReceipes() {

    this.recetteService.getLatestReceipes().subscribe(
      (latestRecipes: RecipeDetails[]) => {
        this.latestRecipes = latestRecipes;
      }, err => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 402) {
            console.log('Il n\'y a pas encore de recettes.');
          }
        }
      });
  }

  updateNbView(recette: any) {
    this.recetteService.updateNbView(recette).subscribe(
      (res) => {
        this.router.navigate(['/recipe', recette.idRecette]).then(() => {
          window.location.reload();
        });
      }, err => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 402) {
            console.log('Cette recette n\'existe pas !');
          }
        }
      });
  }

}
