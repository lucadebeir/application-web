import { Component, OnInit } from '@angular/core';
import { RecipeDetails, RecettesService, IngredientDetails, UniteDetails, QuantiteDetails, FavorisDetails, ListeCoursesDetails, AuthentificationService } from '../../service';
import { HttpResponse} from '@angular/common/http'
import {Router, ActivatedRoute} from '@angular/router'
import {Observable} from 'rxjs'

@Component({
  selector: 'app-recette',
  templateUrl: './recette.component.html',
  styleUrls: ['./recette.component.scss']
})
export class RecetteComponent implements OnInit {

  public image
  public recette: RecipeDetails
  public ingredients: Observable<IngredientDetails[]>
  public unite: UniteDetails
  public qtes: QuantiteDetails[]
  public newFavori: FavorisDetails = {
    pseudo : this.auth.getUserDetails().pseudo,
    idRecette : parseInt(this.route.snapshot.paramMap.get('id'))
  }

  public newListeCourses: ListeCoursesDetails = {
    pseudo: this.auth.getUserDetails().pseudo,
    listIngredients : null
  }

  constructor(public auth: AuthentificationService ,private recetteService: RecettesService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.recetteService.getRecipeById(parseInt(this.route.snapshot.paramMap.get('id'))).subscribe(
      recette => {
        this.recette = recette
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
       
      }
    );
  }

  getUtiliserIngredientsByIdRecette(id: any) : QuantiteDetails[] {
    this.recetteService.getUtiliserIngredientsByIdRecette(id).subscribe(
      (qtes: QuantiteDetails[]) => {
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
    this.router.navigateByUrl('/favorites').then(() => {
      window.location.reload()
    })
  }

  addListeCourses(){
    this.newListeCourses.listIngredients = this.ingredients
    this.recetteService.addListeCourses(this.newListeCourses)
    
    this.router.navigate(['/shoppingList']).then(() => {
      window.location.reload()
    })

   
  }

}
