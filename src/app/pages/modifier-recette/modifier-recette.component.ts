import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {
  RecipeDetails,
  CategoryDetails,
  IngredientDetails,
  QuantiteDetails,
  UniteDetails,
  ImageRecipe
} from '../../models';
import { RecettesService, IngredientsService, CategoriesService, ImagesService, UnitesService } from '../../service';
import { HttpResponse, HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
// la fenetre qui pop pour ajouter l'ingrédient pendant création d'une recette = modal
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxImageCompressService } from 'ngx-image-compress';

@Component({
  selector: 'app-modifier-recette',
  templateUrl: './modifier-recette.component.html',
  styleUrls: ['./modifier-recette.component.scss']
})
export class ModifierRecetteComponent implements OnInit {

  constructor(private recetteService: RecettesService, private router: Router, private route: ActivatedRoute,
              private ingredientsService: IngredientsService, private modalService: NgbModal,
              private http: HttpClient, private categoriesService: CategoriesService,
              private unitesService: UnitesService, private imagesService: ImagesService, private imageCompress: NgxImageCompressService) {
    this.recetteService.getRecipeById(parseInt(this.route.snapshot.paramMap.get('id'), 10)).subscribe(
      recette => {
        this.recette = recette;
      }
    );

    this.ingredientsService.getIngredientsByIdRecette(parseInt(this.route.snapshot.paramMap.get('id'), 10)).subscribe(
      ingredient => {
        this.ingredients = ingredient;
      }
    );

    this.imagesService.getImage(parseInt(this.route.snapshot.paramMap.get('id'), 10)).subscribe(
      res => {
        if (res.length !== 0) {
          this.recette.idImage = res[0].idImage;
          this.image = res[0];
        }
      }
    );

    this.ingredientsService.getRestIngredients(parseInt(this.route.snapshot.paramMap.get('id'), 10)).subscribe(
      ingredients => {
        this.allIngredients = ingredients;
      }
    );

    this.unitesService.getAllUnite().subscribe(
      unites => {
        this.allUnites = unites;
      }
    );

    this.categoriesService.getRestCategory(parseInt(this.route.snapshot.paramMap.get('id'), 10)).subscribe(
      categories => {
        this.allCategories = categories;
      }
    );


    this.getCategory(parseInt(this.route.snapshot.paramMap.get('id'), 10));
  }

  public newIngredient: IngredientDetails = {
    qte: null,
    idRecette: parseInt(this.route.snapshot.paramMap.get('id'), 10),
    idIngredient: null,
    idUnite: null
  };

  public recette: RecipeDetails = {
    idRecette: null,
    nomRecette: 'string',
    datePublication: null,
    nbFavoris: null,
    nbVues: null,
    idImage: null,
    lienImage: null,
    etapes: null,
    nbrePart: null,
    libellePart: '',
    tempsPreparation: null,
    tempsCuisson: null,
    astuce: ''
  };
  public ingredients: IngredientDetails;
  public unite: UniteDetails;
  public qtes: QuantiteDetails[];
  public categories: CategoryDetails[];

  public image;
  public image2;
  public allIngredients: IngredientDetails[]; // ingredients disponibles
  public allUnites: UniteDetails[];
  public allCategories: CategoryDetails[]; // catégories disponibles

  public imageToModify: ImageRecipe = {
    idImage: null,
    idRecette: null
  };

  file: any;
  localUrl: any;
  localCompressedURl: any;
  sizeOfOriginalImage: number;
  sizeOFCompressedImage: number;
  imgResultBeforeCompress: string;
  imgResultAfterCompress: string;

  ngOnInit(): void {
  }


  selectFile(event: any) {
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
    this.sizeOfOriginalImage = this.imageCompress.byteCount(image) / (1024 * 1024);
    console.warn('Size in bytes is now:', this.sizeOfOriginalImage);
    this.imageCompress.compressFile(image, orientation, 50, 50).then(
      result => {
        this.imgResultAfterCompress = result;
        this.localCompressedURl = result;
        this.sizeOFCompressedImage = this.imageCompress.byteCount(result) / (1024 * 1024);
        console.warn('Size in bytes after compression:', this.sizeOFCompressedImage);
        // create file from byte
        const imageName = fileName;
        // call method that creates a blob from dataUri
        const imageBlob = this.dataURItoBlob(this.imgResultAfterCompress.split(',')[1]);
        // imageFile created below is the new compressed file which can be send to API in form data
        const imageFile = new File([imageBlob], imageName, { type: 'image/jpeg' });

        this.image2 = imageFile;
      });
  }

  dataURItoBlob(dataURI) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/jpeg' });
    return blob;
  }

  selectImage(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      console.log(file);
      this.image2 = file;
    }
  }

  onSubmit() {
    const formData = new FormData();
    console.log(this.image2);
    formData.append('file', this.image2);
    if (this.image) {
      this.imagesService.addImage(formData).subscribe(res => {
        this.image = res[0];
        this.imageToModify.idImage = res[0];
        this.imageToModify.idRecette = this.recette.idRecette;
        this.http.post<any>(`/server/image/update`, this.imageToModify).subscribe(
          (res) => {
            this.image = res[0];
            window.location.reload();
          }
        );
      });
    } else {
      this.imagesService.addImage(formData).subscribe(res => {
        this.image = res[0];
        this.imageToModify.idImage = res[0];
        this.imageToModify.idRecette = this.recette.idRecette;
        this.imagesService.addImageToRecipe(this.imageToModify);
        window.location.reload();
      });
    }
  }

  getCategory(id: any): any {
    this.categoriesService.getCategoryByRecette(id).subscribe(
      (categories: CategoryDetails[]) => {
        this.categories = categories;
      }, err => {
        if (err instanceof HttpResponse) {
          if (err.status === 402) {
            console.log('cette recette n\'a pas de catégorie!');
          }
        }
      }
    );
    return this.categories;
  }

  updateRecipeName(recette: RecipeDetails) {
    this.recetteService.updateRecipeName(recette).subscribe((res: any) => {
      window.location.reload();
    }, (err: any) => {
      console.error(err);
    }
    );
  }
  updateSteps(recette: RecipeDetails) {
    this.recetteService.updateSteps(recette).subscribe((res: any) => {
      window.location.reload();
    }, (err: any) => {
      console.error(err);
    }
    );
  }

  updateAstuce(recette: RecipeDetails) {
    this.recetteService.updateAstuce(recette).subscribe((res: any) => {
      window.location.reload();
    }, (err: any) => {
      console.error(err);
    }
    );
  }

  updatePart(recette: RecipeDetails) {
    this.recetteService.updatePart(recette).subscribe((res: any) => {
      window.location.reload();
    }, (err: any) => {
      console.error(err);
    }
    );
  }

  updateTemps(recette: RecipeDetails) {
    this.recetteService.updateTemps(recette).subscribe((res: any) => {
      window.location.reload();
    }, (err: any) => {
      console.error(err);
    }
    );
  }

  updateRecipeIng(recette: RecipeDetails, ingredient: IngredientDetails) {
    this.recetteService.updateRecipeIng(recette, ingredient).subscribe((res: any) => {
      window.location.reload();
    }, (err: any) => {
      console.error(err);
    }
    );
  }

  deleteIngredientRececipe(ingredient: IngredientDetails, recette: RecipeDetails) {
    this.recetteService.deleteIngredientRecipe(ingredient, recette)
      .subscribe(res => {
        this.router.navigate(['updateRecipe/:id']).then(() => {
          window.location.reload();
        });
      }, (err) => {
        console.log(err);
      }
      );

  }

  deleteRecipeCategory(categorie: CategoryDetails, recette: RecipeDetails) {

    this.recetteService.deleteRecipeCategory(categorie, recette)
      .subscribe(res => {
        setTimeout(() => {
          this.categoriesService.getRestCategory(parseInt(this.route.snapshot.paramMap.get('id'), 10)).subscribe(
            categories => {
              this.allCategories = categories;
            }
          );
          this.categoriesService.getCategoryByRecette(parseInt(this.route.snapshot.paramMap.get('id'), 10)).subscribe(
            categories => {
              this.categories = categories;
            }
          );
        }, 1000);
      }, (err) => {
        console.log(err);
      }
      );
  }

  addRecipeCategory(categorie: CategoryDetails, recette: RecipeDetails) {
    this.recetteService.addRecipeCategory(categorie, recette)
      .subscribe(res => {
        setTimeout(() => {
          this.categoriesService.getRestCategory(parseInt(this.route.snapshot.paramMap.get('id'), 10)).subscribe(
            categories => {
              this.allCategories = categories;
            }
          );
          this.categoriesService.getCategoryByRecette(parseInt(this.route.snapshot.paramMap.get('id'), 10)).subscribe(
            categories => {
              this.categories = categories;
            }
          );
        }, 1000);

      }, (err) => {
        console.log(err);
      }
      );
  }


  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result
      .then((result) => {
        this.newIngredient.idIngredient = result.idIngredient;
        this.newIngredient.qte = result.qte;
        this.newIngredient.idUnite = result.idUnite;
        this.recetteService.addIngredientRecette(this.newIngredient);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      });
  }

}

