import { Component, OnInit, Input } from '@angular/core';
import { RecipeDetails, RecettesService, IngredientDetails, UniteDetails, QuantiteDetails, FavorisDetails } from '../service/recettes.service';
import { HttpErrorResponse, HttpResponse} from '@angular/common/http'
import {Router, ActivatedRoute} from '@angular/router'
import {Observable, of} from 'rxjs'
import { AuthentificationService } from '../service/authentification.service';

@Component({
  selector: 'app-recette',
  templateUrl: './recette.component.html',
  styleUrls: ['./recette.component.css']
})
export class RecetteComponent implements OnInit {

  public recette: RecipeDetails
  public ingredients: Observable<IngredientDetails[]>
  public unite: UniteDetails
  public qtes: QuantiteDetails[]
  public newFavori: FavorisDetails = {
    pseudo : this.auth.getUserDetails().pseudo,
    idRecette : parseInt(this.route.snapshot.paramMap.get('id'))
  }

  constructor(public auth: AuthentificationService ,private recetteService: RecettesService, private router: Router, private route: ActivatedRoute) {
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
  }

  getUtiliserIngredientsByIdRecette(id: any) : QuantiteDetails[] {
    this.recetteService.getUtiliserIngredientsByIdRecette(id).subscribe(
      (qtes: QuantiteDetails[]) => {
        console.log(qtes)
        this.qtes = qtes
      }, err => {
        if(err instanceof HttpResponse) {
          if(err.status === 402) {
            console.log("Il n'y a pas d'ingrédients !")
          }
        }
      }
    )
    return this.qtes
  }

  getUniteByIdUnite(id: any) : UniteDetails {
    this.recetteService.getUniteById(id).subscribe(
      (unite: UniteDetails) => {
        this.unite = unite
      }, err => {
        if(err instanceof HttpResponse) {
          if(err.status === 402) {
            console.log("Il n'y a pas d'ingrédients !")
          }
        }
      }
    )
    return this.unite
  }

  addFavoris() {
    this.recetteService.addFavoris(this.newFavori)
    this.router.navigateByUrl('/favorites')
  }

}
