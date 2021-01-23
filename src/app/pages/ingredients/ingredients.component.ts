import { Component, OnInit } from "@angular/core";
import { Observable, combineLatest, from } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { FormControl } from "@angular/forms";
import { RecettesService, IngredientsService } from "../../service";
import { IngredientDetails } from "../../models";
import { Router } from "@angular/router";

@Component({
  selector: "app-ingredients",
  templateUrl: "./ingredients.component.html",
  styleUrls: ["./ingredients.component.scss"],
})
export class IngredientsComponent implements OnInit {
  public ingredients: IngredientDetails[];

  public ingredient: IngredientDetails = {
    idIngredient: null,
    nomIngredient: "",
    qte: null,
    libelleUnite: "",
  };

  searchTerm: string = "";
  public ingredients$: Observable<
    IngredientDetails[]
  > = this.ingredientsService.getSearchResults();

  constructor(
    private router: Router,
    private ingredientsService: IngredientsService
  ) {}

  ngOnInit(): void {
    this.loading();
  }

  loading() {
    this.ingredientsService.getAllIngredients().subscribe((res) => {
      this.ingredients = res;
      setTimeout(() => {
        this.ingredientsService.search(this.searchTerm, res).subscribe();
        this.ingredient.nomIngredient = "";
      }, 1000);
    });
  }

  onSearchTermChange(): void {
    this.ingredientsService
      .search(this.searchTerm, this.ingredients)
      .subscribe();
  }

  deleteIngredient(idIngredient: any) {
    this.ingredientsService.deleteIngredient(idIngredient).subscribe((res) => {
      this.ingredientsService
        .delete(this.ingredients, idIngredient)
        .subscribe();
    });
    setTimeout(() => {
      this.loading();
    }, 500);
  }

  updateIngredient(ingredient: IngredientDetails) {
    this.ingredientsService.updateIngredient(ingredient).subscribe();
  }

  addIngredient() {
    this.ingredientsService.addIngredient(this.ingredient);
    this.ingredientsService.add(this.ingredients, this.ingredient).subscribe();
    setTimeout(() => {
      this.loading();
    }, 500);
  }
}
