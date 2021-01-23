import { Component, OnInit } from "@angular/core";
import { Observable, combineLatest, Subscription } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { FormControl } from "@angular/forms";
import { RecettesService } from "../../service";
import { RecipeDetails } from "../../models";
import { Router } from "@angular/router";
import { MediaObserver } from "@angular/flex-layout";

@Component({
  selector: "app-gerer-les-recettes",
  templateUrl: "./gerer-les-recettes.component.html",
  styleUrls: ["./gerer-les-recettes.component.scss"],
})
export class GererLesRecettesComponent implements OnInit {
  watcher: Subscription;

  opened = true;
  over = "side";
  expandHeight = "42px";
  collapseHeight = "42px";
  displayMode = "flat";

  searchTerm = "";
  public recettes$: Observable<
    RecipeDetails[]
  > = this.recettesService.getSearchResults();
  allRecipe: RecipeDetails[];

  currentPage: number;

  constructor(
    private recettesService: RecettesService,
    private router: Router,
    media: MediaObserver
  ) {
    this.recettesService.getAllRecipesAndIngredients().subscribe((data) => {
      this.allRecipe = data;
      setTimeout(() => {
        this.recettesService.search(this.searchTerm, data).subscribe();
      }, 1000);
    });
  }

  ngOnInit(): void {}

  onSearchTermChange(): void {
    this.recettesService.search(this.searchTerm, this.allRecipe).subscribe();
    if (this.searchTerm === "") {
      this.currentPage = 1;
    }
  }

  deleteRecipe(idRecette: any) {
    this.recettesService.deleteRecipe(idRecette).subscribe(
      (res) => {
        this.router.navigate(["/handleRecipes"]).then(() => {
          this.recettes$.subscribe(
            (res: any) => {
              this.recettesService
                .delete(this.allRecipe, idRecette)
                .subscribe();
            },
            (err: any) => console.log(err)
          );
        });
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onPageChange(page: number) {
    this.currentPage = page;
    window.scrollTo(0, 0);
  }
}
