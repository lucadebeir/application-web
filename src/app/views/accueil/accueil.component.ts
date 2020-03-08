import { Component, OnInit } from '@angular/core';
import { RecipeDetails, RecettesService } from '../../service';
import {HttpErrorResponse} from '@angular/common/http'
import { Router } from '@angular/router';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit {

  public latestRecipes: RecipeDetails[]
  public mostPopularRecipes: RecipeDetails[]

  constructor(private recetteService: RecettesService, private router: Router) { }

  ngOnInit(): void {
    this.getLatestReceipes()
    this.getMostPopularRecipes()
  }

  getLatestReceipes() {

    this.recetteService.getLatestReceipes().subscribe(
      (latestRecipes: RecipeDetails[]) => {
        this.latestRecipes = latestRecipes
    },err => {
      if(err instanceof HttpErrorResponse){
        if(err.status === 402) {
          console.log("Il n'y a pas encore de recettes.")
        }
      }
    })
  }

  getMostPopularRecipes() {

    this.recetteService.getMostPopularRecipes().subscribe(
      (mostPopularRecipes: RecipeDetails[]) => {
        this.mostPopularRecipes = mostPopularRecipes
    },err => {
      if(err instanceof HttpErrorResponse){
        if(err.status === 402) {
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
        if(err instanceof HttpErrorResponse){
          if(err.status === 402) {
          console.log("Cette recette n'existe pas !")
        }
      }
    })
  }

}
