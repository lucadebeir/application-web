import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RecipeDetails, RecettesService } from '../recettes.service';

//?????lesquels import

@Component({
  selector: 'app-recettes',
  templateUrl: './recettes.component.html',
  styleUrls: ['./recettes.component.css']
})
export class RecettesComponent implements OnInit {

  public recettes: RecipeDetails[]

  constructor(private recetteService: RecettesService) { } 

  //dans ngOnInit on récupère les données à afficher au chargement de la page
  ngOnInit(): void {
    this.getAllRecipes()
  }

  getAllRecipes(){
    this.recetteService.getAllRecipes().subscribe(
      recettes => {
        this.recettes = recettes
    },err => {
      //je comprend pas pourquoi tu met ça en erreur car  401  c'est unauthorized et cette page elle est accécible à tout le monde même pas 
    })
  }
}
