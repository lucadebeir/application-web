import { Component, OnInit } from '@angular/core';
import { RecipeDetails } from 'src/app/models';
import { RecettesService } from 'src/app/service';

@Component({
  selector: 'app-gerer-le-menu',
  templateUrl: './gerer-le-menu.component.html',
  styleUrls: ['./gerer-le-menu.component.scss']
})
export class GererLeMenuComponent implements OnInit {

  public petitDej: RecipeDetails;
  public repas: RecipeDetails;
  public douceur: RecipeDetails;

  public allRecipes: RecipeDetails[];

  constructor(private recetteService: RecettesService) {
    this.recetteService.getAllRecipesForMenu().subscribe(recipes => {
      this.allRecipes = recipes;
    });

    this.recetteService.getPetitDej().subscribe(data => {
      this.petitDej = data;
      this.petitDej.idMenu = 1;
    });

    this.recetteService.getRepas().subscribe(data => {
      this.repas = data;
      this.repas.idMenu = 2;
    });

    this.recetteService.getDouceur().subscribe(data => {
      this.douceur = data;
      this.douceur.idMenu = 3;
    });
  }

  ngOnInit(): void {
  }

  updateMenu(petitDej: RecipeDetails, repas: RecipeDetails, douceur: RecipeDetails) {
    this.allRecipes.forEach(element => {
      if (element.nomRecette === petitDej.nomRecette) {
        console.log(element);
        this.petitDej = element;
        this.petitDej.idMenu = 1;
      }
      if (element.nomRecette === repas.nomRecette) {
        this.repas = element;
        this.repas.idMenu = 1;
      }
      if (element.nomRecette === douceur.nomRecette) {
        this.douceur = element;
        this.douceur.idMenu = 1;
      }
    });
    this.recetteService.updatePetitDej(this.petitDej).subscribe();
    this.recetteService.updateRepas(this.repas).subscribe();
    this.recetteService.updateDouceur(this.douceur).subscribe();
    window.location.reload();
  }

}
