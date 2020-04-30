import { Component, OnInit } from '@angular/core';
import { RecettesService, RecipeDetails, Menu } from 'src/app/service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http'

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss']
})
export class AccueilComponent implements OnInit {

  public mostPopularRecipes: RecipeDetails[]
  public latestRecipes: RecipeDetails[]

  public menu: Menu = {
    petitDej : null,
    repas : null,
    douceur : null
  }

  public petitDej: RecipeDetails = null
  public repas: RecipeDetails = null
  public douceur: RecipeDetails = null

  constructor(private recetteService: RecettesService, private router: Router) {
    this.getMostPopularRecipes()
    this.getLatestReceipes()

    this.recetteService.getPetitDej().subscribe(data => {
      this.petitDej = data
    })

    this.recetteService.getRepas().subscribe(data => {
      this.repas = data
    })

    this.recetteService.getDouceur().subscribe(data => {
      this.douceur = data
    })
    
  }

  ngOnInit(): void {
  }

  getMenu() {

    this.recetteService.getMenu().subscribe(
      (menu: any) => {
        menu.forEach(element => {
          if (element.idMenu == 1) {
            this.menu.petitDej = element
          }
          else if (element.idMenu == 2) {
            this.menu.repas = element
          }
          else if (element.idMenu == 3) {
            this.menu.douceur = element
          }
        });
      }, err => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 402) {
            console.log("Il n'y a pas encore de recettes.")
          }
        }
      })
  }

  getMostPopularRecipes() {

    this.recetteService.getMostPopularRecipes().subscribe(
      (mostPopularRecipes: RecipeDetails[]) => {
        this.mostPopularRecipes = mostPopularRecipes
      }, err => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 402) {
            console.log("Il n'y a pas encore de recettes.")
          }
        }
      })
  }

  getLatestReceipes() {

    this.recetteService.getLatestReceipes().subscribe(
      (latestRecipes: RecipeDetails[]) => {
        this.latestRecipes = latestRecipes
      }, err => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 402) {
            console.log("Il n'y a pas encore de recettes.")
          }
        }
      })
  }

  updateNbView(recette: any) {
    this.recetteService.updateNbView(recette).subscribe(
      (res) => {
        this.router.navigate(['/recipe', recette.idRecette]).then(() => {
          window.location.reload()
        })
      }, err => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 402) {
            console.log("Cette recette n'existe pas !")
          }
        }
      })
  }

}
