import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccueilComponent } from './pages/accueil/accueil.component';
import { SeConnecterComponent } from './pages/se-connecter/se-connecter.component';
import { InscrireComponent } from './pages/inscrire/inscrire.component';
import { MonProfileComponent } from './pages/mon-profile/mon-profile.component';
import { AuthGuardService, AdminAuthService } from './service';
import { UpdatePasswordComponent } from './pages/update-password/update-password.component';
import { AProposComponent } from './pages/apropos/apropos.component';
import { RecettesComponent } from './pages/recettes/recettes.component';
import { RecetteComponent } from './pages/recette/recette.component';
import { GererLesRecettesComponent } from './pages/gerer-les-recettes/gerer-les-recettes.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { IngredientsComponent } from './pages/ingredients/ingredients.component';
import { AjoutRecetteComponent } from './pages/ajout-recette/ajout-recette.component';
import { UniteComponent } from './pages/unite/unite.component';
import { ContactComponent } from './pages/contact/contact.component';
import { MaListeDeCoursesComponent } from './pages/ma-liste-de-courses/ma-liste-de-courses.component';
import { MesCommentairesComponent } from './pages/mes-commentaires/mes-commentaires.component';
import { MesRecettesComponent } from './pages/mes-recettes/mes-recettes.component';
import { ModifierRecetteComponent } from './pages/modifier-recette/modifier-recette.component';
import { RequestResetComponent } from './pages/request-reset/request-reset.component';
import { ResponseResetComponent } from './pages/response-reset/response-reset.component';
import { RefreshComponent } from './pages/refresh/refresh.component';
import { MentionsLegalesComponent } from './pages/mentions-legales/mentions-legales.component';
import { GererLeMenuComponent } from './pages/gerer-le-menu/gerer-le-menu.component';
import { MenuComponent } from './pages/menu/menu.component';


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
  { path: 'rules', component: MentionsLegalesComponent },
  { path: 'handleMenu', component: GererLeMenuComponent },
  { path: 'menu', component: MenuComponent},
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
