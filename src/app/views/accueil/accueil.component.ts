import { Component, OnInit } from '@angular/core';
import { RecipeDetails, RecettesService, AuthentificationService, FavorisDetails } from '../../service';
import { HttpErrorResponse } from '@angular/common/http'
import { Router } from '@angular/router';
import { element } from 'protractor';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss'],
  providers: [NgbCarouselConfig]
})
export class AccueilComponent implements OnInit {

  public latestRecipes: RecipeDetails[]
  public mostPopularRecipes: RecipeDetails[]

  public newFavori: FavorisDetails = {
    pseudo: '',
    idRecette: null
  }

  public favoris: number[] = []

  constructor(private recetteService: RecettesService, private router: Router, public auth: AuthentificationService, config: NgbCarouselConfig) {
    if (this.auth.isLoggedIn()) {
      this.newFavori.pseudo = this.auth.getUserDetails().pseudo

      this.getFavoris()
    }
    config.showNavigationIndicators = false;
  }

  ngOnInit(): void {
    this.getLatestReceipes()
    this.getMostPopularRecipes()
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

  addFavoris(id: number) {
    this.newFavori.idRecette = id
    this.recetteService.addFavoris(this.newFavori).subscribe(res => {
      this.getFavoris()
      this.recetteService.getMostPopularRecipes().subscribe(
        (mostPopularRecipes: RecipeDetails[]) => {
          this.mostPopularRecipes = mostPopularRecipes
        })
      this.recetteService.getLatestReceipes().subscribe(
        (latestRecipes: RecipeDetails[]) => {
          this.latestRecipes = latestRecipes
        })
    })
  }

  getFavoris() {
    this.favoris = []
    this.recetteService.getFavoris().subscribe(
      (favoris: RecipeDetails[]) => {
        console.log(favoris)
        favoris.forEach(element => {
          this.favoris.push(element.idRecette)

          console.log(this.favoris)
        })

      }, err => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 402) {
            console.log("Cette user n'a pas de favoris")
          }
        }
      })
  }

  deleteFavoris(idRecette: any) {
    this.recetteService.deleteFavoris(idRecette).subscribe(res => {
      this.getFavoris()
      this.recetteService.getMostPopularRecipes().subscribe(
        (mostPopularRecipes: RecipeDetails[]) => {
          this.mostPopularRecipes = mostPopularRecipes
        })
      this.recetteService.getLatestReceipes().subscribe(
        (latestRecipes: RecipeDetails[]) => {
          this.latestRecipes = latestRecipes
        })
    }) /* rafraichit la page */
  }

}
