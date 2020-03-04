import { Component, OnInit } from '@angular/core';
import { CategoryDetails, IngredientDetails, UniteDetails, RecettesService } from '../service/recettes.service';
import { FormGroup, FormArray, Validator, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-ajout-recette',
  templateUrl: './ajout-recette.component.html',
  styleUrls: ['./ajout-recette.component.css']
})
export class AjoutRecetteComponent implements OnInit {

  recipe: CreateRecipe = {
    idRecette: null,
    nomRecette: '',
    idCategorie: null,
    ingredients: null,
    etapes: ''

  }

  public ingredients: IngredientDetails[]
  public unites: UniteDetails[]
  public categories: CategoryDetails[]

  public recipeForm: FormGroup
  public ingredientForm: FormGroup

  constructor(private recetteService: RecettesService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    //on récupère tous les ingrédients, unités, catégories pour les réponses possibles à notre formulaire
    this.recetteService.getAllIngredients().subscribe(
      ingredients => {
        this.ingredients = ingredients
      }
    )

    this.recetteService.getAllUnite().subscribe(
      unites => {
        this.unites = unites
      }
    )

    this.recetteService.getAllCategory().subscribe(
      categories => {
        this.categories = categories
      }
    )

    this.createIngredientForm()

    this.addIngredient()
  }


  createRecipe() {
    this.recipe.ingredients = this.ingredientForm.value //je récupère les info sur l'ingrédient
    this.recetteService.createRecipe(this.recipe).subscribe(res => {
      this.recipe.idRecette = res[0] // je récupère l'id de l'adresse que je viens de créer
      this.recetteService.addIngredientsAndCategoryToNewRecipe(this.recipe).subscribe(res => {
        console.log(res)
      })
    })
    console.log(this.recipe)
  }


  createRecipeForm() {
    this.recipeForm = this.formBuilder.group({

    })
  }

  /******  création formulaire pour ajouter autant de lignes ingrédient (qté, nom, unite) qu'on veut *****/
  //création initiale formulaire ingredients
  createIngredientForm(){
    this.ingredientForm = this.formBuilder.group({
      ingredients: this.formBuilder.array([])
    })
  }

  get ingFormArray(): FormArray{
    return this.ingredientForm.get("ingredients") as FormArray
  }

  //pour ajouter un ingrédient
  addIngredient(){
    let fg = this.formBuilder.group(new Ingredient())
    this.ingFormArray.push(fg)
  }
/*****************************/

} 
export class Ingredient {
  idIngredient = '';
  quantite= '';
  idUnite='';
}


export interface CreateRecipe{
  idRecette: number
  nomRecette: string
  idCategorie: number
  ingredients: number
  etapes : string
}