import { Component, OnInit, Input } from '@angular/core';
import { RecipeDetails, RecettesService, IngredientDetails, UniteDetails, QuantiteDetails } from '../service/recettes.service';
import { HttpErrorResponse, HttpResponse} from '@angular/common/http'
import {Router, ActivatedRoute} from '@angular/router'
import {Observable, of} from 'rxjs'

@Component({
  selector: 'app-recette',
  templateUrl: './recette.component.html',
  styleUrls: ['./recette.component.css']
})
export class RecetteComponent implements OnInit {

  @Input()
  public recette: RecipeDetails
  @Input()
  public ingredients: Observable<IngredientDetails[]>

  @Input()
  public unite: UniteDetails
  @Input()
  public qtes: QuantiteDetails[]

  constructor(private recetteService: RecettesService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.recetteService.getRecipeById(parseInt(this.route.snapshot.paramMap.get('id'))).subscribe(
      recette => {
        this.recette = recette
        console.log(this.recette)
      }
    );

    this.recetteService.getIngredientsByIdRecette(parseInt(this.route.snapshot.paramMap.get('id'))).subscribe(
      ingredient => {
        console.log(ingredient)
        this.ingredients = ingredient
      }
    );
    console.log(this.ingredients)

    //console.log(this.recette)
    //console.log(parseInt(this.route.snapshot.paramMap.get('id')))
    //this.getRecipeById(parseInt(this.route.snapshot.paramMap.get('id'))) /*parseInt transforme un string en int*/
  }

  /*getRecipeById(id: any) : Observable<RecipeDetails> {
    this.recetteService.getRecipeById(id).subscribe(
      recette => {
        this.recette = recette
        console.log(this.recette)
      }
    )
    this.recetteService.getIngredientsByIdRecette(id).subscribe(
      ingredient => {
        this.recette.ingredients = ingredient
        console.log(this.recette)
      }
    )
    console.log(this.recette)
  }*/

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

}
