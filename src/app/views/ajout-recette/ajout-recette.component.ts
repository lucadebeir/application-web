import { Component, OnInit } from '@angular/core';
import { CategoryDetails, IngredientDetails, UniteDetails, RecettesService } from '../../service';
import { FormGroup, FormArray, Validators, FormBuilder } from '@angular/forms';
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
  public newIngredientForm: FormGroup
  public ingredientForm: FormGroup
  public ingredient: FormArray

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

    this.initRecipeForm()

    this.createIngredientsForm()

    this.addIngredient()
  }

  createRecipe() {

    const formValue = this.recipeForm.value;
    const ingredientFormValue = this.ingredientForm.value;

    if (this.ingredientForm.value.ingredient[0].idIngredient == "" && formValue.etapes == '' && formValue.nomRecette == '' && this.selectedItems.length == 0) {
      alert("Vous devez remplir le champ du nom de la recette, au moins une catégorie de la recette, au moins rajouter un ingrédient, et remplir le champ de la Préparation.");
      return;
    }

    else if (this.ingredientForm.value.ingredient[0].idIngredient == "" && formValue.etapes == '' && formValue.nomRecette == '') {
      alert("Vous devez remplir le champ du nom de la recette, au moins rajouter un ingrédient, et remplir le champ de la Préparation.");
      return;
    }

    else if (this.ingredientForm.value.ingredient[0].idIngredient == "" && formValue.etapes == '' && this.selectedItems.length == 0) {
      alert("Vous devez remplir au moins une catégorie de la recette, au moins rajouter un ingrédient, et remplir le champ de la Préparation.");
      return;
    }

    else if (this.ingredientForm.value.ingredient[0].idIngredient == "" && formValue.nomRecette == '' && this.selectedItems.length == 0) {
      alert("Vous devez remplir le champ du nom de la recette, au moins une catégorie de la recette, et au moins rajouter un ingrédient.");
      return;
    }

    else if (formValue.etapes == '' && formValue.nomRecette == '' && this.selectedItems.length == 0) {
      alert("Vous devez remplir le champ du nom de la recette, au moins une catégorie de la recette et le champ de la Préparation.");
      return;
    }

    else if (this.ingredientForm.value.ingredient[0].idIngredient == "" && formValue.nomRecette == '') {
      alert("Vous devez remplir le champ du nom de la recette, et celui de la préparation.");
      return;
    }

    else if (formValue.etapes == '' && this.ingredientForm.value.ingredient[0].idIngredient == "") {
      alert("Vous devez remplir le champ du nom de la recette, et celui de la préparation.");
      return;
    }

    else if (this.ingredientForm.value.ingredient[0].idIngredient == ""  && this.selectedItems.length == 0) {
      alert("Vous devez remplir le champ du nom de la recette, et celui de la préparation.");
      return;
    }

    else if (formValue.etapes == '' && formValue.nomRecette == '') {
      alert("Vous devez remplir le champ du nom de la recette, et celui de la préparation.");
      return;
    }

    else if (formValue.nomRecette == '' && this.selectedItems.length == 0) {
      alert("Vous devez remplir le champ du nom de la recette, et sélectionner au moins une catégorie.");
      return;
    }

    else if (formValue.etapes == '' && this.selectedItems.length == 0) {
      alert("Vous devez remplir le champ de la préparation, et sélectionner au moins une catégorie.");
      return;
    }

    else if (this.ingredientForm.value.ingredient[0].idIngredient == "") {
      alert("Vous devez choisir au moins un ingrédient pour votre recette.");
      return;
    }

    else if (this.selectedItems.length == 0) {
      alert("Vous devez choisir au moins une catégorie pour votre recette.");
      return;
    }

    else if (formValue.etapes == '') {
      alert("Vous devez choisir le champ de la préparation.");
      return;
    }

    else if (formValue.nomRecette == '') {
      alert("Vous devez remplir le champ du nom de la recette.");
      return;
    }

    else if (this.ingredientForm.value.ingredient.forEach(element => {
        if (element.qte <= 0) {
          alert("Il faut une quantité positive pour l'ingrédient.");
          return;
        }
    }))

    console.log(ingredientFormValue.ingredient)
    this.recipe.ingredients = ingredientFormValue.ingredient //je récupère les info sur l'ingrédient
    this.recipe.categories = this.selectedItems
    this.recipe.nomRecette = formValue.nomRecette
    this.recipe.etapes = formValue.etapes
    this.recetteService.createRecipe(this.recipe).subscribe(res => {
      this.recipe.idRecette = res[0] // je récupère l'id de la recette que je viens de créer

      this.recetteService.addIngredientsAndCategoryToNewRecipe(this.recipe).subscribe(res => {
        console.log("succès !!!!")
      })
    })
    //this.router.navigate(['/recipe/'], { queryParams: { id: this.recipe.idRecette } })
    this.router.navigateByUrl('allRecipes')
  }


  initRecipeForm() {
    this.recipeForm = this.formBuilder.group({
      nomRecette: ['', Validators.required],
      categories: ['', [Validators.required]],
      ingredients: ['', Validators.required],
      etapes: ['', Validators.required]
    });
  }

  /******  création formulaire pour ajouter autant de lignes ingrédient (qté, nom, unite) qu'on veut *****/
  //création initiale formulaire ingredients
  createIngredientsForm() : FormGroup {
    return this.ingredientForm = this.formBuilder.group({
      ingredient: this.formBuilder.array([ this.createIngredientForm() ])
    })
  }

  createIngredientForm() : FormGroup {
    return this.formBuilder.group({
      idIngredient: ['', Validators.required],
      qte: ['', [Validators.required, Validators.min(0)]],
      idUnite: ['', Validators.required]
    });
  }

  get formData() { return this.ingredientForm.get('ingredient'); }

  //pour ajouter un ingrédient
  addIngredient() : void {
    this.ingredient = this.ingredientForm.get('ingredient') as FormArray;
    this.ingredient.push(this.createIngredientForm());
  }
  /*****************************/

  //récupérer le nom du new ingrédient et l'enregistrer dans la bd
  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result
      .then((result) => {
        this.newIngredient.nomIngredient = result
        this.recetteService.addIngredient(this.newIngredient)
        setTimeout (() => {
          this.recetteService.getAllIngredients().subscribe(
            ingredients => {
              this.ingredients = ingredients
            }
          )
       }, 1000);
      })
  }

}

export interface CreateRecipe {
  idRecette: number
  nomRecette: string
  categories: any[]
  ingredients: any[]
  etapes: string
}