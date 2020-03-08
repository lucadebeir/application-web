import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest, from } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { UniteDetails, RecettesService} from '../../service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-unite',
  templateUrl: './unite.component.html',
  styleUrls: ['./unite.component.css']
})
export class UniteComponent implements OnInit {

  public unites$: Observable<UniteDetails[]>
  public unites: UniteDetails[]

  public unite: UniteDetails = {
    idUnite: null,
    libelleUnite: ''
  }
  
  public filteredUnite$: Observable<UniteDetails[]>
  public filter: FormControl
  public filter$: Observable<string>

  constructor(private recettesService: RecettesService, private router: Router) { 
     //pour la recherche dynamique
     this.unites$ = this.recettesService.getAllUnite()
     this.filter = new FormControl('')
     this.filter$ = this.filter.valueChanges.pipe(startWith(''))
     this.filteredUnite$ = combineLatest(this.unites$, this.filter$)
       .pipe(map(([unites, filterString]) =>
         unites.filter(unite => unite.libelleUnite.toLowerCase().indexOf(filterString.toLowerCase()) !== -1)))
  }

  ngOnInit(): void {
  }

  getAllUnite() {

    this.unites$ = this.recettesService.getAllUnite()
    this.filter = new FormControl('')
    this.filter$ = this.filter.valueChanges.pipe(startWith(''))
    this.filteredUnite$ = combineLatest(this.unites$, this.filter$)
      .pipe(map(([unites, filterString]) =>
        unites.filter(unite => unite.libelleUnite.toLowerCase().indexOf(filterString.toLowerCase()) !== -1)))

  }

  deleteUnite(idUnite: any) {
    this.recettesService.deleteUnite(idUnite)
      .subscribe(res => {
        this.router.navigate(['/unite'], {
          queryParams: {refresh: new Date().getTime()}
       })
        }, (err) => {
          console.log(err);
        }
      );
      window.location.reload() /* rafraichit la page */
  }


  updateUnite(unite: UniteDetails){
    this.recettesService.updateUnite(unite).subscribe((res: any) => {
        window.location.reload()
      },(err: any) => {
        console.error(err)
      }
    );
  }

  addUnite(){
    this.recettesService.addUnite(this.unite)
    window.location.reload()
  }
 

}
