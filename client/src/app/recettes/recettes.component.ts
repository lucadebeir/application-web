import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RecipeDetails, RecettesService, CategoryDetails } from '../service/recettes.service';
import {HttpErrorResponse} from '@angular/common/http'
import { Router } from '@angular/router';
 

@Component({
  selector: 'app-recettes',
  templateUrl: './recettes.component.html',
  styleUrls: ['./recettes.component.css']
})
export class RecettesComponent implements OnInit {

  public recettes: RecipeDetails[]
  public categories: CategoryDetails[]

  constructor(private recetteService: RecettesService, private router: Router) { } 

  //dans ngOnInit on récupère les données à afficher au chargement de la page
  ngOnInit(): void {
    this.getAllRecipes()
    this.getAllCategory()
  }

  getAllRecipes() {

    this.recetteService.getAllRecipes().subscribe(
      (recettes: RecipeDetails[]) => {
        this.recettes = recettes
    },err => {
      if(err instanceof HttpErrorResponse){
        if(err.status === 402) {
          console.log("Il n'y a pas encore de recettes.")
        }
      }
    })
  }

  getAllCategory(){
    this.recetteService.getAllCategory().subscribe(
      (categorie: CategoryDetails[]) => {
        console.log(categorie)
        this.categories = categorie
      }, err => {
        if(err instanceof HttpErrorResponse) {
          if(err.status === 402){
            console.log("Il n'y a pas de catégotie.")
          }

        }
      }
    )
  }

  getRecipeByCategory(idCategorie: any){
    //console.log(idCategorie)
    this.recetteService.getRecipeByCategory(idCategorie).subscribe(
      (recettes: RecipeDetails[]) => {
        this.recettes = recettes
        console.log(this.recettes)
      },err => {
        if(err instanceof HttpErrorResponse){
          if(err.status === 402) {
          console.log("Il n'y a pas encore de recettes dans cette catégorie.")
        }
      }
    })
  }

  updateNbView(idRecette: number) {
    this.recetteService.updateNbView(idRecette).subscribe(
      (res) => {
        console.log(res)
        this.router.navigate(['/recipe', idRecette])
      }, err => {
        if(err instanceof HttpErrorResponse){
          if(err.status === 402) {
          console.log("Cette recette n'existe pas !")
        }
      }
    })
  }
}
