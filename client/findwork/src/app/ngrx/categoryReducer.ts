import { Category } from '../types';

export function categoryReducer(state: Category[] = [], action): Category[] {
    if (action.type === 'GET_CATEGORIES') { return action.categories; }

    return state;
}
