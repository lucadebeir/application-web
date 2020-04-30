import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import {  } from '@angular/cdk';
import { HttpClientModule } from '@angular/common/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule, Routes } from '@angular/router'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InscrireComponent } from './views/inscrire/inscrire.component'
import { SeConnecterComponent } from './views/se-connecter/se-connecter.component'
import { AccueilComponent } from './views/accueil/accueil.component'
import { AuthentificationService, AuthGuardService, AdminAuthService, RecettesService } from './service'
import { ContactComponent } from './views/contact/contact.component';
import { GererLesRecettesComponent } from './views/gerer-les-recettes/gerer-les-recettes.component';
import { MaListeDeCoursesComponent } from './views/ma-liste-de-courses/ma-liste-de-courses.component';
import { MesCommentairesComponent } from './views/mes-commentaires/mes-commentaires.component';
import { MesRecettesComponent } from './views/mes-recettes/mes-recettes.component';
import { MonProfileComponent } from './views/mon-profile/mon-profile.component';
import { RecettesComponent } from './views/recettes/recettes.component';
import { UpdatePasswordComponent } from './views/update-password/update-password.component';
import { AProposComponent } from './views/apropos/apropos.component';
import { RecetteComponent } from './views/recette/recette.component';
import { IngredientsComponent } from './views/ingredients/ingredients.component';
import { CategoriesComponent } from './views/categories/categories.component';
import { UniteComponent } from './views/unite/unite.component';
import { AjoutRecetteComponent } from './views/ajout-recette/ajout-recette.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ModifierRecetteComponent } from './views/modifier-recette/modifier-recette.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RequestResetComponent } from './views/request-reset/request-reset.component';
import { ResponseResetComponent } from './views/response-reset/response-reset.component';
import { RefreshComponent } from './views/refresh/refresh.component';
import { MentionsLegalesComponent } from './views/mentions-legales/mentions-legales.component';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';

import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

import { NgxPaginationModule } from 'ngx-pagination';


const routes: Routes = [
  { path: '', component: AccueilComponent },
  { path: 'login', component: SeConnecterComponent },
  { path: 'register', component: InscrireComponent },
  { path: 'profile', component: MonProfileComponent, canActivate: [AuthGuardService] },
  { path: 'update-password', component: UpdatePasswordComponent, canActivate: [AuthGuardService] },
  { path: 'aboutMe', component: AProposComponent },
  { path: 'allRecipes', component: RecettesComponent },
  { path: 'recipe/:id', component: RecetteComponent },
  { path: 'handleRecipes', component: GererLesRecettesComponent, canActivate: [AdminAuthService, AuthGuardService]  },
  { path: 'category', component: CategoriesComponent, canActivate: [AdminAuthService, AuthGuardService]  },
  { path: 'ingredient', component: IngredientsComponent, canActivate: [AdminAuthService, AuthGuardService]  },
  { path: 'add-recipe', component: AjoutRecetteComponent, canActivate: [AdminAuthService, AuthGuardService]  },
  { path: 'unite', component: UniteComponent, canActivate: [AdminAuthService, AuthGuardService]  },
  { path: 'contact', component: ContactComponent},
  { path: 'shoppingList', component: MaListeDeCoursesComponent, canActivate: [AuthGuardService] },
  { path: 'comment', component: MesCommentairesComponent, canActivate: [AuthGuardService] },
  { path: 'favorites', component: MesRecettesComponent, canActivate: [AuthGuardService] },
  { path: 'updateRecipe/:id', component: ModifierRecetteComponent, canActivate: [AdminAuthService, AuthGuardService] },
  { path: 'request-reset-password', component: RequestResetComponent },
  { path: 'response-reset-password/:token', component: ResponseResetComponent },
  { path: 'refresh', component: RefreshComponent },
  { path: 'rules', component: MentionsLegalesComponent }
]

@NgModule({
  declarations: [
    AppComponent,
    AccueilComponent,
    MonProfileComponent,
    InscrireComponent,
    SeConnecterComponent,
    ContactComponent,
    GererLesRecettesComponent,
    MaListeDeCoursesComponent,
    MesCommentairesComponent,
    MesRecettesComponent,
    RecettesComponent,
    UpdatePasswordComponent,
    RecetteComponent,
    IngredientsComponent,
    CategoriesComponent,
    UniteComponent,
    AjoutRecetteComponent,
    ModifierRecetteComponent,
    RequestResetComponent,
    ResponseResetComponent,
    RefreshComponent,
    MentionsLegalesComponent,
  ],
  imports: [
    NgxPaginationModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatSidenavModule,
    MatExpansionModule,
    MatListModule,
    FlexLayoutModule,
    NgbModule,
    NgMultiSelectDropDownModule.forRoot(),
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [AuthGuardService, AuthentificationService, RecettesService, AdminAuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
