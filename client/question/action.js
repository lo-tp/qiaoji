import { SET, action5 } from '../action';

export const QUESTION = 'QUESTION';

// defCstAct

const action = action5(QUESTION);

export const setQuestions = action(QUESTION, SET, 0);
