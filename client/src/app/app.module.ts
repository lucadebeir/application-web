import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule, Routes } from '@angular/router'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InscrireComponent } from './inscrire/inscrire.component'
import { SeConnecterComponent } from './se-connecter/se-connecter.component'
import { AccueilComponent } from './accueil/accueil.component'
import { AuthentificationService } from './service/authentification.service'
import { AuthGuardService } from './service/auth-guard.service';
import { ContactComponent } from './contact/contact.component';
import { GererLesRecettesComponent } from './gerer-les-recettes/gerer-les-recettes.component';
import { MaListeDeCoursesComponent } from './ma-liste-de-courses/ma-liste-de-courses.component';
import { MesCommentairesComponent } from './mes-commentaires/mes-commentaires.component';
import { MesRecettesComponent } from './mes-recettes/mes-recettes.component';
import { MonProfileComponent } from './mon-profile/mon-profile.component';
import { RecettesComponent } from './recettes/recettes.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';
import { AProposComponent } from './apropos/apropos.component';
import { RecettesService } from './service/recettes.service';
import { RecetteComponent } from './recette/recette.component';
import { IngredientsComponent } from './ingredients/ingredients.component';
import { CategoriesComponent } from './categories/categories.component';
import { UniteComponent } from './unite/unite.component';
import { AjoutRecetteComponent } from './ajout-recette/ajout-recette.component';
import { ModalAddIngredientComponent } from './modal-add-ingredient/modal-add-ingredient.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ModifierRecetteComponent } from './modifier-recette/modifier-recette.component';


const routes: Routes = [
  { path: '', component: AccueilComponent },
  { path: 'login', component: SeConnecterComponent },
  { path: 'register', component: InscrireComponent },
  { path: 'profile', component: MonProfileComponent, canActivate: [AuthGuardService] },
  { path: 'update-password', component: UpdatePasswordComponent, canActivate: [AuthGuardService] },
  { path: 'aboutMe', component: AProposComponent },
  { path: 'allRecipes', component: RecettesComponent },
  { path: 'recipe/:id', component: RecetteComponent },
  { path: 'handleRecipes', component: GererLesRecettesComponent },
  { path: 'category', component: CategoriesComponent },
  { path: 'ingredient', component: IngredientsComponent },
  { path: 'add-recipe', component: AjoutRecetteComponent },
  { path: 'unite', component: UniteComponent },
  {path: 'contact', component: ContactComponent},
  {path: 'shoppingList', component: MaListeDeCoursesComponent},
  {path: 'comment', component: MesCommentairesComponent},
  {path: 'favorites', component: MesRecettesComponent},
  {path: 'updateRecipe/:id', component: ModifierRecetteComponent}
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
    ModalAddIngredientComponent,
    ModifierRecetteComponent
  ],
  imports: [
    NgMultiSelectDropDownModule.forRoot(),
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [AuthGuardService, AuthentificationService, RecettesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
