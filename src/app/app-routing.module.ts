import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AccueilComponent } from "./pages/accueil/accueil.component";
import { SeConnecterComponent } from "./pages/se-connecter/se-connecter.component";
import { InscrireComponent } from "./pages/inscrire/inscrire.component";
import { MonProfileComponent } from "./pages/mon-profile/mon-profile.component";
import { AuthGuardService, AdminAuthService } from "./service";
import { UpdatePasswordComponent } from "./pages/update-password/update-password.component";
import { AProposComponent } from "./pages/apropos/apropos.component";
import { RecettesComponent } from "./pages/recettes/recettes.component";
import { RecetteComponent } from "./pages/recette/recette.component";
import { GererLesRecettesComponent } from "./pages/gerer-les-recettes/gerer-les-recettes.component";
import { CategoriesComponent } from "./pages/categories/categories.component";
import { IngredientsComponent } from "./pages/ingredients/ingredients.component";
import { AjoutRecetteComponent } from "./pages/ajout-recette/ajout-recette.component";
import { UniteComponent } from "./pages/unite/unite.component";
import { ContactComponent } from "./pages/contact/contact.component";
import { MaListeDeCoursesComponent } from "./pages/ma-liste-de-courses/ma-liste-de-courses.component";
import { MesCommentairesComponent } from "./pages/mes-commentaires/mes-commentaires.component";
import { MesRecettesComponent } from "./pages/mes-recettes/mes-recettes.component";
import { ModifierRecetteComponent } from "./pages/modifier-recette/modifier-recette.component";
import { RequestResetComponent } from "./pages/request-reset/request-reset.component";
import { ResponseResetComponent } from "./pages/response-reset/response-reset.component";
import { RefreshComponent } from "./pages/refresh/refresh.component";
import { MentionsLegalesComponent } from "./pages/mentions-legales/mentions-legales.component";
import { GererLeMenuComponent } from "./pages/gerer-le-menu/gerer-le-menu.component";
import { MenuComponent } from "./pages/menu/menu.component";
import { StatistiquesComponent } from "./pages/statistiques/statistiques.component";

const routes: Routes = [
  {
    path: "",
    component: AccueilComponent,
    data: { title: "Marine's Recipes" },
  },
  {
    path: "login",
    component: SeConnecterComponent,
    data: { title: "Se connecter" },
  },
  {
    path: "register",
    component: InscrireComponent,
    data: { title: "S'inscrire" },
  },
  {
    path: "profile",
    component: MonProfileComponent,
    canActivate: [AuthGuardService],
    data: { title: "Mon profil" },
  },
  {
    path: "update-password",
    component: UpdatePasswordComponent,
    canActivate: [AuthGuardService],
    data: { title: "Mot de passe oublié" },
  },
  { path: "aboutMe", component: AProposComponent, data: { title: "A propos" } },
  {
    path: "allRecipes",
    component: RecettesComponent,
    data: { title: "Recettes" },
  },
  { path: "recipe/:id", component: RecetteComponent },
  {
    path: "handleRecipes",
    component: GererLesRecettesComponent,
    canActivate: [AdminAuthService, AuthGuardService],
    data: { title: "Gérer les recettes" },
  },
  {
    path: "category",
    component: CategoriesComponent,
    canActivate: [AdminAuthService, AuthGuardService],
    data: { title: "Gérer les catégories" },
  },
  {
    path: "ingredient",
    component: IngredientsComponent,
    canActivate: [AdminAuthService, AuthGuardService],
    data: { title: "Gérer les ingrédients" },
  },
  {
    path: "add-recipe",
    component: AjoutRecetteComponent,
    canActivate: [AdminAuthService, AuthGuardService],
    data: { title: "Ajouter une recette" },
  },
  {
    path: "unite",
    component: UniteComponent,
    canActivate: [AdminAuthService, AuthGuardService],
    data: { title: "Gérer les unités" },
  },
  { path: "contact", component: ContactComponent, data: { title: "Contact" } },
  {
    path: "shoppingList",
    component: MaListeDeCoursesComponent,
    canActivate: [AuthGuardService],
    data: { title: "Liste de courses" },
  },
  {
    path: "comment",
    component: MesCommentairesComponent,
    canActivate: [AuthGuardService],
    data: { title: "Mes commentaires" },
  },
  {
    path: "favorites",
    component: MesRecettesComponent,
    canActivate: [AuthGuardService],
    data: { title: "Mes favoris" },
  },
  {
    path: "updateRecipe/:id",
    component: ModifierRecetteComponent,
    canActivate: [AdminAuthService, AuthGuardService],
    data: { title: "Modifier son mot de passe" },
  },
  { path: "request-reset-password", component: RequestResetComponent },
  { path: "response-reset-password/:token", component: ResponseResetComponent },
  { path: "refresh", component: RefreshComponent },
  {
    path: "rules",
    component: MentionsLegalesComponent,
    data: { title: "Mentions légales" },
  },
  {
    path: "handleMenu",
    component: GererLeMenuComponent,
    data: { title: "Gérer le menu" },
  },
  {
    path: "menu",
    component: MenuComponent,
    data: { title: "Menu de la semaine" },
  },
  {
    path: "statistiques",
    component: StatistiquesComponent,
    data: { title: "Statistiques" },
  },
  { path: "**", redirectTo: "" },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: "enabled" }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
