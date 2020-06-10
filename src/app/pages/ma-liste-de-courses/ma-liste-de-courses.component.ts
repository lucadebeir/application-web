import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { RecettesService, AuthentificationService, ShoppingListService, IngredientsService } from '../../service';
import { IngredientDetails, ListCourses } from '../../models';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ma-liste-de-courses',
  templateUrl: './ma-liste-de-courses.component.html',
  styleUrls: ['./ma-liste-de-courses.component.scss']
})
export class MaListeDeCoursesComponent implements OnInit {
  public ingredients$: Observable<ListCourses[]>;
  public restIngredients$: Observable<ListCourses[]>;

  public allIngredient: IngredientDetails[];

  public filteredIngredient$: Observable<ListCourses[]>;
  public filter: FormControl;
  public filter$: Observable<string>;

  public ingredientToDelete: ListCourses = {
    pseudo: this.auth.getUserDetails().pseudo,
    idIngredient: null,
    nomIngredient: '',
    idIngredientList: null
  };

  public ingredientToAdd: ListCourses = {
    pseudo: this.auth.getUserDetails().pseudo,
    idIngredient: null,
    nomIngredient: '',
    idIngredientList: null
  };


  constructor(private recetteService: RecettesService, private router: Router, private auth: AuthentificationService,
              private modalService: NgbModal, private shoppingListService: ShoppingListService,
              private ingredientService: IngredientsService) {
    this.ingredients$ = this.shoppingListService.getListeCourses();
    this.filter = new FormControl('');
    this.filter$ = this.filter.valueChanges.pipe(startWith(''));
    // tslint:disable-next-line: deprecation
    this.filteredIngredient$ = combineLatest(this.ingredients$, this.filter$)
      .pipe(map(([ingredients, filterString]) =>
        ingredients.filter(ingredient => ingredient.nomIngredient.toLowerCase().indexOf(filterString.toLowerCase()) !== -1)));

    this.restIngredients$ = this.shoppingListService.getRestListeCourses();

    this.ingredientService.getAllIngredients().subscribe(res => {
      this.allIngredient = res;
    });
  }

  ngOnInit(): void {
  }

  getInitData() {
    this.ingredients$ = this.shoppingListService.getListeCourses();
    this.filter = new FormControl('');
    this.filter$ = this.filter.valueChanges.pipe(startWith(''));
    // tslint:disable-next-line: deprecation
    this.filteredIngredient$ = combineLatest(this.ingredients$, this.filter$)
      .pipe(map(([ingredients, filterString]) =>
        ingredients.filter(ingredient => ingredient.nomIngredient.toLowerCase().indexOf(filterString.toLowerCase()) !== -1)));

    this.restIngredients$ = this.shoppingListService.getRestListeCourses();
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

  deleteListeCourse(nomIngredient: any) {
    this.ingredientToDelete.nomIngredient = nomIngredient;
    this.shoppingListService.deleteListeCourse(nomIngredient)
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
        this.allIngredient.forEach(element => {
          if (element.nomIngredient === this.ingredientToAdd.nomIngredient) {
            this.ingredientToAdd.idIngredient = element.idIngredient;
          }
        });
        this.shoppingListService.addIngredientShoppingList(this.ingredientToAdd).subscribe(res => {
          this.getInitData();
          this.ingredientToAdd.nomIngredient = '';
          this.ingredientToAdd.idIngredient = null;
        });
        this.ingredientToAdd.idIngredient = result.idIngredient;
        this.shoppingListService.addIngredientShoppingList(this.ingredientToAdd);
        this.router.navigate(['/refresh'], {
         queryParams: {url: 'shoppingList'}
        });
      });
  }
}
