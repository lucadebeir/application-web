import { Component, OnInit } from '@angular/core';
import { RecettesService, CategoriesService} from '../../service';
import { CategoryDetails } from '../../models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  public categories: CategoryDetails[];

  public categorie: CategoryDetails = {
    idCategorie: null,
    libelleCategorie: ''
  };


  constructor(private recettesService: RecettesService, private router: Router, private categoriesService: CategoriesService) { }

  ngOnInit(): void {

    this.categoriesService.getAllCategory().subscribe(
      categories => {

        this.categories = categories;
      }
    );
  }

  deleteCategory(idCategorie: any) {
    this.categoriesService.deleteCategory(idCategorie)
      .subscribe(res => {
        this.router.navigate(['/category'], {
          queryParams: {refresh: new Date().getTime()}
       });
        }, (err) => {
          console.log(err);
        }
      );
    window.location.reload(); /* rafraichit la page */
  }


  updateCategory(categorie: CategoryDetails) {
    this.categoriesService.updateCategory(categorie).subscribe((res: any) => {
        window.location.reload();
      }, (err: any) => {
        console.error(err);
      }
    );
  }

  addCategory() {
    this.categoriesService.addCategory(this.categorie);
    window.location.reload();
  }
}

