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

  public allIngredients: IngredientDetails[]
  public allUnites: UniteDetails[]
  public allCategories: CategoryDetails[]

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

    this.recetteService.getAllIngredients().subscribe(
      ingredients => {
        this.allIngredients = ingredients
      }
    )

    this.recetteService.getAllUnite().subscribe(
      unites => {
        this.allUnites = unites
      }
    )

    this.recetteService.getAllCategory().subscribe(
      categories => {
        this.allCategories = categories
      }
    )

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'idCategorie',
      textField: 'libelleCategorie',
      enableCheckAll: false,
      itemsShowLimit: 3,
      allowSearchFilter: true,
      searchPlaceholderText: "Rechercher"
    };

    this.getCategorie(parseInt(this.route.snapshot.paramMap.get('id')))

    this.refreshIngredients()

  }

  getCategorie(id: any): any {
    this.recetteService.getCategorie(id).subscribe(
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

  updateNomRecette(recette: RecipeDetails) {
    this.recetteService.updateNomRecette(recette).subscribe((res: any) => {
      window.location.reload()
    }, (err: any) => {
      console.error(err)
    }
    );
  }
  updateEtapes(recette: RecipeDetails) {
    this.recetteService.updateEtapes(recette).subscribe((res: any) => {
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
    //window.location.reload() /* rafraichit la page */
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

}
export class Ingredient {
  idIngredient = '';
  quantite = '';
  idUnite = '';
}

