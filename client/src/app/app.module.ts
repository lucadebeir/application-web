import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms'
import { RouterModule, Routes } from '@angular/router'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InscrireComponent } from './inscrire/inscrire.component'
import { SeConnecterComponent } from './se-connecter/se-connecter.component'
import { AccueilComponent } from './accueil/accueil.component'
import { AuthentificationService } from './authentification.service'
import { AuthGuardService } from './auth-guard.service';
import { ContactComponent } from './contact/contact.component';
import { GererLesRecettesComponent } from './gerer-les-recettes/gerer-les-recettes.component';
import { MaListeDeCoursesComponent } from './ma-liste-de-courses/ma-liste-de-courses.component';
import { MesCommentairesComponent } from './mes-commentaires/mes-commentaires.component';
import { MesRecettesComponent } from './mes-recettes/mes-recettes.component';
import { MonProfileComponent } from './mon-profile/mon-profile.component';
import { RecettesComponent } from './recettes/recettes.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';

const routes: Routes = [
  {path: '', component: AccueilComponent},
  {path: 'login', component: SeConnecterComponent},
  {path: 'register', component: InscrireComponent},
  {path: 'profile', component: MonProfileComponent, canActivate: [AuthGuardService]},
  {path: 'update-password', component: UpdatePasswordComponent, canActivate: [AuthGuardService]},
  
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
    UpdatePasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [AuthGuardService, AuthentificationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
