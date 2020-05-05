import { Time } from '@angular/common';
import { IngredientDetails, CategoryDetails } from '.';

export interface RecipeDetails {
    idRecette: number;
    nomRecette: string;
    datePublication: Date;
    nbFavoris: number;
    nbVues: number;
    etapes: string;
    nbrePart?: number;
    libellePart?: string;
    tempsPreparation?: Time;
    tempsCuisson?: Time;
    astuce?: string;
    lienImage?: any;
    idImage?: number;
    ingredients?: IngredientDetails[];
    globalTime?: string;
    categories?: CategoryDetails[];
    idMenu?: number;
    mot?: string;
}
