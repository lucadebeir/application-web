export interface CommentaireDetails {
    idCommentaire?: number;
    message?: string;
    dateCommentaire?: string;
    ecritPar?: string;
    concerne?: number;
    nomRecette?: string;
    admin?: boolean;
    children?: CommentaireDetails[];
    parent?: number;
    lienImage?: any;
    idImage?: number;
}
