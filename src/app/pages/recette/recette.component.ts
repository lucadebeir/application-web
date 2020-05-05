import { Component, OnInit } from '@angular/core';
import { RecettesService, AuthentificationService, ImagesService, CommentairesService,
  IngredientsService, FavorisService, UnitesService, ShoppingListService } from '../../service';
import { RecipeDetails, IngredientDetails, UniteDetails, QuantiteDetails,
  FavorisDetails, ListeCoursesDetails, CommentaireDetails } from '../../models';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { addHours, roundDecimal } from '../../utils/Utils';

@Component({
  selector: 'app-recette',
  templateUrl: './recette.component.html',
  styleUrls: ['./recette.component.scss']
})
export class RecetteComponent implements OnInit {

  public title;
  public images;

  public image;
  public recette: RecipeDetails;
  public ingredients: Observable<IngredientDetails[]>;
  public unite: UniteDetails;
  public qtes: QuantiteDetails[];
  public newFavori: FavorisDetails = {
    pseudo: '',
    idRecette: parseInt(this.route.snapshot.paramMap.get('id'), 10)
  };

  public newListeCourses: ListeCoursesDetails = {
    pseudo: '',
    listIngredients: null
  };

  public commentaires: CommentaireDetails[];
  public newCommentaire: CommentaireDetails = {
    message: '',
    dateCommentaire: null,
    ecritPar: '',
    concerne: parseInt(this.route.snapshot.paramMap.get('id'), 10)
  };

  public newResponse: CommentaireDetails = {
    message: '',
    dateCommentaire: null,
    ecritPar: '',
    concerne: parseInt(this.route.snapshot.paramMap.get('id'), 10),
    parent: null
  };

  public nbrePartInitial: number;
  public ingredientQteInitial: IngredientDetails[];

  public element: any;

  public isFavori = false;

  public latestRecipes: RecipeDetails[];

  constructor(public auth: AuthentificationService, private recetteService: RecettesService,
              private router: Router, private route: ActivatedRoute, private imagesService: ImagesService,
              private commentairesService: CommentairesService, private ingredientsService: IngredientsService,
              private favorisService: FavorisService, private unitesService: UnitesService,
              private shoppingListService: ShoppingListService) {
    this.recetteService.getRecipeById(parseInt(this.route.snapshot.paramMap.get('id'), 10)).subscribe(
      recette => {
        this.recette = recette;
        this.recette.tempsCuisson = addHours(this.recette.tempsCuisson);
        this.recette.tempsPreparation = addHours(this.recette.tempsPreparation);
        this.nbrePartInitial = this.recette.nbrePart;
      }
    );

    this.recetteService.getLatestReceipes().subscribe(data => {
      this.latestRecipes = data;
    });

    this.imagesService.getImage(parseInt(this.route.snapshot.paramMap.get('id'), 10)).subscribe(
      res => {
        console.log(res);
        this.image = res;
      }
    );

    this.ingredientsService.getIngredientsByIdRecette(parseInt(this.route.snapshot.paramMap.get('id'), 10)).subscribe(
      ingredient => {

        ingredient.forEach(element => {
          element.qte = roundDecimal(element.qte);
        });

        this.ingredients = ingredient;
        this.recette.ingredients = ingredient;
        this.ingredientQteInitial = ingredient;
      }
    );

    this.commentairesService.getCommentaireRecipe(parseInt(this.route.snapshot.paramMap.get('id'), 10)).subscribe(
      commentaires => {
        if (commentaires[0]) {
          this.commentaires = commentaires;
        }
      }
    );

    if (this.auth.isLoggedIn()) {
      this.favorisService.getFavoris().subscribe(data => {
        data.forEach(element => {
          if (element.idRecette === parseInt(this.route.snapshot.paramMap.get('id'), 10)) {
            this.isFavori = true;
          }
        });
      });
      this.newFavori.pseudo = this.auth.getUserDetails().pseudo;
      this.newListeCourses.pseudo = this.auth.getUserDetails().pseudo;
      this.newCommentaire.ecritPar = this.auth.getUserDetails().pseudo;
      this.newResponse.ecritPar = this.auth.getUserDetails().pseudo;
    }
  }

  onClick() {
  }

  ngOnInit(): void {

  }

  updateNbView(recette: any) {
    this.recetteService.updateNbView(recette).subscribe(
      (res) => {
        this.router.navigate(['/recipe', recette.idRecette]).then(() => {
          window.location.reload();
        });
      }, err => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 402) {
            console.log('Cette recette n\'existe pas !');
          }
        }
      });
  }

  selectImage(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.images = file;
    }
  }

  getUtiliserIngredientsByIdRecette(id: any): QuantiteDetails[] {
    this.ingredientsService.getUtiliserIngredientsByIdRecette(id).subscribe(
      (qtes: QuantiteDetails[]) => {
        this.qtes = qtes;
      }, err => {
        if (err instanceof HttpResponse) {
          if (err.status === 402) {
            console.log('Il n\'y a pas d\'ingrédients !');
          }
        }
      }
    );
    return this.qtes;
  }

  getUniteByIdUnite(id: any): UniteDetails {
    this.unitesService.getUniteById(id).subscribe(
      (unite: UniteDetails) => {
        this.unite = unite;
      }, err => {
        if (err instanceof HttpResponse) {
          if (err.status === 402) {
            console.log('Il n\'y a pas d\'ingrédients !');
          }
        }
      }
    );
    return this.unite;
  }

  addFavoris() {
    console.log(this.newFavori);
    this.favorisService.addFavoris(this.newFavori).subscribe();
    this.isFavori = true;
    window.location.reload();
  }

  deleteFavoris() {
    console.log(this.newFavori);
    this.favorisService.deleteFavoris(this.newFavori.idRecette).subscribe();
    this.isFavori = false;
    window.location.reload();
  }

  addListeCourses() {
    this.newListeCourses.listIngredients = this.ingredients;
    this.shoppingListService.addListeCourses(this.newListeCourses);

    this.router.navigate(['/shoppingList']).then(() => {
      window.location.reload();
    });


  }
  deleteCommentaire(idCommentaire: any) {
    this.commentairesService.deleteCommentaire(idCommentaire)
      .subscribe(res => {
        this.router.navigate(['/recipe/' + parseInt(this.route.snapshot.paramMap.get('id'), 10)]).then(() => {
          window.location.reload();
        });
      }, (err) => {
        console.log(err);
      }
      );
    window.location.reload(); /* rafraichit la page */
  }

  addCommentaire(message: any) {
    if (this.images) {
      const formData = new FormData();
      formData.append('file', this.images);
      this.newCommentaire.message = message;
      console.log(this.newCommentaire);
      this.imagesService.addImage(formData).subscribe(res => {
        this.newCommentaire.idImage = res[0];
        this.commentairesService.addCommentaire(this.newCommentaire).subscribe(res2 => {
          console.log(res2);
          this.newCommentaire.idCommentaire = res2.idCommentaire;
          this.commentairesService.addImageToCommentaire(this.newCommentaire).subscribe();
          window.location.reload();
        });
      });
    } else {
      this.newCommentaire.message = message;
      this.commentairesService.addCommentaire(this.newCommentaire).subscribe();
      window.location.reload();
    }

    // window.location.reload()
  }

  addReponse(event, idCommentaire) {
    if (this.images) {
      const formData = new FormData();
      formData.append('file', this.images);
      this.newResponse.message = event.target.message.value;
      this.newResponse.parent = idCommentaire;
      this.imagesService.addImage(formData).subscribe(res => {
        this.newResponse.idImage = res[0];
        this.commentairesService.addCommentaire(this.newResponse).subscribe(res2 => {
          console.log(res2);
          this.newResponse.idCommentaire = res2.idCommentaire;
          this.commentairesService.addImageToCommentaire(this.newResponse).subscribe();
          window.location.reload();
        });
      });
    } else {
      this.newResponse.message = event.target.message.value;
      this.newResponse.parent = idCommentaire;
      this.commentairesService.addCommentaire(this.newResponse).subscribe();
      window.location.reload();
    }
    // window.location.reload()
  }


  onProportionChange(searchValue: string): void {
    this.recette.ingredients.forEach(element => {
      element.qte = (element.qte * parseInt(searchValue, 10)) / this.recette.nbrePart;
    });
    this.recette.nbrePart = parseInt(searchValue, 10);
  }

  onProportionLess(value: number): void {
    console.log(value);
    this.recette.ingredients.forEach(element => {
      element.qte = roundDecimal((element.qte * value) / this.recette.nbrePart);
    });
    this.recette.nbrePart = this.recette.nbrePart - 1;
  }

  onProportionMore(value: number): void {
    this.recette.ingredients.forEach(element => {
      element.qte = roundDecimal((element.qte * value) / this.recette.nbrePart);
    });
    this.recette.nbrePart = this.recette.nbrePart + 1;
  }

}
