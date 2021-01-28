import { Time } from "@angular/common";

export class CreateRecipe {
  idRecette?: number;
  nomRecette?: string;
  categories?: any[];
  ingredients?: any[];
  idImage?: File;
  etapes?: string;
  nbrePart?: number;
  libellePart?: string;
  tempsPreparation?: Time;
  tempsCuisson?: Time;
  astuce?: string;
  mot?: string;
  lienImage?: string;
}
