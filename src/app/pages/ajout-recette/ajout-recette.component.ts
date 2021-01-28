import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import {
  RecettesService,
  UserDetails,
  AuthentificationService,
  IngredientsService,
  UnitesService,
  CategoriesService,
  ImagesService,
} from "../../service";
import {
  CategoryDetails,
  IngredientDetails,
  UniteDetails,
  CreateRecipe,
} from "../../models";
import {
  FormGroup,
  FormArray,
  Validators,
  FormBuilder,
  FormControl,
} from "@angular/forms";
import { IDropdownSettings } from "ng-multiselect-dropdown";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
// la fenetre qui pop pour ajouter l'ingrédient pendant création d'une recette = modal
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { NgxImageCompressService } from "ngx-image-compress";

@Component({
  selector: "app-ajout-recette",
  templateUrl: "./ajout-recette.component.html",
  styleUrls: ["./ajout-recette.component.scss"],
})
export class AjoutRecetteComponent implements OnInit {
  images;

  @ViewChild("closeBtn") closeBtn: ElementRef;

  recipe: CreateRecipe = {
    idRecette: null,
    nomRecette: "",
    categories: null,
    ingredients: null,
    idImage: null,
    etapes: "",
    nbrePart: null,
    libellePart: "",
    tempsPreparation: null,
    tempsCuisson: null,
    astuce: "",
    mot: "",
    lienImage: "",
  };

  public ingredients: IngredientDetails[];
  public unites: UniteDetails[];
  public categories: CategoryDetails[];

  public recipeForm: FormGroup;
  public newIngredientForm: FormGroup;
  public ingredientForm: FormGroup;
  public ingredient: FormArray;
  public selectIngredient: number[] = [];
  private listAbonneNews$: Observable<UserDetails[]>;

  public newIngredient: IngredientDetails = {
    nomIngredient: "",
  };

  // pour multiple select
  dropdownList = [];
  selectedItems = [];
  dropdownSettings: IDropdownSettings;
  fileToUpload: File = null;

  // pour compresser image
  file: any;
  localUrl: any;
  localCompressedURl: any;
  sizeOfOriginalImage: number;
  sizeOFCompressedImage: number;
  imgResultBeforeCompress: string;
  imgResultAfterCompress: string;

  constructor(
    private recetteService: RecettesService,
    private formBuilder: FormBuilder,
    private router: Router,
    private modalService: NgbModal,
    private http: HttpClient,
    private auth: AuthentificationService,
    private ingredientsService: IngredientsService,
    private unitesService: UnitesService,
    private categoriesService: CategoriesService,
    private imagesService: ImagesService,
    private imageCompress: NgxImageCompressService
  ) {}

  ngOnInit(): void {
    // on récupère tous les ingrédients, unités, catégories pour les réponses possibles à notre formulaire
    this.ingredientsService.getAllIngredients().subscribe((ingredients) => {
      ingredients.forEach((element) => {
        element.disabled = false;
      });
      this.ingredients = ingredients;
    });

    this.unitesService.getAllUnite().subscribe((unites) => {
      this.unites = unites;
    });

    this.categoriesService.getAllCategory().subscribe((categories) => {
      this.categories = categories;
    });

    this.dropdownSettings = {
      singleSelection: false,
      idField: "idCategorie",
      textField: "libelleCategorie",
      enableCheckAll: false,
      itemsShowLimit: 3,
      allowSearchFilter: true,
      searchPlaceholderText: "Rechercher",
    };

    this.initRecipeForm();

    this.createIngredientsForm();

    this.onChanges();
  }

  selectFile(event: any) {
    if (this.closeBtn) {
      this.closeBtn.nativeElement.click();
    }
    let fileName: any;
    this.file = event.target.files[0];
    fileName = this.file.name;
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.localUrl = event.target.result;
        this.compressFile(this.localUrl, fileName);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  compressFile(image, fileName) {
    const orientation = -1;
    this.sizeOfOriginalImage =
      this.imageCompress.byteCount(image) / (1024 * 1024);
    console.warn("Size in bytes is now:", this.sizeOfOriginalImage);
    this.imageCompress
      .compressFile(image, orientation, 50, 50)
      .then((result) => {
        this.imgResultAfterCompress = result;
        this.localCompressedURl = result;
        this.sizeOFCompressedImage =
          this.imageCompress.byteCount(result) / (1024 * 1024);
        console.warn(
          "Size in bytes after compression:",
          this.sizeOFCompressedImage
        );
        // create file from byte
        const imageName = fileName;
        // call method that creates a blob from dataUri
        const imageBlob = this.dataURItoBlob(
          this.imgResultAfterCompress.split(",")[1]
        );
        // imageFile created below is the new compressed file which can be send to API in form data
        const imageFile = new File([imageBlob], imageName, {
          type: "image/jpeg",
        });

        this.images = imageFile;
        const formData = new FormData();
        formData.append("file", imageFile);
        this.imagesService.addImage(formData).subscribe((res) => {
          console.log(res[0]);
          this.recipe.idImage = res[0];
          this.imagesService.getImage(res[0]).subscribe((res) => {
            console.log(res[0]);
            this.images = res[0];
            this.recipe.lienImage = res[0].lienImage;
          });
        });
      });
  }

  dataURItoBlob(dataURI) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: "image/jpeg" });
    return blob;
  }

  selectImage(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.images = file;
    }
  }

  onSubmit() {
    const formData = new FormData();
    formData.append("file", this.images);

    this.http.post<any>("/server/uploads", formData).subscribe(
      (res) => console.log(res),
      (err) => console.log(err)
    );
  }

  removeUnit(i: number) {
    const control = <FormArray>this.ingredientForm.controls["ingredient"];
    control.removeAt(i);
  }

  createRecipe() {
    const formValue = this.recipeForm.value;
    const ingredientFormValue = this.ingredientForm.value;

    if (
      formValue.etapes === "" &&
      formValue.nomRecette === "" &&
      this.selectedItems.length === 0
    ) {
      alert(
        "Vous devez remplir le champ du nom de la recette, au moins une catégorie de la recette et le champ de la Préparation."
      );
      return;
    } else if (formValue.etapes === "" && formValue.nomRecette === "") {
      alert(
        "Vous devez remplir le champ du nom de la recette, et celui de la préparation."
      );
      return;
    } else if (formValue.nomRecette === "" && this.selectedItems.length === 0) {
      alert(
        "Vous devez remplir le champ du nom de la recette, et sélectionner au moins une catégorie."
      );
      return;
    } else if (formValue.etapes === "" && this.selectedItems.length === 0) {
      alert(
        "Vous devez remplir le champ de la préparation, et sélectionner au moins une catégorie."
      );
      return;
    } else if (this.selectedItems.length === 0) {
      alert("Vous devez choisir au moins une catégorie pour votre recette.");
      return;
    } else if (formValue.etapes === "") {
      alert("Vous devez choisir le champ de la préparation.");
      return;
    } else if (formValue.nomRecette === "") {
      alert("Vous devez remplir le champ du nom de la recette.");
      return;
    } else if (
      this.ingredientForm.value.ingredient.forEach((element) => {
        if (element.qte <= 0) {
          alert("Il faut une quantité positive pour l'ingrédient.");
          return;
        }
      })
    ) {
      console.log(ingredientFormValue.ingredient);
    }
    this.recipe.ingredients = ingredientFormValue.ingredient; // je récupère les info sur l'ingrédient

    this.recipe.categories = this.selectedItems;
    this.recipe.nomRecette = formValue.nomRecette;
    this.recipe.etapes = formValue.etapes;
    this.recipe.nbrePart = formValue.nbrePart;
    this.recipe.libellePart = formValue.libellePart;
    this.recipe.tempsPreparation = formValue.tempsPreparation;
    this.recipe.tempsCuisson = formValue.tempsCuisson;
    this.recipe.astuce = formValue.astuce;
    this.recipe.mot = formValue.mot;

    this.recetteService.createRecipe(this.recipe).subscribe((res) => {
      console.log(res[0]);
      this.recipe.idRecette = res[0]; // je récupère l'id de la recette que je viens de créer
      this.recetteService
        .addIngredientsAndCategoryToNewRecipe(this.recipe)
        .subscribe((res) => {
          this.listAbonneNews$ = this.auth.getAbonneNews();
          this.listAbonneNews$.subscribe((res) => {
            res.forEach((element) => {
              this.auth
                .sentEmailToNewRecipe(element, this.recipe.idRecette)
                .subscribe();
            });
          });
        });

      this.router.navigateByUrl("handleRecipes");
    });
  }

  initRecipeForm() {
    this.recipeForm = this.formBuilder.group({
      nomRecette: ["", [Validators.required, Validators.max(45)]],
      categories: ["", Validators.required],
      ingredients: [""],
      etapes: ["", Validators.required],
      nbrePart: ["", Validators.required],
      libellePart: ["", Validators.required],
      tempsPreparation: ["", Validators.required],
      tempsCuisson: ["", Validators.required],
      astuce: ["", Validators.required],
      mot: ["", Validators.required],
    });
  }

  /******  création formulaire pour ajouter autant de lignes ingrédient (qté, nom, unite) qu'on veut *****/
  // création initiale formulaire ingredients
  createIngredientsForm(): FormGroup {
    return (this.ingredientForm = this.formBuilder.group({
      ingredient: this.formBuilder.array([this.createIngredientForm()]),
    }));
  }

  createIngredientForm(): FormGroup {
    return this.formBuilder.group({
      idIngredient: new FormControl(
        {
          value: "",
          disabled: false,
        },
        Validators.compose([Validators.required])
      ),
      nomIngredient: new FormControl({
        value: "",
        disabled: false,
      }),
      qte: new FormControl(
        {
          value: "",
          disabled: false,
        },
        Validators.compose([Validators.required, Validators.min(0)])
      ),
      idUnite: new FormControl({
        value: "",
        default: " ",
        disabled: false,
      }),
    });
  }

  onChanges(): void {
    this.ingredientForm.valueChanges.subscribe((val) => {
      // this.selectIngredient = []
      this.ingredients.forEach((ingredient) => {
        ingredient.disabled = false;
      });
      this.ingredients.forEach((ingredient) => {
        val.ingredient.forEach((element) => {
          if (element.nomIngredient !== "") {
            if (ingredient.nomIngredient === element.nomIngredient) {
              ingredient.disabled = true;
              element.idIngredient = ingredient.idIngredient;
            }
            // this.selectIngredient.push(element.idIngredient)
          }
        });
      });
    });
  }

  get formData() {
    return this.ingredientForm.get("ingredient");
  }

  // pour ajouter un ingrédient
  addIngredient(): void {
    this.ingredient = this.ingredientForm.get("ingredient") as FormArray;
    this.ingredient.push(this.createIngredientForm());
  }
  /*****************************/

  // récupérer le nom du new ingrédient et l'enregistrer dans la bd
  open(content) {
    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title" })
      .result.then((result) => {
        this.newIngredient.nomIngredient = result;
        this.ingredientsService.addIngredient(this.newIngredient);
        setTimeout(() => {
          this.ingredientsService
            .getAllIngredients()
            .subscribe((ingredients) => {
              this.ingredients = ingredients;
            });
        }, 1000);
      });
  }
}
