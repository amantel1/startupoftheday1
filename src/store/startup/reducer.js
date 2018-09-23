import Immutable from 'seamless-immutable';
import _ from 'lodash';
import * as types from './actionTypes';

const initialState = Immutable({
    articles: undefined,
    currArticle: undefined
});

export default function reduce(state = initialState, action = {}) {
  console.log("action",action);
    switch (action.type) {
        case types.ARTICLES_FETCHED:
            return state.merge({
                articles: action.articles,
                currArticle:action.articles[0],
                articleNumber:0,
            });
            case "PREV": {
              let articleNumber = Math.min(state.articleNumber + 1,state.articles.length-1);
              let newState = {
                  articles: state.articles,
                  currArticle:state.articles[articleNumber],
                  articleNumber:articleNumber
              };
              return newState;
            }
            case "NEXT": {
              let articleNumber = Math.max(state.articleNumber - 1,0);
              let newState = {
                  articles: state.articles,
                  currArticle:state.articles[articleNumber],
                  articleNumber:articleNumber
              };
              return newState;
            }


        default:
            return state;
    }
}

export function getArticlesContent(state) {
    return state.startup.articles;
}
export function getCurrArticleContent(state) {
    return state.startup.currArticle;
}
export function getCurrArticleNumber(state) {
    return state.startup.articleNumber;
}
