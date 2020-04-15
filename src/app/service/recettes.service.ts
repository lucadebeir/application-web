import { Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs'
import { map, tap } from 'rxjs/operators'
import { CreateRecipe } from '../views/ajout-recette/ajout-recette.component'
import { AuthentificationService, UserDetails } from './authentification.service'
import { element } from 'protractor'
import { Time } from '@angular/common'
import { addTimes } from './../utils/Utils'



export interface RecipeDetails {
    idRecette: number
    nomRecette: string
    datePublication: Date
    nbFavoris: number
    nbVues: number
    etapes: string
    nbrePart?: number
    libellePart?: string
    tempsPreparation?: Time
    tempsCuisson?: Time
    astuce?: string
    lienImage?: any
    idImage?: number
    ingredients?: IngredientDetails[]
    globalTime?: string
}

export interface IngredientDetails {
    idRecette?: number
    idIngredient?: string
    nomIngredient?: string
    qte?: number
    libelleUnite?: string
    idUnite?: number
    disabled?: boolean
}

export interface UniteDetails {
    idUnite: number
    libelleUnite: string
}

export interface QuantiteDetails {
    qte: any,
    idRecette: number
    idIngredient: number,
    idUnite: number
}

export interface CategoryDetails {
    idCategorie: number
    libelleCategorie: string
}

export interface FavorisDetails {
    pseudo: string
    idRecette: number
}

export interface ListeCoursesDetails {
    pseudo: string
    listIngredients: any
}

export interface ImageDetails {
    idImage: number
    lienImage: string
}

export interface ImageRecipe {
    idImage: number
    idRecette: number
}

export interface CommentaireDetails{
    idCommentaire?: number
    message?: string
    dateCommentaire?: string
    ecritPar?: string
    concerne?: number
    nomRecette?: string
    admin?: boolean
}

@Injectable()
export class RecettesService {

    constructor(private http: HttpClient, private auth: AuthentificationService) { }

    public getAllRecipes(): Observable<RecipeDetails[]> {
        const base = this.http.get(`/server/allRecipes`)
        return base.pipe(map((data: RecipeDetails[]) => {
            data.forEach(element => {
                this.http.get(`/server/image/${element.idRecette}`).subscribe((data: any) => {
                    element.lienImage = data[0]?.lienImage
                })
            });
            return data
        }))
    }

    public getAllRecipesAndIngredients(): Observable<RecipeDetails[]> {
        const base = this.http.get(`/server/allRecipes`)
        return base.pipe(map((data: RecipeDetails[]) => {
            data.forEach(element => {
                this.http.get(`/server/image/${element.idRecette}`).subscribe((data: any) => {
                    element.lienImage = data[0]?.lienImage
                })
                element.ingredients = []
                this.getIngredientsByIdRecette(element.idRecette).subscribe(data => {
                    console.log(data)
                    element.ingredients.push(data[0])
                })
                element.globalTime = addTimes(element.tempsPreparation, element.tempsCuisson)
            });
            return data
        }))
    }

    public getRecipeById(id: any): Observable<any> {
        return this.http.get<any>('/server/recipe/' + id)
    }

    public getIngredientsByIdRecette(id: any): any {
        return this.http.get<any>('/server/recipe/' + id + '/ingredients')
    }

    public getUtiliserIngredientsByIdRecette(id: any): Observable<QuantiteDetails[]> {
        const base = this.http.get('/server/recipe/' + id + '/utiliserIngredients')
        const utiliserIngredients = base.pipe(map((data: QuantiteDetails[]) => {
            return data
        }))
        return utiliserIngredients
    }

    public getIngredientById(idIngredient: any): Observable<IngredientDetails> {
        const base = this.http.get('/server/ingredient/' + idIngredient)
        return base.pipe(map((data: IngredientDetails) => {
            return data
        }))
    }

    public getUniteById(idUnite: any): Observable<UniteDetails> {
        const base = this.http.get('/server/recipe/unite/' + idUnite)
        return base.pipe(map((data: UniteDetails) => {
            return data
        }))
    }

    public getLatestReceipes(): Observable<RecipeDetails[]> {
        const base = this.http.get(`/server/latestReceipes`)
        return base.pipe(map((data: RecipeDetails[]) => {
            data.forEach(element => {
                this.http.get(`/server/image/${element.idRecette}`).subscribe((data: any) => {
                    element.lienImage = data[0]?.lienImage
                })
            });
            return data
        }))
    }

    public getMostPopularRecipes(): Observable<RecipeDetails[]> {
        const base = this.http.get(`/server/mostPopularRecipes`)
        return base.pipe(map((data: RecipeDetails[]) => {
            data.forEach(element => {
                this.http.get(`/server/image/${element.idRecette}`).subscribe((data: any) => {
                    element.lienImage = data[0]?.lienImage
                })
            });
            return data
        }))
    }

    public deleteRecipe(id: any): Observable<any> {
        const url = `/server/delete-recipe/${id}`;
        return this.http.delete<any>(url).pipe(
            tap(_ => console.log(`deleted ${id}`)),
        );
    }

    public getRecipeByCategory(idCategorie: any): Observable<RecipeDetails[]> {
        const base = this.http.get(`/server/recipe/category/${idCategorie}`)
        return base.pipe(map((data: RecipeDetails[]) => {
            data.forEach(element => {
                console.log(element)
                console.log(element.idRecette)
                this.http.get(`/server/image/${element.idRecette}`).subscribe((data: any) => {
                    element.lienImage = data[0]?.lienImage
                    console.log(data[0])
                })
                element.globalTime = addTimes(element.tempsCuisson, element.tempsPreparation)
                console.log(element)
            });
            return data
        }))
    }

    public getAllCategory(): any {
        return this.http.get<any>(`/server/category`)
            .pipe(map((data: CategoryDetails[]) => {
                return data
            }))
    }



    public updateNbView(recette: RecipeDetails): Observable<any> {
        return this.http.put<any>(`/server/recipe/update-nbView/${recette.idRecette}`, recette)
    }

    public deleteCategory(id: any): Observable<any> {
        const url = `/server/category/delete/${id}`;
        return this.http.delete<any>(url).pipe(
            tap(_ => console.log(`deleted ${id}`)),
        );
    }

    public updateCategory(categorie: CategoryDetails): Observable<any> {
        return this.http.put(`/server/category/update`, categorie)
            .pipe(map((data: CategoryDetails[]) => {
                return data
            }))


    }

    public updateRecipeIng(recette: RecipeDetails, ingredient: IngredientDetails): Observable<any> {
        return this.http.put(`/server/recipe/${recette.idRecette}/ingredient/update`, ingredient)
            .pipe(map((res) => {
                return res
            }))


    }

    public addCategory(categorie: CategoryDetails): any {

        this.http.post('/server/category/add', categorie).subscribe(res => {
            {
                return res
            }
        })

    }

    public getAllIngredients(): any {
        return this.http.get<any>(`/server/ingredient`)
            .pipe(map((data: IngredientDetails[]) => {
                return data
            }))
    }

    public getRestIngredients(idRecette: any): any {
        return this.http.get<any>(`/server/recipe/${idRecette}/ingredient/rest`)
            .pipe(map((data: IngredientDetails[]) => {
                return data
            }))
    }

    public getRestCategory(idRecette: any): any {
        return this.http.get<any>(`/server/recipe/${idRecette}/category/rest`)
            .pipe(map((data: CategoryDetails[]) => {
                return data
            }))
    }

    public deleteIngredient(id: any): Observable<any> {
        const url = `/server/ingredient/delete/${id}`;
        return this.http.delete<any>(url).pipe(
            tap(_ => console.log(`deleted ${id}`)),
        );
    }

    public updateIngredient(ingredient: IngredientDetails): Observable<any> {
        return this.http.put(`/server/ingredient/update`, ingredient)
            .pipe(map((data: IngredientDetails[]) => {
                return data
            }))
    }

    public addIngredient(ingredient: any): any {
        this.http.post('/server/ingredient/add', ingredient).subscribe(res => {
            {
                return res
            }
        })

    }

    public createRecipe(recipe: CreateRecipe): Observable<any> {
        const res = this.http.post('/server/add-recipe', recipe)
        return res.pipe(map((res) => {
            return res
        }))
    }

    public addIngredientsAndCategoryToNewRecipe(recipe: CreateRecipe): Observable<any> {
        const res = this.http.post('/server/recipe/addIngredientAndCategorie', recipe)
        return res.pipe(map((res) => {
            console.log(res)
            return res
        }))
    }

    public addRecipeCategory(categorie: CategoryDetails, recette: RecipeDetails): Observable<any> {
        return this.http.post(`/server/recipe/${recette.idRecette}/category/add`, categorie)
            .pipe(map((res) => {
                return res
            }))
    }

    public getAllUnite(): any {
        return this.http.get<any>('/server/unite')
            .pipe(map((data: UniteDetails[]) => {
                return data
            }))
    }

    public deleteUnite(id: any): Observable<any> {
        const url = `/server/unite/delete/${id}`;
        return this.http.delete<any>(url).pipe(
            tap(_ => console.log(`deleted ${id}`)),
        );
    }

    public updateUnite(unite: UniteDetails): Observable<any> {
        return this.http.put(`/server/unite/update`, unite)
            .pipe(map((data: UniteDetails[]) => {
                return data
            }))
    }

    public addUnite(unite: any): any {
        this.http.post('/server/unite/add', unite).subscribe(res => {
            {
                return res
            }
        })

    }


    public addFavoris(newFavori: FavorisDetails): any {
        return this.http.post(`/server/favorites/add`, newFavori).subscribe(res => {
            {
                return res
            }

        })
    }


    public addListeCourses(newListeCourses: ListeCoursesDetails) {
        this.http.post(`/server/shoppingList/add`, newListeCourses).subscribe(res => {
            {
                return res
            }

        })
    }


    public getFavoris(): Observable<RecipeDetails[]> {
        const pseudo = this.auth.getUserDetails().pseudo;
        const base = this.http.get(`/server/recipe/favorites/${pseudo}`)
        return base.pipe(map((data: RecipeDetails[]) => {
            data.forEach(element => {
                this.http.get(`/server/image/${element.idRecette}`).subscribe((data: any) => {
                    element.lienImage = data[0]?.lienImage
                })
            });
            return data
        }))
    }

    public getFavorisByCategory(idCategorie: number): Observable<RecipeDetails[]> {
        const pseudo = this.auth.getUserDetails().pseudo;
        const base = this.http.get(`/server/recipe/favorites/${pseudo}/${idCategorie}`)
        return base.pipe(map((data: RecipeDetails[]) => {
            data.forEach(element => {
                console.log(element)
                console.log(element.idRecette)
                this.http.get(`/server/image/${element.idRecette}`).subscribe((data: any) => {
                    element.lienImage = data[0]?.lienImage
                    console.log(data[0])
                })
                console.log(element)
            });
            return data
        }))
    }

    public deleteFavoris(id: any): Observable<any> {
        const pseudo = this.auth.getUserDetails().pseudo;
        const url = `/server/favorites/${pseudo}/delete/${id}`;
        return this.http.delete<any>(url).pipe(
            tap(_ => console.log(`deleted ${id}`)),
        );
    }


    public getListeCourses(): Observable<IngredientDetails[]> {
        const pseudo = this.auth.getUserDetails().pseudo;
        const base = this.http.get(`/server/shoppingList/${pseudo}`);
        return base.pipe(map((data: IngredientDetails[]) => {
            return data
        }))

    }

    public getRestListeCourses(): Observable<IngredientDetails[]> {
        const pseudo = this.auth.getUserDetails().pseudo;
        const base = this.http.get(`/server/shoppingList/rest/${pseudo}`);
        return base.pipe(map((data: IngredientDetails[]) => {
            return data
        }))
    }

    public addIngredientShoppingList(ingredient: any): any {
        return this.http.post(`/server/shoppingList/add/ingredient`, ingredient).subscribe(res => {
            {
                return res
            }
        })

    }

    public deleteListeCourse(id: any): Observable<any> {
        const pseudo = this.auth.getUserDetails().pseudo;
        const url = `/server/shoppingList/delete/${id}/${pseudo}`;
        return this.http.delete<any>(url).pipe(
            tap(_ => console.log(`deleted ${id}`)),
        );
    }

    public getCategory(id: any): any {
        return this.http.get<any>(`/server/recipe/${id}/category`)
            .pipe(map((data: any) => {
                return data
            }))
    }

    public updateRecipeName(recette: RecipeDetails): Observable<any> {

        return this.http.put(`/server/recipe/name/update`, recette)
            .pipe(map((data: RecipeDetails) => {
                return data
            }))


    }

    public updateSteps(recette: RecipeDetails): Observable<any> {

        return this.http.put(`/server/recipe/step/update`, recette)
            .pipe(map((data: RecipeDetails) => {
                return data
            }))


    }

    public updateAstuce(recette: RecipeDetails): Observable<any> {

        return this.http.put(`/server/recipe/astuce/update`, recette)
            .pipe(map((data: RecipeDetails) => {
                return data
            }))


    }

    public updatePart(recette: RecipeDetails): Observable<any> {

        return this.http.put(`/server/recipe/part/update`, recette)
            .pipe(map((data: RecipeDetails) => {
                return data
            }))


    }

    public updateTemps(recette: RecipeDetails): Observable<any> {

        return this.http.put(`/server/recipe/temps/update`, recette)
            .pipe(map((data: RecipeDetails) => {
                return data
            }))


    }

    public deleteIngredientRececipe(ingredient: IngredientDetails, recette: RecipeDetails): Observable<any> {
        const url = `/server/recipe/${recette.idRecette}/ingredient/${ingredient.idIngredient}/delete`;
        return this.http.delete<any>(url).pipe(
            tap(_ => console.log(`deleted ${ingredient.idIngredient} from recipe ${recette.idRecette}`)),
        );
    }

    public addIngredientRecette(newIngredient: IngredientDetails): any {
        this.http.post(`/server/recipe/${newIngredient.idRecette}/add/ingredient/${newIngredient.idIngredient}`, newIngredient).subscribe(res => {
            {
                return res
            }
        })

    }

    public deleteRecipeCategory(categorie: CategoryDetails, recette: RecipeDetails): Observable<any> {
        const url = `/server/recipe/${recette.idRecette}/category/${categorie.idCategorie}/delete`;
        return this.http.delete<any>(url).pipe(
            tap(_ => console.log(`deleted ${categorie.idCategorie} from recipe ${recette.idRecette}`)),
        );
    }

    public addImage(file: any): Observable<any> {
        console.log(file)
        return this.http.post(`/server/uploads`, file).pipe(map((data: any) => {
            return data
        }))
    }

    public getImage(id: number): any {
        return this.http.get(`/server/image/${id}`).pipe(map((data: any) => {
            console.log(data)
            return data
        }))
    }

    public getRestOfIngredients(ingredients: number[]): any {
        let params = new HttpParams();

        ingredients.forEach((idIngredient: number) => {
            params = params.append(`ingredients[]`, idIngredient.toString());
        })
        return this.http.get<any>(`/server/ingredient/rest`, { params: params })
            .pipe(map((data: IngredientDetails[]) => {
                console.log(data)
                return data
            }))
    }

    public addCommentaire(commentaire: CommentaireDetails): any {
        this.http.post<any>(`/server/commentaires/add`, commentaire)
            .subscribe((data: any) => {
                return data
            })
    }

    public modifyCommentaire(commentaire: CommentaireDetails): any {
        this.http.post<any>(`/server/commentaires/update`, commentaire)
            .subscribe((data: any) => {
                return data
            })
    }

    public getCommentaireRecipe(id:any): Observable<any>{
        return this.http.get<any>(`/server/recipe/${id}/commentaires`)
        .pipe(map((data: any) => {
            return data
        }))
    }

    public deleteCommentaire(id: any): Observable<any> {
        const url = `/server/commentaire/${id}/delete`;
        return this.http.delete<any>(url).pipe(
            tap(_ => console.log(`deleted ${id}`)),
        );
    }

    public getCommentaireUser(pseudo: any): Observable<any> {
        return this.http.get<any>(`/server/${pseudo}/mescommentaires`)
        .pipe(map((data: any) => {
            return data
        }))
    }

    public addImageToRecipe(imageToModify: any): any {
        this.http.post<any>(`/server/recipe/update/image`, imageToModify)
            .subscribe((data: any) => {
                console.log(data)
                return data
            })
    }

}    