import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { RecipeDetails, RecettesService, CategoryDetails, IngredientDetails, QuantiteDetails, UniteDetails } from '../../service';
import { HttpResponse } from '@angular/common/http'
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; //la fenetre qui pop pour ajouter l'ingrédient pendant création d'une recette = modal

@Component({
  selector: 'app-modifier-recette',
  templateUrl: './modifier-recette.component.html',
  styleUrls: ['./modifier-recette.component.css']
})
export class ModifierRecetteComponent implements OnInit {

  public newIngredient: IngredientDetails = {
    qte: null,
    idRecette: parseInt(this.route.snapshot.paramMap.get('id')),
    idIngredient: null,
    idUnite: null
  }

  public recette: RecipeDetails = {
    idRecette: null,
    nomRecette: 'string',
    datePublication: null,
    nbFavoris: null,
    nbVues: null,
    etapes: null
  }
  public ingredients: IngredientDetails
  public unite: UniteDetails
  public qtes: QuantiteDetails[]
  public categories: CategoryDetails[]
  

  public allIngredients: IngredientDetails[] //ingredients disponibles
  public allUnites: UniteDetails[]
  public allCategories: CategoryDetails[] //catégories disponibles

 

  constructor(private recetteService: RecettesService, private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder, private modalService: NgbModal) {
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

    this.recetteService.getRestIngredients(parseInt(this.route.snapshot.paramMap.get('id'))).subscribe(
      ingredients => {
        this.allIngredients = ingredients
      }
    )

    this.recetteService.getAllUnite().subscribe(
      unites => {
        this.allUnites = unites
      }
    )

    this.recetteService.getRestCategory(parseInt(this.route.snapshot.paramMap.get('id'))).subscribe(
      categories => {
        this.allCategories = categories
      }
    )

   
    this.getCategory(parseInt(this.route.snapshot.paramMap.get('id')))

  }

  getCategory(id: any): any {
    this.recetteService.getCategory(id).subscribe(
      (categories: CategoryDetails[]) => {
        this.categories = categories
      }, err => {
        if (err instanceof HttpResponse) {
          if (err.status === 402) {
            console.log("cette recette n'a pas de catégorie!")
          }
        }
      }
    )
    return this.categories
  }



  updateRecipeName(recette: RecipeDetails) {
    this.recetteService. updateRecipeName(recette).subscribe((res: any) => {
      window.location.reload()
    }, (err: any) => {
      console.error(err)
    }
    );
  }
  updateSteps(recette: RecipeDetails) {
    this.recetteService.updateSteps(recette).subscribe((res: any) => {
      window.location.reload()
    }, (err: any) => {
      console.error(err)
    }
    );
  }

  updateRecipeIng(recette: RecipeDetails,ingredient: IngredientDetails) {
    this.recetteService.updateRecipeIng(recette, ingredient).subscribe((res: any) => {
      window.location.reload()
    }, (err: any) => {
      console.error(err)
    }
    );
  }

  deleteIngredientRececipe(ingredient: IngredientDetails, recette: RecipeDetails) {
    this.recetteService.deleteIngredientRececipe(ingredient, recette)
      .subscribe(res => {
        this.router.navigate(['updateRecipe/:id'], {
          queryParams: { refresh: new Date().getTime() }
        })
      }, (err) => {
        console.log(err);
      }
      );
  
  }

  deleteRecipeCategory(categorie: CategoryDetails,recette: RecipeDetails){
  
    this.recetteService.deleteRecipeCategory(categorie, recette)
    .subscribe(res => {
      setTimeout(() => {
        this.recetteService.getRestCategory(parseInt(this.route.snapshot.paramMap.get('id'))).subscribe(
          categories => {
            this.allCategories = categories
          }
        )
        this.recetteService.getCategory(parseInt(this.route.snapshot.paramMap.get('id'))).subscribe(
          categories => {
            this.categories = categories
          }
        )
      }, 1000)
    }, (err) => {
      console.log(err);
    }
    );
  }

  addRecipeCategory(categorie: CategoryDetails,recette: RecipeDetails){
    this.recetteService.addRecipeCategory(categorie,recette)
    .subscribe(res => {
      setTimeout(() => {
        this.recetteService.getRestCategory(parseInt(this.route.snapshot.paramMap.get('id'))).subscribe(
          categories => {
            this.allCategories = categories
          }
        )
        this.recetteService.getCategory(parseInt(this.route.snapshot.paramMap.get('id'))).subscribe(
          categories => {
            this.categories = categories
          }
        )
      }, 1000)

    }, (err) => {
      console.log(err);
    }
    );
  }


  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result
      .then((result) => {
        this.newIngredient.idIngredient = result.idIngredient
        this.newIngredient.qte = result.qte
        this.newIngredient.idUnite = result.idUnite
        this.recetteService.addIngredientRecette(this.newIngredient)
        setTimeout (() => {
          this.recetteService.getIngredientsByIdRecette(parseInt(this.route.snapshot.paramMap.get('id'))).subscribe(
            ingredient => {
              this.ingredients = ingredient
            }
          )
       }, 1000);
      })
  }

}
export class Ingredient {
  idIngredient = '';
  quantite = '';
  idUnite = '';
}

