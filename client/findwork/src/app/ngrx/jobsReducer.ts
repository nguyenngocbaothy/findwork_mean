export function jobsReducer(state: any[] = [], action): any[] {
    if (action.type === 'GET_JOBS') { return action.jobs; }
    if (action.type === 'GET_ALL_JOBS') { return action.jobs; }
    if (action.type === 'GET_JOB') { return action.jobs; }

    return state;
}
