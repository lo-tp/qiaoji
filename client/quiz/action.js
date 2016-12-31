import { SET, action5 } from '../action';
export const QUIZ = 'QUIZ';
export const NEW_ITEM = 'NEW_ITEM';
export const TITLE = 'TITLE';
export const CONTENT = 'CONTENT';
export const PREVIEW = 'PREVIEW';
// defCstAct

const action = action5(QUIZ);
const setNewItemAction = action(NEW_ITEM, SET);
export const setNewTitle = setNewItemAction(TITLE);
export const setNewContent = setNewItemAction(CONTENT);
export const setNewPreview = setNewItemAction(PREVIEW);
