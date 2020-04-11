import { Component, OnInit } from '@angular/core';
import { RecipeDetails, RecettesService, AuthentificationService, FavorisDetails } from '../../service';
import {HttpErrorResponse} from '@angular/common/http'
import { Router } from '@angular/router';
import { element } from 'protractor';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss']
})
export class AccueilComponent implements OnInit {

  public latestRecipes: RecipeDetails[]
  public mostPopularRecipes: RecipeDetails[]

  public newFavori: FavorisDetails = {
    pseudo : '',
    idRecette : null 
  }

  public favoris: number[] = []

  constructor(private recetteService: RecettesService, private router: Router, public auth: AuthentificationService) { 
    if(this.auth.isLoggedIn()) {
      this.newFavori.pseudo = this.auth.getUserDetails().pseudo

      this.getFavoris()
    }
  }

  addTimes (startTime, endTime) {
    var times = [ 0, 0, 0 ]
    var max = times.length
  
    var a = (startTime || '').split(':')
    var b = (endTime || '').split(':')
  
    // normalize time values
    for (var i = 0; i < max; i++) {
      a[i] = isNaN(parseInt(a[i])) ? 0 : parseInt(a[i])
      b[i] = isNaN(parseInt(b[i])) ? 0 : parseInt(b[i])
    }
  
    // store time values
    for (var i = 0; i < max; i++) {
      times[i] = a[i] + b[i]
    }
  
    var hours = times[0]
    var minutes = times[1]
    var seconds = times[2]
  
    if (seconds >= 60) {
      var m = (seconds / 60) << 0
      minutes += m
      seconds -= 60 * m
    }
  
    if (minutes >= 60) {
      var h = (minutes / 60) << 0
      hours += h
      minutes -= 60 * h
    }
  
    return ('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2)
  }

  ngOnInit(): void {
    this.getLatestReceipes()
    this.getMostPopularRecipes()
  }

  getLatestReceipes() {

    this.recetteService.getLatestReceipes().subscribe(
      (latestRecipes: RecipeDetails[]) => {
        this.latestRecipes = latestRecipes
        this.latestRecipes.forEach(element => {
          element.globalTime = this.addTimes(element.tempsCuisson, element.tempsPreparation)
        });
    },err => {
      if(err instanceof HttpErrorResponse){
        if(err.status === 402) {
          console.log("Il n'y a pas encore de recettes.")
        }
      }
    })
  }

  getMostPopularRecipes() {

    this.recetteService.getMostPopularRecipes().subscribe(
      (mostPopularRecipes: RecipeDetails[]) => {
        this.mostPopularRecipes = mostPopularRecipes
        this.mostPopularRecipes.forEach(element => {
          element.globalTime = this.addTimes(element.tempsCuisson, element.tempsPreparation)
        });
    },err => {
      if(err instanceof HttpErrorResponse){
        if(err.status === 402) {
          console.log("Il n'y a pas encore de recettes.")
        }
      }
    })
  }

  updateNbView(recette: any) {
    this.recetteService.updateNbView(recette).subscribe(
      (res) => {
        this.router.navigate(['/recipe', recette.idRecette]).then(() => {
          window.location.reload()
        })
      }, err => {
        if(err instanceof HttpErrorResponse){
          if(err.status === 402) {
          console.log("Cette recette n'existe pas !")
        }
      }
    })
  }

  addFavoris(id: number) {
    this.newFavori.idRecette = id
    this.recetteService.addFavoris(this.newFavori)
    this.router.navigateByUrl('/').then(() => {
      window.location.reload()
    })
  }

  getFavoris() {
   this.recetteService.getFavoris().subscribe(
    (favoris: RecipeDetails[]) => {
      console.log(favoris)
      favoris.forEach(element => {
        this.favoris.push(element.idRecette)
 
        console.log(this.favoris)
      })
      
  },err => {
    if(err instanceof HttpErrorResponse){
      if(err.status === 402) {
        console.log("Cette user n'a pas de favoris")
      }
    }
  })
}

deleteFavoris(idRecette: any) {
  this.recetteService.deleteFavoris(idRecette)
    .subscribe(res => {
      this.router.navigate(['/'], {
        queryParams: {refresh: new Date().getTime()}
     })
      }, (err) => {
        console.log(err);
      }
    );
    window.location.reload() /* rafraichit la page */
}

}
