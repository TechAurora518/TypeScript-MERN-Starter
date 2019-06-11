import { ActionCreatorsMapObject, AnyAction as Action } from "redux";
import Article from "./Article";

export default interface ArticleActionCreator extends ActionCreatorsMapObject {
    getAllArticles(): any;
}