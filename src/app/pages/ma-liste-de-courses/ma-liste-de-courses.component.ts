import { Component, OnInit } from "@angular/core";
import { Observable, combineLatest } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { FormControl } from "@angular/forms";
import {
  RecettesService,
  AuthentificationService,
  ShoppingListService,
  IngredientsService,
} from "../../service";
import { IngredientDetails, ListCourses } from "../../models";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-ma-liste-de-courses",
  templateUrl: "./ma-liste-de-courses.component.html",
  styleUrls: ["./ma-liste-de-courses.component.scss"],
})
export class MaListeDeCoursesComponent implements OnInit {
  public allShoppingList: ListCourses[];
  public restIngredients$: Observable<ListCourses[]>;

  public allIngredient: IngredientDetails[];

  public ingredientToDelete: ListCourses = {
    pseudo: this.auth.getUserDetails().pseudo,
    idIngredient: null,
    nomIngredient: "",
    idIngredientList: null,
  };

  public ingredientToAdd: ListCourses = {
    pseudo: this.auth.getUserDetails().pseudo,
    idIngredient: null,
    nomIngredient: "",
    idIngredientList: null,
  };

  searchTerm: string = "";
  public ingredients$: Observable<
    IngredientDetails[]
  > = this.shoppingListService.getSearchResults();

  constructor(
    private auth: AuthentificationService,
    private modalService: NgbModal,
    private shoppingListService: ShoppingListService,
    private ingredientService: IngredientsService
  ) {
    this.loading();
  }

  ngOnInit(): void {}

  loading() {
    this.shoppingListService.getListeCourses().subscribe((res) => {
      this.allShoppingList = res;
      setTimeout(() => {
        this.shoppingListService.search(this.searchTerm, res).subscribe();
        this.ingredientToAdd.nomIngredient = "";
        this.ingredientToAdd.idIngredient = null;
      }, 1000);
    });

    this.restIngredients$ = this.shoppingListService.getRestListeCourses();

    this.ingredientService.getAllIngredients().subscribe((res) => {
      this.allIngredient = res;
    });
  }

  onSearchTermChange(): void {
    this.shoppingListService
      .search(this.searchTerm, this.allShoppingList)
      .subscribe();
  }

  deleteListeCourse(nomIngredient: any) {
    this.shoppingListService.deleteListeCourse(nomIngredient).subscribe(() => {
      this.shoppingListService
        .delete(this.allShoppingList, nomIngredient)
        .subscribe();
    });
    setTimeout(() => {
      this.loading();
    }, 500);
  }

  open(content) {
    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title" })
      .result.then((result) => {
        this.allIngredient.forEach((element) => {
          if (element.nomIngredient === this.ingredientToAdd.nomIngredient) {
            this.ingredientToAdd.idIngredient = element.idIngredient;
          }
        });
        this.ingredientToAdd.idIngredient = result.idIngredient;
        this.shoppingListService
          .addIngredientShoppingList(this.ingredientToAdd)
          .subscribe();

        this.shoppingListService
          .add(this.allShoppingList, this.ingredientToAdd)
          .subscribe();
        setTimeout(() => {
          this.loading();
        }, 500);
      });
  }
}
