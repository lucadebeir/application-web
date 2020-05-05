import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { RecettesService, AuthentificationService, ShoppingListService } from '../../service';
import { IngredientDetails } from '../../models';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ma-liste-de-courses',
  templateUrl: './ma-liste-de-courses.component.html',
  styleUrls: ['./ma-liste-de-courses.component.scss']
})
export class MaListeDeCoursesComponent implements OnInit {
  public ingredients$: Observable<IngredientDetails[]>;
  public restIngredients$: Observable<IngredientDetails[]>;

  public filteredIngredient$: Observable<IngredientDetails[]>;
  public filter: FormControl;
  public filter$: Observable<string>;

  public ingredientToDelete: IngredientShoppingList = {
    pseudo: this.auth.getUserDetails().pseudo,
    idIngredient: null
  };

  public ingredientToAdd: IngredientShoppingList = {
    pseudo: this.auth.getUserDetails().pseudo,
    idIngredient: null
  };


  constructor(private recetteService: RecettesService, private router: Router, private auth: AuthentificationService,
              private modalService: NgbModal, private shoppingListService: ShoppingListService) {
    this.ingredients$ = this.shoppingListService.getListeCourses();
    this.filter = new FormControl('');
    this.filter$ = this.filter.valueChanges.pipe(startWith(''));
    // tslint:disable-next-line: deprecation
    this.filteredIngredient$ = combineLatest(this.ingredients$, this.filter$)
      .pipe(map(([ingredients, filterString]) =>
        ingredients.filter(ingredient => ingredient.nomIngredient.toLowerCase().indexOf(filterString.toLowerCase()) !== -1)));

    this.restIngredients$ = this.shoppingListService.getRestListeCourses();
  }

  ngOnInit(): void {
  }

  getListeCourses() {
    this.ingredients$ = this.shoppingListService.getListeCourses();
    this.filter = new FormControl('');
    this.filter$ = this.filter.valueChanges.pipe(startWith(''));
    // tslint:disable-next-line: deprecation
    this.filteredIngredient$ = combineLatest(this.ingredients$, this.filter$)
      .pipe(map(([ingredients, filterString]) =>
        ingredients.filter(ingredient => ingredient.nomIngredient.toLowerCase().indexOf(filterString.toLowerCase()) !== -1)));

  }

  deleteListeCourse(idIngredient: any) {
    this.ingredientToDelete.idIngredient = idIngredient;
    this.shoppingListService.deleteListeCourse(idIngredient)
      .subscribe(res => {
        this.router.navigate(['/refresh'], {
          queryParams: {url: 'shoppingList'}
        });
      }, (err) => {
        console.log(err);
      }
      );
    window.location.reload(); /* rafraichit la page */
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result
      .then((result) => {
        this.ingredientToAdd.idIngredient = result.idIngredient;
        this.shoppingListService.addIngredientShoppingList(this.ingredientToAdd);
        this.router.navigate(['/refresh'], {
          queryParams: {url: 'shoppingList'}
        });
      });
  }
}

export interface IngredientShoppingList {
  pseudo: string;
  idIngredient: number;
}
