import { Component, OnInit } from '@angular/core';
import { CategoryDetails, IngredientDetails, UniteDetails, RecettesService } from '../service/recettes.service';
import { FormGroup, FormArray, Validator, FormBuilder } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; //la fenetre qui pop pour ajouter l'ingrédient pendant création d'une recette = modal

@Component({
  selector: 'app-ajout-recette',
  templateUrl: './ajout-recette.component.html',
  styleUrls: ['./ajout-recette.component.css']
})
export class AjoutRecetteComponent implements OnInit {

  recipe: CreateRecipe = {
    idRecette: null,
    nomRecette: '',
    categories: null,
    ingredients: null,
    etapes: ''

  }

  public ingredients: IngredientDetails[]
  public unites: UniteDetails[]
  public categories: CategoryDetails[]

  public recipeForm: FormGroup
  public ingredientForm: FormGroup

  public newIngredient: IngredientDetails = {
    nomIngredient: ''
  }

  //pour multiple select
  dropdownList = [];
  selectedItems = [];
  dropdownSettings: IDropdownSettings;

  constructor(private recetteService: RecettesService, private formBuilder: FormBuilder, private router: Router, private modalService: NgbModal) { }

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

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'idCategorie',
      textField: 'libelleCategorie',
      enableCheckAll: false,
      itemsShowLimit: 3,
      allowSearchFilter: true,
      searchPlaceholderText: "Rechercher"
    };

    this.createIngredientForm()

    this.addIngredient()

    this.refreshIngredients()
  }

  //on rafraitchit la liste des ingrédients et pas la page grâce à un timer toutes les 2 secondes
  refreshIngredients(): void {
    setInterval(() => {
      this.recetteService.getAllIngredients().subscribe(
        ingredients => {
          this.ingredients = ingredients
        }
      )
    }, 2000)
  }

  createRecipe() {
    this.recipe.ingredients = this.ingredientForm.value //je récupère les info sur l'ingrédient
    this.recipe.categories = this.selectedItems
    this.recetteService.createRecipe(this.recipe).subscribe(res => {
      this.recipe.idRecette = res[0] // je récupère l'id de l'adresse que je viens de créer
      this.recetteService.addIngredientsAndCategoryToNewRecipe(this.recipe).subscribe(res => {
       
      })
    })
    //this.router.navigate(['/recipe/'], { queryParams: { id: this.recipe.idRecette } })
    this.router.navigateByUrl('allRecipes')
  }


  createRecipeForm() {
    this.recipeForm = this.formBuilder.group({

    })
  }

  /******  création formulaire pour ajouter autant de lignes ingrédient (qté, nom, unite) qu'on veut *****/
  //création initiale formulaire ingredients
  createIngredientForm() {
    this.ingredientForm = this.formBuilder.group({
      ingredients: this.formBuilder.array([])
    })
  }

  get ingFormArray(): FormArray {
    return this.ingredientForm.get("ingredients") as FormArray
  }

  //pour ajouter un ingrédient
  addIngredient() {
    let fg = this.formBuilder.group(new Ingredient())
    this.ingFormArray.push(fg)
  }
  /*****************************/

  //récupérer le nom du new ingrédient et l'enregistrer dans la bd
  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result
      .then((result) => {
        this.newIngredient.nomIngredient = result
        this.recetteService.addIngredient(this.newIngredient)
        //window.location.reload() ?????? voir car si on fait ça on perd tout les champs du questionnaire et sinon on a pas le new ingredient dans les choix -> utiliser cookie?
      })
  }

}
export class Ingredient {
  idIngredient = '';
  quantite = '';
  idUnite = '';
}


export interface CreateRecipe {
  idRecette: number
  nomRecette: string
  categories: any[]
  ingredients: any[]
  etapes: string
}