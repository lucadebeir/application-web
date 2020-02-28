import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RecipeDetails, RecettesService } from '../recettes.service';
import {HttpClient, HttpParams, HttpErrorResponse} from '@angular/common/http'
import {Router} from '@angular/router'
 

@Component({
  selector: 'app-recettes',
  templateUrl: './recettes.component.html',
  styleUrls: ['./recettes.component.css']
})
export class RecettesComponent implements OnInit {

  public recettes: RecipeDetails[]

  constructor(private recetteService: RecettesService, private http: HttpClient) { } 

  //dans ngOnInit on récupère les données à afficher au chargement de la page
  ngOnInit(): void {
    this.getAllRecipes()
    console.log(this.recettes)
  }

  getAllRecipes() {

    this.recetteService.getAllRecipes().subscribe(
      (recettes: RecipeDetails[]) => {
        console.log(recettes)
        this.recettes = recettes
    },err => {
      if(err instanceof HttpErrorResponse){
        if(err.status === 402) {
          console.log("Il n'y a pas encore de recettes.")
        }
      }
    })
  }
  
}
