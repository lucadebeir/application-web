import { Component, OnInit } from "@angular/core";
import { RecettesService, CategoriesService } from "../../service";
import { CategoryDetails } from "../../models";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Component({
  selector: "app-categories",
  templateUrl: "./categories.component.html",
  styleUrls: ["./categories.component.scss"],
})
export class CategoriesComponent implements OnInit {
  public categories: CategoryDetails[];

  public categorie: CategoryDetails = {
    idCategorie: null,
    libelleCategorie: "",
  };

  searchTerm: string = "";
  public categories$: Observable<
    CategoryDetails[]
  > = this.categoriesService.getSearchResults();

  constructor(
    private router: Router,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit(): void {
    this.loading();
  }

  loading() {
    this.categoriesService.getAllCategory().subscribe((categories) => {
      this.categories = categories;
      setTimeout(() => {
        this.categoriesService.search(this.searchTerm, categories).subscribe();
        this.categorie.libelleCategorie = "";
        0;
      }, 1000);
    });
  }

  deleteCategory(idCategorie: any) {
    this.categoriesService.deleteCategory(idCategorie).subscribe((res) => {
      this.categoriesService.delete(this.categories, idCategorie).subscribe();
    });
    setTimeout(() => {
      this.loading();
    }, 500);
  }

  updateCategory(categorie: CategoryDetails) {
    this.categoriesService.updateCategory(categorie).subscribe();
  }

  addCategory() {
    this.categoriesService.addCategory(this.categorie);
    this.categoriesService.add(this.categories, this.categorie).subscribe();
    setTimeout(() => {
      this.loading();
    }, 500);
  }
}
