import { Category } from '../types';

export function categoryReducer(state: Category[] = [], action): Category[] {
    if (action.type === 'GET_CATEGORIES') { return action.categories; }
    if (action.type === 'GET_CATEGORY') { return action.category; }

    return state;
}
