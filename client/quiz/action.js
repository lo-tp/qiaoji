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
export const ANSWER_ID = 'ANSWER_ID';
export const PAGE_ALL = 'PAGE_ALL';
export const PAGE_MINE = 'PAGE_MINE';
// defCstAct

const action = action5(QUIZ);
const setItemAction = action(NEW_ITEM, SET);
export const setItemTitle = setItemAction(TITLE);
export const setItemContent = setItemAction(CONTENT);
export const setItemPreview = setItemAction(PREVIEW);
export const setItemQuizId = setItemAction(QUIZ_ID);
export const setItemAnswerId = setItemAction(ANSWER_ID);
export const startEditing = setItemAction(EDITING, true);
export const startCreating = setItemAction(EDITING, false);

export const setMeta = action(META, SET, 0);
export const setPageAllMeta = action(META, PAGE_ALL, 0);
export const setPageMineMeta = action(META, PAGE_MINE, 0);
export const setQuizzes = action(QUIZZES, SET, 0);
export const setAnswers = action(ANSWERS, SET, 0);
