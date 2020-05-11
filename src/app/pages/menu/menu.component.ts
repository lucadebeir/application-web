import { Component, OnInit } from '@angular/core';
import { ListRecipe } from 'src/app/models/listRecipe.model';
import { RecettesService, AuthentificationService } from 'src/app/service';
import { RecipeDetails } from 'src/app/models';
import { ThrowStmt } from '@angular/compiler';
import { element } from 'protractor';

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

  constructor(private recetteService: RecettesService, private auth: AuthentificationService) {
    this.getInitData();

    if (this.auth.isLoggedIn()) {
      this.newRecetteList.pseudoUser = this.auth.getUserDetails().pseudo;
    }
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
    });

    this.allRecipe = [];

    this.recetteService.getAllRecipes().subscribe(data => {
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
}
