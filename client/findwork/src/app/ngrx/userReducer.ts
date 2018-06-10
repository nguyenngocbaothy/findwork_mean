export function userReducer(state: any[] = [], action): any[] {
    if (action.type === 'GET_USER') { return action.user; }
    if (action.type === 'SAVE_JOB') { return action.user; }
    if (action.type === 'GET_EMPLOYER') { return action.employer; }


    return state;
}
