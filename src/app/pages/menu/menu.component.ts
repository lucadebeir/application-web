import { Component, OnInit } from '@angular/core';
import { ListRecipe } from 'src/app/models/listRecipe.model';
import { RecettesService, AuthentificationService } from 'src/app/service';
import { RecipeDetails } from 'src/app/models';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  public list: ListRecipe[];
  public allRecipe: RecipeDetails[] = [];
  public newRecetteList: ListRecipe = {
    pseudoUser: '',
    nomRecette: '',
    idRecette: null,
    idRecipeList: null,
    complet: false
  };

  public listAdmin: ListRecipe[];
  public menuAdmin = false;

  constructor(private recetteService: RecettesService, private auth: AuthentificationService, private router: Router) {
    this.getInitData();

    if (this.auth.isLoggedIn()) {
      this.newRecetteList.pseudoUser = this.auth.getUserDetails().pseudo;
    }

    this.recetteService.getListRecipesOfAdmin().subscribe(res => {
      this.listAdmin = res;
    });
  }

  ngOnInit(): void {
  }

  addRecipeToList() {
    this.allRecipe.forEach(element => {
      if (element.nomRecette === this.newRecetteList.nomRecette) {
        this.newRecetteList.idRecette = element.idRecette;
      }
    });
    this.recetteService.addRecipeToList(this.newRecetteList).subscribe(res => {
      this.getInitData();
      this.newRecetteList.nomRecette = '';
      this.newRecetteList.idRecette = null;
    });
  }

  getInitData(): void {
    this.recetteService.getListRecipes().subscribe(data => {
      this.list = data;
      console.log(data);
    });

    this.allRecipe = [];

    this.recetteService.getAllRecipesAsc().subscribe(data => {
      data.forEach((element: RecipeDetails) => {
        let res = true;
        this.list.forEach(element2 => {
          if (element.idRecette === element2.idRecette) {
            res = false;
          }
        });
        if (res) {
          this.allRecipe.push(element);
        }
      });
    });
  }

  deleteRecipeOfList(recette: ListRecipe) {
    this.recetteService.deleteRecipeOfList(recette).subscribe(res => {
      this.getInitData();
      this.newRecetteList.nomRecette = '';
      this.newRecetteList.idRecette = null;
    });
  }

  deleteAllRecipeOfList() {
    this.recetteService.deleteAllRecipeOfList().subscribe(res => {
      this.getInitData();
      this.newRecetteList.nomRecette = '';
      this.newRecetteList.idRecette = null;
    });
  }

  changeStateOfRecipe(recette: ListRecipe) {
    this.recetteService.changeStateOfRecipe(recette).subscribe(res => {
      this.getInitData();
      this.newRecetteList.nomRecette = '';
      this.newRecetteList.idRecette = null;
    });
  }

  changeMenu() {
    this.menuAdmin = !this.menuAdmin;
  }

  updateNbView(recette: any) {
    this.recetteService.updateNbViewMenu(recette).subscribe(
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
}
