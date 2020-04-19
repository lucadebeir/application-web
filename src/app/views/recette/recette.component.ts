import { Component, OnInit } from '@angular/core';
import { RecipeDetails, RecettesService, IngredientDetails, UniteDetails, QuantiteDetails, FavorisDetails, ListeCoursesDetails, AuthentificationService, CommentaireDetails } from '../../service';
import { HttpResponse } from '@angular/common/http'
import { Router, ActivatedRoute } from '@angular/router'
import { Observable } from 'rxjs'
import { addHours } from '../../utils/Utils'

@Component({
  selector: 'app-recette',
  templateUrl: './recette.component.html',
  styleUrls: ['./recette.component.scss']
})
export class RecetteComponent implements OnInit {

  public title;

  public image
  public recette: RecipeDetails
  public ingredients: Observable<IngredientDetails[]>
  public unite: UniteDetails
  public qtes: QuantiteDetails[]
  public newFavori: FavorisDetails = {
    pseudo: '',
    idRecette: parseInt(this.route.snapshot.paramMap.get('id'))
  }

  public newListeCourses: ListeCoursesDetails = {
    pseudo: '',
    listIngredients: null
  }

  public commentaires: CommentaireDetails[]
  public newCommentaire: CommentaireDetails = {
    message: '',
    dateCommentaire: null,
    ecritPar: '',
    concerne: parseInt(this.route.snapshot.paramMap.get('id'))
  }

  private nbrePartInitial: number;
  private ingredientQteInitial: IngredientDetails[]

  public element: any

  constructor(public auth: AuthentificationService, private recetteService: RecettesService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit(): void {

    this.recetteService.getRecipeById(parseInt(this.route.snapshot.paramMap.get('id'))).subscribe(
      recette => {
        this.recette = recette
        this.recette.tempsCuisson = addHours(this.recette.tempsCuisson)
        this.recette.tempsPreparation = addHours(this.recette.tempsPreparation)
        this.nbrePartInitial = this.recette.nbrePart
      }
    );

    this.recetteService.getImage(parseInt(this.route.snapshot.paramMap.get('id'))).subscribe(
      res => {
        console.log(res)
        this.image = res
      }
    );

    this.recetteService.getIngredientsByIdRecette(parseInt(this.route.snapshot.paramMap.get('id'))).subscribe(
      ingredient => {

        this.ingredients = ingredient
        this.recette.ingredients = ingredient
        this.ingredientQteInitial = ingredient
      }
    );

    this.recetteService.getCommentaireRecipe(parseInt(this.route.snapshot.paramMap.get('id'))).subscribe(
      commentaires => {

        this.commentaires = commentaires

      }
    );

    if (this.auth.isLoggedIn()) {
      this.newFavori.pseudo = this.auth.getUserDetails().pseudo
      this.newListeCourses.pseudo = this.auth.getUserDetails().pseudo
      this.newCommentaire.ecritPar = this.auth.getUserDetails().pseudo
    }

  }

  getUtiliserIngredientsByIdRecette(id: any): QuantiteDetails[] {
    this.recetteService.getUtiliserIngredientsByIdRecette(id).subscribe(
      (qtes: QuantiteDetails[]) => {
        this.qtes = qtes
      }, err => {
        if (err instanceof HttpResponse) {
          if (err.status === 402) {
            console.log("Il n'y a pas d'ingrédients !")
          }
        }
      }
    )
    return this.qtes
  }

  getUniteByIdUnite(id: any): UniteDetails {
    this.recetteService.getUniteById(id).subscribe(
      (unite: UniteDetails) => {
        this.unite = unite
      }, err => {
        if (err instanceof HttpResponse) {
          if (err.status === 402) {
            console.log("Il n'y a pas d'ingrédients !")
          }
        }
      }
    )
    return this.unite
  }

  addFavoris() {
    this.recetteService.addFavoris(this.newFavori)
    this.router.navigateByUrl('/favorites').then(() => {
      window.location.reload()
    })
  }

  addListeCourses() {
    this.newListeCourses.listIngredients = this.ingredients
    this.recetteService.addListeCourses(this.newListeCourses)

    this.router.navigate(['/shoppingList']).then(() => {
      window.location.reload()
    })


  }
  deleteCommentaire(idCommentaire: any) {
    this.recetteService.deleteCommentaire(idCommentaire)
      .subscribe(res => {
        this.router.navigate(['/recipe/' + parseInt(this.route.snapshot.paramMap.get('id'))]).then(() => {
          window.location.reload()
        })
      }, (err) => {
        console.log(err);
      }
      );
    window.location.reload() /* rafraichit la page */
  }

  addCommentaire(message: any) {
    this.newCommentaire.message = message
    console.log(this.newCommentaire)
    this.recetteService.addCommentaire(this.newCommentaire)
    window.location.reload()
  }


  onProportionChange(searchValue: string): void {
    this.recette.ingredients.forEach(element => {
      element.qte = (element.qte * parseInt(searchValue)) / this.recette.nbrePart
    });
    this.recette.nbrePart = parseInt(searchValue)
  }

  onProportionLess(value: number): void {
    console.log(value)
    this.recette.ingredients.forEach(element => {
      element.qte = (element.qte * value) / this.recette.nbrePart
    });
    this.recette.nbrePart = this.recette.nbrePart - 1;
  }

  onProportionMore(value: number): void {
    this.recette.ingredients.forEach(element => {
      element.qte = (element.qte * value) / this.recette.nbrePart
    });
    this.recette.nbrePart = this.recette.nbrePart + 1;
  }

}
