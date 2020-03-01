import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RecipeDetails, RecettesService } from '../service/recettes.service';
import {HttpErrorResponse} from '@angular/common/http'
import { Router } from '@angular/router';
import { ResourceLoader } from '@angular/compiler';

@Component({
  selector: 'app-gerer-les-recettes',
  templateUrl: './gerer-les-recettes.component.html',
  styleUrls: ['./gerer-les-recettes.component.css']
})
export class GererLesRecettesComponent implements OnInit {

  public recettes: RecipeDetails[]
  public recette: RecipeDetails

  constructor(private recettesService: RecettesService, private router: Router) { }

  ngOnInit(): void {
    this.recettesService.getAllRecipes().subscribe(
      recettes => {
        this.recettes = recettes
      }
    )
  }
  deleteRecipe(idRecette: any) {
    this.recettesService.deleteRecipe(idRecette)
      .subscribe(res => {
        this.router.navigate(['/handleRecipes'], {
          queryParams: {refresh: new Date().getTime()}
       })
        }, (err) => {
          console.log(err);
        }
      );
      window.location.reload() /* rafraichit la page */
  }
  

}

