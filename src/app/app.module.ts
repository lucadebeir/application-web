import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {  } from '@angular/cdk';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InscrireComponent } from './pages/inscrire/inscrire.component';
import { SeConnecterComponent } from './pages/se-connecter/se-connecter.component';
import { AccueilComponent } from './pages/accueil/accueil.component';
import { AuthentificationService, AuthGuardService, AdminAuthService, RecettesService } from './service';
import { ContactComponent } from './pages/contact/contact.component';
import { GererLesRecettesComponent } from './pages/gerer-les-recettes/gerer-les-recettes.component';
import { MaListeDeCoursesComponent } from './pages/ma-liste-de-courses/ma-liste-de-courses.component';
import { MesCommentairesComponent } from './pages/mes-commentaires/mes-commentaires.component';
import { MesRecettesComponent } from './pages/mes-recettes/mes-recettes.component';
import { MonProfileComponent } from './pages/mon-profile/mon-profile.component';
import { RecettesComponent } from './pages/recettes/recettes.component';
import { UpdatePasswordComponent } from './pages/update-password/update-password.component';
import { AProposComponent } from './pages/apropos/apropos.component';
import { RecetteComponent } from './pages/recette/recette.component';
import { IngredientsComponent } from './pages/ingredients/ingredients.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { UniteComponent } from './pages/unite/unite.component';
import { AjoutRecetteComponent } from './pages/ajout-recette/ajout-recette.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ModifierRecetteComponent } from './pages/modifier-recette/modifier-recette.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RequestResetComponent } from './pages/request-reset/request-reset.component';
import { ResponseResetComponent } from './pages/response-reset/response-reset.component';
import { RefreshComponent } from './pages/refresh/refresh.component';
import { MentionsLegalesComponent } from './pages/mentions-legales/mentions-legales.component';

import { NgxPaginationModule } from 'ngx-pagination';
import { OwlModule } from 'ngx-owl-carousel';
import { CarouselModule } from 'ngx-owl-carousel-o';
import {NgxImageCompressService} from 'ngx-image-compress';

import { MaterialModule } from './modules/material.module';
import { GererLeMenuComponent } from './pages/gerer-le-menu/gerer-le-menu.component';
import { MenuComponent } from './pages/menu/menu.component';
import { StatistiquesComponent } from './pages/statistiques/statistiques.component';

@NgModule({
  declarations: [
    AppComponent,
    AProposComponent,
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
    GererLeMenuComponent,
    MenuComponent,
    StatistiquesComponent
  ],
  imports: [
    MaterialModule,
    CarouselModule,
    OwlModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgbModule,
    NgMultiSelectDropDownModule.forRoot(),
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [AuthGuardService, AuthentificationService, RecettesService, AdminAuthService, NgxImageCompressService],
  bootstrap: [AppComponent]
})
export class AppModule { }
