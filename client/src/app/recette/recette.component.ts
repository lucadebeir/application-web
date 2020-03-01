import { Component, OnInit, Input } from '@angular/core';
import { RecipeDetails, RecettesService, IngredientDetails, UniteDetails, QuantiteDetails } from '../recettes.service';
import { HttpErrorResponse, HttpResponse} from '@angular/common/http'
import {Router, ActivatedRoute} from '@angular/router'

@Component({
  selector: 'app-recette',
  templateUrl: './recette.component.html',
  styleUrls: ['./recette.component.css']
})
export class RecetteComponent implements OnInit {

  @Input()
  public recette: RecipeDetails 
  @Input()
  public ingredient: IngredientDetails
  @Input()
  public unite: UniteDetails
  @Input()
  public qtes: QuantiteDetails[]

  constructor(private recetteService: RecettesService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    if(this.route.snapshot.paramMap.get('id')) {
      this.getRecipeById(parseInt(this.route.snapshot.paramMap.get('id'))) /*parseInt transforme un string en int
      
      this.recette = this.getRecipeById(parseInt(this.route.snapshot.paramMap.get('id'))) /*parseInt transforme un string en int
      route.snapshot.paramMap.get('id') pour récupérer l'id dans l'url */
      console.log(this.recette)
      this.getUtiliserIngredientsByIdRecette(this.route.snapshot.paramMap.get('id')).forEach(function(element) {
        console.log(element)
        this.unite = this.getUniteByIdUnite(element.idUnite)
        this.ingredient = this.getIngredientById(element.idIngredient)
        this.ingredient.unite = this.unite["libelleUnite"]
        this.recette.ingredients.push(this.ingredient)
      })
    }
  }

  getRecipeById(id: any) : void {
    this.recetteService.getRecipeById(id).subscribe(
      (recette: RecipeDetails) => {
        this.recette = recette
        console.log(this.recette)
      },err => {
        if(err instanceof HttpErrorResponse){
          if(err.status === 402) {
            console.log("Cette recette n'existe pas !")
          }
        }
      }
    )
    console.log(this.recette)
  }

  getUtiliserIngredientsByIdRecette(id: any) : QuantiteDetails[] {
    this.recetteService.getUtiliserIngredientsByIdRecette(id).subscribe(
      (qtes: QuantiteDetails[]) => {
        console.log(qtes)
        this.qtes = qtes
      }, err => {
        if(err instanceof HttpResponse) {
          if(err.status === 402) {
            console.log("Il n'y a pas d'ingrédients !")
          }
        }
      }
    )
    return this.qtes
  }

  getUniteByIdUnite(id: any) : UniteDetails {
    this.recetteService.getUniteById(id).subscribe(
      (unite: UniteDetails) => {
        this.unite = unite
      }, err => {
        if(err instanceof HttpResponse) {
          if(err.status === 402) {
            console.log("Il n'y a pas d'ingrédients !")
          }
        }
      }
    )
    return this.unite
  }

  getIngredientById(id: any) : IngredientDetails {
    this.recetteService.getIngredientById(id).subscribe(
      (ingredient: IngredientDetails) => {
        this.ingredient = ingredient
      }, err => {
        if(err instanceof HttpResponse) {
          if(err.status === 402) {
            console.log("Il n'y a pas d'ingrédients !")
          }
        }
      }
    )
    return this.ingredient
  }

}
