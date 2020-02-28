import { Component, OnInit } from '@angular/core';
import { RecipeDetails, RecettesService } from '../recettes.service';
import { HttpErrorResponse} from '@angular/common/http'
import {Router, ActivatedRoute} from '@angular/router'

@Component({
  selector: 'app-recette',
  templateUrl: './recette.component.html',
  styleUrls: ['./recette.component.css']
})
export class RecetteComponent implements OnInit {

  public recette: RecipeDetails

  constructor(private recetteService: RecettesService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    if(this.route.snapshot.paramMap.get('id')) {
      this.recette = this.getRecipeById(parseInt(this.route.snapshot.paramMap.get('id'))) 
    }
  }

  getRecipeById(id: any) : RecipeDetails {
    this.recetteService.getRecipeById(id).subscribe(
      (recette: RecipeDetails) => {
        this.recette = recette
      },err => {
        if(err instanceof HttpErrorResponse){
          if(err.status === 402) {
            console.log("Cette recette n'existe pas !")
          }
        }
      }
      
    )
    return this.recette
  }

}
