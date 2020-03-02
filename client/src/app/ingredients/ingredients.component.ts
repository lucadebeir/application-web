import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IngredientDetails, RecettesService} from '../service/recettes.service';
import {HttpErrorResponse} from '@angular/common/http'
import { Router } from '@angular/router';
import { ResourceLoader } from '@angular/compiler';

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.css']
})
export class IngredientsComponent implements OnInit {
  public ingredients: IngredientDetails[]
  public ingredient: IngredientDetails

  constructor(private recettesService: RecettesService, private router: Router) { }

  ngOnInit(): void {
    this.recettesService.getAllIngredients().subscribe(
      ingredients => {
        this.ingredients = ingredients
       
      }
    )
  }
  
}
