import { SET, action5 } from '../action';

export const QUESTION = 'QUESTION';
export const QUESTIONS = 'QUESTIONS';

// defCstAct

const action = action5(QUESTION);

export const setQuestions = action(QUESTIONS, SET, 0);
export const setQuestionMeta = action(QUESTION, SET, 0);
