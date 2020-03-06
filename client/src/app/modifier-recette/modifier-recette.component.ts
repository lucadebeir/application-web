import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest, from } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl, Form } from '@angular/forms';
import { RecipeDetails, RecettesService, CategoryDetails, IngredientDetails, QuantiteDetails,UniteDetails } from '../service/recettes.service';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http'
import { Router,ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-modifier-recette',
  templateUrl: './modifier-recette.component.html',
  styleUrls: ['./modifier-recette.component.css']
})
export class ModifierRecetteComponent implements OnInit {

  public recette: RecipeDetails 
  public ingredients: IngredientDetails
  public unite: UniteDetails
  public qtes: QuantiteDetails[]
  public categories: CategoryDetails[]

  constructor(private recetteService: RecettesService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.recetteService.getRecipeById(parseInt(this.route.snapshot.paramMap.get('id'))).subscribe(
      recette => {
        this.recette = recette
      }
    );

    this.recetteService.getIngredientsByIdRecette(parseInt(this.route.snapshot.paramMap.get('id'))).subscribe(
      ingredient => {
        this.ingredients = ingredient
        console.log(ingredient)
      }
    );
  }

  getCategorie(id: any) : any {
    this.recetteService.getCategorie(id).subscribe(
      (categories: CategoryDetails[]) => {
        this.categories = categories
      }, err => {
        if(err instanceof HttpResponse) {
          if(err.status === 402) {
            console.log("cette recette n'a pas de catégorie!")
          }
        }
      }
    )
    return this.categories
  }

  updateNomRecette(recette: RecipeDetails){
    this.recetteService.updateNomRecette(recette).subscribe((res: any) => {
        window.location.reload()
      },(err: any) => {
        console.error(err)
      }
    );
  }
  updateEtapes(recette: RecipeDetails){
    this.recetteService.updateEtapes(recette).subscribe((res: any) => {
        window.location.reload()
      },(err: any) => {
        console.error(err)
      }
    );
  }
}
