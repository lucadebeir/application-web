import { Component, OnInit, ViewChild } from '@angular/core';
import { CategoryDetails, IngredientDetails, UniteDetails, RecettesService, UserDetails, AuthentificationService } from '../../service';
import { FormGroup, FormArray, Validators, FormBuilder, FormControl } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; //la fenetre qui pop pour ajouter l'ingrédient pendant création d'une recette = modal
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { Time } from '@angular/common';
import { MatSelect } from '@angular/material/select';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-ajout-recette',
  templateUrl: './ajout-recette.component.html',
  styleUrls: ['./ajout-recette.component.scss']
})
export class AjoutRecetteComponent implements OnInit {

  images;


  recipe: CreateRecipe = {
    idRecette: null,
    nomRecette: '',
    categories: null,
    ingredients: null,
    idImage: null,
    etapes: '',
    nbrePart: null,
    libellePart: '',
    tempsPreparation: null,
    tempsCuisson: null,
    astuce: ''
  }

  public ingredients: IngredientDetails[]
  public unites: UniteDetails[]
  public categories: CategoryDetails[]

  public recipeForm: FormGroup
  public newIngredientForm: FormGroup
  public ingredientForm: FormGroup
  public ingredient: FormArray
  public selectIngredient: number[] = []
  private listAbonneNews$: Observable<UserDetails[]>

  public newIngredient: IngredientDetails = {
    nomIngredient: ''
  }

  //pour multiple select
  dropdownList = [];
  selectedItems = [];
  dropdownSettings: IDropdownSettings;
  fileToUpload: File = null;

  constructor(private recetteService: RecettesService, private formBuilder: FormBuilder, private router: Router, private modalService: NgbModal,
    private http: HttpClient, private auth: AuthentificationService) { }

  ngOnInit(): void {
    //on récupère tous les ingrédients, unités, catégories pour les réponses possibles à notre formulaire
    this.recetteService.getAllIngredients().subscribe(
      ingredients => {
        ingredients.forEach(element => {
          element.disabled = false
        })
        this.ingredients = ingredients
        console.log(this.ingredients)
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

    this.onChanges()

  }

  selectImage(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.images = file;
    }
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('file', this.images);

    this.http.post<any>('/server/uploads', formData).subscribe(
      (res) => console.log(res),
      (err) => console.log(err)
    );
  }

  onFileChange(file: any) {

    console.log(file)

    var reader = new FileReader();
    var dataURL;
    reader.onload = function () {
      dataURL = reader.result;
      console.log(dataURL)
    };

    const fileMetaData = {
      originalname: file[0].name,
      type: file[0].type,
      buffer: file[0]
    }
    console.log(fileMetaData)
    this.recetteService.addImage(fileMetaData).subscribe(data => {
      console.log(data)
      this.recipe.idImage = data[0]
    }, error => {
      console.log(error);
    });
  }

  uploadFileToActivity() {
    this.recetteService.addImage(this.fileToUpload).subscribe(data => {
      // do something, if upload success
    }, error => {
      console.log(error);
    });
  }

  createRecipe() {

    const formValue = this.recipeForm.value;
    const ingredientFormValue = this.ingredientForm.value;
    const formData = new FormData();
    formData.append('file', this.images);

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

    else if (this.ingredientForm.value.ingredient[0].idIngredient == "" && this.selectedItems.length == 0) {
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
    this.recipe.nbrePart = formValue.nbrePart
    this.recipe.libellePart = formValue.libellePart
    this.recipe.tempsPreparation = formValue.tempsPreparation
    this.recipe.tempsCuisson = formValue.tempsCuisson
    this.recipe.astuce = formValue.astuce
    console.log(this.recipe)
    this.recetteService.addImage(formData).subscribe(res => {
      this.recipe.idImage = res[0]
      console.log(res[0])
      this.recetteService.createRecipe(this.recipe).subscribe(res => {
        this.recipe.idRecette = res[0] // je récupère l'id de la recette que je viens de créer

        this.recetteService.addIngredientsAndCategoryToNewRecipe(this.recipe).subscribe(res => {
          console.log("succès !!!!")
          this.listAbonneNews$ = this.auth.getAbonneNews()
          console.log(this.listAbonneNews$)
          this.listAbonneNews$.subscribe(res => {
            res.forEach(element => {
              console.log(element)
              this.auth.sentEmailToNewRecipe(element, this.recipe.idRecette).subscribe(res => {
                console.log(res)
                console.log("bg")
              })
            });
          });
        })
      })


      this.router.navigateByUrl('handleRecipes')
    })
  }

  initRecipeForm() {
    this.recipeForm = this.formBuilder.group({
      nomRecette: ['', Validators.required],
      categories: ['', Validators.required],
      ingredients: [''],
      etapes: ['', Validators.required],
      nbrePart: ['', Validators.required],
      libellePart: ['', Validators.required],
      tempsPreparation: ['', Validators.required],
      tempsCuisson: ['', Validators.required],
      astuce: ['', Validators.required]
    });
  }

  /******  création formulaire pour ajouter autant de lignes ingrédient (qté, nom, unite) qu'on veut *****/
  //création initiale formulaire ingredients
  createIngredientsForm(): FormGroup {
    return this.ingredientForm = this.formBuilder.group({
      ingredient: this.formBuilder.array([this.createIngredientForm()])
    })
  }

  createIngredientForm(): FormGroup {
    return this.formBuilder.group({
      idIngredient: new FormControl({
        value: '',
        disabled: false
      },
        Validators.compose([Validators.required])),
      nomIngredient: new FormControl({
        value: '',
        disabled: false
      }),
      qte: new FormControl({
        value: '',
        disabled: false
      },
        Validators.compose([Validators.required, Validators.min(0)])),
      idUnite: new FormControl({
        value: '',
        disabled: false
      },
        Validators.compose([Validators.required]))
    });
  }

  onChanges(): void {
    this.ingredientForm.valueChanges.subscribe(val => {
      console.log(val.ingredient)
      //this.selectIngredient = []
      this.ingredients.forEach(ingredient => {
        ingredient.disabled = false
      })
      this.ingredients.forEach(ingredient => {
        val.ingredient.forEach(element => {
          if (element.nomIngredient != '') {
            if (ingredient.nomIngredient == element.nomIngredient) {
              ingredient.disabled = true
              element.idIngredient = ingredient.idIngredient
            }
            //this.selectIngredient.push(element.idIngredient)
          }
          
        })
      })
    })
  }

  get formData() { return this.ingredientForm.get('ingredient'); }

  //pour ajouter un ingrédient
  addIngredient(): void {
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
        setTimeout(() => {
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
  idRecette?: number
  nomRecette?: string
  categories?: any[]
  ingredients?: any[]
  idImage?: File
  etapes?: string
  nbrePart?: number
  libellePart?: string
  tempsPreparation?: Time
  tempsCuisson?: Time
  astuce?: string
}