import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from "@angular/core";
import {
  RecettesService,
  AuthentificationService,
  ImagesService,
  CommentairesService,
  IngredientsService,
  FavorisService,
  UnitesService,
  ShoppingListService,
} from "../../service";
import {
  RecipeDetails,
  IngredientDetails,
  UniteDetails,
  QuantiteDetails,
  FavorisDetails,
  ListeCoursesDetails,
  CommentaireDetails,
} from "../../models";
import { HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { Router, ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { addHours, roundDecimal } from "../../utils/Utils";
import { ListRecipe } from "src/app/models/listRecipe.model";
import { Notification } from "src/app/models";
import { NotificationService } from "src/app/service/notifications/notification.service";
import { Title } from "@angular/platform-browser";
import { NgxImageCompressService } from "ngx-image-compress";

@Component({
  selector: "app-recette",
  templateUrl: "./recette.component.html",
  styleUrls: ["./recette.component.scss"],
})
export class RecetteComponent implements OnInit {
  public title;
  public images;

  @ViewChild("closeBtn") closeBtn: ElementRef;

  public url: string;

  public image;
  public recette: RecipeDetails;
  public ingredients: Observable<IngredientDetails[]>;
  public unite: UniteDetails;
  public qtes: QuantiteDetails[];
  public newFavori: FavorisDetails = {
    pseudo: "",
    idRecette: parseInt(this.route.snapshot.paramMap.get("id"), 10),
  };

  public newListeCourses: ListeCoursesDetails = {
    pseudo: "",
    listIngredients: null,
  };

  public hasCom: boolean = false;
  public commentaires: CommentaireDetails[];
  public commentaires$: Observable<
    CommentaireDetails[]
  > = this.commentairesService.getSearchResults();
  public newCommentaire: CommentaireDetails = {
    message: "",
    dateCommentaire: null,
    ecritPar: "",
    concerne: parseInt(this.route.snapshot.paramMap.get("id"), 10),
    idImage: null,
    lienImage: "",
  };

  public newResponse: CommentaireDetails = {
    message: "",
    dateCommentaire: null,
    ecritPar: "",
    concerne: parseInt(this.route.snapshot.paramMap.get("id"), 10),
    parent: null,
    idImage: null,
    lienImage: "",
  };

  public nbrePartInitial: number;
  public ingredientQteInitial: IngredientDetails[];
  public recipeList: ListRecipe = {
    idRecette: parseInt(this.route.snapshot.paramMap.get("id"), 10),
    nomRecette: "",
    pseudoUser: "",
    idRecipeList: null,
    complet: false,
  };

  public element: any;

  public isFavori = false;
  public isInMenu = false;

  public latestRecipes: RecipeDetails[];

  public allRecipeList: ListRecipe[];

  public notif: Notification = {
    pseudo: "",
    idRecette: parseInt(this.route.snapshot.paramMap.get("id"), 10),
    type: "commentaire",
  };

  check: boolean = true;

  response: boolean = false;

  @ViewChild("box") input: ElementRef;
  sizeOfOriginalImage: number;
  localUrl: any;
  imgResultAfterCompress: string;
  localCompressedURl: string;
  sizeOFCompressedImage: number;
  file: any;
  choice: number;

  constructor(
    public auth: AuthentificationService,
    private recetteService: RecettesService,
    private router: Router,
    private route: ActivatedRoute,
    private imagesService: ImagesService,
    private commentairesService: CommentairesService,
    private ingredientsService: IngredientsService,
    private favorisService: FavorisService,
    private unitesService: UnitesService,
    private shoppingListService: ShoppingListService,
    private notifService: NotificationService,
    private titleService: Title,
    private imageCompress: NgxImageCompressService
  ) {
    this.url = "http://marinesrecipes.fr" + this.router.url;

    this.loading();
  }

  onClick() {}

  ngOnInit(): void {}

  ngOnDestroy() {
    if (this.check) {
      localStorage.removeItem("value");
      localStorage.removeItem("backButton");
    }
  }

  loading() {
    this.newCommentaire = {
      message: "",
      dateCommentaire: null,
      ecritPar: "",
      concerne: parseInt(this.route.snapshot.paramMap.get("id"), 10),
      idImage: null,
      lienImage: "",
      response: false,
      image: false,
    };
    this.newResponse = {
      message: "",
      dateCommentaire: null,
      ecritPar: "",
      concerne: parseInt(this.route.snapshot.paramMap.get("id"), 10),
      idImage: null,
      lienImage: "",
      response: false,
      image: false,
    };
    console.log(this.newCommentaire.lienImage);
    this.images = null;
    this.recetteService
      .getRecipeById(parseInt(this.route.snapshot.paramMap.get("id"), 10))
      .subscribe((recette) => {
        this.titleService.setTitle(recette.nomRecette);
        this.recette = recette;
        this.recette.tempsCuisson = addHours(this.recette.tempsCuisson);
        this.recette.tempsPreparation = addHours(this.recette.tempsPreparation);
        this.nbrePartInitial = this.recette.nbrePart;
        this.recipeList.nomRecette = recette.nomRecette;
      });

    this.recetteService.getLatestReceipes().subscribe((data) => {
      this.latestRecipes = data;
    });

    this.imagesService
      .getImageByRecipe(parseInt(this.route.snapshot.paramMap.get("id"), 10))
      .subscribe((res) => {
        console.log(res);
        this.image = res;
        console.log(this.image[0].lienImage);
      });

    this.ingredientsService
      .getIngredientsByIdRecette(
        parseInt(this.route.snapshot.paramMap.get("id"), 10)
      )
      .subscribe((ingredient) => {
        ingredient.forEach((element) => {
          element.qte = roundDecimal(element.qte);
        });

        this.ingredients = ingredient;
        this.recette.ingredients = ingredient;
        this.ingredientQteInitial = ingredient;
      });

    if (this.auth.isLoggedIn()) {
      this.favorisService.getFavoris().subscribe((data) => {
        data.forEach((element) => {
          if (
            element.idRecette ===
            parseInt(this.route.snapshot.paramMap.get("id"), 10)
          ) {
            this.isFavori = true;
          }
        });
        this.recetteService.getListRecipes().subscribe((data) => {
          data.forEach((element) => {
            console.log(element);
            if (element.idRecette === this.recipeList.idRecette) {
              this.isInMenu = true;
              this.recipeList = element;
              console.log(this.recipeList);
            }
          });
          this.allRecipeList = data;
        });
      });
      this.newFavori.pseudo = this.auth.getUserDetails().pseudo;
      this.newListeCourses.pseudo = this.auth.getUserDetails().pseudo;
      this.newCommentaire.ecritPar = this.auth.getUserDetails().pseudo;
      this.newResponse.ecritPar = this.auth.getUserDetails().pseudo;
      this.recipeList.pseudoUser = this.auth.getUserDetails().pseudo;
      this.notif.pseudo = this.auth.getUserDetails().pseudo;
    }

    this.commentairesService
      .getCommentaireRecipe(
        parseInt(this.route.snapshot.paramMap.get("id"), 10)
      )
      .subscribe((commentaires) => {
        if (commentaires[0]) {
          this.hasCom = true;
          this.commentaires = commentaires;
          console.log(commentaires);
          setTimeout(() => {
            this.commentairesService.search(commentaires).subscribe();
            this.newCommentaire.message = "";
          }, 1000);
        } else {
          this.hasCom = false;
        }
      });
  }

  addResponse(id) {
    console.log(id);
    this.commentaires$.forEach((commentaires) => {
      commentaires.forEach((element) => {
        if (element.idCommentaire === id) {
          element.response = !element.response;
        }
        element.children.forEach((commentaire) => {
          console.log(commentaire);
          if (commentaire.idCommentaire === id) {
            commentaire.response = !commentaire.response;
          }
        });
      });
    });
  }

  updateNbView(recette: any) {
    this.recetteService.updateNbView(recette).subscribe(
      (res) => {
        this.router.navigate(["/recipe", recette.idRecette]).then(() => {
          this.loading();
        });
      },
      (err) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 402) {
            console.log("Cette recette n'existe pas !");
          }
        }
      }
    );
  }

  selectImage(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.images = file;
    }
  }

  addFavoris() {
    this.favorisService.addFavoris(this.newFavori).subscribe(() => {
      (this.isFavori = true), this.recette.nbFavoris++;
    });
    this.notificationFavori(
      this.auth.getUserDetails().pseudo,
      this.newFavori.idRecette
    );
  }

  addToMenu() {
    this.recetteService.addRecipeToList(this.recipeList).subscribe((res) => {
      this.isInMenu = true;
      this.recipeList.idRecipeList = res.success[0];
      console.log(res.success[0]);
    });
    //window.location.reload();
    alert("Vous avez bien ajouté cette recette à votre menu de la semaine !");
  }

  deleteToMenu() {
    this.recetteService
      .deleteRecipeOfList(this.recipeList)
      .subscribe(() => (this.isInMenu = false));
    alert(
      "Vous avez bien supprimé cette recette de votre menu de la semaine !"
    );
  }

  deleteFavoris() {
    this.favorisService
      .deleteFavoris(this.newFavori.idRecette)
      .subscribe(() => {
        (this.isFavori = false), this.recette.nbFavoris--;
      });
  }

  addListeCourses() {
    this.newListeCourses.listIngredients = this.ingredients;
    this.shoppingListService.addListeCourses(this.newListeCourses);

    this.router.navigate(["/shoppingList"]).then(() => {
      //window.location.reload();
    });
  }
  deleteCommentaire(idCommentaire: any) {
    this.commentairesService.deleteCommentaire(idCommentaire).subscribe();
    this.commentairesService
      .delete(this.commentaires, idCommentaire)
      .subscribe();
    setTimeout(() => {
      this.loading();
    }, 500);
    //window.location.reload(); /* rafraichit la page */
  }

  addCommentaire(message: any) {
    if (this.newCommentaire.image) {
      this.newCommentaire.message = message;
      this.commentairesService
        .addCommentaire(this.newCommentaire)
        .subscribe((res2) => {
          this.newCommentaire.idCommentaire = res2.idCommentaire;
          this.commentairesService
            .addImageToCommentaire(this.newCommentaire)
            .subscribe();
          //window.location.reload();
        });
      this.addResponse(this.newCommentaire.idCommentaire);
      setTimeout(() => {
        this.loading();
      }, 500);
    } else {
      this.newCommentaire.message = message;
      this.commentairesService
        .addCommentaire(this.newCommentaire)
        .subscribe((res) => {
          console.log(res);
          this.commentaires$ = this.commentairesService.getCommentaireRecipe(
            parseInt(this.route.snapshot.paramMap.get("id"), 10)
          );
        });
      this.addResponse(this.newCommentaire.idCommentaire);
      setTimeout(() => {
        this.loading();
      }, 500);
      this.notificationCommentaire(
        this.auth.getUserDetails().pseudo,
        this.recette.idRecette
      );

      //window.location.reload();
    }

    // window.location.reload()
  }

  selectFile(event: any, response: boolean) {
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
        this.compressFile(this.localUrl, fileName, response);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  compressFile(image, fileName, response) {
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

        //this.images = imageFile;
        this.choice = response;
        const formData = new FormData();
        formData.append("file", imageFile);
        if (response) {
          this.imagesService.addImage(formData).subscribe((res) => {
            console.log(res[0]);
            this.newResponse.idImage = res[0];
            this.imagesService.getImage(res[0]).subscribe((res) => {
              console.log(res[0]);
              this.images = res[0];
              this.newResponse.lienImage = res[0].lienImage;
              this.newResponse.image = true;
            });
          });
        } else {
          this.imagesService.addImage(formData).subscribe((res) => {
            console.log(res[0]);
            this.newCommentaire.idImage = res[0];
            this.imagesService.getImage(res[0]).subscribe((res) => {
              console.log(res[0]);
              this.images = res[0];
              this.newCommentaire.lienImage = res[0].lienImage;
              console.log(this.newCommentaire);
              this.newCommentaire.image = true;
            });
          });
        }
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

  addReponse(event, idCommentaire) {
    if (this.newResponse.image) {
      this.newResponse.message = event.target.message.value;
      this.newResponse.parent = idCommentaire;
      this.commentairesService
        .addCommentaire(this.newResponse)
        .subscribe((res2) => {
          this.newResponse.idCommentaire = res2.idCommentaire;
          this.commentairesService
            .addImageToCommentaire(this.newResponse)
            .subscribe();
          //window.location.reload();
        });
      this.addResponse(idCommentaire);
      setTimeout(() => {
        this.loading();
      }, 500);
    } else {
      this.newResponse.message = event.target.message.value;
      this.newResponse.parent = idCommentaire;
      this.commentairesService.addCommentaire(this.newResponse).subscribe();
      this.addResponse(idCommentaire);
      setTimeout(() => {
        this.loading();
      }, 500);
      this.notificationCommentaire(
        this.auth.getUserDetails().pseudo,
        this.recette.idRecette
      );
      //window.location.reload();
    }
    // window.location.reload()
  }

  onProportionChange(searchValue: string): void {
    this.recette.ingredients.forEach((element) => {
      element.updateQte =
        (element.qte * parseInt(searchValue, 10)) / this.nbrePartInitial;
    });
    this.recette.nbrePart = parseInt(searchValue, 10);
  }

  onEnter(value: string) {
    if (parseInt(value) > 0) {
      this.recette.ingredients.forEach((element) => {
        element.updateQte = roundDecimal(
          (element.qte * parseFloat(value)) / this.nbrePartInitial
        );
      });
      this.recette.nbrePart = parseFloat(value);
    } else {
      this.input.nativeElement.value = this.recette.nbrePart.toString();
    }
    console.log(this.recette.nbrePart);
  }

  onProportionLess(value: number): void {
    this.recette.ingredients.forEach((element) => {
      element.updateQte = roundDecimal(
        (element.qte * value) / this.nbrePartInitial
      );
    });
    this.recette.nbrePart = this.recette.nbrePart - 1;
  }

  onProportionMore(value: number): void {
    this.recette.ingredients.forEach((element) => {
      element.updateQte = roundDecimal(
        (element.qte * value) / this.nbrePartInitial
      );
    });
    this.recette.nbrePart = this.recette.nbrePart + 1;
  }

  //notification commentaire
  notificationCommentaire(pseudo, idRecette) {
    let notif: Notification = {
      pseudo: pseudo,
      idRecette: idRecette,
      type: "commentaire",
    };
    this.notifService.addNotification(notif).subscribe();
  }

  //notification favori
  notificationFavori(pseudo, idRecette) {
    let notif: Notification = {
      pseudo: pseudo,
      idRecette: idRecette,
      type: "favori",
    };
    this.notifService.addNotification(notif).subscribe();
  }

  //back button
  @HostListener("window:popstate", ["$event"])
  onPopState(event) {
    this.check = false;
    //localStorage.setItem("backButton", "true");
    var json = {
      backButton: true,
    };
    localStorage.setItem("backButton", JSON.stringify(json));
    console.log("Back button pressed");
  }
}
