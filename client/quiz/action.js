import { SET, action5 } from '../action';

export const QUIZ = 'QUIZ';
export const NEW_ITEM = 'NEW_ITEM';
export const TITLE = 'TITLE';
export const CONTENT = 'CONTENT';
export const PREVIEW = 'PREVIEW';
export const META = 'META';
export const QUIZZES = 'QUIZZES';
export const ANSWERS = 'ANSWERS';
export const EDITING = 'EDITING';
export const QUIZ_ID = 'QUIZ_ID';
// defCstAct

const action = action5(QUIZ);
const setItemAction = action(NEW_ITEM, SET);
export const setItemTitle = setItemAction(TITLE);
export const setItemContent = setItemAction(CONTENT);
export const setItemPreview = setItemAction(PREVIEW);
export const setItemQuizId = setItemAction(QUIZ_ID);
export const startEditing = setItemAction(EDITING, true);
export const startCreating = setItemAction(EDITING, false);

export const setMeta = action(META, SET, 0);
export const setQuizzes = action(QUIZZES, SET, 0);
export const setAnswers = action(ANSWERS, SET, 0);
