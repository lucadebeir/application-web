import { Component, OnInit } from '@angular/core';
import { CategoryDetails, RecettesService} from '../../service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  public categories: CategoryDetails[] 

  public categorie: CategoryDetails = {
    idCategorie: null,
    libelleCategorie: ''
  }
   

  constructor(private recettesService: RecettesService, private router: Router) { }

  ngOnInit(): void {

    this.recettesService.getAllCategory().subscribe(
      categories => {
        this.categories = categories
      }
    )
  }

  deleteCategory(idCategorie: any) {
    this.recettesService.deleteCategory(idCategorie)
      .subscribe(res => {
        this.router.navigate(['/category'], {
          queryParams: {refresh: new Date().getTime()}
       })
        }, (err) => {
          console.log(err);
        }
      );
      window.location.reload() /* rafraichit la page */
  }


  updateCategory(categorie: CategoryDetails){
    this.recettesService.updateCategory(categorie).subscribe((res: any) => {
        window.location.reload()
      },(err: any) => {
        console.error(err)
      }
    );
  }

  addCategory(){
    this.recettesService.addCategory(this.categorie)
    window.location.reload()
  }
}

