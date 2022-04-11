import { TodoSagaActions } from './index';
import { TodoItemType } from '../../../models';

export type EditItemSagaAction = {
  type: TodoSagaActions.EDIT_ITEM_SAGA;
  payload: EditItemSagaPayload;
};

export type EditItemSagaPayload = {
  id: TodoItemType['id'];
  text: TodoItemType['text'];
};

export const editItemSagaAction = (payload: EditItemSagaPayload) => {
  return {
    type: TodoSagaActions.EDIT_ITEM_SAGA,
    payload,
  };
};
