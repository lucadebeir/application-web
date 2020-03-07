import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest, from } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormGroup, FormArray, Validator, FormBuilder } from '@angular/forms';
import { RecipeDetails, RecettesService, CategoryDetails, IngredientDetails, QuantiteDetails, UniteDetails } from '../service/recettes.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http'
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; //la fenetre qui pop pour ajouter l'ingrédient pendant création d'une recette = modal
import {IDropdownSettings } from 'ng-multiselect-dropdown'

@Component({
  selector: 'app-modifier-recette',
  templateUrl: './modifier-recette.component.html',
  styleUrls: ['./modifier-recette.component.css']
})
export class ModifierRecetteComponent implements OnInit {

  public newIngredient: IngredientDetails = {
    qte: null,
    idRecette: parseInt(this.route.snapshot.paramMap.get('id')),
    idIngredient: null,
    idUnite: null
  }

  public recette: RecipeDetails
  public ingredients: IngredientDetails
  public unite: UniteDetails
  public qtes: QuantiteDetails[]
  

  public allIngredients: IngredientDetails[] //ingredients disponibles
  public allUnites: UniteDetails[]
  public allCategories: CategoryDetails[] //catégories disponibles

  public recipeForm: FormGroup
  public ingredientForm: FormGroup

  public selectedItems = []
  public dropdownSettings : IDropdownSettings

  constructor(private recetteService: RecettesService, private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder, private modalService: NgbModal) {
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
      }
    );

    this.recetteService.getRestIngredients(parseInt(this.route.snapshot.paramMap.get('id'))).subscribe(
      ingredients => {
        this.allIngredients = ingredients
      }
    )

    this.recetteService.getAllUnite().subscribe(
      unites => {
        this.allUnites = unites
      }
    )

    this.recetteService.getRestCategory(parseInt(this.route.snapshot.paramMap.get('id'))).subscribe(
      categories => {
        this.allCategories = categories
      }
    )

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'idCategorie',
      textField: 'libelleCategorie',
      enableCheckAll: false,
      itemsShowLimit: 4,
      allowSearchFilter: true,
      searchPlaceholderText: "Rechercher"
    };
    this.getCategory(parseInt(this.route.snapshot.paramMap.get('id')))


    this.refreshIngredients()

    this.refreshCategory()

  }

  getCategory(id: any): any {
    this.recetteService.getCategory(id).subscribe(
      (categories: CategoryDetails[]) => {
        this.selectedItems = categories
      }, err => {
        if (err instanceof HttpResponse) {
          if (err.status === 402) {
            console.log("cette recette n'a pas de catégorie!")
          }
        }
      }
    )
    return this.selectedItems
  }



  updateRecipeName(recette: RecipeDetails) {
    this.recetteService. updateRecipeName(recette).subscribe((res: any) => {
      window.location.reload()
    }, (err: any) => {
      console.error(err)
    }
    );
  }
  updateSteps(recette: RecipeDetails) {
    this.recetteService.updateSteps(recette).subscribe((res: any) => {
      window.location.reload()
    }, (err: any) => {
      console.error(err)
    }
    );
  }

  updateRecipeCategory(recette: RecipeDetails){
    this.recetteService.updateRecipeCategory(recette).subscribe((res: any) => {
      window.location.reload()
    }, (err: any) => {
      console.error(err)
    }
    );
  }

  deleteIngredientRececipe(ingredient: IngredientDetails, recette: RecipeDetails) {
    this.recetteService.deleteIngredientRececipe(ingredient, recette)
      .subscribe(res => {
        this.router.navigate(['updateRecipe/:id'], {
          queryParams: { refresh: new Date().getTime() }
        })
      }, (err) => {
        console.log(err);
      }
      );
  
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result
      .then((result) => {
        this.newIngredient.idIngredient = result.idIngredient
        this.newIngredient.qte = result.qte
        this.newIngredient.idUnite = result.idUnite
        this.recetteService.addIngredientRecette(this.newIngredient)
      })
  }

  refreshIngredients(): void {
    setInterval(() => {
      this.recetteService.getIngredientsByIdRecette(parseInt(this.route.snapshot.paramMap.get('id'))).subscribe(
        ingredient => {
          this.ingredients = ingredient
        }
      );
    }, 2000)
  }

  refreshCategory(): void {
    setInterval(() => {
      this.recetteService.getRestCategory(parseInt(this.route.snapshot.paramMap.get('id'))).subscribe(
        categories => {
          this.allCategories = categories
        }
      )
    }, 2000)
  }

}
export class Ingredient {
  idIngredient = '';
  quantite = '';
  idUnite = '';
}

